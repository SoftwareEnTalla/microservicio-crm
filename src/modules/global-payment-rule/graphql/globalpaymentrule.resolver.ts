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
import { GlobalPaymentRule } from "../entities/global-payment-rule.entity";

//Definición de comandos
import {
  CreateGlobalPaymentRuleCommand,
  UpdateGlobalPaymentRuleCommand,
  DeleteGlobalPaymentRuleCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { GlobalPaymentRuleQueryService } from "../services/globalpaymentrulequery.service";


import { GlobalPaymentRuleResponse, GlobalPaymentRulesResponse } from "../types/globalpaymentrule.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateGlobalPaymentRuleDto, 
CreateOrUpdateGlobalPaymentRuleDto, 
GlobalPaymentRuleValueInput, 
GlobalPaymentRuleDto, 
CreateGlobalPaymentRuleDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => GlobalPaymentRule)
export class GlobalPaymentRuleResolver {

   //Constructor del resolver de GlobalPaymentRule
  constructor(
    private readonly service: GlobalPaymentRuleQueryService,
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  // Mutaciones
  @Mutation(() => GlobalPaymentRuleResponse<GlobalPaymentRule>)
  async createGlobalPaymentRule(
    @Args("input", { type: () => CreateGlobalPaymentRuleDto }) input: CreateGlobalPaymentRuleDto
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule>> {
    return this.commandBus.execute(new CreateGlobalPaymentRuleCommand(input));
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Mutation(() => GlobalPaymentRuleResponse<GlobalPaymentRule>)
  async updateGlobalPaymentRule(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateGlobalPaymentRuleDto
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateGlobalPaymentRuleCommand(payLoad, {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Mutation(() => GlobalPaymentRuleResponse<GlobalPaymentRule>)
  async createOrUpdateGlobalPaymentRule(
    @Args("data", { type: () => CreateOrUpdateGlobalPaymentRuleDto })
    data: CreateOrUpdateGlobalPaymentRuleDto
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule>> {
    if (data.id) {
      const existingGlobalPaymentRule = await this.service.findById(data.id);
      if (existingGlobalPaymentRule) {
        return this.commandBus.execute(
          new UpdateGlobalPaymentRuleCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateGlobalPaymentRuleDto | UpdateGlobalPaymentRuleDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateGlobalPaymentRuleCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateGlobalPaymentRuleDto | UpdateGlobalPaymentRuleDto).createdBy ||
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteGlobalPaymentRule(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteGlobalPaymentRuleCommand(id));
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  // Queries
  @Query(() => GlobalPaymentRulesResponse<GlobalPaymentRule>)
  async globalpaymentrules(
    options?: FindManyOptions<GlobalPaymentRule>,
    paginationArgs?: PaginationArgs
  ): Promise<GlobalPaymentRulesResponse<GlobalPaymentRule>> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRulesResponse<GlobalPaymentRule>)
  async globalpaymentrule(
    @Args("id", { type: () => String }) id: string
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule>> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRulesResponse<GlobalPaymentRule>)
  async globalpaymentrulesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => GlobalPaymentRuleValueInput }) value: GlobalPaymentRuleValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<GlobalPaymentRulesResponse<GlobalPaymentRule>> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRulesResponse<GlobalPaymentRule>)
  async globalpaymentrulesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<GlobalPaymentRulesResponse<GlobalPaymentRule>> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => Number)
  async totalGlobalPaymentRules(): Promise<number> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRulesResponse<GlobalPaymentRule>)
  async searchGlobalPaymentRules(
    @Args("where", { type: () => GlobalPaymentRuleDto, nullable: false })
    where: Record<string, any>
  ): Promise<GlobalPaymentRulesResponse<GlobalPaymentRule>> {
    const globalpaymentrules = await this.service.findAndCount(where);
    return globalpaymentrules;
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRuleResponse<GlobalPaymentRule>, { nullable: true })
  async findOneGlobalPaymentRule(
    @Args("where", { type: () => GlobalPaymentRuleDto, nullable: false })
    where: Record<string, any>
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule>> {
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
      .registerClient(GlobalPaymentRuleResolver.name)

      .get(GlobalPaymentRuleResolver.name),
    })
  @Query(() => GlobalPaymentRuleResponse<GlobalPaymentRule>)
  async findOneGlobalPaymentRuleOrFail(
    @Args("where", { type: () => GlobalPaymentRuleDto, nullable: false })
    where: Record<string, any>
  ): Promise<GlobalPaymentRuleResponse<GlobalPaymentRule> | Error> {
    return this.service.findOneOrFail(where);
  }
}

