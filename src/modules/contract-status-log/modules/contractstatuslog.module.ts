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
import { ContractStatusLogCommandController } from "../controllers/contractstatuslogcommand.controller";
import { ContractStatusLogQueryController } from "../controllers/contractstatuslogquery.controller";
import { ContractStatusLogCommandService } from "../services/contractstatuslogcommand.service";
import { ContractStatusLogQueryService } from "../services/contractstatuslogquery.service";

import { ContractStatusLogCommandRepository } from "../repositories/contractstatuslogcommand.repository";
import { ContractStatusLogQueryRepository } from "../repositories/contractstatuslogquery.repository";
import { ContractStatusLogRepository } from "../repositories/contractstatuslog.repository";
import { ContractStatusLogResolver } from "../graphql/contractstatuslog.resolver";
import { ContractStatusLogAuthGuard } from "../guards/contractstatuslogauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ContractStatusLog } from "../entities/contract-status-log.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateContractStatusLogHandler } from "../commands/handlers/createcontractstatuslog.handler";
import { UpdateContractStatusLogHandler } from "../commands/handlers/updatecontractstatuslog.handler";
import { DeleteContractStatusLogHandler } from "../commands/handlers/deletecontractstatuslog.handler";
import { GetContractStatusLogByIdHandler } from "../queries/handlers/getcontractstatuslogbyid.handler";
import { GetContractStatusLogByFieldHandler } from "../queries/handlers/getcontractstatuslogbyfield.handler";
import { GetAllContractStatusLogHandler } from "../queries/handlers/getallcontractstatuslog.handler";
import { ContractStatusLogCrudSaga } from "../sagas/contractstatuslog-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ContractStatusLogInterceptor } from "../interceptors/contractstatuslog.interceptor";
import { ContractStatusLogLoggingInterceptor } from "../interceptors/contractstatuslog.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, ContractStatusLog]), // Incluir BaseEntity para herencia
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
  controllers: [ContractStatusLogCommandController, ContractStatusLogQueryController],
  providers: [
    //Services
    EventStoreService,
    ContractStatusLogQueryService,
    ContractStatusLogCommandService,
  
    //Repositories
    ContractStatusLogCommandRepository,
    ContractStatusLogQueryRepository,
    ContractStatusLogRepository,      
    //Resolvers
    ContractStatusLogResolver,
    //Guards
    ContractStatusLogAuthGuard,
    //Interceptors
    ContractStatusLogInterceptor,
    ContractStatusLogLoggingInterceptor,
    //CQRS Handlers
    CreateContractStatusLogHandler,
    UpdateContractStatusLogHandler,
    DeleteContractStatusLogHandler,
    GetContractStatusLogByIdHandler,
    GetContractStatusLogByFieldHandler,
    GetAllContractStatusLogHandler,
    ContractStatusLogCrudSaga,
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
    ContractStatusLogQueryService,
    ContractStatusLogCommandService,
  
    //Repositories
    ContractStatusLogCommandRepository,
    ContractStatusLogQueryRepository,
    ContractStatusLogRepository,      
    //Resolvers
    ContractStatusLogResolver,
    //Guards
    ContractStatusLogAuthGuard,
    //Interceptors
    ContractStatusLogInterceptor,
    ContractStatusLogLoggingInterceptor,
  ],
})
export class ContractStatusLogModule {}

