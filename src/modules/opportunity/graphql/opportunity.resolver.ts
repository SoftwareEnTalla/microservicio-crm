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
import { Opportunity } from "../entities/opportunity.entity";

//Definición de comandos
import {
  CreateOpportunityCommand,
  UpdateOpportunityCommand,
  DeleteOpportunityCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { OpportunityQueryService } from "../services/opportunityquery.service";


import { OpportunityResponse, OpportunitysResponse } from "../types/opportunity.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateOpportunityDto, 
CreateOrUpdateOpportunityDto, 
OpportunityValueInput, 
OpportunityDto, 
CreateOpportunityDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Opportunity)
export class OpportunityResolver {

   //Constructor del resolver de Opportunity
  constructor(
    private readonly service: OpportunityQueryService,
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  // Mutaciones
  @Mutation(() => OpportunityResponse<Opportunity>)
  async createOpportunity(
    @Args("input", { type: () => CreateOpportunityDto }) input: CreateOpportunityDto
  ): Promise<OpportunityResponse<Opportunity>> {
    return this.commandBus.execute(new CreateOpportunityCommand(input));
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Mutation(() => OpportunityResponse<Opportunity>)
  async updateOpportunity(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateOpportunityDto
  ): Promise<OpportunityResponse<Opportunity>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateOpportunityCommand(payLoad, {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Mutation(() => OpportunityResponse<Opportunity>)
  async createOrUpdateOpportunity(
    @Args("data", { type: () => CreateOrUpdateOpportunityDto })
    data: CreateOrUpdateOpportunityDto
  ): Promise<OpportunityResponse<Opportunity>> {
    if (data.id) {
      const existingOpportunity = await this.service.findById(data.id);
      if (existingOpportunity) {
        return this.commandBus.execute(
          new UpdateOpportunityCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateOpportunityDto | UpdateOpportunityDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateOpportunityCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateOpportunityDto | UpdateOpportunityDto).createdBy ||
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteOpportunity(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteOpportunityCommand(id));
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  // Queries
  @Query(() => OpportunitysResponse<Opportunity>)
  async opportunitys(
    options?: FindManyOptions<Opportunity>,
    paginationArgs?: PaginationArgs
  ): Promise<OpportunitysResponse<Opportunity>> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunitysResponse<Opportunity>)
  async opportunity(
    @Args("id", { type: () => String }) id: string
  ): Promise<OpportunityResponse<Opportunity>> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunitysResponse<Opportunity>)
  async opportunitysByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => OpportunityValueInput }) value: OpportunityValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OpportunitysResponse<Opportunity>> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunitysResponse<Opportunity>)
  async opportunitysWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<OpportunitysResponse<Opportunity>> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => Number)
  async totalOpportunitys(): Promise<number> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunitysResponse<Opportunity>)
  async searchOpportunitys(
    @Args("where", { type: () => OpportunityDto, nullable: false })
    where: Record<string, any>
  ): Promise<OpportunitysResponse<Opportunity>> {
    const opportunitys = await this.service.findAndCount(where);
    return opportunitys;
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunityResponse<Opportunity>, { nullable: true })
  async findOneOpportunity(
    @Args("where", { type: () => OpportunityDto, nullable: false })
    where: Record<string, any>
  ): Promise<OpportunityResponse<Opportunity>> {
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
      .registerClient(OpportunityResolver.name)

      .get(OpportunityResolver.name),
    })
  @Query(() => OpportunityResponse<Opportunity>)
  async findOneOpportunityOrFail(
    @Args("where", { type: () => OpportunityDto, nullable: false })
    where: Record<string, any>
  ): Promise<OpportunityResponse<Opportunity> | Error> {
    return this.service.findOneOrFail(where);
  }
}

