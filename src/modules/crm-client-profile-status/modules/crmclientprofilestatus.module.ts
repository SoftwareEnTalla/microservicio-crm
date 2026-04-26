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
import { CrmClientProfileStatusCommandController } from "../controllers/crmclientprofilestatuscommand.controller";
import { CrmClientProfileStatusQueryController } from "../controllers/crmclientprofilestatusquery.controller";
import { CrmClientProfileStatusCommandService } from "../services/crmclientprofilestatuscommand.service";
import { CrmClientProfileStatusQueryService } from "../services/crmclientprofilestatusquery.service";

import { CrmClientProfileStatusCommandRepository } from "../repositories/crmclientprofilestatuscommand.repository";
import { CrmClientProfileStatusQueryRepository } from "../repositories/crmclientprofilestatusquery.repository";
import { CrmClientProfileStatusRepository } from "../repositories/crmclientprofilestatus.repository";
import { CrmClientProfileStatusResolver } from "../graphql/crmclientprofilestatus.resolver";
import { CrmClientProfileStatusAuthGuard } from "../guards/crmclientprofilestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CrmClientProfileStatus } from "../entities/crm-client-profile-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCrmClientProfileStatusHandler } from "../commands/handlers/createcrmclientprofilestatus.handler";
import { UpdateCrmClientProfileStatusHandler } from "../commands/handlers/updatecrmclientprofilestatus.handler";
import { DeleteCrmClientProfileStatusHandler } from "../commands/handlers/deletecrmclientprofilestatus.handler";
import { GetCrmClientProfileStatusByIdHandler } from "../queries/handlers/getcrmclientprofilestatusbyid.handler";
import { GetCrmClientProfileStatusByFieldHandler } from "../queries/handlers/getcrmclientprofilestatusbyfield.handler";
import { GetAllCrmClientProfileStatusHandler } from "../queries/handlers/getallcrmclientprofilestatus.handler";
import { CrmClientProfileStatusCrudSaga } from "../sagas/crmclientprofilestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CrmClientProfileStatusInterceptor } from "../interceptors/crmclientprofilestatus.interceptor";
import { CrmClientProfileStatusLoggingInterceptor } from "../interceptors/crmclientprofilestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CrmClientProfileStatus]), // Incluir BaseEntity para herencia
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
  controllers: [CrmClientProfileStatusCommandController, CrmClientProfileStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    CrmClientProfileStatusQueryService,
    CrmClientProfileStatusCommandService,
  
    //Repositories
    CrmClientProfileStatusCommandRepository,
    CrmClientProfileStatusQueryRepository,
    CrmClientProfileStatusRepository,      
    //Resolvers
    CrmClientProfileStatusResolver,
    //Guards
    CrmClientProfileStatusAuthGuard,
    //Interceptors
    CrmClientProfileStatusInterceptor,
    CrmClientProfileStatusLoggingInterceptor,
    //CQRS Handlers
    CreateCrmClientProfileStatusHandler,
    UpdateCrmClientProfileStatusHandler,
    DeleteCrmClientProfileStatusHandler,
    GetCrmClientProfileStatusByIdHandler,
    GetCrmClientProfileStatusByFieldHandler,
    GetAllCrmClientProfileStatusHandler,
    CrmClientProfileStatusCrudSaga,
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
    CrmClientProfileStatusQueryService,
    CrmClientProfileStatusCommandService,
  
    //Repositories
    CrmClientProfileStatusCommandRepository,
    CrmClientProfileStatusQueryRepository,
    CrmClientProfileStatusRepository,      
    //Resolvers
    CrmClientProfileStatusResolver,
    //Guards
    CrmClientProfileStatusAuthGuard,
    //Interceptors
    CrmClientProfileStatusInterceptor,
    CrmClientProfileStatusLoggingInterceptor,
  ],
})
export class CrmClientProfileStatusModule {}

