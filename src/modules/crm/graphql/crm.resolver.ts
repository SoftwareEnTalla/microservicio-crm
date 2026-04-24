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
import { Crm } from "../entities/crm.entity";

//Definición de comandos
import {
  CreateCrmCommand,
  UpdateCrmCommand,
  DeleteCrmCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CrmQueryService } from "../services/crmquery.service";


import { CrmResponse, CrmsResponse } from "../types/crm.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCrmDto, 
CreateOrUpdateCrmDto, 
CrmValueInput, 
CrmDto, 
CreateCrmDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Crm)
export class CrmResolver {

   //Constructor del resolver de Crm
  constructor(
    private readonly service: CrmQueryService,
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  // Mutaciones
  @Mutation(() => CrmResponse<Crm>)
  async createCrm(
    @Args("input", { type: () => CreateCrmDto }) input: CreateCrmDto
  ): Promise<CrmResponse<Crm>> {
    return this.commandBus.execute(new CreateCrmCommand(input));
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Mutation(() => CrmResponse<Crm>)
  async updateCrm(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCrmDto
  ): Promise<CrmResponse<Crm>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCrmCommand(payLoad, {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Mutation(() => CrmResponse<Crm>)
  async createOrUpdateCrm(
    @Args("data", { type: () => CreateOrUpdateCrmDto })
    data: CreateOrUpdateCrmDto
  ): Promise<CrmResponse<Crm>> {
    if (data.id) {
      const existingCrm = await this.service.findById(data.id);
      if (existingCrm) {
        return this.commandBus.execute(
          new UpdateCrmCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCrmDto | UpdateCrmDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCrmCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCrmDto | UpdateCrmDto).createdBy ||
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCrm(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCrmCommand(id));
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  // Queries
  @Query(() => CrmsResponse<Crm>)
  async crms(
    options?: FindManyOptions<Crm>,
    paginationArgs?: PaginationArgs
  ): Promise<CrmsResponse<Crm>> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmsResponse<Crm>)
  async crm(
    @Args("id", { type: () => String }) id: string
  ): Promise<CrmResponse<Crm>> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmsResponse<Crm>)
  async crmsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CrmValueInput }) value: CrmValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmsResponse<Crm>> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmsResponse<Crm>)
  async crmsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmsResponse<Crm>> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => Number)
  async totalCrms(): Promise<number> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmsResponse<Crm>)
  async searchCrms(
    @Args("where", { type: () => CrmDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmsResponse<Crm>> {
    const crms = await this.service.findAndCount(where);
    return crms;
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmResponse<Crm>, { nullable: true })
  async findOneCrm(
    @Args("where", { type: () => CrmDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmResponse<Crm>> {
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
      .registerClient(CrmResolver.name)

      .get(CrmResolver.name),
    })
  @Query(() => CrmResponse<Crm>)
  async findOneCrmOrFail(
    @Args("where", { type: () => CrmDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmResponse<Crm> | Error> {
    return this.service.findOneOrFail(where);
  }
}

