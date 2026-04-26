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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { PaymentMilestoneStatus } from "../entities/payment-milestone-status.entity";

//Definición de comandos
import {
  CreatePaymentMilestoneStatusCommand,
  UpdatePaymentMilestoneStatusCommand,
  DeletePaymentMilestoneStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMilestoneStatusQueryService } from "../services/paymentmilestonestatusquery.service";


import { PaymentMilestoneStatusResponse, PaymentMilestoneStatussResponse } from "../types/paymentmilestonestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMilestoneStatusDto, 
CreateOrUpdatePaymentMilestoneStatusDto, 
PaymentMilestoneStatusValueInput, 
PaymentMilestoneStatusDto, 
CreatePaymentMilestoneStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMilestoneStatus)
export class PaymentMilestoneStatusResolver {

   //Constructor del resolver de PaymentMilestoneStatus
  constructor(
    private readonly service: PaymentMilestoneStatusQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMilestoneStatusResponse<PaymentMilestoneStatus>)
  async createPaymentMilestoneStatus(
    @Args("input", { type: () => CreatePaymentMilestoneStatusDto }) input: CreatePaymentMilestoneStatusDto
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus>> {
    return this.commandBus.execute(new CreatePaymentMilestoneStatusCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Mutation(() => PaymentMilestoneStatusResponse<PaymentMilestoneStatus>)
  async updatePaymentMilestoneStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMilestoneStatusDto
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMilestoneStatusCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Mutation(() => PaymentMilestoneStatusResponse<PaymentMilestoneStatus>)
  async createOrUpdatePaymentMilestoneStatus(
    @Args("data", { type: () => CreateOrUpdatePaymentMilestoneStatusDto })
    data: CreateOrUpdatePaymentMilestoneStatusDto
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus>> {
    if (data.id) {
      const existingPaymentMilestoneStatus = await this.service.findById(data.id);
      if (existingPaymentMilestoneStatus) {
        return this.commandBus.execute(
          new UpdatePaymentMilestoneStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMilestoneStatusDto | UpdatePaymentMilestoneStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMilestoneStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMilestoneStatusDto | UpdatePaymentMilestoneStatusDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMilestoneStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMilestoneStatusCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  // Queries
  @Query(() => PaymentMilestoneStatussResponse<PaymentMilestoneStatus>)
  async paymentmilestonestatuss(
    options?: FindManyOptions<PaymentMilestoneStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMilestoneStatussResponse<PaymentMilestoneStatus>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatussResponse<PaymentMilestoneStatus>)
  async paymentmilestonestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatussResponse<PaymentMilestoneStatus>)
  async paymentmilestonestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMilestoneStatusValueInput }) value: PaymentMilestoneStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMilestoneStatussResponse<PaymentMilestoneStatus>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatussResponse<PaymentMilestoneStatus>)
  async paymentmilestonestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMilestoneStatussResponse<PaymentMilestoneStatus>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMilestoneStatuss(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatussResponse<PaymentMilestoneStatus>)
  async searchPaymentMilestoneStatuss(
    @Args("where", { type: () => PaymentMilestoneStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestoneStatussResponse<PaymentMilestoneStatus>> {
    const paymentmilestonestatuss = await this.service.findAndCount(where);
    return paymentmilestonestatuss;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatusResponse<PaymentMilestoneStatus>, { nullable: true })
  async findOnePaymentMilestoneStatus(
    @Args("where", { type: () => PaymentMilestoneStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(PaymentMilestoneStatusResolver.name)

      .get(PaymentMilestoneStatusResolver.name),
    })
  @Query(() => PaymentMilestoneStatusResponse<PaymentMilestoneStatus>)
  async findOnePaymentMilestoneStatusOrFail(
    @Args("where", { type: () => PaymentMilestoneStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestoneStatusResponse<PaymentMilestoneStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

