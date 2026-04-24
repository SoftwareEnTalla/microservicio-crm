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
import { CrmClientProfile } from "../entities/crm-client-profile.entity";

//Definición de comandos
import {
  CreateCrmClientProfileCommand,
  UpdateCrmClientProfileCommand,
  DeleteCrmClientProfileCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { CrmClientProfileQueryService } from "../services/crmclientprofilequery.service";


import { CrmClientProfileResponse, CrmClientProfilesResponse } from "../types/crmclientprofile.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateCrmClientProfileDto, 
CreateOrUpdateCrmClientProfileDto, 
CrmClientProfileValueInput, 
CrmClientProfileDto, 
CreateCrmClientProfileDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => CrmClientProfile)
export class CrmClientProfileResolver {

   //Constructor del resolver de CrmClientProfile
  constructor(
    private readonly service: CrmClientProfileQueryService,
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  // Mutaciones
  @Mutation(() => CrmClientProfileResponse<CrmClientProfile>)
  async createCrmClientProfile(
    @Args("input", { type: () => CreateCrmClientProfileDto }) input: CreateCrmClientProfileDto
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    return this.commandBus.execute(new CreateCrmClientProfileCommand(input));
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Mutation(() => CrmClientProfileResponse<CrmClientProfile>)
  async updateCrmClientProfile(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateCrmClientProfileDto
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateCrmClientProfileCommand(payLoad, {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Mutation(() => CrmClientProfileResponse<CrmClientProfile>)
  async createOrUpdateCrmClientProfile(
    @Args("data", { type: () => CreateOrUpdateCrmClientProfileDto })
    data: CreateOrUpdateCrmClientProfileDto
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
    if (data.id) {
      const existingCrmClientProfile = await this.service.findById(data.id);
      if (existingCrmClientProfile) {
        return this.commandBus.execute(
          new UpdateCrmClientProfileCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateCrmClientProfileDto | UpdateCrmClientProfileDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateCrmClientProfileCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateCrmClientProfileDto | UpdateCrmClientProfileDto).createdBy ||
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteCrmClientProfile(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteCrmClientProfileCommand(id));
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  // Queries
  @Query(() => CrmClientProfilesResponse<CrmClientProfile>)
  async crmclientprofiles(
    options?: FindManyOptions<CrmClientProfile>,
    paginationArgs?: PaginationArgs
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfilesResponse<CrmClientProfile>)
  async crmclientprofile(
    @Args("id", { type: () => String }) id: string
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfilesResponse<CrmClientProfile>)
  async crmclientprofilesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => CrmClientProfileValueInput }) value: CrmClientProfileValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfilesResponse<CrmClientProfile>)
  async crmclientprofilesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => Number)
  async totalCrmClientProfiles(): Promise<number> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfilesResponse<CrmClientProfile>)
  async searchCrmClientProfiles(
    @Args("where", { type: () => CrmClientProfileDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfilesResponse<CrmClientProfile>> {
    const crmclientprofiles = await this.service.findAndCount(where);
    return crmclientprofiles;
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfileResponse<CrmClientProfile>, { nullable: true })
  async findOneCrmClientProfile(
    @Args("where", { type: () => CrmClientProfileDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfileResponse<CrmClientProfile>> {
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
      .registerClient(CrmClientProfileResolver.name)

      .get(CrmClientProfileResolver.name),
    })
  @Query(() => CrmClientProfileResponse<CrmClientProfile>)
  async findOneCrmClientProfileOrFail(
    @Args("where", { type: () => CrmClientProfileDto, nullable: false })
    where: Record<string, any>
  ): Promise<CrmClientProfileResponse<CrmClientProfile> | Error> {
    return this.service.findOneOrFail(where);
  }
}

