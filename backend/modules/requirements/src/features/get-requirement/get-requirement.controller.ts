import { Controller, Get, Param } from '@nestjs/common';
import { GetRequirementHandler } from './get-requirement.handler';
import { GetRequirementQuery } from './get-requirement.query';
import { EnrichedRequirement } from '../../domain/requirement/interfaces/requirement';

@Controller('requirements')
export class GetRequirementController {
  constructor(private readonly handler: GetRequirementHandler) {}

  @Get(':id')
  async handle(@Param('id') id: string): Promise<EnrichedRequirement> {
    const query = new GetRequirementQuery(id);
    return this.handler.handle(query);
  }
}
