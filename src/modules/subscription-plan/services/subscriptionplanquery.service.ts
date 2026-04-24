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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { FindManyOptions } from "typeorm";
import { SubscriptionPlan } from "../entities/subscription-plan.entity";
import { BaseEntity } from "../entities/base.entity";
import { SubscriptionPlanQueryRepository } from "../repositories/subscriptionplanquery.repository";
import { SubscriptionPlanResponse, SubscriptionPlansResponse } from "../types/subscriptionplan.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class SubscriptionPlanQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(SubscriptionPlanQueryService.name);
  private readonly loggerClient = LoggerClient.getInstance();

  constructor(private readonly repository: SubscriptionPlanQueryRepository,
  private moduleRef: ModuleRef
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(SubscriptionPlan.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${SubscriptionPlan.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        logger.info(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<SubscriptionPlan>,
    paginationArgs?: PaginationArgs
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
    try {
      const subscriptionplans = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de subscriptionplans obtenido con éxito",
        data: subscriptionplans,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          subscriptionplans.length
        ),
        count: subscriptionplans.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findById(id: string): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
    try {
      const subscriptionplan = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el subscriptionplan no existe
      if (!subscriptionplan)
        throw new NotFoundException(
          "SubscriptionPlan no encontrado para el id solicitado"
        );
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlan obtenido con éxito",
        data: subscriptionplan,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }



  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({ [field]: value });

      // Respuesta si el subscriptionplan no existe
      if (!entities)
        throw new NotFoundException(
          "SubscriptionPlans no encontrados para la propiedad y valor especificado"
        );
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlans obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
 

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<SubscriptionPlan>,
    paginationArgs?: PaginationArgs
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el subscriptionplan no existe
      if (!entities)
        throw new NotFoundException("Entidades SubscriptionPlans no encontradas.");
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlan obtenido con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
  


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
  }

 

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount(where);

      // Respuesta si el subscriptionplan no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades SubscriptionPlans no encontradas para el criterio especificado."
        );
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlans obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }




  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el subscriptionplan no existe
      if (!entity)
        throw new NotFoundException("Entidad SubscriptionPlan no encontrada.");
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlan obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(SubscriptionPlanQueryService.name)
      .get(SubscriptionPlanQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan> | Error> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el subscriptionplan no existe
      if (!entity)
        return new NotFoundException("Entidad SubscriptionPlan no encontrada.");
      // Devolver subscriptionplan
      return {
        ok: true,
        message: "SubscriptionPlan obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
}



