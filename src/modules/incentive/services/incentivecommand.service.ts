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
import { DeleteResult, UpdateResult } from "typeorm";
import { Incentive } from "../entities/incentive.entity";
import { CreateIncentiveDto, UpdateIncentiveDto, DeleteIncentiveDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { IncentiveCommandRepository } from "../repositories/incentivecommand.repository";
import { IncentiveQueryRepository } from "../repositories/incentivequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { IncentiveResponse, IncentivesResponse } from "../types/incentive.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { IncentiveQueryService } from "./incentivequery.service";
import { BaseEvent } from "../events/base.event";
import { IncentiveAppliedEvent } from '../events/incentiveapplied.event';

@Injectable()
export class IncentiveCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(IncentiveCommandService.name);
  //Constructo del servicio IncentiveCommandService
  constructor(
    private readonly repository: IncentiveCommandRepository,
    private readonly queryRepository: IncentiveQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
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
      .registerClient(IncentiveQueryService.name)
      .get(IncentiveQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('incentive-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Incentive | null,
    current?: Incentive | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: no-overlapping-incentives-same-type
      // No pueden coexistir dos incentivos del mismo tipo en el mismo plan con fechas solapadas
      if (!(!(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === undefined || this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'type') === undefined || this.dslValue(entityData, currentData, inputData, 'type') === null || (typeof this.dslValue(entityData, currentData, inputData, 'type') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'type')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'type')) && this.dslValue(entityData, currentData, inputData, 'type').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'type') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'type')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'type')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'type'))).length === 0)))) {
        throw new Error('INCENTIVE_001: Existe otro incentivo del mismo tipo con fechas solapadas');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: no-overlapping-incentives-same-type
      // No pueden coexistir dos incentivos del mismo tipo en el mismo plan con fechas solapadas
      if (!(!(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === undefined || this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'type') === undefined || this.dslValue(entityData, currentData, inputData, 'type') === null || (typeof this.dslValue(entityData, currentData, inputData, 'type') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'type')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'type')) && this.dslValue(entityData, currentData, inputData, 'type').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'type') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'type')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'type')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'type'))).length === 0)))) {
        throw new Error('INCENTIVE_001: Existe otro incentivo del mismo tipo con fechas solapadas');
      }

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateIncentiveDto>("createIncentive", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createIncentiveDtoInput: CreateIncentiveDto
  ): Promise<IncentiveResponse<Incentive>> {
    try {
      logger.info("Receiving in service:", createIncentiveDtoInput);
      const candidate = Incentive.fromDto(createIncentiveDtoInput);
      await this.applyDslServiceRules("create", createIncentiveDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createIncentiveDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el incentive no existe
      if (!entity)
        throw new NotFoundException("Entidad Incentive no encontrada.");
      // Devolver incentive
      return {
        ok: true,
        message: "Incentive obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Incentive>("createIncentives", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createIncentiveDtosInput: CreateIncentiveDto[]
  ): Promise<IncentivesResponse<Incentive>> {
    try {
      const entities = await this.repository.bulkCreate(
        createIncentiveDtosInput.map((entity) => Incentive.fromDto(entity))
      );

      // Respuesta si el incentive no existe
      if (!entities)
        throw new NotFoundException("Entidades Incentives no encontradas.");
      // Devolver incentive
      return {
        ok: true,
        message: "Incentives creados con éxito.",
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateIncentiveDto>("updateIncentive", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateIncentiveDto
  ): Promise<IncentiveResponse<Incentive>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Incentive(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el incentive no existe
      if (!entity)
        throw new NotFoundException("Entidades Incentives no encontradas.");
      // Devolver incentive
      return {
        ok: true,
        message: "Incentive actualizada con éxito.",
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateIncentiveDto>("updateIncentives", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateIncentiveDto[]
  ): Promise<IncentivesResponse<Incentive>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Incentive.fromDto(entity))
      );
      // Respuesta si el incentive no existe
      if (!entities)
        throw new NotFoundException("Entidades Incentives no encontradas.");
      // Devolver incentive
      return {
        ok: true,
        message: "Incentives actualizadas con éxito.",
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteIncentiveDto>("deleteIncentive", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<IncentiveResponse<Incentive>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el incentive no existe
      if (!entity)
        throw new NotFoundException("Instancias de Incentive no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver incentive
      return {
        ok: true,
        message: "Instancia de Incentive eliminada con éxito.",
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
      .registerClient(IncentiveCommandService.name)
      .get(IncentiveCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteIncentives", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

