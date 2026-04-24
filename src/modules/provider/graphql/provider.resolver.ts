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
import { Provider } from "../entities/provider.entity";

//Definición de comandos
import {
  CreateProviderCommand,
  UpdateProviderCommand,
  DeleteProviderCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { ProviderQueryService } from "../services/providerquery.service";


import { ProviderResponse, ProvidersResponse } from "../types/provider.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateProviderDto, 
CreateOrUpdateProviderDto, 
ProviderValueInput, 
ProviderDto, 
CreateProviderDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Provider)
export class ProviderResolver {

   //Constructor del resolver de Provider
  constructor(
    private readonly service: ProviderQueryService,
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  // Mutaciones
  @Mutation(() => ProviderResponse<Provider>)
  async createProvider(
    @Args("input", { type: () => CreateProviderDto }) input: CreateProviderDto
  ): Promise<ProviderResponse<Provider>> {
    return this.commandBus.execute(new CreateProviderCommand(input));
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Mutation(() => ProviderResponse<Provider>)
  async updateProvider(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateProviderDto
  ): Promise<ProviderResponse<Provider>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateProviderCommand(payLoad, {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Mutation(() => ProviderResponse<Provider>)
  async createOrUpdateProvider(
    @Args("data", { type: () => CreateOrUpdateProviderDto })
    data: CreateOrUpdateProviderDto
  ): Promise<ProviderResponse<Provider>> {
    if (data.id) {
      const existingProvider = await this.service.findById(data.id);
      if (existingProvider) {
        return this.commandBus.execute(
          new UpdateProviderCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateProviderDto | UpdateProviderDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateProviderCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateProviderDto | UpdateProviderDto).createdBy ||
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteProvider(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteProviderCommand(id));
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  // Queries
  @Query(() => ProvidersResponse<Provider>)
  async providers(
    options?: FindManyOptions<Provider>,
    paginationArgs?: PaginationArgs
  ): Promise<ProvidersResponse<Provider>> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProvidersResponse<Provider>)
  async provider(
    @Args("id", { type: () => String }) id: string
  ): Promise<ProviderResponse<Provider>> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProvidersResponse<Provider>)
  async providersByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => ProviderValueInput }) value: ProviderValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProvidersResponse<Provider>> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProvidersResponse<Provider>)
  async providersWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<ProvidersResponse<Provider>> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => Number)
  async totalProviders(): Promise<number> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProvidersResponse<Provider>)
  async searchProviders(
    @Args("where", { type: () => ProviderDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProvidersResponse<Provider>> {
    const providers = await this.service.findAndCount(where);
    return providers;
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProviderResponse<Provider>, { nullable: true })
  async findOneProvider(
    @Args("where", { type: () => ProviderDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProviderResponse<Provider>> {
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
      .registerClient(ProviderResolver.name)

      .get(ProviderResolver.name),
    })
  @Query(() => ProviderResponse<Provider>)
  async findOneProviderOrFail(
    @Args("where", { type: () => ProviderDto, nullable: false })
    where: Record<string, any>
  ): Promise<ProviderResponse<Provider> | Error> {
    return this.service.findOneOrFail(where);
  }
}

