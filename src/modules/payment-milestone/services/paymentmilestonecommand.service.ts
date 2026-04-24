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
import { PaymentMilestone } from "../entities/payment-milestone.entity";
import { CreatePaymentMilestoneDto, UpdatePaymentMilestoneDto, DeletePaymentMilestoneDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { PaymentMilestoneCommandRepository } from "../repositories/paymentmilestonecommand.repository";
import { PaymentMilestoneQueryRepository } from "../repositories/paymentmilestonequery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { PaymentMilestoneResponse, PaymentMilestonesResponse } from "../types/paymentmilestone.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { PaymentMilestoneQueryService } from "./paymentmilestonequery.service";
import { BaseEvent } from "../events/base.event";
import { PaymentMilestoneStatusChangedEvent } from '../events/paymentmilestonestatuschanged.event';
import { PaymentMilestoneAcceptedEvent } from '../events/paymentmilestoneaccepted.event';
import { PaymentMilestoneRejectedEvent } from '../events/paymentmilestonerejected.event';
import { MilestoneReadyForInvoicingEvent } from '../events/milestonereadyforinvoicing.event';
import { PaymentMilestoneInvoicedEvent } from '../events/paymentmilestoneinvoiced.event';

@Injectable()
export class PaymentMilestoneCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(PaymentMilestoneCommandService.name);
  //Constructo del servicio PaymentMilestoneCommandService
  constructor(
    private readonly repository: PaymentMilestoneCommandRepository,
    private readonly queryRepository: PaymentMilestoneQueryRepository,
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
      .registerClient(PaymentMilestoneQueryService.name)
      .get(PaymentMilestoneQueryService.name),
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
        await this.eventStore.appendEvent('payment-milestone-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: PaymentMilestone | null,
    current?: PaymentMilestone | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'update') {
      // Regla de servicio: accepted-requires-acceptance-date
      // Al transitar a ACCEPTED debe existir clientAcceptanceDate
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACCEPTED' && !(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate') === undefined || this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate') === null || (typeof this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate') === 'string' && String(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate')).trim() === '') || (Array.isArray(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate')) && this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate').length === 0) || (typeof this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate') === 'object' && !Array.isArray(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate')) && Object.prototype.toString.call(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate')) === '[object Object]' && Object.keys(Object(this.dslValue(entityData, currentData, inputData, 'clientAcceptanceDate'))).length === 0)))) {
        throw new Error('MILESTONE_001: ACCEPTED requiere clientAcceptanceDate');
      }

      // Regla de servicio: compute-actual-payment-due-date-on-accept
      // Al transitar a ACCEPTED se calcula actualPaymentDueDate según regla local, global del contrato, global de términos o default 30 días
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'ACCEPTED') {
        entityData['actualPaymentDueDate'] = undefined;
        if (entity) {
          (entity as any)['actualPaymentDueDate'] = undefined;
        }
      }
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'ACCEPTED') {
        pendingEvents.push(MilestoneReadyForInvoicingEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-milestone-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'payment-milestone-update')
        ));
      }

      // Regla de servicio: rejected-reopens-execution
      // REJECTED debe volver a EXECUTION limpiando fechas de cierre
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'REJECTED') {
        entityData['executionEndDate'] = 'null';
        if (entity) {
          (entity as any)['executionEndDate'] = 'null';
        }
      }
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'REJECTED') {
        entityData['clientAcceptanceDate'] = 'null';
        if (entity) {
          (entity as any)['clientAcceptanceDate'] = 'null';
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreatePaymentMilestoneDto>("createPaymentMilestone", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createPaymentMilestoneDtoInput: CreatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
      logger.info("Receiving in service:", createPaymentMilestoneDtoInput);
      const candidate = PaymentMilestone.fromDto(createPaymentMilestoneDtoInput);
      await this.applyDslServiceRules("create", createPaymentMilestoneDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createPaymentMilestoneDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el paymentmilestone no existe
      if (!entity)
        throw new NotFoundException("Entidad PaymentMilestone no encontrada.");
      // Devolver paymentmilestone
      return {
        ok: true,
        message: "PaymentMilestone obtenido con éxito.",
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<PaymentMilestone>("createPaymentMilestones", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createPaymentMilestoneDtosInput: CreatePaymentMilestoneDto[]
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
    try {
      const entities = await this.repository.bulkCreate(
        createPaymentMilestoneDtosInput.map((entity) => PaymentMilestone.fromDto(entity))
      );

      // Respuesta si el paymentmilestone no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentMilestones no encontradas.");
      // Devolver paymentmilestone
      return {
        ok: true,
        message: "PaymentMilestones creados con éxito.",
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentMilestoneDto>("updatePaymentMilestone", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new PaymentMilestone(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el paymentmilestone no existe
      if (!entity)
        throw new NotFoundException("Entidades PaymentMilestones no encontradas.");
      // Devolver paymentmilestone
      return {
        ok: true,
        message: "PaymentMilestone actualizada con éxito.",
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdatePaymentMilestoneDto>("updatePaymentMilestones", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdatePaymentMilestoneDto[]
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => PaymentMilestone.fromDto(entity))
      );
      // Respuesta si el paymentmilestone no existe
      if (!entities)
        throw new NotFoundException("Entidades PaymentMilestones no encontradas.");
      // Devolver paymentmilestone
      return {
        ok: true,
        message: "PaymentMilestones actualizadas con éxito.",
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeletePaymentMilestoneDto>("deletePaymentMilestone", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el paymentmilestone no existe
      if (!entity)
        throw new NotFoundException("Instancias de PaymentMilestone no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver paymentmilestone
      return {
        ok: true,
        message: "Instancia de PaymentMilestone eliminada con éxito.",
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
      .registerClient(PaymentMilestoneCommandService.name)
      .get(PaymentMilestoneCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deletePaymentMilestones", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

