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
import { CrmClientProfile } from "../entities/crm-client-profile.entity";
import { CreateCrmClientProfileDto, UpdateCrmClientProfileDto, DeleteCrmClientProfileDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { CrmClientProfileCommandRepository } from "../repositories/crmclientprofilecommand.repository";
import { CrmClientProfileQueryRepository } from "../repositories/crmclientprofilequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { CrmClientProfileResponse, CrmClientProfilesResponse } from "../types/crmclientprofile.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { CrmClientProfileQueryService } from "./crmclientprofilequery.service";
import { BaseEvent } from "../events/base.event";
import { CrmClientProfileArchivedEvent } from '../events/crmclientprofilearchived.event';

@Injectable()
export class CrmClientProfileCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(CrmClientProfileCommandService.name);
  //Constructo del servicio CrmClientProfileCommandService
  constructor(
    private readonly repository: CrmClientProfileCommandRepository,
    private readonly queryRepository: CrmClientProfileQueryRepository,
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
      .registerClient(CrmClientProfileQueryService.name)
      .get(CrmClientProfileQueryService.name),
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
        await this.eventStore.appendEvent('crm-client-profile-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: CrmClientProfile | null,
    current?: CrmClientProfile | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: archived-profile-cannot-accept-new-contracts
      // Un perfil ARCHIVED no puede aparecer como clientId de un nuevo contrato
      if (!(this.dslValue(entityData, currentData, inputData, 'status') !== 'ARCHIVED')) {
        throw new Error('CRM_PROFILE_001: No se puede operar sobre un perfil CRM archivado');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: archived-profile-cannot-accept-new-contracts
      // Un perfil ARCHIVED no puede aparecer como clientId de un nuevo contrato
      if (!(this.dslValue(entityData, currentData, inputData, 'status') !== 'ARCHIVED')) {
        throw new Error('CRM_PROFILE_001: No se puede operar sobre un perfil CRM archivado');
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateCrmClientProfileDto>("createCrmClientProfile", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createCrmClientProfileDtoInput: CreateCrmClientProfileDto
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    try {
      logger.info("Receiving in service:", createCrmClientProfileDtoInput);
      const candidate = CrmClientProfile.fromDto(createCrmClientProfileDtoInput);
      await this.applyDslServiceRules("create", createCrmClientProfileDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createCrmClientProfileDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el crmclientprofile no existe
      if (!entity)
        throw new NotFoundException("Entidad CrmClientProfile no encontrada.");
      // Devolver crmclientprofile
      return {
        ok: true,
        message: "CrmClientProfile obtenido con éxito.",
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CrmClientProfile>("createCrmClientProfiles", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createCrmClientProfileDtosInput: CreateCrmClientProfileDto[]
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
    try {
      const entities = await this.repository.bulkCreate(
        createCrmClientProfileDtosInput.map((entity) => CrmClientProfile.fromDto(entity))
      );

      // Respuesta si el crmclientprofile no existe
      if (!entities)
        throw new NotFoundException("Entidades CrmClientProfiles no encontradas.");
      // Devolver crmclientprofile
      return {
        ok: true,
        message: "CrmClientProfiles creados con éxito.",
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCrmClientProfileDto>("updateCrmClientProfile", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateCrmClientProfileDto
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new CrmClientProfile(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el crmclientprofile no existe
      if (!entity)
        throw new NotFoundException("Entidades CrmClientProfiles no encontradas.");
      // Devolver crmclientprofile
      return {
        ok: true,
        message: "CrmClientProfile actualizada con éxito.",
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateCrmClientProfileDto>("updateCrmClientProfiles", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateCrmClientProfileDto[]
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => CrmClientProfile.fromDto(entity))
      );
      // Respuesta si el crmclientprofile no existe
      if (!entities)
        throw new NotFoundException("Entidades CrmClientProfiles no encontradas.");
      // Devolver crmclientprofile
      return {
        ok: true,
        message: "CrmClientProfiles actualizadas con éxito.",
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteCrmClientProfileDto>("deleteCrmClientProfile", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el crmclientprofile no existe
      if (!entity)
        throw new NotFoundException("Instancias de CrmClientProfile no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver crmclientprofile
      return {
        ok: true,
        message: "Instancia de CrmClientProfile eliminada con éxito.",
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
      .registerClient(CrmClientProfileCommandService.name)
      .get(CrmClientProfileCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteCrmClientProfiles", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

