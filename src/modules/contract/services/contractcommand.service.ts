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
import { Contract } from "../entities/contract.entity";
import { CreateContractDto, UpdateContractDto, DeleteContractDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ContractCommandRepository } from "../repositories/contractcommand.repository";
import { ContractQueryRepository } from "../repositories/contractquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ContractResponse, ContractsResponse } from "../types/contract.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ContractQueryService } from "./contractquery.service";
import { BaseEvent } from "../events/base.event";
import { ContractSignedEvent } from '../events/contractsigned.event';
import { ContractRenewedEvent } from '../events/contractrenewed.event';
import { ContractSuspendedEvent } from '../events/contractsuspended.event';
import { ContractTerminatedEvent } from '../events/contractterminated.event';
import { ContractExpiredEvent } from '../events/contractexpired.event';

@Injectable()
export class ContractCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ContractCommandService.name);
  //Constructo del servicio ContractCommandService
  constructor(
    private readonly repository: ContractCommandRepository,
    private readonly queryRepository: ContractQueryRepository,
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
      .registerClient(ContractQueryService.name)
      .get(ContractQueryService.name),
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
        await this.eventStore.appendEvent('contract-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Contract | null,
    current?: Contract | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: total-value-derived-from-plan
      // totalValue se deriva del subscription-plan + incentivos + duración
      if (!(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === undefined || this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId'))).length === 0))) {
        entityData['totalValue'] = undefined;
        if (entity) {
          (entity as any)['totalValue'] = undefined;
        }
      }

    }

    if (operation === 'update') {
      // Regla de servicio: signed-contract-requires-signed-at-and-flag
      // Para transitar DRAFT→ACTIVE debe existir signedAt y signedByClient=true
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE' && this.dslValue(entityData, currentData, inputData, 'signedByClient') === true && !(this.dslValue(entityData, currentData, inputData, 'signedAt') === undefined || this.dslValue(entityData, currentData, inputData, 'signedAt') === null || (typeof this.dslValue(entityData, currentData, inputData, 'signedAt') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'signedAt')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'signedAt')) && this.dslValue(entityData, currentData, inputData, 'signedAt').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'signedAt') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'signedAt')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'signedAt')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'signedAt'))).length === 0)))) {
        throw new Error('CONTRACT_001: Un contrato ACTIVE requiere firma y signedAt');
      }

      // Regla de servicio: total-value-derived-from-plan
      // totalValue se deriva del subscription-plan + incentivos + duración
      if (!(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === undefined || this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subscriptionPlanId'))).length === 0))) {
        entityData['totalValue'] = undefined;
        if (entity) {
          (entity as any)['totalValue'] = undefined;
        }
      }

      // Regla de servicio: expired-contract-by-end-date
      // Un contrato ACTIVE cuyo endDate ya pasó transita a EXPIRED (job diario)
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE' && !(this.dslValue(entityData, currentData, inputData, 'endDate') === undefined || this.dslValue(entityData, currentData, inputData, 'endDate') === null || (typeof this.dslValue(entityData, currentData, inputData, 'endDate') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'endDate')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'endDate')) && this.dslValue(entityData, currentData, inputData, 'endDate').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'endDate') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'endDate')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'endDate')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'endDate'))).length === 0))) {
        entityData['status'] = 'EXPIRED';
        if (entity) {
          (entity as any)['status'] = 'EXPIRED';
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateContractDto>("createContract", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createContractDtoInput: CreateContractDto
  ): Promise<ContractResponse<Contract>> {
    try {
      logger.info("Receiving in service:", createContractDtoInput);
      const candidate = Contract.fromDto(createContractDtoInput);
      await this.applyDslServiceRules("create", createContractDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createContractDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el contract no existe
      if (!entity)
        throw new NotFoundException("Entidad Contract no encontrada.");
      // Devolver contract
      return {
        ok: true,
        message: "Contract obtenido con éxito.",
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Contract>("createContracts", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createContractDtosInput: CreateContractDto[]
  ): Promise<ContractsResponse<Contract>> {
    try {
      const entities = await this.repository.bulkCreate(
        createContractDtosInput.map((entity) => Contract.fromDto(entity))
      );

      // Respuesta si el contract no existe
      if (!entities)
        throw new NotFoundException("Entidades Contracts no encontradas.");
      // Devolver contract
      return {
        ok: true,
        message: "Contracts creados con éxito.",
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateContractDto>("updateContract", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateContractDto
  ): Promise<ContractResponse<Contract>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Contract(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el contract no existe
      if (!entity)
        throw new NotFoundException("Entidades Contracts no encontradas.");
      // Devolver contract
      return {
        ok: true,
        message: "Contract actualizada con éxito.",
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateContractDto>("updateContracts", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateContractDto[]
  ): Promise<ContractsResponse<Contract>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Contract.fromDto(entity))
      );
      // Respuesta si el contract no existe
      if (!entities)
        throw new NotFoundException("Entidades Contracts no encontradas.");
      // Devolver contract
      return {
        ok: true,
        message: "Contracts actualizadas con éxito.",
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteContractDto>("deleteContract", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ContractResponse<Contract>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el contract no existe
      if (!entity)
        throw new NotFoundException("Instancias de Contract no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver contract
      return {
        ok: true,
        message: "Instancia de Contract eliminada con éxito.",
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
      .registerClient(ContractCommandService.name)
      .get(ContractCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteContracts", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

