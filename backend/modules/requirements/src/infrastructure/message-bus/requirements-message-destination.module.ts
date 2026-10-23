import { Module, OnModuleInit } from '@nestjs/common';
import { MessageDestinationRegistry } from '@modules/shared/infrastructure/message-bus/message-destination-registry';

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
    const exchange = process.env.RABBITMQ_EXCHANGE!;

    const registeredRoutingKey =
      process.env.RABBITMQ_ROUTING_KEY_REQUIREMENT_REGISTERED!;

    const clientPriorityRoutingKey =
      process.env.RABBITMQ_ROUTING_KEY_REQUIREMENT_CLIENT_PRIORITY_UPDATED!;

    const managementPriorityRoutingKey =
      process.env.RABBITMQ_ROUTING_KEY_REQUIREMENT_MANAGEMENT_PRIORITY_UPDATED!;

    this.messageDestinationRegistry.register(registeredRoutingKey, {
      exchange,
      routingKey: registeredRoutingKey,
    });

    this.messageDestinationRegistry.register(clientPriorityRoutingKey, {
      exchange,
      routingKey: clientPriorityRoutingKey,
    });

    this.messageDestinationRegistry.register(managementPriorityRoutingKey, {
      exchange,
      routingKey: managementPriorityRoutingKey,
    });
  }
}
