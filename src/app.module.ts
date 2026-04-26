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


import { DynamicModule, Module, OnModuleInit, Optional, Inject } from "@nestjs/common";
import { DataSource } from "typeorm";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { CrmCommandController } from "./modules/crm/controllers/crmcommand.controller";
import { CrmModule } from "./modules/crm/modules/crm.module";
import { CqrsModule } from "@nestjs/cqrs";
import { AppDataSource, initializeDatabase } from "./data-source";
import { CrmQueryController } from "./modules/crm/controllers/crmquery.controller";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import GraphQLJSON from "graphql-type-json";
import { CrmCommandService } from "./modules/crm/services/crmcommand.service";
import { CrmQueryService } from "./modules/crm/services/crmquery.service";
import { CacheModule } from "@nestjs/cache-manager";
import { LoggingModule } from "./modules/crm/modules/logger.module";
import { CatalogClientModule } from "./modules/catalog-client/catalog-client.module";
import { ModuleRef } from "@nestjs/core";
import { ServiceRegistry } from "@core/service-registry";
import LoggerService, { logger } from "@core/logs/logger";
import { CatalogSyncLogModule } from "./modules/catalog-sync-log/modules/catalogsynclog.module";
import { CatalogSyncLogCommandService } from "./modules/catalog-sync-log/services/catalogsynclogcommand.service";
import { CatalogSyncLogQueryService } from "./modules/catalog-sync-log/services/catalogsynclogquery.service";
import { ContractStatusLogModule } from "./modules/contract-status-log/modules/contractstatuslog.module";
import { ContractStatusLogCommandService } from "./modules/contract-status-log/services/contractstatuslogcommand.service";
import { ContractStatusLogQueryService } from "./modules/contract-status-log/services/contractstatuslogquery.service";
import { ContractModule } from "./modules/contract/modules/contract.module";
import { ContractCommandService } from "./modules/contract/services/contractcommand.service";
import { ContractQueryService } from "./modules/contract/services/contractquery.service";
import { CrmClientProfileModule } from "./modules/crm-client-profile/modules/crmclientprofile.module";
import { CrmClientProfileCommandService } from "./modules/crm-client-profile/services/crmclientprofilecommand.service";
import { CrmClientProfileQueryService } from "./modules/crm-client-profile/services/crmclientprofilequery.service";
import { IncentiveModule } from "./modules/incentive/modules/incentive.module";
import { IncentiveCommandService } from "./modules/incentive/services/incentivecommand.service";
import { IncentiveQueryService } from "./modules/incentive/services/incentivequery.service";
import { MilestoneStatusLogModule } from "./modules/milestone-status-log/modules/milestonestatuslog.module";
import { MilestoneStatusLogCommandService } from "./modules/milestone-status-log/services/milestonestatuslogcommand.service";
import { MilestoneStatusLogQueryService } from "./modules/milestone-status-log/services/milestonestatuslogquery.service";
import { PaymentMilestoneModule } from "./modules/payment-milestone/modules/paymentmilestone.module";
import { PaymentMilestoneCommandService } from "./modules/payment-milestone/services/paymentmilestonecommand.service";
import { PaymentMilestoneQueryService } from "./modules/payment-milestone/services/paymentmilestonequery.service";
import { ProviderModule } from "./modules/provider/modules/provider.module";
import { ProviderCommandService } from "./modules/provider/services/providercommand.service";
import { ProviderQueryService } from "./modules/provider/services/providerquery.service";
import { SubscriptionPlanModule } from "./modules/subscription-plan/modules/subscriptionplan.module";
import { SubscriptionPlanCommandService } from "./modules/subscription-plan/services/subscriptionplancommand.service";
import { SubscriptionPlanQueryService } from "./modules/subscription-plan/services/subscriptionplanquery.service";
import { TermsAndConditionModule } from "./modules/terms-and-condition/modules/termsandcondition.module";
import { TermsAndConditionCommandService } from "./modules/terms-and-condition/services/termsandconditioncommand.service";
import { TermsAndConditionQueryService } from "./modules/terms-and-condition/services/termsandconditionquery.service";

/*
//TODO unused for while dependencies
import { I18nModule } from "nestjs-i18n";
import { join } from "path";
import { CustomI18nLoader } from "./core/loaders/custom-I18n-Loader";
import { TranslocoService } from "@jsverse/transloco";
import { HeaderResolver, AcceptLanguageResolver } from "nestjs-i18n";
import { TranslocoWrapperService } from "./core/services/transloco-wrapper.service";
import { TranslocoModule } from "@ngneat/transloco";
import LoggerService, { logger } from "@core/logs/logger";

*/

import { HorizontalModule } from "@common/horizontal";

