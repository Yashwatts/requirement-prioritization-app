import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { connect, ChannelModel, Channel } from 'amqplib';

@Injectable()
export class RabbitmqConnectionService implements OnModuleDestroy {
  private readonly logger = new Logger(RabbitmqConnectionService.name);

  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  constructor(private readonly configService: ConfigService) {}

  async connect(): Promise<void> {
    const dsn = this.configService.getOrThrow<string>('RABBITMQ_DSN');

    this.connection = await connect(dsn);
    this.channel = await this.connection.createChannel();

    this.logger.log('RabbitMQ connected.');
  }

  async assertExchange(exchange: string, type: string): Promise<void> {
    await this.channel?.assertExchange(exchange, type, { durable: true });
  }

  async publish(
    exchange: string,
    routingKey: string,
    content: Record<string, unknown>,
    messageId: string,
    type: string,
  ): Promise<boolean> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not open.');
    }

    return this.channel.publish(
      exchange,
      routingKey,
      Buffer.from(JSON.stringify(content)),
      {
        persistent: true,
        contentType: 'application/json',
        messageId,
        type,
      },
    );
  }

  async closeChannel(): Promise<void> {
    await this.channel?.close();
    this.channel = null;
  }

  async onModuleDestroy(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
    this.logger.log('RabbitMQ connection closed.');
  }
}
