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
import { SubscriptionPlan } from "../entities/subscription-plan.entity";

//Definición de comandos
import {
  CreateSubscriptionPlanCommand,
  UpdateSubscriptionPlanCommand,
  DeleteSubscriptionPlanCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { SubscriptionPlanQueryService } from "../services/subscriptionplanquery.service";


import { SubscriptionPlanResponse, SubscriptionPlansResponse } from "../types/subscriptionplan.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateSubscriptionPlanDto, 
CreateOrUpdateSubscriptionPlanDto, 
SubscriptionPlanValueInput, 
SubscriptionPlanDto, 
CreateSubscriptionPlanDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => SubscriptionPlan)
export class SubscriptionPlanResolver {

   //Constructor del resolver de SubscriptionPlan
  constructor(
    private readonly service: SubscriptionPlanQueryService,
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  // Mutaciones
  @Mutation(() => SubscriptionPlanResponse<SubscriptionPlan>)
  async createSubscriptionPlan(
    @Args("input", { type: () => CreateSubscriptionPlanDto }) input: CreateSubscriptionPlanDto
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
    return this.commandBus.execute(new CreateSubscriptionPlanCommand(input));
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Mutation(() => SubscriptionPlanResponse<SubscriptionPlan>)
  async updateSubscriptionPlan(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateSubscriptionPlanDto
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateSubscriptionPlanCommand(payLoad, {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Mutation(() => SubscriptionPlanResponse<SubscriptionPlan>)
  async createOrUpdateSubscriptionPlan(
    @Args("data", { type: () => CreateOrUpdateSubscriptionPlanDto })
    data: CreateOrUpdateSubscriptionPlanDto
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
    if (data.id) {
      const existingSubscriptionPlan = await this.service.findById(data.id);
      if (existingSubscriptionPlan) {
        return this.commandBus.execute(
          new UpdateSubscriptionPlanCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateSubscriptionPlanCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto).createdBy ||
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteSubscriptionPlan(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteSubscriptionPlanCommand(id));
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  // Queries
  @Query(() => SubscriptionPlansResponse<SubscriptionPlan>)
  async subscriptionplans(
    options?: FindManyOptions<SubscriptionPlan>,
    paginationArgs?: PaginationArgs
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlansResponse<SubscriptionPlan>)
  async subscriptionplan(
    @Args("id", { type: () => String }) id: string
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlansResponse<SubscriptionPlan>)
  async subscriptionplansByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => SubscriptionPlanValueInput }) value: SubscriptionPlanValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlansResponse<SubscriptionPlan>)
  async subscriptionplansWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => Number)
  async totalSubscriptionPlans(): Promise<number> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlansResponse<SubscriptionPlan>)
  async searchSubscriptionPlans(
    @Args("where", { type: () => SubscriptionPlanDto, nullable: false })
    where: Record<string, any>
  ): Promise<SubscriptionPlansResponse<SubscriptionPlan>> {
    const subscriptionplans = await this.service.findAndCount(where);
    return subscriptionplans;
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlanResponse<SubscriptionPlan>, { nullable: true })
  async findOneSubscriptionPlan(
    @Args("where", { type: () => SubscriptionPlanDto, nullable: false })
    where: Record<string, any>
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan>> {
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
      .registerClient(SubscriptionPlanResolver.name)

      .get(SubscriptionPlanResolver.name),
    })
  @Query(() => SubscriptionPlanResponse<SubscriptionPlan>)
  async findOneSubscriptionPlanOrFail(
    @Args("where", { type: () => SubscriptionPlanDto, nullable: false })
    where: Record<string, any>
  ): Promise<SubscriptionPlanResponse<SubscriptionPlan> | Error> {
    return this.service.findOneOrFail(where);
  }
}

