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
import { GlobalPaymentRuleCommandController } from "../controllers/globalpaymentrulecommand.controller";
import { GlobalPaymentRuleQueryController } from "../controllers/globalpaymentrulequery.controller";
import { GlobalPaymentRuleCommandService } from "../services/globalpaymentrulecommand.service";
import { GlobalPaymentRuleQueryService } from "../services/globalpaymentrulequery.service";

import { GlobalPaymentRuleCommandRepository } from "../repositories/globalpaymentrulecommand.repository";
import { GlobalPaymentRuleQueryRepository } from "../repositories/globalpaymentrulequery.repository";
import { GlobalPaymentRuleRepository } from "../repositories/globalpaymentrule.repository";
import { GlobalPaymentRuleResolver } from "../graphql/globalpaymentrule.resolver";
import { GlobalPaymentRuleAuthGuard } from "../guards/globalpaymentruleauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GlobalPaymentRule } from "../entities/global-payment-rule.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateGlobalPaymentRuleHandler } from "../commands/handlers/createglobalpaymentrule.handler";
import { UpdateGlobalPaymentRuleHandler } from "../commands/handlers/updateglobalpaymentrule.handler";
import { DeleteGlobalPaymentRuleHandler } from "../commands/handlers/deleteglobalpaymentrule.handler";
import { GetGlobalPaymentRuleByIdHandler } from "../queries/handlers/getglobalpaymentrulebyid.handler";
import { GetGlobalPaymentRuleByFieldHandler } from "../queries/handlers/getglobalpaymentrulebyfield.handler";
import { GetAllGlobalPaymentRuleHandler } from "../queries/handlers/getallglobalpaymentrule.handler";
import { GlobalPaymentRuleCrudSaga } from "../sagas/globalpaymentrule-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { GlobalPaymentRuleInterceptor } from "../interceptors/globalpaymentrule.interceptor";
import { GlobalPaymentRuleLoggingInterceptor } from "../interceptors/globalpaymentrule.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, GlobalPaymentRule]), // Incluir BaseEntity para herencia
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
  controllers: [GlobalPaymentRuleCommandController, GlobalPaymentRuleQueryController],
  providers: [
    //Services
    EventStoreService,
    GlobalPaymentRuleQueryService,
    GlobalPaymentRuleCommandService,
  
    //Repositories
    GlobalPaymentRuleCommandRepository,
    GlobalPaymentRuleQueryRepository,
    GlobalPaymentRuleRepository,      
    //Resolvers
    GlobalPaymentRuleResolver,
    //Guards
    GlobalPaymentRuleAuthGuard,
    //Interceptors
    GlobalPaymentRuleInterceptor,
    GlobalPaymentRuleLoggingInterceptor,
    //CQRS Handlers
    CreateGlobalPaymentRuleHandler,
    UpdateGlobalPaymentRuleHandler,
    DeleteGlobalPaymentRuleHandler,
    GetGlobalPaymentRuleByIdHandler,
    GetGlobalPaymentRuleByFieldHandler,
    GetAllGlobalPaymentRuleHandler,
    GlobalPaymentRuleCrudSaga,
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
    GlobalPaymentRuleQueryService,
    GlobalPaymentRuleCommandService,
  
    //Repositories
    GlobalPaymentRuleCommandRepository,
    GlobalPaymentRuleQueryRepository,
    GlobalPaymentRuleRepository,      
    //Resolvers
    GlobalPaymentRuleResolver,
    //Guards
    GlobalPaymentRuleAuthGuard,
    //Interceptors
    GlobalPaymentRuleInterceptor,
    GlobalPaymentRuleLoggingInterceptor,
  ],
})
export class GlobalPaymentRuleModule {}

