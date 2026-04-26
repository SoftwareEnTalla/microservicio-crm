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
import { PaymentMilestoneStatusCommandController } from "../controllers/paymentmilestonestatuscommand.controller";
import { PaymentMilestoneStatusQueryController } from "../controllers/paymentmilestonestatusquery.controller";
import { PaymentMilestoneStatusCommandService } from "../services/paymentmilestonestatuscommand.service";
import { PaymentMilestoneStatusQueryService } from "../services/paymentmilestonestatusquery.service";

import { PaymentMilestoneStatusCommandRepository } from "../repositories/paymentmilestonestatuscommand.repository";
import { PaymentMilestoneStatusQueryRepository } from "../repositories/paymentmilestonestatusquery.repository";
import { PaymentMilestoneStatusRepository } from "../repositories/paymentmilestonestatus.repository";
import { PaymentMilestoneStatusResolver } from "../graphql/paymentmilestonestatus.resolver";
import { PaymentMilestoneStatusAuthGuard } from "../guards/paymentmilestonestatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentMilestoneStatus } from "../entities/payment-milestone-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentMilestoneStatusHandler } from "../commands/handlers/createpaymentmilestonestatus.handler";
import { UpdatePaymentMilestoneStatusHandler } from "../commands/handlers/updatepaymentmilestonestatus.handler";
import { DeletePaymentMilestoneStatusHandler } from "../commands/handlers/deletepaymentmilestonestatus.handler";
import { GetPaymentMilestoneStatusByIdHandler } from "../queries/handlers/getpaymentmilestonestatusbyid.handler";
import { GetPaymentMilestoneStatusByFieldHandler } from "../queries/handlers/getpaymentmilestonestatusbyfield.handler";
import { GetAllPaymentMilestoneStatusHandler } from "../queries/handlers/getallpaymentmilestonestatus.handler";
import { PaymentMilestoneStatusCrudSaga } from "../sagas/paymentmilestonestatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentMilestoneStatusInterceptor } from "../interceptors/paymentmilestonestatus.interceptor";
import { PaymentMilestoneStatusLoggingInterceptor } from "../interceptors/paymentmilestonestatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentMilestoneStatus]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentMilestoneStatusCommandController, PaymentMilestoneStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentMilestoneStatusQueryService,
    PaymentMilestoneStatusCommandService,
  
    //Repositories
    PaymentMilestoneStatusCommandRepository,
    PaymentMilestoneStatusQueryRepository,
    PaymentMilestoneStatusRepository,      
    //Resolvers
    PaymentMilestoneStatusResolver,
    //Guards
    PaymentMilestoneStatusAuthGuard,
    //Interceptors
    PaymentMilestoneStatusInterceptor,
    PaymentMilestoneStatusLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentMilestoneStatusHandler,
    UpdatePaymentMilestoneStatusHandler,
    DeletePaymentMilestoneStatusHandler,
    GetPaymentMilestoneStatusByIdHandler,
    GetPaymentMilestoneStatusByFieldHandler,
    GetAllPaymentMilestoneStatusHandler,
    PaymentMilestoneStatusCrudSaga,
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
    PaymentMilestoneStatusQueryService,
    PaymentMilestoneStatusCommandService,
  
    //Repositories
    PaymentMilestoneStatusCommandRepository,
    PaymentMilestoneStatusQueryRepository,
    PaymentMilestoneStatusRepository,      
    //Resolvers
    PaymentMilestoneStatusResolver,
    //Guards
    PaymentMilestoneStatusAuthGuard,
    //Interceptors
    PaymentMilestoneStatusInterceptor,
    PaymentMilestoneStatusLoggingInterceptor,
  ],
})
export class PaymentMilestoneStatusModule {}

