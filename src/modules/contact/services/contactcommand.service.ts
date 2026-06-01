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
import { Contact } from "../entities/contact.entity";
import { CreateContactDto, UpdateContactDto, DeleteContactDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { ContactCommandRepository } from "../repositories/contactcommand.repository";
import { ContactQueryRepository } from "../repositories/contactquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { ContactResponse, ContactsResponse } from "../types/contact.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { ContactQueryService } from "./contactquery.service";
import { BaseEvent } from "../events/base.event";
import { ContactLinkedToAccountEvent } from '../events/contactlinkedtoaccount.event';

@Injectable()
export class ContactCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(ContactCommandService.name);
  //Constructo del servicio ContactCommandService
  constructor(
    private readonly repository: ContactCommandRepository,
    private readonly queryRepository: ContactQueryRepository,
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
      .registerClient(ContactQueryService.name)
      .get(ContactQueryService.name),
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
        await this.eventStore.appendEvent('contact-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Contact | null,
    current?: Contact | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: contact-active-requires-account-or-owner
      // Un contacto activo debe estar vinculado a una cuenta o tener owner asignado.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('CONTACT_001: Un contacto ACTIVE requiere accountId o ownerId');
      }

    }

    if (operation === 'update') {
      // Regla de servicio: contact-active-requires-account-or-owner
      // Un contacto activo debe estar vinculado a una cuenta o tener owner asignado.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE')) {
        throw new Error('CONTACT_001: Un contacto ACTIVE requiere accountId o ownerId');
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateContactDto>("createContact", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createContactDtoInput: CreateContactDto
  ): Promise<ContactResponse<Contact>> {
    try {
      logger.info("Receiving in service:", createContactDtoInput);
      const candidate = Contact.fromDto(createContactDtoInput);
      await this.applyDslServiceRules("create", createContactDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createContactDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el contact no existe
      if (!entity)
        throw new NotFoundException("Entidad Contact no encontrada.");
      // Devolver contact
      return {
        ok: true,
        message: "Contact obtenido con éxito.",
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Contact>("createContacts", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createContactDtosInput: CreateContactDto[]
  ): Promise<ContactsResponse<Contact>> {
    try {
      const entities = await this.repository.bulkCreate(
        createContactDtosInput.map((entity) => Contact.fromDto(entity))
      );

      // Respuesta si el contact no existe
      if (!entities)
        throw new NotFoundException("Entidades Contacts no encontradas.");
      // Devolver contact
      return {
        ok: true,
        message: "Contacts creados con éxito.",
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateContactDto>("updateContact", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateContactDto
  ): Promise<ContactResponse<Contact>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Contact(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el contact no existe
      if (!entity)
        throw new NotFoundException("Entidades Contacts no encontradas.");
      // Devolver contact
      return {
        ok: true,
        message: "Contact actualizada con éxito.",
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateContactDto>("updateContacts", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateContactDto[]
  ): Promise<ContactsResponse<Contact>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Contact.fromDto(entity))
      );
      // Respuesta si el contact no existe
      if (!entities)
        throw new NotFoundException("Entidades Contacts no encontradas.");
      // Devolver contact
      return {
        ok: true,
        message: "Contacts actualizadas con éxito.",
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteContactDto>("deleteContact", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<ContactResponse<Contact>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el contact no existe
      if (!entity)
        throw new NotFoundException("Instancias de Contact no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver contact
      return {
        ok: true,
        message: "Instancia de Contact eliminada con éxito.",
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
      .registerClient(ContactCommandService.name)
      .get(ContactCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteContacts", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

