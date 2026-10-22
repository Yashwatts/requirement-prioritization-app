import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  OutboxMessage,
  OutboxStatus,
} from '@modules/shared/domain/outbox-message/outbox-message.entity';
import { RabbitmqConnectionService } from './rabbitmq/rabbitmq-connection.service';

const BATCH_SIZE = 50;
const POLL_INTERVAL_MS = 5000;
const EXCHANGE_HEADER = '_destination';

@Injectable()
export class OutboxRelayService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(OutboxRelayService.name);
  private timer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  constructor(
    private readonly em: EntityManager,
    private readonly rabbitmq: RabbitmqConnectionService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    try {
      await this.rabbitmq.connect();
      this.logger.log('RabbitMQ connected successfully for Outbox Relay.');
    } catch (error) {
      this.logger.error(
        `Failed to connect to RabbitMQ on startup: ${(error as Error).message}`,
      );
    }

    this.timer = setInterval(() => {
      this.relay().catch((err) => {
        this.logger.error(`Error during outbox relay: ${(err as Error).message}`);
      });
    }, POLL_INTERVAL_MS);

    this.logger.log(
      `OutboxRelayService started (polling every ${POLL_INTERVAL_MS}ms).`,
    );
  }

  onModuleDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async relay(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      const fork = this.em.fork();

      const pendingMessages = await fork.find(
        OutboxMessage,
        { status: OutboxStatus.PENDING },
        {
          limit: BATCH_SIZE,
          orderBy: { created_at: 'ASC' },
          schema: 'requirements',
        },
      );

      if (!pendingMessages.length) {
        return;
      }

      this.logger.log(
        `Processing ${pendingMessages.length} pending outbox message(s)...`,
      );

      for (const message of pendingMessages) {
        await this.publishAndMark(fork, message);
      }

      await fork.flush();
    } catch (error) {
      this.logger.error(
        `Error executing outbox poll batch: ${(error as Error).message}`,
      );
    } finally {
      this.isProcessing = false;
    }
  }

  private async publishAndMark(
    em: EntityManager,
    message: OutboxMessage,
  ): Promise<void> {
    try {
      const body = message.getBody();
      const destination = body[EXCHANGE_HEADER] as
        | { exchange: string; routingKey: string }
        | undefined;

      if (!destination?.exchange || !destination?.routingKey) {
        this.logger.warn(
          `Message ${message.message_id} (${message.type}) has no destination - marking as FAILED.`,
        );
        message.status = OutboxStatus.FAILED;
        em.persist(message);
        return;
      }

      const { [EXCHANGE_HEADER]: _dest, ...payload } = body;

      await this.rabbitmq.assertExchange(destination.exchange, 'topic');

      await this.rabbitmq.publish(
        destination.exchange,
        destination.routingKey,
        payload as Record<string, unknown>,
        message.message_id,
        message.type,
      );

      message.markAsSent();
      em.persist(message);
    } catch (err) {
      this.logger.error(
        `Failed to publish message ${message.message_id}: ${(err as Error).message}`,
      );
      message.status = OutboxStatus.FAILED;
      em.persist(message);
    }
  }
}
