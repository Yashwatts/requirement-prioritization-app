import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FetchDomainsController } from './fetch-domains.controller';
import { FetchDomainsHandler } from './fetch-domains.handler';

@Module({
  imports: [CqrsModule],
  controllers: [FetchDomainsController],
  providers: [FetchDomainsHandler],
})
export class FetchDomainsModule {}
