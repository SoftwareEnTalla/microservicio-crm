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
import { IncentiveType } from "../entities/incentive-type.entity";

//Definición de comandos
import {
  CreateIncentiveTypeCommand,
  UpdateIncentiveTypeCommand,
  DeleteIncentiveTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { IncentiveTypeQueryService } from "../services/incentivetypequery.service";


import { IncentiveTypeResponse, IncentiveTypesResponse } from "../types/incentivetype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateIncentiveTypeDto, 
CreateOrUpdateIncentiveTypeDto, 
IncentiveTypeValueInput, 
IncentiveTypeDto, 
CreateIncentiveTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => IncentiveType)
export class IncentiveTypeResolver {

   //Constructor del resolver de IncentiveType
  constructor(
    private readonly service: IncentiveTypeQueryService,
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => IncentiveTypeResponse<IncentiveType>)
  async createIncentiveType(
    @Args("input", { type: () => CreateIncentiveTypeDto }) input: CreateIncentiveTypeDto
  ): Promise<IncentiveTypeResponse<IncentiveType>> {
    return this.commandBus.execute(new CreateIncentiveTypeCommand(input));
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Mutation(() => IncentiveTypeResponse<IncentiveType>)
  async updateIncentiveType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateIncentiveTypeDto
  ): Promise<IncentiveTypeResponse<IncentiveType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateIncentiveTypeCommand(payLoad, {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Mutation(() => IncentiveTypeResponse<IncentiveType>)
  async createOrUpdateIncentiveType(
    @Args("data", { type: () => CreateOrUpdateIncentiveTypeDto })
    data: CreateOrUpdateIncentiveTypeDto
  ): Promise<IncentiveTypeResponse<IncentiveType>> {
    if (data.id) {
      const existingIncentiveType = await this.service.findById(data.id);
      if (existingIncentiveType) {
        return this.commandBus.execute(
          new UpdateIncentiveTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateIncentiveTypeDto | UpdateIncentiveTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateIncentiveTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateIncentiveTypeDto | UpdateIncentiveTypeDto).createdBy ||
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteIncentiveType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteIncentiveTypeCommand(id));
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  // Queries
  @Query(() => IncentiveTypesResponse<IncentiveType>)
  async incentivetypes(
    options?: FindManyOptions<IncentiveType>,
    paginationArgs?: PaginationArgs
  ): Promise<IncentiveTypesResponse<IncentiveType>> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypesResponse<IncentiveType>)
  async incentivetype(
    @Args("id", { type: () => String }) id: string
  ): Promise<IncentiveTypeResponse<IncentiveType>> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypesResponse<IncentiveType>)
  async incentivetypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => IncentiveTypeValueInput }) value: IncentiveTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<IncentiveTypesResponse<IncentiveType>> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypesResponse<IncentiveType>)
  async incentivetypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<IncentiveTypesResponse<IncentiveType>> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => Number)
  async totalIncentiveTypes(): Promise<number> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypesResponse<IncentiveType>)
  async searchIncentiveTypes(
    @Args("where", { type: () => IncentiveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IncentiveTypesResponse<IncentiveType>> {
    const incentivetypes = await this.service.findAndCount(where);
    return incentivetypes;
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypeResponse<IncentiveType>, { nullable: true })
  async findOneIncentiveType(
    @Args("where", { type: () => IncentiveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IncentiveTypeResponse<IncentiveType>> {
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
      .registerClient(IncentiveTypeResolver.name)

      .get(IncentiveTypeResolver.name),
    })
  @Query(() => IncentiveTypeResponse<IncentiveType>)
  async findOneIncentiveTypeOrFail(
    @Args("where", { type: () => IncentiveTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<IncentiveTypeResponse<IncentiveType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

