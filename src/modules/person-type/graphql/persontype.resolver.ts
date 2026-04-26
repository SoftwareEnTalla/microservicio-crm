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
import { PersonType } from "../entities/person-type.entity";

//Definición de comandos
import {
  CreatePersonTypeCommand,
  UpdatePersonTypeCommand,
  DeletePersonTypeCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { PersonTypeQueryService } from "../services/persontypequery.service";


import { PersonTypeResponse, PersonTypesResponse } from "../types/persontype.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdatePersonTypeDto, 
CreateOrUpdatePersonTypeDto, 
PersonTypeValueInput, 
PersonTypeDto, 
CreatePersonTypeDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => PersonType)
export class PersonTypeResolver {

   //Constructor del resolver de PersonType
  constructor(
    private readonly service: PersonTypeQueryService,
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  // Mutaciones
  @Mutation(() => PersonTypeResponse<PersonType>)
  async createPersonType(
    @Args("input", { type: () => CreatePersonTypeDto }) input: CreatePersonTypeDto
  ): Promise<PersonTypeResponse<PersonType>> {
    return this.commandBus.execute(new CreatePersonTypeCommand(input));
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Mutation(() => PersonTypeResponse<PersonType>)
  async updatePersonType(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdatePersonTypeDto
  ): Promise<PersonTypeResponse<PersonType>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdatePersonTypeCommand(payLoad, {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Mutation(() => PersonTypeResponse<PersonType>)
  async createOrUpdatePersonType(
    @Args("data", { type: () => CreateOrUpdatePersonTypeDto })
    data: CreateOrUpdatePersonTypeDto
  ): Promise<PersonTypeResponse<PersonType>> {
    if (data.id) {
      const existingPersonType = await this.service.findById(data.id);
      if (existingPersonType) {
        return this.commandBus.execute(
          new UpdatePersonTypeCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreatePersonTypeDto | UpdatePersonTypeDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreatePersonTypeCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreatePersonTypeDto | UpdatePersonTypeDto).createdBy ||
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Mutation(() => Boolean)
  async deletePersonType(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeletePersonTypeCommand(id));
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  // Queries
  @Query(() => PersonTypesResponse<PersonType>)
  async persontypes(
    options?: FindManyOptions<PersonType>,
    paginationArgs?: PaginationArgs
  ): Promise<PersonTypesResponse<PersonType>> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypesResponse<PersonType>)
  async persontype(
    @Args("id", { type: () => String }) id: string
  ): Promise<PersonTypeResponse<PersonType>> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypesResponse<PersonType>)
  async persontypesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => PersonTypeValueInput }) value: PersonTypeValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonTypesResponse<PersonType>> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypesResponse<PersonType>)
  async persontypesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<PersonTypesResponse<PersonType>> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => Number)
  async totalPersonTypes(): Promise<number> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypesResponse<PersonType>)
  async searchPersonTypes(
    @Args("where", { type: () => PersonTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonTypesResponse<PersonType>> {
    const persontypes = await this.service.findAndCount(where);
    return persontypes;
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypeResponse<PersonType>, { nullable: true })
  async findOnePersonType(
    @Args("where", { type: () => PersonTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonTypeResponse<PersonType>> {
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
      .registerClient(PersonTypeResolver.name)

      .get(PersonTypeResolver.name),
    })
  @Query(() => PersonTypeResponse<PersonType>)
  async findOnePersonTypeOrFail(
    @Args("where", { type: () => PersonTypeDto, nullable: false })
    where: Record<string, any>
  ): Promise<PersonTypeResponse<PersonType> | Error> {
    return this.service.findOneOrFail(where);
  }
}

