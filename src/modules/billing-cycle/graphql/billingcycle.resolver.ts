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
import { BillingCycle } from "../entities/billing-cycle.entity";

//Definición de comandos
import {
  CreateBillingCycleCommand,
  UpdateBillingCycleCommand,
  DeleteBillingCycleCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { BillingCycleQueryService } from "../services/billingcyclequery.service";


import { BillingCycleResponse, BillingCyclesResponse } from "../types/billingcycle.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateBillingCycleDto, 
CreateOrUpdateBillingCycleDto, 
BillingCycleValueInput, 
BillingCycleDto, 
CreateBillingCycleDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => BillingCycle)
export class BillingCycleResolver {

   //Constructor del resolver de BillingCycle
  constructor(
    private readonly service: BillingCycleQueryService,
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  // Mutaciones
  @Mutation(() => BillingCycleResponse<BillingCycle>)
  async createBillingCycle(
    @Args("input", { type: () => CreateBillingCycleDto }) input: CreateBillingCycleDto
  ): Promise<BillingCycleResponse<BillingCycle>> {
    return this.commandBus.execute(new CreateBillingCycleCommand(input));
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Mutation(() => BillingCycleResponse<BillingCycle>)
  async updateBillingCycle(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateBillingCycleDto
  ): Promise<BillingCycleResponse<BillingCycle>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateBillingCycleCommand(payLoad, {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Mutation(() => BillingCycleResponse<BillingCycle>)
  async createOrUpdateBillingCycle(
    @Args("data", { type: () => CreateOrUpdateBillingCycleDto })
    data: CreateOrUpdateBillingCycleDto
  ): Promise<BillingCycleResponse<BillingCycle>> {
    if (data.id) {
      const existingBillingCycle = await this.service.findById(data.id);
      if (existingBillingCycle) {
        return this.commandBus.execute(
          new UpdateBillingCycleCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateBillingCycleDto | UpdateBillingCycleDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateBillingCycleCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateBillingCycleDto | UpdateBillingCycleDto).createdBy ||
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteBillingCycle(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteBillingCycleCommand(id));
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  // Queries
  @Query(() => BillingCyclesResponse<BillingCycle>)
  async billingcycles(
    options?: FindManyOptions<BillingCycle>,
    paginationArgs?: PaginationArgs
  ): Promise<BillingCyclesResponse<BillingCycle>> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCyclesResponse<BillingCycle>)
  async billingcycle(
    @Args("id", { type: () => String }) id: string
  ): Promise<BillingCycleResponse<BillingCycle>> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCyclesResponse<BillingCycle>)
  async billingcyclesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => BillingCycleValueInput }) value: BillingCycleValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<BillingCyclesResponse<BillingCycle>> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCyclesResponse<BillingCycle>)
  async billingcyclesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<BillingCyclesResponse<BillingCycle>> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => Number)
  async totalBillingCycles(): Promise<number> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCyclesResponse<BillingCycle>)
  async searchBillingCycles(
    @Args("where", { type: () => BillingCycleDto, nullable: false })
    where: Record<string, any>
  ): Promise<BillingCyclesResponse<BillingCycle>> {
    const billingcycles = await this.service.findAndCount(where);
    return billingcycles;
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCycleResponse<BillingCycle>, { nullable: true })
  async findOneBillingCycle(
    @Args("where", { type: () => BillingCycleDto, nullable: false })
    where: Record<string, any>
  ): Promise<BillingCycleResponse<BillingCycle>> {
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
      .registerClient(BillingCycleResolver.name)

      .get(BillingCycleResolver.name),
    })
  @Query(() => BillingCycleResponse<BillingCycle>)
  async findOneBillingCycleOrFail(
    @Args("where", { type: () => BillingCycleDto, nullable: false })
    where: Record<string, any>
  ): Promise<BillingCycleResponse<BillingCycle> | Error> {
    return this.service.findOneOrFail(where);
  }
}

