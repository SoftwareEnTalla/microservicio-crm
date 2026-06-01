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
import { Quote } from "../entities/quote.entity";

//Definición de comandos
import {
  CreateQuoteCommand,
  UpdateQuoteCommand,
  DeleteQuoteCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { QuoteQueryService } from "../services/quotequery.service";


import { QuoteResponse, QuotesResponse } from "../types/quote.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateQuoteDto, 
CreateOrUpdateQuoteDto, 
QuoteValueInput, 
QuoteDto, 
CreateQuoteDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Quote)
export class QuoteResolver {

   //Constructor del resolver de Quote
  constructor(
    private readonly service: QuoteQueryService,
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  // Mutaciones
  @Mutation(() => QuoteResponse<Quote>)
  async createQuote(
    @Args("input", { type: () => CreateQuoteDto }) input: CreateQuoteDto
  ): Promise<QuoteResponse<Quote>> {
    return this.commandBus.execute(new CreateQuoteCommand(input));
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Mutation(() => QuoteResponse<Quote>)
  async updateQuote(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateQuoteDto
  ): Promise<QuoteResponse<Quote>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateQuoteCommand(payLoad, {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Mutation(() => QuoteResponse<Quote>)
  async createOrUpdateQuote(
    @Args("data", { type: () => CreateOrUpdateQuoteDto })
    data: CreateOrUpdateQuoteDto
  ): Promise<QuoteResponse<Quote>> {
    if (data.id) {
      const existingQuote = await this.service.findById(data.id);
      if (existingQuote) {
        return this.commandBus.execute(
          new UpdateQuoteCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateQuoteDto | UpdateQuoteDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateQuoteCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateQuoteDto | UpdateQuoteDto).createdBy ||
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteQuote(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteQuoteCommand(id));
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  // Queries
  @Query(() => QuotesResponse<Quote>)
  async quotes(
    options?: FindManyOptions<Quote>,
    paginationArgs?: PaginationArgs
  ): Promise<QuotesResponse<Quote>> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuotesResponse<Quote>)
  async quote(
    @Args("id", { type: () => String }) id: string
  ): Promise<QuoteResponse<Quote>> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuotesResponse<Quote>)
  async quotesByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => QuoteValueInput }) value: QuoteValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<QuotesResponse<Quote>> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuotesResponse<Quote>)
  async quotesWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<QuotesResponse<Quote>> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => Number)
  async totalQuotes(): Promise<number> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuotesResponse<Quote>)
  async searchQuotes(
    @Args("where", { type: () => QuoteDto, nullable: false })
    where: Record<string, any>
  ): Promise<QuotesResponse<Quote>> {
    const quotes = await this.service.findAndCount(where);
    return quotes;
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuoteResponse<Quote>, { nullable: true })
  async findOneQuote(
    @Args("where", { type: () => QuoteDto, nullable: false })
    where: Record<string, any>
  ): Promise<QuoteResponse<Quote>> {
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
      .registerClient(QuoteResolver.name)

      .get(QuoteResolver.name),
    })
  @Query(() => QuoteResponse<Quote>)
  async findOneQuoteOrFail(
    @Args("where", { type: () => QuoteDto, nullable: false })
    where: Record<string, any>
  ): Promise<QuoteResponse<Quote> | Error> {
    return this.service.findOneOrFail(where);
  }
}

