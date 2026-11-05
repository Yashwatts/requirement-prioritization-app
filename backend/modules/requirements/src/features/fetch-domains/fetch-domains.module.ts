import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FetchDomainsController } from './fetch-domains.controller';
import { FetchDomainsHandler } from './fetch-domains.handler';
import { DomainRepository } from '../../infrastructure/repositories/domain.repository';

@Module({
  imports: [CqrsModule],
  controllers: [FetchDomainsController],
  providers: [FetchDomainsHandler, DomainRepository],
})
export class FetchDomainsModule {}
