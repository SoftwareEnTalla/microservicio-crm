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
export class BaseProviderDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateProvider',
    example: 'Nombre de instancia CreateProvider',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateProviderDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateProvider).',
    example: 'Fecha de creación de la instancia (CreateProvider).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateProvider).',
    example: 'Fecha de actualización de la instancia (CreateProvider).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateProvider).',
    example:
      'Usuario que realiza la creación de la instancia (CreateProvider).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateProvider).',
    example: 'Estado de activación de la instancia (CreateProvider).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'NIF/CIF único',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'NIF/CIF único', nullable: false })
  taxId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de persona: natural hereda de hrms:person directamente; jurídica referencia contactPersonId',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de persona: natural hereda de hrms:person directamente; jurídica referencia contactPersonId', nullable: false })
  personType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sitio web',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Sitio web', nullable: true })
  website?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Rating 0..5',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Rating 0..5', nullable: true })
  rating?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del proveedor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del proveedor', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Dirección',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Dirección', nullable: true })
  address?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Ciudad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Ciudad', nullable: true })
  city?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'País ISO-3166-1 alpha-2',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'País ISO-3166-1 alpha-2', nullable: true })
  country?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código postal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código postal', nullable: true })
  postalCode?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadata libre',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadata libre', nullable: true })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft a hrms:person canónica del provider (caso persona natural)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft a hrms:person canónica del provider (caso persona natural)', nullable: true })
  personId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft a hrms:person del contacto comercial (caso persona jurídica)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft a hrms:person del contacto comercial (caso persona jurídica)', nullable: true })
  contactPersonId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre — mirror de hrms:person', nullable: true })
  firstName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Apellido — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Apellido — mirror de hrms:person', nullable: true })
  lastName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de documento — mirror de hrms:person', nullable: true })
  documentType?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de documento — mirror de hrms:person', nullable: true })
  documentNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Persona de contacto — mirror (displayName de hrms:person via contactPersonId)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Persona de contacto — mirror (displayName de hrms:person via contactPersonId)', nullable: true })
  contactPerson?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Email de contacto — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Email de contacto — mirror de hrms:person', nullable: true })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono de contacto — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono de contacto — mirror de hrms:person', nullable: true })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de sincronización con el upstream hrms:person',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de sincronización con el upstream hrms:person', nullable: false })
  upstreamSyncStatus!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última sincronización exitosa con upstream',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última sincronización exitosa con upstream', nullable: true })
  upstreamSyncedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del snapshot mirror recibido del upstream',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del snapshot mirror recibido del upstream', nullable: true })
  upstreamHash?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento fallido de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento fallido de sincronización', nullable: true })
  upstreamLastErrorAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento (ok o ko) de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento (ok o ko) de sincronización', nullable: true })
  upstreamLastAttemptAt?: Date = new Date();

  // Constructor
  constructor(partial: Partial<BaseProviderDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ProviderDto extends BaseProviderDto {
  // Propiedades específicas de la clase ProviderDto en cuestión

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
  constructor(partial: Partial<ProviderDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProviderDto>): ProviderDto {
    const instance = new ProviderDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ProviderValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ProviderDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ProviderDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ProviderOutPutDto extends BaseProviderDto {
  // Propiedades específicas de la clase ProviderOutPutDto en cuestión

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
  constructor(partial: Partial<ProviderOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ProviderOutPutDto>): ProviderOutPutDto {
    const instance = new ProviderOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateProviderDto extends BaseProviderDto {
  // Propiedades específicas de la clase CreateProviderDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateProvider a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateProviderDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateProviderDto>): CreateProviderDto {
    const instance = new CreateProviderDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateProviderDto {
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
    type: () => CreateProviderDto,
    description: 'Instancia CreateProvider o UpdateProvider',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateProviderDto, { nullable: true })
  input?: CreateProviderDto | UpdateProviderDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteProviderDto {
  // Propiedades específicas de la clase DeleteProviderDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteProvider a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteProvider a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateProviderDto extends BaseProviderDto {
  // Propiedades específicas de la clase UpdateProviderDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateProvider a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateProviderDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateProviderDto>): UpdateProviderDto {
    const instance = new UpdateProviderDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



