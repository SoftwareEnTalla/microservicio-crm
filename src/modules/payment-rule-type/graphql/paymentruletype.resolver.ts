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
import { PaymentRuleType } from "../entities/payment-rule-type.entity";

//Definición de comandos
import {
  CreatePaymentRuleTypeCommand,
  UpdatePaymentRuleTypeCommand,
  DeletePaymentRuleTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PaymentRuleTypeQueryService } from "../services/paymentruletypequery.service";


import { PaymentRuleTypeResponse, PaymentRuleTypesResponse } from "../types/paymentruletype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePaymentRuleTypeDto, 
CreateOrUpdatePaymentRuleTypeDto, 
PaymentRuleTypeValueInput, 
PaymentRuleTypeDto, 
CreatePaymentRuleTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PaymentRuleType)
export class PaymentRuleTypeResolver {

   //Constructor del resolver de PaymentRuleType
  constructor(
    private readonly service: PaymentRuleTypeQueryService,
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PaymentRuleTypeResponse<PaymentRuleType>)
  async createPaymentRuleType(
    @Args("input", { type: () => CreatePaymentRuleTypeDto }) input: CreatePaymentRuleTypeDto
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType>> {
    return this.commandBus.execute(new CreatePaymentRuleTypeCommand(input));
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Mutation(() => PaymentRuleTypeResponse<PaymentRuleType>)
  async updatePaymentRuleType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePaymentRuleTypeDto
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePaymentRuleTypeCommand(payLoad, {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Mutation(() => PaymentRuleTypeResponse<PaymentRuleType>)
  async createOrUpdatePaymentRuleType(
    @Args("data", { type: () => CreateOrUpdatePaymentRuleTypeDto })
    data: CreateOrUpdatePaymentRuleTypeDto
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType>> {
    if (data.id) {
      const existingPaymentRuleType = await this.service.findById(data.id);
      if (existingPaymentRuleType) {
        return this.commandBus.execute(
          new UpdatePaymentRuleTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePaymentRuleTypeDto | UpdatePaymentRuleTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePaymentRuleTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePaymentRuleTypeDto | UpdatePaymentRuleTypeDto).createdBy ||
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePaymentRuleType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePaymentRuleTypeCommand(id));
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  // Queries
  @Query(() => PaymentRuleTypesResponse<PaymentRuleType>)
  async paymentruletypes(
    options?: FindManyOptions<PaymentRuleType>,
    paginationArgs?: PaginationArgs
  ): Promise<PaymentRuleTypesResponse<PaymentRuleType>> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypesResponse<PaymentRuleType>)
  async paymentruletype(
    @Args("id", { type: () => String }) id: string
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType>> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypesResponse<PaymentRuleType>)
  async paymentruletypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PaymentRuleTypeValueInput }) value: PaymentRuleTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentRuleTypesResponse<PaymentRuleType>> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypesResponse<PaymentRuleType>)
  async paymentruletypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PaymentRuleTypesResponse<PaymentRuleType>> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => Number)
  async totalPaymentRuleTypes(): Promise<number> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypesResponse<PaymentRuleType>)
  async searchPaymentRuleTypes(
    @Args("where", { type: () => PaymentRuleTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentRuleTypesResponse<PaymentRuleType>> {
    const paymentruletypes = await this.service.findAndCount(where);
    return paymentruletypes;
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypeResponse<PaymentRuleType>, { nullable: true })
  async findOnePaymentRuleType(
    @Args("where", { type: () => PaymentRuleTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType>> {
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
      .registerClient(PaymentRuleTypeResolver.name)

      .get(PaymentRuleTypeResolver.name),
    })
  @Query(() => PaymentRuleTypeResponse<PaymentRuleType>)
  async findOnePaymentRuleTypeOrFail(
    @Args("where", { type: () => PaymentRuleTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PaymentRuleTypeResponse<PaymentRuleType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

