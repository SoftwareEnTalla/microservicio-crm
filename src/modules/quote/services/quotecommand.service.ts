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
import { Quote } from "../entities/quote.entity";
import { CreateQuoteDto, UpdateQuoteDto, DeleteQuoteDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { QuoteCommandRepository } from "../repositories/quotecommand.repository";
import { QuoteQueryRepository } from "../repositories/quotequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { QuoteResponse, QuotesResponse } from "../types/quote.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { QuoteQueryService } from "./quotequery.service";
import { BaseEvent } from "../events/base.event";
import { QuoteSentEvent } from '../events/quotesent.event';
import { QuoteAcceptedEvent } from '../events/quoteaccepted.event';
import { QuoteRejectedEvent } from '../events/quoterejected.event';

@Injectable()
export class QuoteCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(QuoteCommandService.name);
  //Constructo del servicio QuoteCommandService
  constructor(
    private readonly repository: QuoteCommandRepository,
    private readonly queryRepository: QuoteQueryRepository,
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
      .registerClient(QuoteQueryService.name)
      .get(QuoteQueryService.name),
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
        await this.eventStore.appendEvent('quote-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: Quote | null,
    current?: Quote | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'create') {
      // Regla de servicio: quote-total-derived
      // El total de la cotización se deriva de subtotal, descuento e impuestos.
      if (!(this.dslValue(entityData, currentData, inputData, 'subtotal') === undefined || this.dslValue(entityData, currentData, inputData, 'subtotal') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subtotal') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subtotal')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subtotal')) && this.dslValue(entityData, currentData, inputData, 'subtotal').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subtotal') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subtotal')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subtotal')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subtotal'))).length === 0))) {
        entityData['grandTotal'] = undefined;
        if (entity) {
          (entity as any)['grandTotal'] = undefined;
        }
      }

    }

    if (operation === 'update') {
      // Regla de servicio: quote-accepted-requires-accepted-at
      // Una cotización aceptada debe registrar fecha de aceptación.
      if (!((!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACCEPTED') || (!(this.dslValue(entityData, currentData, inputData, 'acceptedAt') === undefined || this.dslValue(entityData, currentData, inputData, 'acceptedAt') === null || (typeof this.dslValue(entityData, currentData, inputData, 'acceptedAt') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'acceptedAt')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'acceptedAt')) && this.dslValue(entityData, currentData, inputData, 'acceptedAt').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'acceptedAt') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'acceptedAt')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'acceptedAt')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'acceptedAt'))).length === 0)))))) {
        throw new Error('QUOTE_001: Una cotización ACCEPTED requiere acceptedAt');
      }

      // Regla de servicio: quote-total-derived
      // El total de la cotización se deriva de subtotal, descuento e impuestos.
      if (!(this.dslValue(entityData, currentData, inputData, 'subtotal') === undefined || this.dslValue(entityData, currentData, inputData, 'subtotal') === null || (typeof this.dslValue(entityData, currentData, inputData, 'subtotal') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'subtotal')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'subtotal')) && this.dslValue(entityData, currentData, inputData, 'subtotal').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'subtotal') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'subtotal')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'subtotal')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'subtotal'))).length === 0))) {
        entityData['grandTotal'] = undefined;
        if (entity) {
          (entity as any)['grandTotal'] = undefined;
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateQuoteDto>("createQuote", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createQuoteDtoInput: CreateQuoteDto
  ): Promise<QuoteResponse<Quote>> {
    try {
      logger.info("Receiving in service:", createQuoteDtoInput);
      const candidate = Quote.fromDto(createQuoteDtoInput);
      await this.applyDslServiceRules("create", createQuoteDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createQuoteDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el quote no existe
      if (!entity)
        throw new NotFoundException("Entidad Quote no encontrada.");
      // Devolver quote
      return {
        ok: true,
        message: "Quote obtenido con éxito.",
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<Quote>("createQuotes", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createQuoteDtosInput: CreateQuoteDto[]
  ): Promise<QuotesResponse<Quote>> {
    try {
      const entities = await this.repository.bulkCreate(
        createQuoteDtosInput.map((entity) => Quote.fromDto(entity))
      );

      // Respuesta si el quote no existe
      if (!entities)
        throw new NotFoundException("Entidades Quotes no encontradas.");
      // Devolver quote
      return {
        ok: true,
        message: "Quotes creados con éxito.",
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateQuoteDto>("updateQuote", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateQuoteDto
  ): Promise<QuoteResponse<Quote>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new Quote(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el quote no existe
      if (!entity)
        throw new NotFoundException("Entidades Quotes no encontradas.");
      // Devolver quote
      return {
        ok: true,
        message: "Quote actualizada con éxito.",
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateQuoteDto>("updateQuotes", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateQuoteDto[]
  ): Promise<QuotesResponse<Quote>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => Quote.fromDto(entity))
      );
      // Respuesta si el quote no existe
      if (!entities)
        throw new NotFoundException("Entidades Quotes no encontradas.");
      // Devolver quote
      return {
        ok: true,
        message: "Quotes actualizadas con éxito.",
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteQuoteDto>("deleteQuote", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<QuoteResponse<Quote>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el quote no existe
      if (!entity)
        throw new NotFoundException("Instancias de Quote no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver quote
      return {
        ok: true,
        message: "Instancia de Quote eliminada con éxito.",
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
      .registerClient(QuoteCommandService.name)
      .get(QuoteCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteQuotes", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

