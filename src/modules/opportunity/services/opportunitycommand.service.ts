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
import { Opportunity } from "../entities/opportunity.entity";
import { CreateOpportunityDto, UpdateOpportunityDto, DeleteOpportunityDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { OpportunityCommandRepository } from "../repositories/opportunitycommand.repository";
import { OpportunityQueryRepository } from "../repositories/opportunityquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { OpportunityResponse, OpportunitysResponse } from "../types/opportunity.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { OpportunityQueryService } from "./opportunityquery.service";
import { BaseEvent } from "../events/base.event";
import { OpportunityStageChangedEvent } from '../events/opportunitystagechanged.event';
import { OpportunityWonEvent } from '../events/opportunitywon.event';
import { OpportunityLostEvent } from '../events/opportunitylost.event';

@Injectable()
export class OpportunityCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(OpportunityCommandService.name);
  //Constructo del servicio OpportunityCommandService
  constructor(
    private readonly repository: OpportunityCommandRepository,
    private readonly queryRepository: OpportunityQueryRepository,
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
      .registerClient(OpportunityQueryService.name)
      .get(OpportunityQueryService.name),
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
        await this.eventStore.appendEvent('opportunity-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Opportunity | null,
    current?: Opportunity | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: weighted-value-derived-from-probability
      // weightedValue se deriva de estimatedValue y probability.
      if (!(this.dslValue(entityData, currentData, inputData, 'estimatedValue') === undefined || this.dslValue(entityData, currentData, inputData, 'estimatedValue') === null || (typeof this.dslValue(entityData, currentData, inputData, 'estimatedValue') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'estimatedValue')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) && this.dslValue(entityData, currentData, inputData, 'estimatedValue').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'estimatedValue') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'estimatedValue'))).length === 0))) {
        entityData['weightedValue'] = undefined;
        if (entity) {
          (entity as any)['weightedValue'] = undefined;
        }
      }

    }

    if (operation === 'update') {
      // Regla de servicio: opportunity-won-requires-close-data
      // Una oportunidad ganada debe registrar cierre y orden ERP si ya se materializó.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'WON') || (!(this.dslValue(entityData, currentData, inputData, 'closedAt') === undefined || this.dslValue(entityData, currentData, inputData, 'closedAt') === null || (typeof this.dslValue(entityData, currentData, inputData, 'closedAt') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'closedAt')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'closedAt')) && this.dslValue(entityData, currentData, inputData, 'closedAt').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'closedAt') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'closedAt')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'closedAt')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'closedAt'))).length === 0)))))) {
        throw new Error('OPPORTUNITY_001: Una oportunidad WON requiere closedAt');
      }

      // Regla de servicio: opportunity-lost-requires-reason
      // Una oportunidad perdida debe registrar motivo.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'LOST') || (!(this.dslValue(entityData, currentData, inputData, 'lossReason') === undefined || this.dslValue(entityData, currentData, inputData, 'lossReason') === null || (typeof this.dslValue(entityData, currentData, inputData, 'lossReason') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'lossReason')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'lossReason')) && this.dslValue(entityData, currentData, inputData, 'lossReason').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'lossReason') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'lossReason')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'lossReason')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'lossReason'))).length === 0)))))) {
        throw new Error('OPPORTUNITY_002: Una oportunidad LOST requiere lossReason');
      }

      // Regla de servicio: weighted-value-derived-from-probability
      // weightedValue se deriva de estimatedValue y probability.
      if (!(this.dslValue(entityData, currentData, inputData, 'estimatedValue') === undefined || this.dslValue(entityData, currentData, inputData, 'estimatedValue') === null || (typeof this.dslValue(entityData, currentData, inputData, 'estimatedValue') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'estimatedValue')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) && this.dslValue(entityData, currentData, inputData, 'estimatedValue').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'estimatedValue') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'estimatedValue')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'estimatedValue'))).length === 0))) {
        entityData['weightedValue'] = undefined;
        if (entity) {
          (entity as any)['weightedValue'] = undefined;
        }
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateOpportunityDto>("createOpportunity", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createOpportunityDtoInput: CreateOpportunityDto
  ): Promise<OpportunityResponse<Opportunity>> {
    try {
      logger.info("Receiving in service:", createOpportunityDtoInput);
      const candidate = Opportunity.fromDto(createOpportunityDtoInput);
      await this.applyDslServiceRules("create", createOpportunityDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createOpportunityDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el opportunity no existe
      if (!entity)
        throw new NotFoundException("Entidad Opportunity no encontrada.");
      // Devolver opportunity
      return {
        ok: true,
        message: "Opportunity obtenido con éxito.",
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Opportunity>("createOpportunitys", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createOpportunityDtosInput: CreateOpportunityDto[]
  ): Promise<OpportunitysResponse<Opportunity>> {
    try {
      const entities = await this.repository.bulkCreate(
        createOpportunityDtosInput.map((entity) => Opportunity.fromDto(entity))
      );

      // Respuesta si el opportunity no existe
      if (!entities)
        throw new NotFoundException("Entidades Opportunitys no encontradas.");
      // Devolver opportunity
      return {
        ok: true,
        message: "Opportunitys creados con éxito.",
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOpportunityDto>("updateOpportunity", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateOpportunityDto
  ): Promise<OpportunityResponse<Opportunity>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Opportunity(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el opportunity no existe
      if (!entity)
        throw new NotFoundException("Entidades Opportunitys no encontradas.");
      // Devolver opportunity
      return {
        ok: true,
        message: "Opportunity actualizada con éxito.",
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateOpportunityDto>("updateOpportunitys", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateOpportunityDto[]
  ): Promise<OpportunitysResponse<Opportunity>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Opportunity.fromDto(entity))
      );
      // Respuesta si el opportunity no existe
      if (!entities)
        throw new NotFoundException("Entidades Opportunitys no encontradas.");
      // Devolver opportunity
      return {
        ok: true,
        message: "Opportunitys actualizadas con éxito.",
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteOpportunityDto>("deleteOpportunity", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<OpportunityResponse<Opportunity>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el opportunity no existe
      if (!entity)
        throw new NotFoundException("Instancias de Opportunity no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver opportunity
      return {
        ok: true,
        message: "Instancia de Opportunity eliminada con éxito.",
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
      .registerClient(OpportunityCommandService.name)
      .get(OpportunityCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteOpportunitys", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

