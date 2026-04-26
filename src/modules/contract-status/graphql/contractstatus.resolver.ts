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
import { ContractStatus } from "../entities/contract-status.entity";

//Definición de comandos
import {
  CreateContractStatusCommand,
  UpdateContractStatusCommand,
  DeleteContractStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ContractStatusQueryService } from "../services/contractstatusquery.service";


import { ContractStatusResponse, ContractStatussResponse } from "../types/contractstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateContractStatusDto, 
CreateOrUpdateContractStatusDto, 
ContractStatusValueInput, 
ContractStatusDto, 
CreateContractStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => ContractStatus)
export class ContractStatusResolver {

   //Constructor del resolver de ContractStatus
  constructor(
    private readonly service: ContractStatusQueryService,
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => ContractStatusResponse<ContractStatus>)
  async createContractStatus(
    @Args("input", { type: () => CreateContractStatusDto }) input: CreateContractStatusDto
  ): Promise<ContractStatusResponse<ContractStatus>> {
    return this.commandBus.execute(new CreateContractStatusCommand(input));
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Mutation(() => ContractStatusResponse<ContractStatus>)
  async updateContractStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateContractStatusDto
  ): Promise<ContractStatusResponse<ContractStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateContractStatusCommand(payLoad, {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Mutation(() => ContractStatusResponse<ContractStatus>)
  async createOrUpdateContractStatus(
    @Args("data", { type: () => CreateOrUpdateContractStatusDto })
    data: CreateOrUpdateContractStatusDto
  ): Promise<ContractStatusResponse<ContractStatus>> {
    if (data.id) {
      const existingContractStatus = await this.service.findById(data.id);
      if (existingContractStatus) {
        return this.commandBus.execute(
          new UpdateContractStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateContractStatusDto | UpdateContractStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateContractStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateContractStatusDto | UpdateContractStatusDto).createdBy ||
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteContractStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteContractStatusCommand(id));
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  // Queries
  @Query(() => ContractStatussResponse<ContractStatus>)
  async contractstatuss(
    options?: FindManyOptions<ContractStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<ContractStatussResponse<ContractStatus>> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatussResponse<ContractStatus>)
  async contractstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<ContractStatusResponse<ContractStatus>> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatussResponse<ContractStatus>)
  async contractstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ContractStatusValueInput }) value: ContractStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ContractStatussResponse<ContractStatus>> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatussResponse<ContractStatus>)
  async contractstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ContractStatussResponse<ContractStatus>> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => Number)
  async totalContractStatuss(): Promise<number> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatussResponse<ContractStatus>)
  async searchContractStatuss(
    @Args("where", { type: () => ContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractStatussResponse<ContractStatus>> {
    const contractstatuss = await this.service.findAndCount(where);
    return contractstatuss;
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatusResponse<ContractStatus>, { nullable: true })
  async findOneContractStatus(
    @Args("where", { type: () => ContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractStatusResponse<ContractStatus>> {
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
      .registerClient(ContractStatusResolver.name)

      .get(ContractStatusResolver.name),
    })
  @Query(() => ContractStatusResponse<ContractStatus>)
  async findOneContractStatusOrFail(
    @Args("where", { type: () => ContractStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<ContractStatusResponse<ContractStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

