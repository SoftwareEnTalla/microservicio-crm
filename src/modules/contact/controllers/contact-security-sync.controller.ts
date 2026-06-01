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
import { ContactAuthGuard } from "../guards/contactauthguard.guard";
import { ContactSecuritySyncService } from "../services/contact-security-sync.service";

@ApiTags("Contact Security Sync")
@UseGuards(ContactAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticacion requerida." })
@Controller("contacts")
export class ContactSecuritySyncController {
  constructor(private readonly service: ContactSecuritySyncService) {}

  @Get("search-security-candidates")
  @ApiOperation({ summary: "Buscar candidatos en Security para enlazar un contact." })
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
  @ApiOperation({ summary: "Sincronizar un contact desde Security hacia CRM." })
  async pull(
    @Param("id") id: string,
    @Body() body: Record<string, any>,
    @Req() req?: any,
  ) {
    return this.service.pull(id, body || {}, req?.headers?.authorization);
  }

  @Post(":id/security/push")
  @ApiOperation({ summary: "Sincronizar un contact desde CRM hacia Security." })
  async push(@Param("id") id: string, @Req() req?: any) {
    return this.service.push(id, req?.headers?.authorization);
  }
}