import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OutboxMessage } from '@modules/shared/domain/outbox-message/outbox-message.entity';
import { MessageDestinationRegistry } from './message-destination-registry';
import { OutboxRelayService } from './outbox-relay.service';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

@Global()
@Module({
  imports: [MikroOrmModule.forFeature([OutboxMessage]), RabbitmqModule],
  providers: [MessageDestinationRegistry, OutboxRelayService],
  exports: [MessageDestinationRegistry],
})
export class OutboxProducerModule {}
