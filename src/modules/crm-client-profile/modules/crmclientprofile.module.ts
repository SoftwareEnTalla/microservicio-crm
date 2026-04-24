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
import { CrmClientProfileCommandController } from "../controllers/crmclientprofilecommand.controller";
import { CrmClientProfileQueryController } from "../controllers/crmclientprofilequery.controller";
import { CrmClientProfileCommandService } from "../services/crmclientprofilecommand.service";
import { CrmClientProfileQueryService } from "../services/crmclientprofilequery.service";

import { CrmClientProfileCommandRepository } from "../repositories/crmclientprofilecommand.repository";
import { CrmClientProfileQueryRepository } from "../repositories/crmclientprofilequery.repository";
import { CrmClientProfileRepository } from "../repositories/crmclientprofile.repository";
import { CrmClientProfileResolver } from "../graphql/crmclientprofile.resolver";
import { CrmClientProfileAuthGuard } from "../guards/crmclientprofileauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CrmClientProfile } from "../entities/crm-client-profile.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCrmClientProfileHandler } from "../commands/handlers/createcrmclientprofile.handler";
import { UpdateCrmClientProfileHandler } from "../commands/handlers/updatecrmclientprofile.handler";
import { DeleteCrmClientProfileHandler } from "../commands/handlers/deletecrmclientprofile.handler";
import { GetCrmClientProfileByIdHandler } from "../queries/handlers/getcrmclientprofilebyid.handler";
import { GetCrmClientProfileByFieldHandler } from "../queries/handlers/getcrmclientprofilebyfield.handler";
import { GetAllCrmClientProfileHandler } from "../queries/handlers/getallcrmclientprofile.handler";
import { CrmClientProfileCrudSaga } from "../sagas/crmclientprofile-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CrmClientProfileInterceptor } from "../interceptors/crmclientprofile.interceptor";
import { CrmClientProfileLoggingInterceptor } from "../interceptors/crmclientprofile.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, CrmClientProfile]), // Incluir BaseEntity para herencia
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
  controllers: [CrmClientProfileCommandController, CrmClientProfileQueryController],
  providers: [
    //Services
    EventStoreService,
    CrmClientProfileQueryService,
    CrmClientProfileCommandService,
  
    //Repositories
    CrmClientProfileCommandRepository,
    CrmClientProfileQueryRepository,
    CrmClientProfileRepository,      
    //Resolvers
    CrmClientProfileResolver,
    //Guards
    CrmClientProfileAuthGuard,
    //Interceptors
    CrmClientProfileInterceptor,
    CrmClientProfileLoggingInterceptor,
    //CQRS Handlers
    CreateCrmClientProfileHandler,
    UpdateCrmClientProfileHandler,
    DeleteCrmClientProfileHandler,
    GetCrmClientProfileByIdHandler,
    GetCrmClientProfileByFieldHandler,
    GetAllCrmClientProfileHandler,
    CrmClientProfileCrudSaga,
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
    CrmClientProfileQueryService,
    CrmClientProfileCommandService,
  
    //Repositories
    CrmClientProfileCommandRepository,
    CrmClientProfileQueryRepository,
    CrmClientProfileRepository,      
    //Resolvers
    CrmClientProfileResolver,
    //Guards
    CrmClientProfileAuthGuard,
    //Interceptors
    CrmClientProfileInterceptor,
    CrmClientProfileLoggingInterceptor,
  ],
})
export class CrmClientProfileModule {}

