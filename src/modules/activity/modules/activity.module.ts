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
import { ActivityCommandController } from "../controllers/activitycommand.controller";
import { ActivityQueryController } from "../controllers/activityquery.controller";
import { ActivityCommandService } from "../services/activitycommand.service";
import { ActivityQueryService } from "../services/activityquery.service";

import { ActivityCommandRepository } from "../repositories/activitycommand.repository";
import { ActivityQueryRepository } from "../repositories/activityquery.repository";
import { ActivityRepository } from "../repositories/activity.repository";
import { ActivityResolver } from "../graphql/activity.resolver";
import { ActivityAuthGuard } from "../guards/activityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Activity } from "../entities/activity.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateActivityHandler } from "../commands/handlers/createactivity.handler";
import { UpdateActivityHandler } from "../commands/handlers/updateactivity.handler";
import { DeleteActivityHandler } from "../commands/handlers/deleteactivity.handler";
import { GetActivityByIdHandler } from "../queries/handlers/getactivitybyid.handler";
import { GetActivityByFieldHandler } from "../queries/handlers/getactivitybyfield.handler";
import { GetAllActivityHandler } from "../queries/handlers/getallactivity.handler";
import { ActivityCrudSaga } from "../sagas/activity-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ActivityInterceptor } from "../interceptors/activity.interceptor";
import { ActivityLoggingInterceptor } from "../interceptors/activity.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Activity]), // Incluir BaseEntity para herencia
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
  controllers: [ActivityCommandController, ActivityQueryController],
  providers: [
    //Services
    EventStoreService,
    ActivityQueryService,
    ActivityCommandService,
  
    //Repositories
    ActivityCommandRepository,
    ActivityQueryRepository,
    ActivityRepository,      
    //Resolvers
    ActivityResolver,
    //Guards
    ActivityAuthGuard,
    //Interceptors
    ActivityInterceptor,
    ActivityLoggingInterceptor,
    //CQRS Handlers
    CreateActivityHandler,
    UpdateActivityHandler,
    DeleteActivityHandler,
    GetActivityByIdHandler,
    GetActivityByFieldHandler,
    GetAllActivityHandler,
    ActivityCrudSaga,
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
    ActivityQueryService,
    ActivityCommandService,
  
    //Repositories
    ActivityCommandRepository,
    ActivityQueryRepository,
    ActivityRepository,      
    //Resolvers
    ActivityResolver,
    //Guards
    ActivityAuthGuard,
    //Interceptors
    ActivityInterceptor,
    ActivityLoggingInterceptor,
  ],
})
export class ActivityModule {}

