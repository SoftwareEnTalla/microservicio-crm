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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { PaymentMilestoneStatus } from '../entities/payment-milestone-status.entity';
import { PaymentMilestoneStatusQueryRepository } from './paymentmilestonestatusquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {PaymentMilestoneStatusRepository} from './paymentmilestonestatus.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { PaymentMilestoneStatusCreatedEvent } from '../events/paymentmilestonestatuscreated.event';
import { PaymentMilestoneStatusUpdatedEvent } from '../events/paymentmilestonestatusupdated.event';
import { PaymentMilestoneStatusDeletedEvent } from '../events/paymentmilestonestatusdeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(PaymentMilestoneStatusCreatedEvent, PaymentMilestoneStatusUpdatedEvent, PaymentMilestoneStatusDeletedEvent)
@Injectable()
export class PaymentMilestoneStatusCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: PaymentMilestoneStatusCommandRepository
  constructor(
    @InjectRepository(PaymentMilestoneStatus)
    private readonly repository: Repository<PaymentMilestoneStatus>,
    private readonly paymentmilestonestatusRepository: PaymentMilestoneStatusQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(PaymentMilestoneStatus.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${PaymentMilestoneStatus.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle PaymentMilestoneStatus event on repository:', event);
    switch (event.constructor.name) {
      case 'PaymentMilestoneStatusCreatedEvent':
        return await this.onPaymentMilestoneStatusCreated(event);
      case 'PaymentMilestoneStatusUpdatedEvent':
        return await this.onPaymentMilestoneStatusUpdated(event);
      case 'PaymentMilestoneStatusDeletedEvent':
        return await this.onPaymentMilestoneStatusDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentMilestoneStatus>('createPaymentMilestoneStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentMilestoneStatusCreated(event: PaymentMilestoneStatusCreatedEvent) {
    logger.info('Ready to handle onPaymentMilestoneStatusCreated event on repository:', event);
    const entity = new PaymentMilestoneStatus();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'paymentmilestonestatus';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentMilestoneStatus>('updatePaymentMilestoneStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentMilestoneStatusUpdated(event: PaymentMilestoneStatusUpdatedEvent) {
    logger.info('Ready to handle onPaymentMilestoneStatusUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<PaymentMilestoneStatus>('deletePaymentMilestoneStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onPaymentMilestoneStatusDeleted(event: PaymentMilestoneStatusDeletedEvent) {
    logger.info('Ready to handle onPaymentMilestoneStatusDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentMilestoneStatus>('createPaymentMilestoneStatus',args[0], args[1]), ttl: 60 })
  async create(entity: PaymentMilestoneStatus): Promise<PaymentMilestoneStatus> {
    logger.info('Ready to create PaymentMilestoneStatus on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'paymentmilestonestatus';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of PaymentMilestoneStatus was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const event = new PaymentMilestoneStatusCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentMilestoneStatus[]>('createPaymentMilestoneStatuss',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: PaymentMilestoneStatus[]): Promise<PaymentMilestoneStatus[]> {
    logger.info('Ready to create PaymentMilestoneStatus on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'paymentmilestonestatus';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of PaymentMilestoneStatus was created on repository:', result);
    
    // Publicar eventos al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const events = result.map((el) => new PaymentMilestoneStatusCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      events.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(events);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentMilestoneStatus>('updatePaymentMilestoneStatus',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<PaymentMilestoneStatus>
  ): Promise<PaymentMilestoneStatus | null> {
    logger.info('Ready to update PaymentMilestoneStatus on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update PaymentMilestoneStatus on repository was successfully :', partialEntity);
    let instance=await this.paymentmilestonestatusRepository.findById(id);
    logger.info('Updated instance of PaymentMilestoneStatus with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event PaymentMilestoneStatusUpdatedEvent on repository:', instance);
      const event = new PaymentMilestoneStatusUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<PaymentMilestoneStatus[]>('updatePaymentMilestoneStatuss',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<PaymentMilestoneStatus>[]): Promise<PaymentMilestoneStatus[]> {
    const updatedEntities: PaymentMilestoneStatus[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const updateEvent = new PaymentMilestoneStatusUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(updateEvent);
            this.eventPublisher.publish(updateEvent);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deletePaymentMilestoneStatus',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.paymentmilestonestatusRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire PaymentMilestoneStatusDeletedEvent on repository:', result);
       const event = new PaymentMilestoneStatusDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(event);
       this.eventPublisher.publish(event);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
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
      .registerClient(PaymentMilestoneStatusRepository.name)
      .get(PaymentMilestoneStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deletePaymentMilestoneStatuss',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire PaymentMilestoneStatusDeletedEvent on repository:', result);
      const deleteEvents = await Promise.all(ids.map(async (id) => {
          const entity = await this.paymentmilestonestatusRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new PaymentMilestoneStatusDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      deleteEvents.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(deleteEvents);
    }
    return result;
  }
}


