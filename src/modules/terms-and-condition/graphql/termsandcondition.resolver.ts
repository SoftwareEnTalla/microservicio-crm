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
import { TermsAndCondition } from "../entities/terms-and-condition.entity";

//Definición de comandos
import {
  CreateTermsAndConditionCommand,
  UpdateTermsAndConditionCommand,
  DeleteTermsAndConditionCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { TermsAndConditionQueryService } from "../services/termsandconditionquery.service";


import { TermsAndConditionResponse, TermsAndConditionsResponse } from "../types/termsandcondition.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateTermsAndConditionDto, 
CreateOrUpdateTermsAndConditionDto, 
TermsAndConditionValueInput, 
TermsAndConditionDto, 
CreateTermsAndConditionDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => TermsAndCondition)
export class TermsAndConditionResolver {

   //Constructor del resolver de TermsAndCondition
  constructor(
    private readonly service: TermsAndConditionQueryService,
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  // Mutaciones
  @Mutation(() => TermsAndConditionResponse<TermsAndCondition>)
  async createTermsAndCondition(
    @Args("input", { type: () => CreateTermsAndConditionDto }) input: CreateTermsAndConditionDto
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    return this.commandBus.execute(new CreateTermsAndConditionCommand(input));
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Mutation(() => TermsAndConditionResponse<TermsAndCondition>)
  async updateTermsAndCondition(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateTermsAndConditionDto
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateTermsAndConditionCommand(payLoad, {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Mutation(() => TermsAndConditionResponse<TermsAndCondition>)
  async createOrUpdateTermsAndCondition(
    @Args("data", { type: () => CreateOrUpdateTermsAndConditionDto })
    data: CreateOrUpdateTermsAndConditionDto
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
    if (data.id) {
      const existingTermsAndCondition = await this.service.findById(data.id);
      if (existingTermsAndCondition) {
        return this.commandBus.execute(
          new UpdateTermsAndConditionCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateTermsAndConditionDto | UpdateTermsAndConditionDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateTermsAndConditionCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateTermsAndConditionDto | UpdateTermsAndConditionDto).createdBy ||
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteTermsAndCondition(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteTermsAndConditionCommand(id));
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  // Queries
  @Query(() => TermsAndConditionsResponse<TermsAndCondition>)
  async termsandconditions(
    options?: FindManyOptions<TermsAndCondition>,
    paginationArgs?: PaginationArgs
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionsResponse<TermsAndCondition>)
  async termsandcondition(
    @Args("id", { type: () => String }) id: string
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionsResponse<TermsAndCondition>)
  async termsandconditionsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => TermsAndConditionValueInput }) value: TermsAndConditionValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionsResponse<TermsAndCondition>)
  async termsandconditionsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => Number)
  async totalTermsAndConditions(): Promise<number> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionsResponse<TermsAndCondition>)
  async searchTermsAndConditions(
    @Args("where", { type: () => TermsAndConditionDto, nullable: false })
    where: Record<string, any>
  ): Promise<TermsAndConditionsResponse<TermsAndCondition>> {
    const termsandconditions = await this.service.findAndCount(where);
    return termsandconditions;
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionResponse<TermsAndCondition>, { nullable: true })
  async findOneTermsAndCondition(
    @Args("where", { type: () => TermsAndConditionDto, nullable: false })
    where: Record<string, any>
  ): Promise<TermsAndConditionResponse<TermsAndCondition>> {
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
      .registerClient(TermsAndConditionResolver.name)

      .get(TermsAndConditionResolver.name),
    })
  @Query(() => TermsAndConditionResponse<TermsAndCondition>)
  async findOneTermsAndConditionOrFail(
    @Args("where", { type: () => TermsAndConditionDto, nullable: false })
    where: Record<string, any>
  ): Promise<TermsAndConditionResponse<TermsAndCondition> | Error> {
    return this.service.findOneOrFail(where);
  }
}

