import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CrmTacticalSummaryService } from './crm-tactical-summary.service';

@ApiTags('crm-tactical-summary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('crm-tactical-summary')
export class CrmTacticalSummaryController {
  constructor(private readonly service: CrmTacticalSummaryService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen táctico CRM para contratos, hitos y continuidad documental' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de CRM.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 6));
  }
}