/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Module } from "@nestjs/common";
import { LeadCommandController } from "../controllers/leadcommand.controller";
import { LeadQueryController } from "../controllers/leadquery.controller";
import { LeadCommandService } from "../services/leadcommand.service";
import { LeadQueryService } from "../services/leadquery.service";

import { LeadCommandRepository } from "../repositories/leadcommand.repository";
import { LeadQueryRepository } from "../repositories/leadquery.repository";
import { LeadRepository } from "../repositories/lead.repository";
import { LeadResolver } from "../graphql/lead.resolver";
import { LeadAuthGuard } from "../guards/leadauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Lead } from "../entities/lead.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateLeadHandler } from "../commands/handlers/createlead.handler";
import { UpdateLeadHandler } from "../commands/handlers/updatelead.handler";
import { DeleteLeadHandler } from "../commands/handlers/deletelead.handler";
import { GetLeadByIdHandler } from "../queries/handlers/getleadbyid.handler";
import { GetLeadByFieldHandler } from "../queries/handlers/getleadbyfield.handler";
import { GetAllLeadHandler } from "../queries/handlers/getalllead.handler";
import { LeadCrudSaga } from "../sagas/lead-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { LeadInterceptor } from "../interceptors/lead.interceptor";
import { LeadLoggingInterceptor } from "../interceptors/lead.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Lead]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [LeadCommandController, LeadQueryController],
  providers: [
    //Services
    EventStoreService,
    LeadQueryService,
    LeadCommandService,
  
    //Repositories
    LeadCommandRepository,
    LeadQueryRepository,
    LeadRepository,      
    //Resolvers
    LeadResolver,
    //Guards
    LeadAuthGuard,
    //Interceptors
    LeadInterceptor,
    LeadLoggingInterceptor,
    //CQRS Handlers
    CreateLeadHandler,
    UpdateLeadHandler,
    DeleteLeadHandler,
    GetLeadByIdHandler,
    GetLeadByFieldHandler,
    GetAllLeadHandler,
    LeadCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    LeadQueryService,
    LeadCommandService,
  
    //Repositories
    LeadCommandRepository,
    LeadQueryRepository,
    LeadRepository,      
    //Resolvers
    LeadResolver,
    //Guards
    LeadAuthGuard,
    //Interceptors
    LeadInterceptor,
    LeadLoggingInterceptor,
  ],
})
export class LeadModule {}

