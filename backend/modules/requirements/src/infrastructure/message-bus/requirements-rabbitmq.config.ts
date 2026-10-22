/**
 * RabbitMQ exchange and routing key config for the Requirements module.
 *
 * We use a single topic exchange.  Each event type gets its own routing key,
 * which makes it easy for downstream consumers to selectively subscribe.
 *
 * exchange : requirement-prioritization.events
 * routing keys:
 *   - requirement-prioritization.requirement_registered
 *   - requirement-prioritization.requirement_client_priority_updated
 *   - requirement-prioritization.requirement_management_priority_updated
 */
export const REQUIREMENTS_EXCHANGE = 'requirement-prioritization.events';

export const REQUIREMENTS_ROUTING_KEYS = {
  REQUIREMENT_REGISTERED: 'requirement-prioritization.requirement_registered',
  REQUIREMENT_CLIENT_PRIORITY_UPDATED:
    'requirement-prioritization.requirement_client_priority_updated',
  REQUIREMENT_MANAGEMENT_PRIORITY_UPDATED:
    'requirement-prioritization.requirement_management_priority_updated',
} as const;
