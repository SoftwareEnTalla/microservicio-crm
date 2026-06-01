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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseQuoteDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateQuote',
    example: 'Nombre de instancia CreateQuote',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateQuoteDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateQuote).',
    example: 'Fecha de creación de la instancia (CreateQuote).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateQuote).',
    example: 'Fecha de actualización de la instancia (CreateQuote).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateQuote).',
    example:
      'Usuario que realiza la creación de la instancia (CreateQuote).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateQuote).',
    example: 'Estado de activación de la instancia (CreateQuote).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Oportunidad origen',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Oportunidad origen', nullable: false })
  opportunityId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta comercial',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta comercial', nullable: true })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto principal',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto principal', nullable: true })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de cotización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de cotización', nullable: false })
  quoteNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la cotización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la cotización', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda ISO-4217',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda ISO-4217', nullable: false })
  currency!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Subtotal',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Subtotal', nullable: true })
  subtotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento total',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento total', nullable: true })
  discountTotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Impuestos',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Impuestos', nullable: true })
  taxTotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Importe total',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Importe total', nullable: true })
  grandTotal?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigencia', nullable: true })
  validUntil?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de envío',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de envío', nullable: true })
  sentAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aceptación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aceptación', nullable: true })
  acceptedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de rechazo',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de rechazo', nullable: true })
  rejectedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Orden ERP derivada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Orden ERP derivada', nullable: true })
  erpOrderId?: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Renglones de la cotización',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Renglones de la cotización', nullable: true })
  lineItems?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadata libre',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadata libre', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseQuoteDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class QuoteDto extends BaseQuoteDto {
  // Propiedades específicas de la clase QuoteDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<QuoteDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<QuoteDto>): QuoteDto {
    const instance = new QuoteDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class QuoteValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => QuoteDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => QuoteDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class QuoteOutPutDto extends BaseQuoteDto {
  // Propiedades específicas de la clase QuoteOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<QuoteOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<QuoteOutPutDto>): QuoteOutPutDto {
    const instance = new QuoteOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateQuoteDto extends BaseQuoteDto {
  // Propiedades específicas de la clase CreateQuoteDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateQuote a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateQuoteDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateQuoteDto>): CreateQuoteDto {
    const instance = new CreateQuoteDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateQuoteDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateQuoteDto,
    description: 'Instancia CreateQuote o UpdateQuote',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateQuoteDto, { nullable: true })
  input?: CreateQuoteDto | UpdateQuoteDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteQuoteDto {
  // Propiedades específicas de la clase DeleteQuoteDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteQuote a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteQuote a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateQuoteDto extends BaseQuoteDto {
  // Propiedades específicas de la clase UpdateQuoteDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateQuote a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateQuoteDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateQuoteDto>): UpdateQuoteDto {
    const instance = new UpdateQuoteDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