import { NomencladorListenersModule } from './modules/nomenclador-listeners/nomenclador-listeners.module';
import { GlobalPaymentRuleModule } from "./modules/global-payment-rule/modules/globalpaymentrule.module";
import { IncentiveTypeModule } from "./modules/incentive-type/modules/incentivetype.module";
import { PaymentMilestoneStatusModule } from "./modules/payment-milestone-status/modules/paymentmilestonestatus.module";
import { PaymentRuleTypeModule } from "./modules/payment-rule-type/modules/paymentruletype.module";
import { PersonTypeModule } from "./modules/person-type/modules/persontype.module";
import { CrmClientProfileStatusModule } from "./modules/crm-client-profile-status/modules/crmclientprofilestatus.module";
@Module({
  imports: [
    // Se importa/registra el módulo de caché
    CacheModule.register(),

    /**
     * ConfigModule - Configuración global de variables de entorno
     *
     * Configuración centralizada para el manejo de variables de entorno.
     * Se establece como global para estar disponible en toda la aplicación.
     */
    ConfigModule.forRoot({
      isGlobal: true, // Disponible en todos los módulos sin necesidad de importar
      envFilePath: ".env", // Ubicación del archivo .env
      cache: true, // Mejora rendimiento cacheando las variables
      expandVariables: true, // Permite usar variables anidadas (ej: )
    }),

    /**
     * TypeOrmModule - Configuración de la base de datos
     *
     * Conexión asíncrona con PostgreSQL y configuración avanzada.
     * Se inicializa primero la conexión a la base de datos.
     */
    // TypeORM solo si INCLUDING_DATA_BASE_SYSTEM=true
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async () => {
              const dataSource = await initializeDatabase();
              return {
                ...dataSource.options,
                autoLoadEntities: true,
                retryAttempts: 5,
                retryDelay: 3000,
                synchronize: process.env.NODE_ENV !== "production",
                logging: process.env.DB_LOGGING === "true",
              };
            },
          }),
        ]
      : []),

    /**
     * Módulos Crm de la aplicación
     */
    CqrsModule,
    HorizontalModule,
    CrmModule,
    CatalogClientModule,
        CatalogSyncLogModule,
    ContractStatusLogModule,
    ContractModule,
    CrmClientProfileModule,
    IncentiveModule,
    MilestoneStatusLogModule,
    PaymentMilestoneModule,
    ProviderModule,
    SubscriptionPlanModule,
    TermsAndConditionModule,    
    /**
     * Módulo Logger de la aplicación
     */
    LoggingModule,

    // GraphQL solo si GRAPHQL_ENABLED=true
    ...(process.env.GRAPHQL_ENABLED === 'true'
      ? [
          GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            buildSchemaOptions: {
              dateScalarMode: "timestamp",
            },
            resolvers: { JSON: GraphQLJSON },
          }),
        ]
      : []),
  
    NomencladorListenersModule,
      GlobalPaymentRuleModule,
    IncentiveTypeModule,
    PaymentMilestoneStatusModule,
    PaymentRuleTypeModule,
    PersonTypeModule,
      CrmClientProfileStatusModule,
  ],

  /**
   * Controladores de Crm
   *
   * Registro de controladores a nivel de aplicación.
   */
  controllers: [
  //No se recomienda habilitar los controladores si ya fueron declarados en el módulo: CrmModule
  /*
  
  CrmCommandController, 
  CrmQueryController
  
  */
  ],

  /**
   * Proveedores (Servicios, Repositorios, etc.) de Crm
   *
   * Registro de servicios globales y configuración de inyección de dependencias.
   */
  providers: [
    // Configuración de Base de datos
    ...(process.env.INCLUDING_DATA_BASE_SYSTEM === 'true'
      ? [
          {
            provide: DataSource,
            useValue: AppDataSource,
          },
        ]
      : []),
    // Se importan los servicios del módulo
    CrmCommandService,
    CrmQueryService,
    LoggerService
  ],

  /**
   * Exportaciones de módulos y servicios
   *
   * Hace disponibles módulos y servicios para otros módulos que importen este módulo.
   */
  exports: [CrmCommandService, CrmQueryService,LoggerService],
})
export class CrmAppModule implements OnModuleInit {
  /**
   * Constructor del módulo principal
   * @param dataSource Instancia inyectada del DataSource
   * @param translocoService Servicio para manejo de idiomas
   */
  constructor(
    private moduleRef: ModuleRef,
    @Optional() @Inject(DataSource) private readonly dataSource?: DataSource
  ) {
    if (process.env.INCLUDING_DATA_BASE_SYSTEM === 'true') {
      this.checkDatabaseConnection();
    }
    this.setupLanguageChangeHandling();
    this.onModuleInit();
  }
  onModuleInit() {
    //Inicializar servicios del microservicio
    ServiceRegistry.getInstance().setModuleRef(this.moduleRef);
    ServiceRegistry.getInstance().registryAll([
      CrmCommandService,
      CrmQueryService,
      CatalogSyncLogCommandService,
      CatalogSyncLogQueryService,
      ContractStatusLogCommandService,
      ContractStatusLogQueryService,
      ContractCommandService,
      ContractQueryService,
      CrmClientProfileCommandService,
      CrmClientProfileQueryService,
      IncentiveCommandService,
      IncentiveQueryService,
      MilestoneStatusLogCommandService,
      MilestoneStatusLogQueryService,
      PaymentMilestoneCommandService,
      PaymentMilestoneQueryService,
      ProviderCommandService,
      ProviderQueryService,
      SubscriptionPlanCommandService,
      SubscriptionPlanQueryService,
      TermsAndConditionCommandService,
      TermsAndConditionQueryService,    
    ]);
    const loggerService = ServiceRegistry.getInstance().get(
      "LoggerService"
    ) as LoggerService;
    if (loggerService) 
    loggerService.log(ServiceRegistry.getInstance());
  }
  /**
   * Verifica la conexión a la base de datos al iniciar
   *
   * Realiza una consulta simple para confirmar que la conexión está activa.
   * Termina la aplicación si no puede establecer conexión.
   */
  private async checkDatabaseConnection() {
    try {
      if (!this.dataSource) return;
      await this.dataSource.query("SELECT 1");
      logger.log("✅ Conexión a la base de datos verificada correctamente");
    } catch (error) {
      logger.error(
        "❌ Error crítico: No se pudo conectar a la base de datos",
        error
      );
      process.exit(1); // Termina la aplicación con código de error
    }
  }

  /**
   * Configura el manejo de cambios de idioma
   *
   * Suscribe a eventos de cambio de idioma para mantener consistencia.
   */
  private setupLanguageChangeHandling() {}
}


