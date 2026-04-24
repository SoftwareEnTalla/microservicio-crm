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
import { TermsAndConditionCommandController } from "../controllers/termsandconditioncommand.controller";
import { TermsAndConditionQueryController } from "../controllers/termsandconditionquery.controller";
import { TermsAndConditionCommandService } from "../services/termsandconditioncommand.service";
import { TermsAndConditionQueryService } from "../services/termsandconditionquery.service";

import { TermsAndConditionCommandRepository } from "../repositories/termsandconditioncommand.repository";
import { TermsAndConditionQueryRepository } from "../repositories/termsandconditionquery.repository";
import { TermsAndConditionRepository } from "../repositories/termsandcondition.repository";
import { TermsAndConditionResolver } from "../graphql/termsandcondition.resolver";
import { TermsAndConditionAuthGuard } from "../guards/termsandconditionauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TermsAndCondition } from "../entities/terms-and-condition.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateTermsAndConditionHandler } from "../commands/handlers/createtermsandcondition.handler";
import { UpdateTermsAndConditionHandler } from "../commands/handlers/updatetermsandcondition.handler";
import { DeleteTermsAndConditionHandler } from "../commands/handlers/deletetermsandcondition.handler";
import { GetTermsAndConditionByIdHandler } from "../queries/handlers/gettermsandconditionbyid.handler";
import { GetTermsAndConditionByFieldHandler } from "../queries/handlers/gettermsandconditionbyfield.handler";
import { GetAllTermsAndConditionHandler } from "../queries/handlers/getalltermsandcondition.handler";
import { TermsAndConditionCrudSaga } from "../sagas/termsandcondition-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { TermsAndConditionInterceptor } from "../interceptors/termsandcondition.interceptor";
import { TermsAndConditionLoggingInterceptor } from "../interceptors/termsandcondition.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, TermsAndCondition]), // Incluir BaseEntity para herencia
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
  controllers: [TermsAndConditionCommandController, TermsAndConditionQueryController],
  providers: [
    //Services
    EventStoreService,
    TermsAndConditionQueryService,
    TermsAndConditionCommandService,
  
    //Repositories
    TermsAndConditionCommandRepository,
    TermsAndConditionQueryRepository,
    TermsAndConditionRepository,      
    //Resolvers
    TermsAndConditionResolver,
    //Guards
    TermsAndConditionAuthGuard,
    //Interceptors
    TermsAndConditionInterceptor,
    TermsAndConditionLoggingInterceptor,
    //CQRS Handlers
    CreateTermsAndConditionHandler,
    UpdateTermsAndConditionHandler,
    DeleteTermsAndConditionHandler,
    GetTermsAndConditionByIdHandler,
    GetTermsAndConditionByFieldHandler,
    GetAllTermsAndConditionHandler,
    TermsAndConditionCrudSaga,
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
    TermsAndConditionQueryService,
    TermsAndConditionCommandService,
  
    //Repositories
    TermsAndConditionCommandRepository,
    TermsAndConditionQueryRepository,
    TermsAndConditionRepository,      
    //Resolvers
    TermsAndConditionResolver,
    //Guards
    TermsAndConditionAuthGuard,
    //Interceptors
    TermsAndConditionInterceptor,
    TermsAndConditionLoggingInterceptor,
  ],
})
export class TermsAndConditionModule {}

