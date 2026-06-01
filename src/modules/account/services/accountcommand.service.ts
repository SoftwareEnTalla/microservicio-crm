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
import { Account } from "../entities/account.entity";
import { CreateAccountDto, UpdateAccountDto, DeleteAccountDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { AccountCommandRepository } from "../repositories/accountcommand.repository";
import { AccountQueryRepository } from "../repositories/accountquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { AccountResponse, AccountsResponse } from "../types/account.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { AccountQueryService } from "./accountquery.service";
import { BaseEvent } from "../events/base.event";
import { AccountOwnerChangedEvent } from '../events/accountownerchanged.event';
import { AccountDeactivatedEvent } from '../events/accountdeactivated.event';

@Injectable()
export class AccountCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(AccountCommandService.name);
  //Constructo del servicio AccountCommandService
  constructor(
    private readonly repository: AccountCommandRepository,
    private readonly queryRepository: AccountQueryRepository,
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
      .registerClient(AccountQueryService.name)
      .get(AccountQueryService.name),
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
        await this.eventStore.appendEvent('account-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Account | null,
    current?: Account | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: customer-account-requires-owner
      // Una cuenta de cliente debe tener owner asignado.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'accountType') === 'CUSTOMER') || (!(this.dslValue(entityData, currentData, inputData, 'ownerId') === undefined || this.dslValue(entityData, currentData, inputData, 'ownerId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'ownerId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && this.dslValue(entityData, currentData, inputData, 'ownerId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'ownerId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'ownerId'))).length === 0)))))) {
        throw new Error('ACCOUNT_001: Una cuenta CUSTOMER requiere ownerId');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: customer-account-requires-owner
      // Una cuenta de cliente debe tener owner asignado.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'accountType') === 'CUSTOMER') || (!(this.dslValue(entityData, currentData, inputData, 'ownerId') === undefined || this.dslValue(entityData, currentData, inputData, 'ownerId') === null || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'ownerId')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && this.dslValue(entityData, currentData, inputData, 'ownerId').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'ownerId') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'ownerId')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'ownerId')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'ownerId'))).length === 0)))))) {
        throw new Error('ACCOUNT_001: Una cuenta CUSTOMER requiere ownerId');
      }

      // Regla de servicio: inactive-account-requires-status
      // Una cuenta inactiva debe reflejar status INACTIVE.
      if (!(!(this.dslValue(entityData, currentData, inputData, 'status') === undefined || this.dslValue(entityData, currentData, inputData, 'status') === null || (typeof this.dslValue(entityData, currentData, inputData, 'status') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'status')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'status')) && this.dslValue(entityData, currentData, inputData, 'status').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'status') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'status')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'status')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'status'))).length === 0)))) {
        throw new Error('ACCOUNT_002: La cuenta debe tener un status válido');
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateAccountDto>("createAccount", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createAccountDtoInput: CreateAccountDto
  ): Promise<AccountResponse<Account>> {
    try {
      logger.info("Receiving in service:", createAccountDtoInput);
      const candidate = Account.fromDto(createAccountDtoInput);
      await this.applyDslServiceRules("create", createAccountDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createAccountDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el account no existe
      if (!entity)
        throw new NotFoundException("Entidad Account no encontrada.");
      // Devolver account
      return {
        ok: true,
        message: "Account obtenido con éxito.",
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Account>("createAccounts", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createAccountDtosInput: CreateAccountDto[]
  ): Promise<AccountsResponse<Account>> {
    try {
      const entities = await this.repository.bulkCreate(
        createAccountDtosInput.map((entity) => Account.fromDto(entity))
      );

      // Respuesta si el account no existe
      if (!entities)
        throw new NotFoundException("Entidades Accounts no encontradas.");
      // Devolver account
      return {
        ok: true,
        message: "Accounts creados con éxito.",
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAccountDto>("updateAccount", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateAccountDto
  ): Promise<AccountResponse<Account>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Account(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el account no existe
      if (!entity)
        throw new NotFoundException("Entidades Accounts no encontradas.");
      // Devolver account
      return {
        ok: true,
        message: "Account actualizada con éxito.",
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateAccountDto>("updateAccounts", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateAccountDto[]
  ): Promise<AccountsResponse<Account>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Account.fromDto(entity))
      );
      // Respuesta si el account no existe
      if (!entities)
        throw new NotFoundException("Entidades Accounts no encontradas.");
      // Devolver account
      return {
        ok: true,
        message: "Accounts actualizadas con éxito.",
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteAccountDto>("deleteAccount", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<AccountResponse<Account>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el account no existe
      if (!entity)
        throw new NotFoundException("Instancias de Account no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver account
      return {
        ok: true,
        message: "Instancia de Account eliminada con éxito.",
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
      .registerClient(AccountCommandService.name)
      .get(AccountCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteAccounts", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

