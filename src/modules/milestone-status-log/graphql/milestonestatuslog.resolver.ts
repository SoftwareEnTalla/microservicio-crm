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
import { MilestoneStatusLog } from "../entities/milestone-status-log.entity";

//Definición de comandos
import {
  CreateMilestoneStatusLogCommand,
  UpdateMilestoneStatusLogCommand,
  DeleteMilestoneStatusLogCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MilestoneStatusLogQueryService } from "../services/milestonestatuslogquery.service";


import { MilestoneStatusLogResponse, MilestoneStatusLogsResponse } from "../types/milestonestatuslog.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMilestoneStatusLogDto, 
CreateOrUpdateMilestoneStatusLogDto, 
MilestoneStatusLogValueInput, 
MilestoneStatusLogDto, 
CreateMilestoneStatusLogDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => MilestoneStatusLog)
export class MilestoneStatusLogResolver {

   //Constructor del resolver de MilestoneStatusLog
  constructor(
    private readonly service: MilestoneStatusLogQueryService,
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  // Mutaciones
  @Mutation(() => MilestoneStatusLogResponse<MilestoneStatusLog>)
  async createMilestoneStatusLog(
    @Args("input", { type: () => CreateMilestoneStatusLogDto }) input: CreateMilestoneStatusLogDto
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog>> {
    return this.commandBus.execute(new CreateMilestoneStatusLogCommand(input));
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Mutation(() => MilestoneStatusLogResponse<MilestoneStatusLog>)
  async updateMilestoneStatusLog(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMilestoneStatusLogDto
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMilestoneStatusLogCommand(payLoad, {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Mutation(() => MilestoneStatusLogResponse<MilestoneStatusLog>)
  async createOrUpdateMilestoneStatusLog(
    @Args("data", { type: () => CreateOrUpdateMilestoneStatusLogDto })
    data: CreateOrUpdateMilestoneStatusLogDto
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog>> {
    if (data.id) {
      const existingMilestoneStatusLog = await this.service.findById(data.id);
      if (existingMilestoneStatusLog) {
        return this.commandBus.execute(
          new UpdateMilestoneStatusLogCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMilestoneStatusLogDto | UpdateMilestoneStatusLogDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMilestoneStatusLogCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMilestoneStatusLogDto | UpdateMilestoneStatusLogDto).createdBy ||
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMilestoneStatusLog(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMilestoneStatusLogCommand(id));
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  // Queries
  @Query(() => MilestoneStatusLogsResponse<MilestoneStatusLog>)
  async milestonestatuslogs(
    options?: FindManyOptions<MilestoneStatusLog>,
    paginationArgs?: PaginationArgs
  ): Promise<MilestoneStatusLogsResponse<MilestoneStatusLog>> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogsResponse<MilestoneStatusLog>)
  async milestonestatuslog(
    @Args("id", { type: () => String }) id: string
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog>> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogsResponse<MilestoneStatusLog>)
  async milestonestatuslogsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MilestoneStatusLogValueInput }) value: MilestoneStatusLogValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MilestoneStatusLogsResponse<MilestoneStatusLog>> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogsResponse<MilestoneStatusLog>)
  async milestonestatuslogsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MilestoneStatusLogsResponse<MilestoneStatusLog>> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => Number)
  async totalMilestoneStatusLogs(): Promise<number> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogsResponse<MilestoneStatusLog>)
  async searchMilestoneStatusLogs(
    @Args("where", { type: () => MilestoneStatusLogDto, nullable: false })
    where: Record<string, any>
  ): Promise<MilestoneStatusLogsResponse<MilestoneStatusLog>> {
    const milestonestatuslogs = await this.service.findAndCount(where);
    return milestonestatuslogs;
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogResponse<MilestoneStatusLog>, { nullable: true })
  async findOneMilestoneStatusLog(
    @Args("where", { type: () => MilestoneStatusLogDto, nullable: false })
    where: Record<string, any>
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog>> {
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
      .registerClient(MilestoneStatusLogResolver.name)

      .get(MilestoneStatusLogResolver.name),
    })
  @Query(() => MilestoneStatusLogResponse<MilestoneStatusLog>)
  async findOneMilestoneStatusLogOrFail(
    @Args("where", { type: () => MilestoneStatusLogDto, nullable: false })
    where: Record<string, any>
  ): Promise<MilestoneStatusLogResponse<MilestoneStatusLog> | Error> {
    return this.service.findOneOrFail(where);
  }
}

