import { Module, OnModuleInit } from '@nestjs/common';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';
import {
  REQUIREMENTS_EXCHANGE,
  REQUIREMENTS_ROUTING_KEYS,
} from './requirements-rabbitmq.config';

/**
 * Registers all requirement domain events with the MessageDestinationRegistry
 * so the OutboxRelayService knows which RabbitMQ exchange/routing-key to use
 * for each event type.
 */
@Module({})
export class RequirementsMessageDestinationModule implements OnModuleInit {
  constructor(
    private readonly messageDestinationRegistry: MessageDestinationRegistry,
  ) {}

  onModuleInit(): void {
    this.messageDestinationRegistry.register(
      REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_REGISTERED,
      {
        exchange: REQUIREMENTS_EXCHANGE,
        routingKey: REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_REGISTERED,
      },
    );

    this.messageDestinationRegistry.register(
      REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_CLIENT_PRIORITY_UPDATED,
      {
        exchange: REQUIREMENTS_EXCHANGE,
        routingKey:
          REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_CLIENT_PRIORITY_UPDATED,
      },
    );

    this.messageDestinationRegistry.register(
      REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_MANAGEMENT_PRIORITY_UPDATED,
      {
        exchange: REQUIREMENTS_EXCHANGE,
        routingKey:
          REQUIREMENTS_ROUTING_KEYS.REQUIREMENT_MANAGEMENT_PRIORITY_UPDATED,
      },
    );
  }
}
