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
import { ProviderCommandController } from "../controllers/providercommand.controller";
import { ProviderQueryController } from "../controllers/providerquery.controller";
import { ProviderCommandService } from "../services/providercommand.service";
import { ProviderQueryService } from "../services/providerquery.service";

import { ProviderCommandRepository } from "../repositories/providercommand.repository";
import { ProviderQueryRepository } from "../repositories/providerquery.repository";
import { ProviderRepository } from "../repositories/provider.repository";
import { ProviderResolver } from "../graphql/provider.resolver";
import { ProviderAuthGuard } from "../guards/providerauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Provider } from "../entities/provider.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateProviderHandler } from "../commands/handlers/createprovider.handler";
import { UpdateProviderHandler } from "../commands/handlers/updateprovider.handler";
import { DeleteProviderHandler } from "../commands/handlers/deleteprovider.handler";
import { GetProviderByIdHandler } from "../queries/handlers/getproviderbyid.handler";
import { GetProviderByFieldHandler } from "../queries/handlers/getproviderbyfield.handler";
import { GetAllProviderHandler } from "../queries/handlers/getallprovider.handler";
import { ProviderCrudSaga } from "../sagas/provider-crud.saga";
import { ProviderUpstreamClientService } from "../services/provider-upstream-client.service";
import { ProviderUpstreamReconcilerService } from "../services/provider-upstream-reconciler.service";
import { ProviderUpstreamMirrorSaga } from "../sagas/provider-upstream-mirror.saga";
import { ProviderUpstreamSearchController } from "../controllers/provider-upstream-search.controller";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ProviderInterceptor } from "../interceptors/provider.interceptor";
import { ProviderLoggingInterceptor } from "../interceptors/provider.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Provider]), // Incluir BaseEntity para herencia
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
  controllers: [ProviderCommandController, ProviderQueryController, ProviderUpstreamSearchController],
  providers: [
    //Services
    EventStoreService,
    ProviderQueryService,
    ProviderCommandService,
  
    //Repositories
    ProviderCommandRepository,
    ProviderQueryRepository,
    ProviderRepository,      
    //Resolvers
    ProviderResolver,
    //Guards
    ProviderAuthGuard,
    //Interceptors
    ProviderInterceptor,
    ProviderLoggingInterceptor,
    //CQRS Handlers
    CreateProviderHandler,
    UpdateProviderHandler,
    DeleteProviderHandler,
    GetProviderByIdHandler,
    GetProviderByFieldHandler,
    GetAllProviderHandler,
    ProviderCrudSaga,
    ProviderUpstreamClientService,
    ProviderUpstreamReconcilerService,
    ProviderUpstreamMirrorSaga,    //Configurations
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
    ProviderQueryService,
    ProviderCommandService,
  
    //Repositories
    ProviderCommandRepository,
    ProviderQueryRepository,
    ProviderRepository,      
    //Resolvers
    ProviderResolver,
    //Guards
    ProviderAuthGuard,
    //Interceptors
    ProviderInterceptor,
    ProviderLoggingInterceptor,
    ProviderUpstreamClientService,  ],
})
export class ProviderModule {}

