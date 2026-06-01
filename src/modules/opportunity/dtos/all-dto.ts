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
export class BaseOpportunityDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateOpportunity',
    example: 'Nombre de instancia CreateOpportunity',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateOpportunityDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateOpportunity).',
    example: 'Fecha de creación de la instancia (CreateOpportunity).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateOpportunity).',
    example: 'Fecha de actualización de la instancia (CreateOpportunity).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateOpportunity).',
    example:
      'Usuario que realiza la creación de la instancia (CreateOpportunity).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateOpportunity).',
    example: 'Estado de activación de la instancia (CreateOpportunity).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead origen',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead origen', nullable: true })
  leadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta comercial asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta comercial asociada', nullable: true })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto principal asociado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto principal asociado', nullable: true })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título de la oportunidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título de la oportunidad', nullable: false })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etapa del pipeline',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etapa del pipeline', nullable: false })
  stage!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la oportunidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la oportunidad', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Responsable comercial',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Responsable comercial', nullable: true })
  ownerId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha esperada de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha esperada de cierre', nullable: true })
  expectedCloseDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cierre', nullable: true })
  closedAt?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor estimado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor estimado', nullable: true })
  estimatedValue?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor ponderado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor ponderado', nullable: true })
  weightedValue?: number = 0;

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
    description: 'Probabilidad de cierre 0..100',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Probabilidad de cierre 0..100', nullable: true })
  probability?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Categoría de forecast',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Categoría de forecast', nullable: true })
  forecastCategory?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo de pérdida',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo de pérdida', nullable: true })
  lossReason?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sales order creada en ERP al ganar',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Sales order creada en ERP al ganar', nullable: true })
  wonOrderId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Próxima acción comercial',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Próxima acción comercial', nullable: true })
  nextActionAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Etiquetas comerciales',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Etiquetas comerciales', nullable: true })
  tags?: Record<string, any> = {};

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
  constructor(partial: Partial<BaseOpportunityDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class OpportunityDto extends BaseOpportunityDto {
  // Propiedades específicas de la clase OpportunityDto en cuestión

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
  constructor(partial: Partial<OpportunityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OpportunityDto>): OpportunityDto {
    const instance = new OpportunityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class OpportunityValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => OpportunityDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => OpportunityDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class OpportunityOutPutDto extends BaseOpportunityDto {
  // Propiedades específicas de la clase OpportunityOutPutDto en cuestión

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
  constructor(partial: Partial<OpportunityOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<OpportunityOutPutDto>): OpportunityOutPutDto {
    const instance = new OpportunityOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOpportunityDto extends BaseOpportunityDto {
  // Propiedades específicas de la clase CreateOpportunityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateOpportunity a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateOpportunityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateOpportunityDto>): CreateOpportunityDto {
    const instance = new CreateOpportunityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateOpportunityDto {
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
    type: () => CreateOpportunityDto,
    description: 'Instancia CreateOpportunity o UpdateOpportunity',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateOpportunityDto, { nullable: true })
  input?: CreateOpportunityDto | UpdateOpportunityDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteOpportunityDto {
  // Propiedades específicas de la clase DeleteOpportunityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteOpportunity a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteOpportunity a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateOpportunityDto extends BaseOpportunityDto {
  // Propiedades específicas de la clase UpdateOpportunityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateOpportunity a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateOpportunityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateOpportunityDto>): UpdateOpportunityDto {
    const instance = new UpdateOpportunityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



