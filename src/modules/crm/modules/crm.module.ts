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
import { CrmCommandController } from "../controllers/crmcommand.controller";
import { CrmQueryController } from "../controllers/crmquery.controller";
import { CrmCommandService } from "../services/crmcommand.service";
import { CrmQueryService } from "../services/crmquery.service";

import { CrmCommandRepository } from "../repositories/crmcommand.repository";
import { CrmQueryRepository } from "../repositories/crmquery.repository";
import { CrmRepository } from "../repositories/crm.repository";
import { CrmResolver } from "../graphql/crm.resolver";
import { CrmAuthGuard } from "../guards/crmauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Crm } from "../entities/crm.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateCrmHandler } from "../commands/handlers/createcrm.handler";
import { UpdateCrmHandler } from "../commands/handlers/updatecrm.handler";
import { DeleteCrmHandler } from "../commands/handlers/deletecrm.handler";
import { GetCrmByIdHandler } from "../queries/handlers/getcrmbyid.handler";
import { GetCrmByFieldHandler } from "../queries/handlers/getcrmbyfield.handler";
import { GetAllCrmHandler } from "../queries/handlers/getallcrm.handler";
import { CrmCrudSaga } from "../sagas/crm-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { CrmInterceptor } from "../interceptors/crm.interceptor";
import { CrmLoggingInterceptor } from "../interceptors/crm.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Crm]), // Incluir BaseEntity para herencia
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
  controllers: [CrmCommandController, CrmQueryController],
  providers: [
    //Services
    EventStoreService,
    CrmQueryService,
    CrmCommandService,
  
    //Repositories
    CrmCommandRepository,
    CrmQueryRepository,
    CrmRepository,      
    //Resolvers
    CrmResolver,
    //Guards
    CrmAuthGuard,
    //Interceptors
    CrmInterceptor,
    CrmLoggingInterceptor,
    //CQRS Handlers
    CreateCrmHandler,
    UpdateCrmHandler,
    DeleteCrmHandler,
    GetCrmByIdHandler,
    GetCrmByFieldHandler,
    GetAllCrmHandler,
    CrmCrudSaga,
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
    CrmQueryService,
    CrmCommandService,
  
    //Repositories
    CrmCommandRepository,
    CrmQueryRepository,
    CrmRepository,      
    //Resolvers
    CrmResolver,
    //Guards
    CrmAuthGuard,
    //Interceptors
    CrmInterceptor,
    CrmLoggingInterceptor,
  ],
})
export class CrmModule {}

