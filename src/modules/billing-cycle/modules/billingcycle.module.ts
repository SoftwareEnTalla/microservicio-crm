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
import { BillingCycleCommandController } from "../controllers/billingcyclecommand.controller";
import { BillingCycleQueryController } from "../controllers/billingcyclequery.controller";
import { BillingCycleCommandService } from "../services/billingcyclecommand.service";
import { BillingCycleQueryService } from "../services/billingcyclequery.service";

import { BillingCycleCommandRepository } from "../repositories/billingcyclecommand.repository";
import { BillingCycleQueryRepository } from "../repositories/billingcyclequery.repository";
import { BillingCycleRepository } from "../repositories/billingcycle.repository";
import { BillingCycleResolver } from "../graphql/billingcycle.resolver";
import { BillingCycleAuthGuard } from "../guards/billingcycleauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BillingCycle } from "../entities/billing-cycle.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateBillingCycleHandler } from "../commands/handlers/createbillingcycle.handler";
import { UpdateBillingCycleHandler } from "../commands/handlers/updatebillingcycle.handler";
import { DeleteBillingCycleHandler } from "../commands/handlers/deletebillingcycle.handler";
import { GetBillingCycleByIdHandler } from "../queries/handlers/getbillingcyclebyid.handler";
import { GetBillingCycleByFieldHandler } from "../queries/handlers/getbillingcyclebyfield.handler";
import { GetAllBillingCycleHandler } from "../queries/handlers/getallbillingcycle.handler";
import { BillingCycleCrudSaga } from "../sagas/billingcycle-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { BillingCycleInterceptor } from "../interceptors/billingcycle.interceptor";
import { BillingCycleLoggingInterceptor } from "../interceptors/billingcycle.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, BillingCycle]), // Incluir BaseEntity para herencia
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
  controllers: [BillingCycleCommandController, BillingCycleQueryController],
  providers: [
    //Services
    EventStoreService,
    BillingCycleQueryService,
    BillingCycleCommandService,
  
    //Repositories
    BillingCycleCommandRepository,
    BillingCycleQueryRepository,
    BillingCycleRepository,      
    //Resolvers
    BillingCycleResolver,
    //Guards
    BillingCycleAuthGuard,
    //Interceptors
    BillingCycleInterceptor,
    BillingCycleLoggingInterceptor,
    //CQRS Handlers
    CreateBillingCycleHandler,
    UpdateBillingCycleHandler,
    DeleteBillingCycleHandler,
    GetBillingCycleByIdHandler,
    GetBillingCycleByFieldHandler,
    GetAllBillingCycleHandler,
    BillingCycleCrudSaga,
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
    BillingCycleQueryService,
    BillingCycleCommandService,
  
    //Repositories
    BillingCycleCommandRepository,
    BillingCycleQueryRepository,
    BillingCycleRepository,      
    //Resolvers
    BillingCycleResolver,
    //Guards
    BillingCycleAuthGuard,
    //Interceptors
    BillingCycleInterceptor,
    BillingCycleLoggingInterceptor,
  ],
})
export class BillingCycleModule {}

