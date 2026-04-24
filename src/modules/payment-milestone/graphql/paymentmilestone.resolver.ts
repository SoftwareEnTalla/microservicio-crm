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
import { PaymentMilestone } from "../entities/payment-milestone.entity";

//Definición de comandos
import {
  CreatePaymentMilestoneCommand,
  UpdatePaymentMilestoneCommand,
  DeletePaymentMilestoneCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentMilestoneQueryService } from "../services/paymentmilestonequery.service";


import { PaymentMilestoneResponse, PaymentMilestonesResponse } from "../types/paymentmilestone.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentMilestoneDto, 
CreateOrUpdatePaymentMilestoneDto, 
PaymentMilestoneValueInput, 
PaymentMilestoneDto, 
CreatePaymentMilestoneDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentMilestone)
export class PaymentMilestoneResolver {

   //Constructor del resolver de PaymentMilestone
  constructor(
    private readonly service: PaymentMilestoneQueryService,
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentMilestoneResponse<PaymentMilestone>)
  async createPaymentMilestone(
    @Args("input", { type: () => CreatePaymentMilestoneDto }) input: CreatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    return this.commandBus.execute(new CreatePaymentMilestoneCommand(input));
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Mutation(() => PaymentMilestoneResponse<PaymentMilestone>)
  async updatePaymentMilestone(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentMilestoneCommand(payLoad, {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Mutation(() => PaymentMilestoneResponse<PaymentMilestone>)
  async createOrUpdatePaymentMilestone(
    @Args("data", { type: () => CreateOrUpdatePaymentMilestoneDto })
    data: CreateOrUpdatePaymentMilestoneDto
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
    if (data.id) {
      const existingPaymentMilestone = await this.service.findById(data.id);
      if (existingPaymentMilestone) {
        return this.commandBus.execute(
          new UpdatePaymentMilestoneCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentMilestoneDto | UpdatePaymentMilestoneDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentMilestoneCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentMilestoneDto | UpdatePaymentMilestoneDto).createdBy ||
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentMilestone(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentMilestoneCommand(id));
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  // Queries
  @Query(() => PaymentMilestonesResponse<PaymentMilestone>)
  async paymentmilestones(
    options?: FindManyOptions<PaymentMilestone>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestonesResponse<PaymentMilestone>)
  async paymentmilestone(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestonesResponse<PaymentMilestone>)
  async paymentmilestonesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentMilestoneValueInput }) value: PaymentMilestoneValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestonesResponse<PaymentMilestone>)
  async paymentmilestonesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => Number)
  async totalPaymentMilestones(): Promise<number> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestonesResponse<PaymentMilestone>)
  async searchPaymentMilestones(
    @Args("where", { type: () => PaymentMilestoneDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestonesResponse<PaymentMilestone>> {
    const paymentmilestones = await this.service.findAndCount(where);
    return paymentmilestones;
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestoneResponse<PaymentMilestone>, { nullable: true })
  async findOnePaymentMilestone(
    @Args("where", { type: () => PaymentMilestoneDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestoneResponse<PaymentMilestone>> {
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
      .registerClient(PaymentMilestoneResolver.name)

      .get(PaymentMilestoneResolver.name),
    })
  @Query(() => PaymentMilestoneResponse<PaymentMilestone>)
  async findOnePaymentMilestoneOrFail(
    @Args("where", { type: () => PaymentMilestoneDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentMilestoneResponse<PaymentMilestone> | Error> {
    return this.service.findOneOrFail(where);
  }
}

