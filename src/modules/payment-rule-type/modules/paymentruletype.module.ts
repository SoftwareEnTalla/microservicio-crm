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
import { PaymentRuleTypeCommandController } from "../controllers/paymentruletypecommand.controller";
import { PaymentRuleTypeQueryController } from "../controllers/paymentruletypequery.controller";
import { PaymentRuleTypeCommandService } from "../services/paymentruletypecommand.service";
import { PaymentRuleTypeQueryService } from "../services/paymentruletypequery.service";

import { PaymentRuleTypeCommandRepository } from "../repositories/paymentruletypecommand.repository";
import { PaymentRuleTypeQueryRepository } from "../repositories/paymentruletypequery.repository";
import { PaymentRuleTypeRepository } from "../repositories/paymentruletype.repository";
import { PaymentRuleTypeResolver } from "../graphql/paymentruletype.resolver";
import { PaymentRuleTypeAuthGuard } from "../guards/paymentruletypeauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentRuleType } from "../entities/payment-rule-type.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentRuleTypeHandler } from "../commands/handlers/createpaymentruletype.handler";
import { UpdatePaymentRuleTypeHandler } from "../commands/handlers/updatepaymentruletype.handler";
import { DeletePaymentRuleTypeHandler } from "../commands/handlers/deletepaymentruletype.handler";
import { GetPaymentRuleTypeByIdHandler } from "../queries/handlers/getpaymentruletypebyid.handler";
import { GetPaymentRuleTypeByFieldHandler } from "../queries/handlers/getpaymentruletypebyfield.handler";
import { GetAllPaymentRuleTypeHandler } from "../queries/handlers/getallpaymentruletype.handler";
import { PaymentRuleTypeCrudSaga } from "../sagas/paymentruletype-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentRuleTypeInterceptor } from "../interceptors/paymentruletype.interceptor";
import { PaymentRuleTypeLoggingInterceptor } from "../interceptors/paymentruletype.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentRuleType]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentRuleTypeCommandController, PaymentRuleTypeQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentRuleTypeQueryService,
    PaymentRuleTypeCommandService,
  
    //Repositories
    PaymentRuleTypeCommandRepository,
    PaymentRuleTypeQueryRepository,
    PaymentRuleTypeRepository,      
    //Resolvers
    PaymentRuleTypeResolver,
    //Guards
    PaymentRuleTypeAuthGuard,
    //Interceptors
    PaymentRuleTypeInterceptor,
    PaymentRuleTypeLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentRuleTypeHandler,
    UpdatePaymentRuleTypeHandler,
    DeletePaymentRuleTypeHandler,
    GetPaymentRuleTypeByIdHandler,
    GetPaymentRuleTypeByFieldHandler,
    GetAllPaymentRuleTypeHandler,
    PaymentRuleTypeCrudSaga,
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
    PaymentRuleTypeQueryService,
    PaymentRuleTypeCommandService,
  
    //Repositories
    PaymentRuleTypeCommandRepository,
    PaymentRuleTypeQueryRepository,
    PaymentRuleTypeRepository,      
    //Resolvers
    PaymentRuleTypeResolver,
    //Guards
    PaymentRuleTypeAuthGuard,
    //Interceptors
    PaymentRuleTypeInterceptor,
    PaymentRuleTypeLoggingInterceptor,
  ],
})
export class PaymentRuleTypeModule {}

