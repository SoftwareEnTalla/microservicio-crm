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
import { Activity } from "../entities/activity.entity";
import { CreateActivityDto, UpdateActivityDto, DeleteActivityDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ActivityCommandRepository } from "../repositories/activitycommand.repository";
import { ActivityQueryRepository } from "../repositories/activityquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ActivityResponse, ActivitysResponse } from "../types/activity.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ActivityQueryService } from "./activityquery.service";
import { BaseEvent } from "../events/base.event";
import { ActivityCompletedEvent } from '../events/activitycompleted.event';

@Injectable()
export class ActivityCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ActivityCommandService.name);
  //Constructo del servicio ActivityCommandService
  constructor(
    private readonly repository: ActivityCommandRepository,
    private readonly queryRepository: ActivityQueryRepository,
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
      .registerClient(ActivityQueryService.name)
      .get(ActivityQueryService.name),
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
        await this.eventStore.appendEvent('activity-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Activity | null,
    current?: Activity | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: activity-must-link-commercial-context
      // Una actividad debe vincular al menos un contexto comercial.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'subject') === undefined || this.dslValue(entityData, currentData, inputData, 'subject') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subject') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subject')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subject')) && this.dslValue(entityData, currentData, inputData, 'subject').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subject') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subject')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subject')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subject'))).length === 0)))) {
        throw new Error('ACTIVITY_002: La actividad debe relacionarse con leadId, accountId, contactId u opportunityId');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: completed-activity-requires-completed-at
      // Una actividad completada debe registrar fecha de finalización.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'COMPLETED') || (!(this.dslValue(entityData, currentData, inputData, 'completedAt') === undefined || this.dslValue(entityData, currentData, inputData, 'completedAt') === null || (typeof this.dslValue(entityData, currentData, inputData, 'completedAt') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'completedAt')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'completedAt')) && this.dslValue(entityData, currentData, inputData, 'completedAt').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'completedAt') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'completedAt')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'completedAt')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'completedAt'))).length === 0)))))) {
        throw new Error('ACTIVITY_001: Una actividad COMPLETED requiere completedAt');
      }

      // Regla de servicio: activity-must-link-commercial-context
      // Una actividad debe vincular al menos un contexto comercial.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'subject') === undefined || this.dslValue(entityData, currentData, inputData, 'subject') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subject') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subject')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subject')) && this.dslValue(entityData, currentData, inputData, 'subject').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subject') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subject')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subject')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subject'))).length === 0)))) {
        throw new Error('ACTIVITY_002: La actividad debe relacionarse con leadId, accountId, contactId u opportunityId');
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateActivityDto>("createActivity", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createActivityDtoInput: CreateActivityDto
  ): Promise<ActivityResponse<Activity>> {
    try {
      logger.info("Receiving in service:", createActivityDtoInput);
      const candidate = Activity.fromDto(createActivityDtoInput);
      await this.applyDslServiceRules("create", createActivityDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createActivityDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el activity no existe
      if (!entity)
        throw new NotFoundException("Entidad Activity no encontrada.");
      // Devolver activity
      return {
        ok: true,
        message: "Activity obtenido con éxito.",
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Activity>("createActivitys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createActivityDtosInput: CreateActivityDto[]
  ): Promise<ActivitysResponse<Activity>> {
    try {
      const entities = await this.repository.bulkCreate(
        createActivityDtosInput.map((entity) => Activity.fromDto(entity))
      );

      // Respuesta si el activity no existe
      if (!entities)
        throw new NotFoundException("Entidades Activitys no encontradas.");
      // Devolver activity
      return {
        ok: true,
        message: "Activitys creados con éxito.",
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateActivityDto>("updateActivity", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateActivityDto
  ): Promise<ActivityResponse<Activity>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Activity(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el activity no existe
      if (!entity)
        throw new NotFoundException("Entidades Activitys no encontradas.");
      // Devolver activity
      return {
        ok: true,
        message: "Activity actualizada con éxito.",
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateActivityDto>("updateActivitys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateActivityDto[]
  ): Promise<ActivitysResponse<Activity>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Activity.fromDto(entity))
      );
      // Respuesta si el activity no existe
      if (!entities)
        throw new NotFoundException("Entidades Activitys no encontradas.");
      // Devolver activity
      return {
        ok: true,
        message: "Activitys actualizadas con éxito.",
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteActivityDto>("deleteActivity", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ActivityResponse<Activity>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el activity no existe
      if (!entity)
        throw new NotFoundException("Instancias de Activity no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver activity
      return {
        ok: true,
        message: "Instancia de Activity eliminada con éxito.",
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
      .registerClient(ActivityCommandService.name)
      .get(ActivityCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteActivitys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

