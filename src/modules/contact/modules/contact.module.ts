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
import { ContactCommandController } from "../controllers/contactcommand.controller";
import { ContactQueryController } from "../controllers/contactquery.controller";
import { ContactCommandService } from "../services/contactcommand.service";
import { ContactQueryService } from "../services/contactquery.service";

import { ContactCommandRepository } from "../repositories/contactcommand.repository";
import { ContactQueryRepository } from "../repositories/contactquery.repository";
import { ContactRepository } from "../repositories/contact.repository";
import { ContactResolver } from "../graphql/contact.resolver";
import { ContactAuthGuard } from "../guards/contactauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Contact } from "../entities/contact.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateContactHandler } from "../commands/handlers/createcontact.handler";
import { UpdateContactHandler } from "../commands/handlers/updatecontact.handler";
import { DeleteContactHandler } from "../commands/handlers/deletecontact.handler";
import { GetContactByIdHandler } from "../queries/handlers/getcontactbyid.handler";
import { GetContactByFieldHandler } from "../queries/handlers/getcontactbyfield.handler";
import { GetAllContactHandler } from "../queries/handlers/getallcontact.handler";
import { ContactCrudSaga } from "../sagas/contact-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { ContactInterceptor } from "../interceptors/contact.interceptor";
import { ContactLoggingInterceptor } from "../interceptors/contact.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";
import { ContactSecuritySyncService } from "../services/contact-security-sync.service";
import { ContactSecuritySyncController } from "../controllers/contact-security-sync.controller";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Contact]), // Incluir BaseEntity para herencia
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
  controllers: [ContactCommandController, ContactQueryController, ContactSecuritySyncController],
  providers: [
    //Services
    EventStoreService,
    ContactQueryService,
    ContactCommandService,
    ContactSecuritySyncService,
  
    //Repositories
    ContactCommandRepository,
    ContactQueryRepository,
    ContactRepository,      
    //Resolvers
    ContactResolver,
    //Guards
    ContactAuthGuard,
    //Interceptors
    ContactInterceptor,
    ContactLoggingInterceptor,
    //CQRS Handlers
    CreateContactHandler,
    UpdateContactHandler,
    DeleteContactHandler,
    GetContactByIdHandler,
    GetContactByFieldHandler,
    GetAllContactHandler,
    ContactCrudSaga,
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
    ContactQueryService,
    ContactCommandService,
    ContactSecuritySyncService,
  
    //Repositories
    ContactCommandRepository,
    ContactQueryRepository,
    ContactRepository,      
    //Resolvers
    ContactResolver,
    //Guards
    ContactAuthGuard,
    //Interceptors
    ContactInterceptor,
    ContactLoggingInterceptor,
  ],
})
export class ContactModule {}

