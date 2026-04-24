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
import { SubscriptionPlanCommandController } from "../controllers/subscriptionplancommand.controller";
import { SubscriptionPlanQueryController } from "../controllers/subscriptionplanquery.controller";
import { SubscriptionPlanCommandService } from "../services/subscriptionplancommand.service";
import { SubscriptionPlanQueryService } from "../services/subscriptionplanquery.service";

import { SubscriptionPlanCommandRepository } from "../repositories/subscriptionplancommand.repository";
import { SubscriptionPlanQueryRepository } from "../repositories/subscriptionplanquery.repository";
import { SubscriptionPlanRepository } from "../repositories/subscriptionplan.repository";
import { SubscriptionPlanResolver } from "../graphql/subscriptionplan.resolver";
import { SubscriptionPlanAuthGuard } from "../guards/subscriptionplanauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SubscriptionPlan } from "../entities/subscription-plan.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateSubscriptionPlanHandler } from "../commands/handlers/createsubscriptionplan.handler";
import { UpdateSubscriptionPlanHandler } from "../commands/handlers/updatesubscriptionplan.handler";
import { DeleteSubscriptionPlanHandler } from "../commands/handlers/deletesubscriptionplan.handler";
import { GetSubscriptionPlanByIdHandler } from "../queries/handlers/getsubscriptionplanbyid.handler";
import { GetSubscriptionPlanByFieldHandler } from "../queries/handlers/getsubscriptionplanbyfield.handler";
import { GetAllSubscriptionPlanHandler } from "../queries/handlers/getallsubscriptionplan.handler";
import { SubscriptionPlanCrudSaga } from "../sagas/subscriptionplan-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { SubscriptionPlanInterceptor } from "../interceptors/subscriptionplan.interceptor";
import { SubscriptionPlanLoggingInterceptor } from "../interceptors/subscriptionplan.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, SubscriptionPlan]), // Incluir BaseEntity para herencia
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
  controllers: [SubscriptionPlanCommandController, SubscriptionPlanQueryController],
  providers: [
    //Services
    EventStoreService,
    SubscriptionPlanQueryService,
    SubscriptionPlanCommandService,
  
    //Repositories
    SubscriptionPlanCommandRepository,
    SubscriptionPlanQueryRepository,
    SubscriptionPlanRepository,      
    //Resolvers
    SubscriptionPlanResolver,
    //Guards
    SubscriptionPlanAuthGuard,
    //Interceptors
    SubscriptionPlanInterceptor,
    SubscriptionPlanLoggingInterceptor,
    //CQRS Handlers
    CreateSubscriptionPlanHandler,
    UpdateSubscriptionPlanHandler,
    DeleteSubscriptionPlanHandler,
    GetSubscriptionPlanByIdHandler,
    GetSubscriptionPlanByFieldHandler,
    GetAllSubscriptionPlanHandler,
    SubscriptionPlanCrudSaga,
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
    SubscriptionPlanQueryService,
    SubscriptionPlanCommandService,
  
    //Repositories
    SubscriptionPlanCommandRepository,
    SubscriptionPlanQueryRepository,
    SubscriptionPlanRepository,      
    //Resolvers
    SubscriptionPlanResolver,
    //Guards
    SubscriptionPlanAuthGuard,
    //Interceptors
    SubscriptionPlanInterceptor,
    SubscriptionPlanLoggingInterceptor,
  ],
})
export class SubscriptionPlanModule {}

