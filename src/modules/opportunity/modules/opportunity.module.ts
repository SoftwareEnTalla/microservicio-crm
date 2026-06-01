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
import { OpportunityCommandController } from "../controllers/opportunitycommand.controller";
import { OpportunityQueryController } from "../controllers/opportunityquery.controller";
import { OpportunityCommandService } from "../services/opportunitycommand.service";
import { OpportunityQueryService } from "../services/opportunityquery.service";

import { OpportunityCommandRepository } from "../repositories/opportunitycommand.repository";
import { OpportunityQueryRepository } from "../repositories/opportunityquery.repository";
import { OpportunityRepository } from "../repositories/opportunity.repository";
import { OpportunityResolver } from "../graphql/opportunity.resolver";
import { OpportunityAuthGuard } from "../guards/opportunityauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Opportunity } from "../entities/opportunity.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateOpportunityHandler } from "../commands/handlers/createopportunity.handler";
import { UpdateOpportunityHandler } from "../commands/handlers/updateopportunity.handler";
import { DeleteOpportunityHandler } from "../commands/handlers/deleteopportunity.handler";
import { GetOpportunityByIdHandler } from "../queries/handlers/getopportunitybyid.handler";
import { GetOpportunityByFieldHandler } from "../queries/handlers/getopportunitybyfield.handler";
import { GetAllOpportunityHandler } from "../queries/handlers/getallopportunity.handler";
import { OpportunityCrudSaga } from "../sagas/opportunity-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { OpportunityInterceptor } from "../interceptors/opportunity.interceptor";
import { OpportunityLoggingInterceptor } from "../interceptors/opportunity.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Opportunity]), // Incluir BaseEntity para herencia
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
  controllers: [OpportunityCommandController, OpportunityQueryController],
  providers: [
    //Services
    EventStoreService,
    OpportunityQueryService,
    OpportunityCommandService,
  
    //Repositories
    OpportunityCommandRepository,
    OpportunityQueryRepository,
    OpportunityRepository,      
    //Resolvers
    OpportunityResolver,
    //Guards
    OpportunityAuthGuard,
    //Interceptors
    OpportunityInterceptor,
    OpportunityLoggingInterceptor,
    //CQRS Handlers
    CreateOpportunityHandler,
    UpdateOpportunityHandler,
    DeleteOpportunityHandler,
    GetOpportunityByIdHandler,
    GetOpportunityByFieldHandler,
    GetAllOpportunityHandler,
    OpportunityCrudSaga,
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
    OpportunityQueryService,
    OpportunityCommandService,
  
    //Repositories
    OpportunityCommandRepository,
    OpportunityQueryRepository,
    OpportunityRepository,      
    //Resolvers
    OpportunityResolver,
    //Guards
    OpportunityAuthGuard,
    //Interceptors
    OpportunityInterceptor,
    OpportunityLoggingInterceptor,
  ],
})
export class OpportunityModule {}

