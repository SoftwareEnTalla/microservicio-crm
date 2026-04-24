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
import { ContractCommandController } from "../controllers/contractcommand.controller";
import { ContractQueryController } from "../controllers/contractquery.controller";
import { ContractCommandService } from "../services/contractcommand.service";
import { ContractQueryService } from "../services/contractquery.service";

import { ContractCommandRepository } from "../repositories/contractcommand.repository";
import { ContractQueryRepository } from "../repositories/contractquery.repository";
import { ContractRepository } from "../repositories/contract.repository";
import { ContractResolver } from "../graphql/contract.resolver";
import { ContractAuthGuard } from "../guards/contractauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contract } from "../entities/contract.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateContractHandler } from "../commands/handlers/createcontract.handler";
import { UpdateContractHandler } from "../commands/handlers/updatecontract.handler";
import { DeleteContractHandler } from "../commands/handlers/deletecontract.handler";
import { GetContractByIdHandler } from "../queries/handlers/getcontractbyid.handler";
import { GetContractByFieldHandler } from "../queries/handlers/getcontractbyfield.handler";
import { GetAllContractHandler } from "../queries/handlers/getallcontract.handler";
import { ContractCrudSaga } from "../sagas/contract-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ContractInterceptor } from "../interceptors/contract.interceptor";
import { ContractLoggingInterceptor } from "../interceptors/contract.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Contract]), // Incluir BaseEntity para herencia
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
  controllers: [ContractCommandController, ContractQueryController],
  providers: [
    //Services
    EventStoreService,
    ContractQueryService,
    ContractCommandService,
  
    //Repositories
    ContractCommandRepository,
    ContractQueryRepository,
    ContractRepository,      
    //Resolvers
    ContractResolver,
    //Guards
    ContractAuthGuard,
    //Interceptors
    ContractInterceptor,
    ContractLoggingInterceptor,
    //CQRS Handlers
    CreateContractHandler,
    UpdateContractHandler,
    DeleteContractHandler,
    GetContractByIdHandler,
    GetContractByFieldHandler,
    GetAllContractHandler,
    ContractCrudSaga,
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
    ContractQueryService,
    ContractCommandService,
  
    //Repositories
    ContractCommandRepository,
    ContractQueryRepository,
    ContractRepository,      
    //Resolvers
    ContractResolver,
    //Guards
    ContractAuthGuard,
    //Interceptors
    ContractInterceptor,
    ContractLoggingInterceptor,
  ],
})
export class ContractModule {}

