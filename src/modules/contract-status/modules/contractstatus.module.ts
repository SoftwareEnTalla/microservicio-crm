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
import { ContractStatusCommandController } from "../controllers/contractstatuscommand.controller";
import { ContractStatusQueryController } from "../controllers/contractstatusquery.controller";
import { ContractStatusCommandService } from "../services/contractstatuscommand.service";
import { ContractStatusQueryService } from "../services/contractstatusquery.service";

import { ContractStatusCommandRepository } from "../repositories/contractstatuscommand.repository";
import { ContractStatusQueryRepository } from "../repositories/contractstatusquery.repository";
import { ContractStatusRepository } from "../repositories/contractstatus.repository";
import { ContractStatusResolver } from "../graphql/contractstatus.resolver";
import { ContractStatusAuthGuard } from "../guards/contractstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractStatus } from "../entities/contract-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateContractStatusHandler } from "../commands/handlers/createcontractstatus.handler";
import { UpdateContractStatusHandler } from "../commands/handlers/updatecontractstatus.handler";
import { DeleteContractStatusHandler } from "../commands/handlers/deletecontractstatus.handler";
import { GetContractStatusByIdHandler } from "../queries/handlers/getcontractstatusbyid.handler";
import { GetContractStatusByFieldHandler } from "../queries/handlers/getcontractstatusbyfield.handler";
import { GetAllContractStatusHandler } from "../queries/handlers/getallcontractstatus.handler";
import { ContractStatusCrudSaga } from "../sagas/contractstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ContractStatusInterceptor } from "../interceptors/contractstatus.interceptor";
import { ContractStatusLoggingInterceptor } from "../interceptors/contractstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ContractStatus]), // Incluir BaseEntity para herencia
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
  controllers: [ContractStatusCommandController, ContractStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    ContractStatusQueryService,
    ContractStatusCommandService,
  
    //Repositories
    ContractStatusCommandRepository,
    ContractStatusQueryRepository,
    ContractStatusRepository,      
    //Resolvers
    ContractStatusResolver,
    //Guards
    ContractStatusAuthGuard,
    //Interceptors
    ContractStatusInterceptor,
    ContractStatusLoggingInterceptor,
    //CQRS Handlers
    CreateContractStatusHandler,
    UpdateContractStatusHandler,
    DeleteContractStatusHandler,
    GetContractStatusByIdHandler,
    GetContractStatusByFieldHandler,
    GetAllContractStatusHandler,
    ContractStatusCrudSaga,
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
    ContractStatusQueryService,
    ContractStatusCommandService,
  
    //Repositories
    ContractStatusCommandRepository,
    ContractStatusQueryRepository,
    ContractStatusRepository,      
    //Resolvers
    ContractStatusResolver,
    //Guards
    ContractStatusAuthGuard,
    //Interceptors
    ContractStatusInterceptor,
    ContractStatusLoggingInterceptor,
  ],
})
export class ContractStatusModule {}

