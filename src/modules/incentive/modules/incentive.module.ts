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
import { IncentiveCommandController } from "../controllers/incentivecommand.controller";
import { IncentiveQueryController } from "../controllers/incentivequery.controller";
import { IncentiveCommandService } from "../services/incentivecommand.service";
import { IncentiveQueryService } from "../services/incentivequery.service";

import { IncentiveCommandRepository } from "../repositories/incentivecommand.repository";
import { IncentiveQueryRepository } from "../repositories/incentivequery.repository";
import { IncentiveRepository } from "../repositories/incentive.repository";
import { IncentiveResolver } from "../graphql/incentive.resolver";
import { IncentiveAuthGuard } from "../guards/incentiveauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Incentive } from "../entities/incentive.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateIncentiveHandler } from "../commands/handlers/createincentive.handler";
import { UpdateIncentiveHandler } from "../commands/handlers/updateincentive.handler";
import { DeleteIncentiveHandler } from "../commands/handlers/deleteincentive.handler";
import { GetIncentiveByIdHandler } from "../queries/handlers/getincentivebyid.handler";
import { GetIncentiveByFieldHandler } from "../queries/handlers/getincentivebyfield.handler";
import { GetAllIncentiveHandler } from "../queries/handlers/getallincentive.handler";
import { IncentiveCrudSaga } from "../sagas/incentive-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { IncentiveInterceptor } from "../interceptors/incentive.interceptor";
import { IncentiveLoggingInterceptor } from "../interceptors/incentive.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Incentive]), // Incluir BaseEntity para herencia
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
  controllers: [IncentiveCommandController, IncentiveQueryController],
  providers: [
    //Services
    EventStoreService,
    IncentiveQueryService,
    IncentiveCommandService,
  
    //Repositories
    IncentiveCommandRepository,
    IncentiveQueryRepository,
    IncentiveRepository,      
    //Resolvers
    IncentiveResolver,
    //Guards
    IncentiveAuthGuard,
    //Interceptors
    IncentiveInterceptor,
    IncentiveLoggingInterceptor,
    //CQRS Handlers
    CreateIncentiveHandler,
    UpdateIncentiveHandler,
    DeleteIncentiveHandler,
    GetIncentiveByIdHandler,
    GetIncentiveByFieldHandler,
    GetAllIncentiveHandler,
    IncentiveCrudSaga,
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
    IncentiveQueryService,
    IncentiveCommandService,
  
    //Repositories
    IncentiveCommandRepository,
    IncentiveQueryRepository,
    IncentiveRepository,      
    //Resolvers
    IncentiveResolver,
    //Guards
    IncentiveAuthGuard,
    //Interceptors
    IncentiveInterceptor,
    IncentiveLoggingInterceptor,
  ],
})
export class IncentiveModule {}

