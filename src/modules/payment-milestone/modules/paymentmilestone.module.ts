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
import { PaymentMilestoneCommandController } from "../controllers/paymentmilestonecommand.controller";
import { PaymentMilestoneQueryController } from "../controllers/paymentmilestonequery.controller";
import { PaymentMilestoneCommandService } from "../services/paymentmilestonecommand.service";
import { PaymentMilestoneQueryService } from "../services/paymentmilestonequery.service";

import { PaymentMilestoneCommandRepository } from "../repositories/paymentmilestonecommand.repository";
import { PaymentMilestoneQueryRepository } from "../repositories/paymentmilestonequery.repository";
import { PaymentMilestoneRepository } from "../repositories/paymentmilestone.repository";
import { PaymentMilestoneResolver } from "../graphql/paymentmilestone.resolver";
import { PaymentMilestoneAuthGuard } from "../guards/paymentmilestoneauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentMilestone } from "../entities/payment-milestone.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreatePaymentMilestoneHandler } from "../commands/handlers/createpaymentmilestone.handler";
import { UpdatePaymentMilestoneHandler } from "../commands/handlers/updatepaymentmilestone.handler";
import { DeletePaymentMilestoneHandler } from "../commands/handlers/deletepaymentmilestone.handler";
import { GetPaymentMilestoneByIdHandler } from "../queries/handlers/getpaymentmilestonebyid.handler";
import { GetPaymentMilestoneByFieldHandler } from "../queries/handlers/getpaymentmilestonebyfield.handler";
import { GetAllPaymentMilestoneHandler } from "../queries/handlers/getallpaymentmilestone.handler";
import { PaymentMilestoneCrudSaga } from "../sagas/paymentmilestone-crud.saga";
import { PaymentMilestoneCrossServiceSaga } from "../sagas/payment-milestone-crossservice.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { PaymentMilestoneInterceptor } from "../interceptors/paymentmilestone.interceptor";
import { PaymentMilestoneLoggingInterceptor } from "../interceptors/paymentmilestone.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, PaymentMilestone]), // Incluir BaseEntity para herencia
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
  controllers: [PaymentMilestoneCommandController, PaymentMilestoneQueryController],
  providers: [
    //Services
    EventStoreService,
    PaymentMilestoneQueryService,
    PaymentMilestoneCommandService,
  
    //Repositories
    PaymentMilestoneCommandRepository,
    PaymentMilestoneQueryRepository,
    PaymentMilestoneRepository,      
    //Resolvers
    PaymentMilestoneResolver,
    //Guards
    PaymentMilestoneAuthGuard,
    //Interceptors
    PaymentMilestoneInterceptor,
    PaymentMilestoneLoggingInterceptor,
    //CQRS Handlers
    CreatePaymentMilestoneHandler,
    UpdatePaymentMilestoneHandler,
    DeletePaymentMilestoneHandler,
    GetPaymentMilestoneByIdHandler,
    GetPaymentMilestoneByFieldHandler,
    GetAllPaymentMilestoneHandler,
    PaymentMilestoneCrudSaga,
    PaymentMilestoneCrossServiceSaga,
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
    PaymentMilestoneQueryService,
    PaymentMilestoneCommandService,
  
    //Repositories
    PaymentMilestoneCommandRepository,
    PaymentMilestoneQueryRepository,
    PaymentMilestoneRepository,      
    //Resolvers
    PaymentMilestoneResolver,
    //Guards
    PaymentMilestoneAuthGuard,
    //Interceptors
    PaymentMilestoneInterceptor,
    PaymentMilestoneLoggingInterceptor,
  ],
})
export class PaymentMilestoneModule {}

