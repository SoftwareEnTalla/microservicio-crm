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
import { AccountCommandController } from "../controllers/accountcommand.controller";
import { AccountQueryController } from "../controllers/accountquery.controller";
import { AccountCommandService } from "../services/accountcommand.service";
import { AccountQueryService } from "../services/accountquery.service";

import { AccountCommandRepository } from "../repositories/accountcommand.repository";
import { AccountQueryRepository } from "../repositories/accountquery.repository";
import { AccountRepository } from "../repositories/account.repository";
import { AccountResolver } from "../graphql/account.resolver";
import { AccountAuthGuard } from "../guards/accountauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Account } from "../entities/account.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateAccountHandler } from "../commands/handlers/createaccount.handler";
import { UpdateAccountHandler } from "../commands/handlers/updateaccount.handler";
import { DeleteAccountHandler } from "../commands/handlers/deleteaccount.handler";
import { GetAccountByIdHandler } from "../queries/handlers/getaccountbyid.handler";
import { GetAccountByFieldHandler } from "../queries/handlers/getaccountbyfield.handler";
import { GetAllAccountHandler } from "../queries/handlers/getallaccount.handler";
import { AccountCrudSaga } from "../sagas/account-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { AccountInterceptor } from "../interceptors/account.interceptor";
import { AccountLoggingInterceptor } from "../interceptors/account.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { AccountSecuritySyncService } from "../services/account-security-sync.service";
import { AccountSecuritySyncController } from "../controllers/account-security-sync.controller";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Account]), // Incluir BaseEntity para herencia
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
  controllers: [AccountCommandController, AccountQueryController, AccountSecuritySyncController],
  providers: [
    //Services
    EventStoreService,
    AccountQueryService,
    AccountCommandService,
    AccountSecuritySyncService,
  
    //Repositories
    AccountCommandRepository,
    AccountQueryRepository,
    AccountRepository,      
    //Resolvers
    AccountResolver,
    //Guards
    AccountAuthGuard,
    //Interceptors
    AccountInterceptor,
    AccountLoggingInterceptor,
    //CQRS Handlers
    CreateAccountHandler,
    UpdateAccountHandler,
    DeleteAccountHandler,
    GetAccountByIdHandler,
    GetAccountByFieldHandler,
    GetAllAccountHandler,
    AccountCrudSaga,
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
    AccountQueryService,
    AccountCommandService,
    AccountSecuritySyncService,
  
    //Repositories
    AccountCommandRepository,
    AccountQueryRepository,
    AccountRepository,      
    //Resolvers
    AccountResolver,
    //Guards
    AccountAuthGuard,
    //Interceptors
    AccountInterceptor,
    AccountLoggingInterceptor,
  ],
})
export class AccountModule {}

