import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CrmTacticalSummaryController } from './crm-tactical-summary.controller';
import { CrmTacticalSummaryService } from './crm-tactical-summary.service';

@Module({
  imports: [ConfigModule],
  controllers: [CrmTacticalSummaryController],
  providers: [CrmTacticalSummaryService],
  exports: [CrmTacticalSummaryService],
})
export class CrmTacticalSummaryModule {}