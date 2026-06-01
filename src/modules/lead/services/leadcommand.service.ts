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
import { Lead } from "../entities/lead.entity";
import { CreateLeadDto, UpdateLeadDto, DeleteLeadDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { LeadCommandRepository } from "../repositories/leadcommand.repository";
import { LeadQueryRepository } from "../repositories/leadquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { LeadResponse, LeadsResponse } from "../types/lead.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { LeadQueryService } from "./leadquery.service";
import { BaseEvent } from "../events/base.event";
import { LeadAssignedEvent } from '../events/leadassigned.event';
import { LeadQualifiedEvent } from '../events/leadqualified.event';
import { LeadConvertedEvent } from '../events/leadconverted.event';

@Injectable()
export class LeadCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(LeadCommandService.name);
  //Constructo del servicio LeadCommandService
  constructor(
    private readonly repository: LeadCommandRepository,
    private readonly queryRepository: LeadQueryRepository,
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
      .registerClient(LeadQueryService.name)
      .get(LeadQueryService.name),
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
        await this.eventStore.appendEvent('lead-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Lead | null,
    current?: Lead | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'update') {
      // Regla de servicio: lead-qualified-requires-owner
      // Un lead calificado debe tener owner asignado.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'QUALIFIED') || (!(this.dslValue(entityData, currentData, inputData, 'ownerId') === undefined || this.dslValue(entityData, currentData, inputData, 'ownerId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'ownerId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && this.dslValue(entityData, currentData, inputData, 'ownerId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'ownerId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'ownerId'))).length === 0)))))) {
        throw new Error('LEAD_001: Un lead QUALIFIED requiere ownerId');
      }

      // Regla de servicio: lead-converted-requires-opportunity
      // Un lead convertido debe apuntar a una oportunidad y registrar fecha de conversión.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'CONVERTED') || (!(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId') === undefined || this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId')) && this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'convertedOpportunityId'))).length === 0)) && !(this.dslValue(entityData, currentData, inputData, 'convertedAt') === undefined || this.dslValue(entityData, currentData, inputData, 'convertedAt') === null || (typeof this.dslValue(entityData, currentData, inputData, 'convertedAt') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'convertedAt')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'convertedAt')) && this.dslValue(entityData, currentData, inputData, 'convertedAt').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'convertedAt') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'convertedAt')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'convertedAt')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'convertedAt'))).length === 0)))))) {
        throw new Error('LEAD_002: Un lead CONVERTED requiere convertedOpportunityId y convertedAt');
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateLeadDto>("createLead", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createLeadDtoInput: CreateLeadDto
  ): Promise<LeadResponse<Lead>> {
    try {
      logger.info("Receiving in service:", createLeadDtoInput);
      const candidate = Lead.fromDto(createLeadDtoInput);
      await this.applyDslServiceRules("create", createLeadDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createLeadDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el lead no existe
      if (!entity)
        throw new NotFoundException("Entidad Lead no encontrada.");
      // Devolver lead
      return {
        ok: true,
        message: "Lead obtenido con éxito.",
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Lead>("createLeads", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createLeadDtosInput: CreateLeadDto[]
  ): Promise<LeadsResponse<Lead>> {
    try {
      const entities = await this.repository.bulkCreate(
        createLeadDtosInput.map((entity) => Lead.fromDto(entity))
      );

      // Respuesta si el lead no existe
      if (!entities)
        throw new NotFoundException("Entidades Leads no encontradas.");
      // Devolver lead
      return {
        ok: true,
        message: "Leads creados con éxito.",
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateLeadDto>("updateLead", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateLeadDto
  ): Promise<LeadResponse<Lead>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Lead(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el lead no existe
      if (!entity)
        throw new NotFoundException("Entidades Leads no encontradas.");
      // Devolver lead
      return {
        ok: true,
        message: "Lead actualizada con éxito.",
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateLeadDto>("updateLeads", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateLeadDto[]
  ): Promise<LeadsResponse<Lead>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Lead.fromDto(entity))
      );
      // Respuesta si el lead no existe
      if (!entities)
        throw new NotFoundException("Entidades Leads no encontradas.");
      // Devolver lead
      return {
        ok: true,
        message: "Leads actualizadas con éxito.",
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteLeadDto>("deleteLead", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<LeadResponse<Lead>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el lead no existe
      if (!entity)
        throw new NotFoundException("Instancias de Lead no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver lead
      return {
        ok: true,
        message: "Instancia de Lead eliminada con éxito.",
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
      .registerClient(LeadCommandService.name)
      .get(LeadCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteLeads", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

