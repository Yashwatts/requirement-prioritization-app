import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterRequirementCommand } from './register-requirement.command';
import { RegisterRequirementDto } from './register-requirement.dto';

@Controller('requirements')
export class RegisterRequirementController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async registerRequirement(
    @Body() dto: RegisterRequirementDto,
  ): Promise<void> {
    await this.commandBus.execute<RegisterRequirementCommand, void>(
      new RegisterRequirementCommand(
        dto.name,
        dto.description,
        dto.requestingInstitution,
        dto.requestedBy,
        dto.type,
        dto.domain,
        dto.benefitedInstitutions,
        dto.studyModalities,
        dto.isObligatory,
        dto.hasAlternativeSolution,
        dto.impactUsers,
        dto.complexityEffort,
        dto.collaboratorDomains ?? [],
        dto.followerDomains ?? [],
        dto.startDate ? new Date(dto.startDate) : null,
        dto.finishDate ? new Date(dto.finishDate) : null,
        dto.clientPriorityOverride,
        dto.managementPriority,
        dto.impactUsersNumericContribution,
        dto.impactOverride,
      ),
    );
  }
}
