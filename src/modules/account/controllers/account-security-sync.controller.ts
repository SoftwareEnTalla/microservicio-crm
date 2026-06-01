import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { AccountAuthGuard } from "../guards/accountauthguard.guard";
import { AccountSecuritySyncService } from "../services/account-security-sync.service";

@ApiTags("Account Security Sync")
@UseGuards(AccountAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticacion requerida." })
@Controller("accounts")
export class AccountSecuritySyncController {
  constructor(private readonly service: AccountSecuritySyncService) {}

  @Get("search-security-candidates")
  @ApiOperation({ summary: "Buscar candidatos en Security para enlazar una account." })
  async searchCandidates(
    @Query("q") q: string,
    @Query("limit") limit?: string,
    @Req() req?: any,
  ) {
    return this.service.searchCandidates(
      q,
      limit ? parseInt(limit, 10) : 10,
      req?.headers?.authorization,
    );
  }

  @Post(":id/security/pull")
  @ApiOperation({ summary: "Sincronizar una account desde Security hacia CRM." })
  async pull(
    @Param("id") id: string,
    @Body() body: Record<string, any>,
    @Req() req?: any,
  ) {
    return this.service.pull(id, body || {}, req?.headers?.authorization);
  }

  @Post(":id/security/push")
  @ApiOperation({ summary: "Sincronizar una account desde CRM hacia Security." })
  async push(@Param("id") id: string, @Req() req?: any) {
    return this.service.push(id, req?.headers?.authorization);
  }
}