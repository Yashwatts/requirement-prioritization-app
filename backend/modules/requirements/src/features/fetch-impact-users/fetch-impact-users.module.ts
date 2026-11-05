import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FetchImpactUsersController } from './fetch-impact-users.controller';
import { FetchImpactUsersHandler } from './fetch-impact-users.handler';
import { ImpactUsersRepository } from '../../infrastructure/repositories/impact-users.repository';

@Module({
  imports: [CqrsModule],
  controllers: [FetchImpactUsersController],
  providers: [FetchImpactUsersHandler, ImpactUsersRepository],
})
export class FetchImpactUsersModule {}
