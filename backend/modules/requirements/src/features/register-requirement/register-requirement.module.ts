import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RegisterRequirementController } from './register-requirement.controller';
import { RegisterRequirementHandler } from './register-requirement.handler';

@Module({
  imports: [CqrsModule],
  controllers: [RegisterRequirementController],
  providers: [RegisterRequirementHandler],
})
export class RegisterRequirementModule {}
