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
import { QuoteCommandController } from "../controllers/quotecommand.controller";
import { QuoteQueryController } from "../controllers/quotequery.controller";
import { QuoteCommandService } from "../services/quotecommand.service";
import { QuoteQueryService } from "../services/quotequery.service";

import { QuoteCommandRepository } from "../repositories/quotecommand.repository";
import { QuoteQueryRepository } from "../repositories/quotequery.repository";
import { QuoteRepository } from "../repositories/quote.repository";
import { QuoteResolver } from "../graphql/quote.resolver";
import { QuoteAuthGuard } from "../guards/quoteauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quote } from "../entities/quote.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateQuoteHandler } from "../commands/handlers/createquote.handler";
import { UpdateQuoteHandler } from "../commands/handlers/updatequote.handler";
import { DeleteQuoteHandler } from "../commands/handlers/deletequote.handler";
import { GetQuoteByIdHandler } from "../queries/handlers/getquotebyid.handler";
import { GetQuoteByFieldHandler } from "../queries/handlers/getquotebyfield.handler";
import { GetAllQuoteHandler } from "../queries/handlers/getallquote.handler";
import { QuoteCrudSaga } from "../sagas/quote-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { QuoteInterceptor } from "../interceptors/quote.interceptor";
import { QuoteLoggingInterceptor } from "../interceptors/quote.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Quote]), // Incluir BaseEntity para herencia
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
  controllers: [QuoteCommandController, QuoteQueryController],
  providers: [
    //Services
    EventStoreService,
    QuoteQueryService,
    QuoteCommandService,
  
    //Repositories
    QuoteCommandRepository,
    QuoteQueryRepository,
    QuoteRepository,      
    //Resolvers
    QuoteResolver,
    //Guards
    QuoteAuthGuard,
    //Interceptors
    QuoteInterceptor,
    QuoteLoggingInterceptor,
    //CQRS Handlers
    CreateQuoteHandler,
    UpdateQuoteHandler,
    DeleteQuoteHandler,
    GetQuoteByIdHandler,
    GetQuoteByFieldHandler,
    GetAllQuoteHandler,
    QuoteCrudSaga,
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
    QuoteQueryService,
    QuoteCommandService,
  
    //Repositories
    QuoteCommandRepository,
    QuoteQueryRepository,
    QuoteRepository,      
    //Resolvers
    QuoteResolver,
    //Guards
    QuoteAuthGuard,
    //Interceptors
    QuoteInterceptor,
    QuoteLoggingInterceptor,
  ],
})
export class QuoteModule {}

