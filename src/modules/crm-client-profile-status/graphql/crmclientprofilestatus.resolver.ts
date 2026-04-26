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
import { CrmClientProfileStatus } from "../entities/crm-client-profile-status.entity";

//Definición de comandos
import {
  CreateCrmClientProfileStatusCommand,
  UpdateCrmClientProfileStatusCommand,
  DeleteCrmClientProfileStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CrmClientProfileStatusQueryService } from "../services/crmclientprofilestatusquery.service";


import { CrmClientProfileStatusResponse, CrmClientProfileStatussResponse } from "../types/crmclientprofilestatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCrmClientProfileStatusDto, 
CreateOrUpdateCrmClientProfileStatusDto, 
CrmClientProfileStatusValueInput, 
CrmClientProfileStatusDto, 
CreateCrmClientProfileStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CrmClientProfileStatus)
export class CrmClientProfileStatusResolver {

   //Constructor del resolver de CrmClientProfileStatus
  constructor(
    private readonly service: CrmClientProfileStatusQueryService,
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => CrmClientProfileStatusResponse<CrmClientProfileStatus>)
  async createCrmClientProfileStatus(
    @Args("input", { type: () => CreateCrmClientProfileStatusDto }) input: CreateCrmClientProfileStatusDto
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus>> {
    return this.commandBus.execute(new CreateCrmClientProfileStatusCommand(input));
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Mutation(() => CrmClientProfileStatusResponse<CrmClientProfileStatus>)
  async updateCrmClientProfileStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCrmClientProfileStatusDto
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCrmClientProfileStatusCommand(payLoad, {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Mutation(() => CrmClientProfileStatusResponse<CrmClientProfileStatus>)
  async createOrUpdateCrmClientProfileStatus(
    @Args("data", { type: () => CreateOrUpdateCrmClientProfileStatusDto })
    data: CreateOrUpdateCrmClientProfileStatusDto
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus>> {
    if (data.id) {
      const existingCrmClientProfileStatus = await this.service.findById(data.id);
      if (existingCrmClientProfileStatus) {
        return this.commandBus.execute(
          new UpdateCrmClientProfileStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCrmClientProfileStatusDto | UpdateCrmClientProfileStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCrmClientProfileStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCrmClientProfileStatusDto | UpdateCrmClientProfileStatusDto).createdBy ||
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCrmClientProfileStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCrmClientProfileStatusCommand(id));
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  // Queries
  @Query(() => CrmClientProfileStatussResponse<CrmClientProfileStatus>)
  async crmclientprofilestatuss(
    options?: FindManyOptions<CrmClientProfileStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<CrmClientProfileStatussResponse<CrmClientProfileStatus>> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatussResponse<CrmClientProfileStatus>)
  async crmclientprofilestatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus>> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatussResponse<CrmClientProfileStatus>)
  async crmclientprofilestatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CrmClientProfileStatusValueInput }) value: CrmClientProfileStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmClientProfileStatussResponse<CrmClientProfileStatus>> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatussResponse<CrmClientProfileStatus>)
  async crmclientprofilestatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmClientProfileStatussResponse<CrmClientProfileStatus>> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => Number)
  async totalCrmClientProfileStatuss(): Promise<number> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatussResponse<CrmClientProfileStatus>)
  async searchCrmClientProfileStatuss(
    @Args("where", { type: () => CrmClientProfileStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfileStatussResponse<CrmClientProfileStatus>> {
    const crmclientprofilestatuss = await this.service.findAndCount(where);
    return crmclientprofilestatuss;
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatusResponse<CrmClientProfileStatus>, { nullable: true })
  async findOneCrmClientProfileStatus(
    @Args("where", { type: () => CrmClientProfileStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus>> {
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
      .registerClient(CrmClientProfileStatusResolver.name)

      .get(CrmClientProfileStatusResolver.name),
    })
  @Query(() => CrmClientProfileStatusResponse<CrmClientProfileStatus>)
  async findOneCrmClientProfileStatusOrFail(
    @Args("where", { type: () => CrmClientProfileStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfileStatusResponse<CrmClientProfileStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

