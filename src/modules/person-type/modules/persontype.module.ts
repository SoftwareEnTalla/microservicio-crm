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
import { PersonTypeCommandController } from "../controllers/persontypecommand.controller";
import { PersonTypeQueryController } from "../controllers/persontypequery.controller";
import { PersonTypeCommandService } from "../services/persontypecommand.service";
import { PersonTypeQueryService } from "../services/persontypequery.service";

import { PersonTypeCommandRepository } from "../repositories/persontypecommand.repository";
import { PersonTypeQueryRepository } from "../repositories/persontypequery.repository";
import { PersonTypeRepository } from "../repositories/persontype.repository";
import { PersonTypeResolver } from "../graphql/persontype.resolver";
import { PersonTypeAuthGuard } from "../guards/persontypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PersonType } from "../entities/person-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePersonTypeHandler } from "../commands/handlers/createpersontype.handler";
import { UpdatePersonTypeHandler } from "../commands/handlers/updatepersontype.handler";
import { DeletePersonTypeHandler } from "../commands/handlers/deletepersontype.handler";
import { GetPersonTypeByIdHandler } from "../queries/handlers/getpersontypebyid.handler";
import { GetPersonTypeByFieldHandler } from "../queries/handlers/getpersontypebyfield.handler";
import { GetAllPersonTypeHandler } from "../queries/handlers/getallpersontype.handler";
import { PersonTypeCrudSaga } from "../sagas/persontype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PersonTypeInterceptor } from "../interceptors/persontype.interceptor";
import { PersonTypeLoggingInterceptor } from "../interceptors/persontype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PersonType]), // Incluir BaseEntity para herencia
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
  controllers: [PersonTypeCommandController, PersonTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    PersonTypeQueryService,
    PersonTypeCommandService,
  
    //Repositories
    PersonTypeCommandRepository,
    PersonTypeQueryRepository,
    PersonTypeRepository,      
    //Resolvers
    PersonTypeResolver,
    //Guards
    PersonTypeAuthGuard,
    //Interceptors
    PersonTypeInterceptor,
    PersonTypeLoggingInterceptor,
    //CQRS Handlers
    CreatePersonTypeHandler,
    UpdatePersonTypeHandler,
    DeletePersonTypeHandler,
    GetPersonTypeByIdHandler,
    GetPersonTypeByFieldHandler,
    GetAllPersonTypeHandler,
    PersonTypeCrudSaga,
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
    PersonTypeQueryService,
    PersonTypeCommandService,
  
    //Repositories
    PersonTypeCommandRepository,
    PersonTypeQueryRepository,
    PersonTypeRepository,      
    //Resolvers
    PersonTypeResolver,
    //Guards
    PersonTypeAuthGuard,
    //Interceptors
    PersonTypeInterceptor,
    PersonTypeLoggingInterceptor,
  ],
})
export class PersonTypeModule {}

