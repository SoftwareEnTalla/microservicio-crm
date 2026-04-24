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
import { TermsAndCondition } from "../entities/terms-and-condition.entity";
import { CreateTermsAndConditionDto, UpdateTermsAndConditionDto, DeleteTermsAndConditionDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { TermsAndConditionCommandRepository } from "../repositories/termsandconditioncommand.repository";
import { TermsAndConditionQueryRepository } from "../repositories/termsandconditionquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { TermsAndConditionResponse, TermsAndConditionsResponse } from "../types/termsandcondition.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { TermsAndConditionQueryService } from "./termsandconditionquery.service";
import { BaseEvent } from "../events/base.event";
import { TermsCreatedEvent } from '../events/termscreated.event';
import { TermsUpdatedEvent } from '../events/termsupdated.event';
import { TermsVersionActivatedEvent } from '../events/termsversionactivated.event';

@Injectable()
export class TermsAndConditionCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(TermsAndConditionCommandService.name);
  //Constructo del servicio TermsAndConditionCommandService
  constructor(
    private readonly repository: TermsAndConditionCommandRepository,
    private readonly queryRepository: TermsAndConditionQueryRepository,
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
      .registerClient(TermsAndConditionQueryService.name)
      .get(TermsAndConditionQueryService.name),
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
        await this.eventStore.appendEvent('terms-and-condition-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: TermsAndCondition | null,
    current?: TermsAndCondition | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: effective-from-before-until
      // effectiveFrom debe ser anterior a effectiveUntil si este último está definido
      if (!(!(this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === undefined || this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === null || (typeof this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) && this.dslValue(entityData, currentData, inputData, 'effectiveFrom').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'effectiveFrom'))).length === 0)))) {
        throw new Error('TERMS_001: effectiveFrom debe ser anterior a effectiveUntil');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: effective-from-before-until
      // effectiveFrom debe ser anterior a effectiveUntil si este último está definido
      if (!(!(this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === undefined || this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === null || (typeof this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) && this.dslValue(entityData, currentData, inputData, 'effectiveFrom').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'effectiveFrom') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'effectiveFrom')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'effectiveFrom'))).length === 0)))) {
        throw new Error('TERMS_001: effectiveFrom debe ser anterior a effectiveUntil');
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateTermsAndConditionDto>("createTermsAndCondition", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createTermsAndConditionDtoInput: CreateTermsAndConditionDto
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    try {
      logger.info("Receiving in service:", createTermsAndConditionDtoInput);
      const candidate = TermsAndCondition.fromDto(createTermsAndConditionDtoInput);
      await this.applyDslServiceRules("create", createTermsAndConditionDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createTermsAndConditionDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el termsandcondition no existe
      if (!entity)
        throw new NotFoundException("Entidad TermsAndCondition no encontrada.");
      // Devolver termsandcondition
      return {
        ok: true,
        message: "TermsAndCondition obtenido con éxito.",
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<TermsAndCondition>("createTermsAndConditions", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createTermsAndConditionDtosInput: CreateTermsAndConditionDto[]
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
    try {
      const entities = await this.repository.bulkCreate(
        createTermsAndConditionDtosInput.map((entity) => TermsAndCondition.fromDto(entity))
      );

      // Respuesta si el termsandcondition no existe
      if (!entities)
        throw new NotFoundException("Entidades TermsAndConditions no encontradas.");
      // Devolver termsandcondition
      return {
        ok: true,
        message: "TermsAndConditions creados con éxito.",
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTermsAndConditionDto>("updateTermsAndCondition", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateTermsAndConditionDto
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new TermsAndCondition(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el termsandcondition no existe
      if (!entity)
        throw new NotFoundException("Entidades TermsAndConditions no encontradas.");
      // Devolver termsandcondition
      return {
        ok: true,
        message: "TermsAndCondition actualizada con éxito.",
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateTermsAndConditionDto>("updateTermsAndConditions", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateTermsAndConditionDto[]
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => TermsAndCondition.fromDto(entity))
      );
      // Respuesta si el termsandcondition no existe
      if (!entities)
        throw new NotFoundException("Entidades TermsAndConditions no encontradas.");
      // Devolver termsandcondition
      return {
        ok: true,
        message: "TermsAndConditions actualizadas con éxito.",
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteTermsAndConditionDto>("deleteTermsAndCondition", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el termsandcondition no existe
      if (!entity)
        throw new NotFoundException("Instancias de TermsAndCondition no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver termsandcondition
      return {
        ok: true,
        message: "Instancia de TermsAndCondition eliminada con éxito.",
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
      .registerClient(TermsAndConditionCommandService.name)
      .get(TermsAndConditionCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteTermsAndConditions", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

