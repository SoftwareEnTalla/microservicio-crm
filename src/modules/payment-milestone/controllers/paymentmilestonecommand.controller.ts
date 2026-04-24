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


import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { PaymentMilestoneCommandService } from "../services/paymentmilestonecommand.service";
import { PaymentMilestoneAuthGuard } from "../guards/paymentmilestoneauthguard.guard";

import { DeleteResult } from "typeorm";
import { Logger } from "@nestjs/common";
import { Helper } from "src/common/helpers/helpers";
import { PaymentMilestone } from "../entities/payment-milestone.entity";
import { PaymentMilestoneResponse, PaymentMilestonesResponse } from "../types/paymentmilestone.types";
import { CreatePaymentMilestoneDto, UpdatePaymentMilestoneDto } from "../dtos/all-dto"; 

//Loggers
import { LoggerClient } from "src/common/logger/logger.client";
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { logger } from '@core/logs/logger';

import { BadRequestException } from "@nestjs/common";

import { CommandBus } from "@nestjs/cqrs";
//import { PaymentMilestoneCreatedEvent } from "../events/paymentmilestonecreated.event";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";

@ApiTags("PaymentMilestone Command")
@UseGuards(PaymentMilestoneAuthGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: "Autenticación requerida." })
@Controller("paymentmilestones/command")
export class PaymentMilestoneCommandController {

  #logger = new Logger(PaymentMilestoneCommandController.name);

  //Constructor del controlador: PaymentMilestoneCommandController
  constructor(
  private readonly service: PaymentMilestoneCommandService,
  private readonly commandBus: CommandBus,
  private readonly eventStore: EventStoreService,
  private readonly eventPublisher: KafkaEventPublisher
  ) {
    //Coloca aquí la lógica que consideres necesaria para inicializar el controlador
  }

  @ApiOperation({ summary: "Create a new paymentmilestone" })
  @ApiBody({ type: CreatePaymentMilestoneDto })
  @ApiResponse({ status: 201, type: PaymentMilestoneResponse<PaymentMilestone> })
  @Post()
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async create(
    @Body() createPaymentMilestoneDtoInput: CreatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
      logger.info("Receiving in controller:", createPaymentMilestoneDtoInput);
      const entity = await this.service.create(createPaymentMilestoneDtoInput);
      logger.info("Entity created on controller:", entity);
      if (!entity) {
        throw new NotFoundException("Response paymentmilestone entity not found.");
      } else if (!entity.data) {
        throw new NotFoundException("PaymentMilestone entity not found on response.");
      } else if (!entity.data.id) {
        throw new NotFoundException("Id paymentmilestone is null on order instance.");
      }     

      return entity;
    } catch (error) {
      logger.info("Error creating entity on controller:", error);
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Create multiple paymentmilestones" })
  @ApiBody({ type: [CreatePaymentMilestoneDto] })
  @ApiResponse({ status: 201, type: PaymentMilestonesResponse<PaymentMilestone> })
  @Post("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async bulkCreate(
    @Body() createPaymentMilestoneDtosInput: CreatePaymentMilestoneDto[]
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
    try {
      const entities = await this.service.bulkCreate(createPaymentMilestoneDtosInput);

      if (!entities) {
        throw new NotFoundException("PaymentMilestone entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update an paymentmilestone" })
  @ApiParam({
    name: "id",
    description: "Identificador desde la url del endpoint",
  }) // ✅ Documentamos el ID de la URL
  @ApiBody({
    type: UpdatePaymentMilestoneDto,
    description: "El Payload debe incluir el mismo ID de la URL",
  })
  @ApiResponse({ status: 200, type: PaymentMilestoneResponse<PaymentMilestone> })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMilestone a actualizar.",
  }) // ✅ Nuevo status para el error de validación
  @Put(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async update(
    @Param("id") id: string,
    @Body() body: any
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
      // Permitir body plano o anidado en 'data'
      const partialEntity = body?.data ? body.data : body;
      // ✅ Validación de coincidencia de IDs (auto-asigna id de la URL si el body no lo trae)
      if (partialEntity?.id && id !== partialEntity.id) {
        throw new BadRequestException(
          "El ID en la URL no coincide con el ID en la instancia de PaymentMilestone a actualizar."
        );
      }
      if (partialEntity && !partialEntity.id) { partialEntity.id = id; }
      const entity = await this.service.update(id, partialEntity);

      if (!entity) {
        throw new NotFoundException("Instancia de PaymentMilestone no encontrada.");
      }

      return entity;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Update multiple paymentmilestones" })
  @ApiBody({ type: [UpdatePaymentMilestoneDto] })
  @ApiResponse({ status: 200, type: PaymentMilestonesResponse<PaymentMilestone> })
  @Put("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async bulkUpdate(
    @Body() partialEntities: UpdatePaymentMilestoneDto[]
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
    try {
      const entities = await this.service.bulkUpdate(partialEntities);

      if (!entities) {
        throw new NotFoundException("PaymentMilestone entities not found.");
      }

      return entities;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete an paymentmilestone" })   
  @ApiResponse({ status: 200, type: PaymentMilestoneResponse<PaymentMilestone>,description:
    "Instancia de PaymentMilestone eliminada satisfactoriamente.", })
  @ApiResponse({
    status: 400,
    description:
      "EL ID en la URL no coincide con la instancia PaymentMilestone a eliminar.",
  }) // ✅ Nuevo status para el error de validación
  @Delete(":id")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async delete(@Param("id") id: string): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    try {
       
      const result = await this.service.delete(id);

      if (!result) {
        throw new NotFoundException("PaymentMilestone entity not found.");
      }

      return result;
    } catch (error) {
      logger.error(error);
      return Helper.throwCachedError(error);
    }
  }

  
  
  @ApiOperation({ summary: "Delete multiple paymentmilestones" })
  @ApiResponse({ status: 200, type: DeleteResult })
  @Delete("bulk")
  @LogExecutionTime({
    layer: "controller",
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
      .registerClient(PaymentMilestoneCommandController.name)
      .get(PaymentMilestoneCommandController.name),
  })
  async bulkDelete(@Query("ids") ids: string[]): Promise<DeleteResult> {
    return await this.service.bulkDelete(ids);
  }
}

