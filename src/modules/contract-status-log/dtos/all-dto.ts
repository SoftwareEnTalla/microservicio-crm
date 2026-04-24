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
export class BaseContractStatusLogDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateContractStatusLog',
    example: 'Nombre de instancia CreateContractStatusLog',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateContractStatusLogDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateContractStatusLog).',
    example: 'Fecha de creación de la instancia (CreateContractStatusLog).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateContractStatusLog).',
    example: 'Fecha de actualización de la instancia (CreateContractStatusLog).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateContractStatusLog).',
    example:
      'Usuario que realiza la creación de la instancia (CreateContractStatusLog).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateContractStatusLog).',
    example: 'Estado de activación de la instancia (CreateContractStatusLog).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contrato asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contrato asociado', nullable: false })
  contractId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Estado anterior',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Estado anterior', nullable: true })
  oldStatus?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nuevo estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nuevo estado', nullable: false })
  newStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Usuario que realizó el cambio',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Usuario que realizó el cambio', nullable: true })
  changedBy?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo del cambio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo del cambio', nullable: true })
  reason?: string = '';

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
  constructor(partial: Partial<BaseContractStatusLogDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ContractStatusLogDto extends BaseContractStatusLogDto {
  // Propiedades específicas de la clase ContractStatusLogDto en cuestión

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
  constructor(partial: Partial<ContractStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContractStatusLogDto>): ContractStatusLogDto {
    const instance = new ContractStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ContractStatusLogValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ContractStatusLogDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ContractStatusLogDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ContractStatusLogOutPutDto extends BaseContractStatusLogDto {
  // Propiedades específicas de la clase ContractStatusLogOutPutDto en cuestión

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
  constructor(partial: Partial<ContractStatusLogOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContractStatusLogOutPutDto>): ContractStatusLogOutPutDto {
    const instance = new ContractStatusLogOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateContractStatusLogDto extends BaseContractStatusLogDto {
  // Propiedades específicas de la clase CreateContractStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateContractStatusLog a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateContractStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateContractStatusLogDto>): CreateContractStatusLogDto {
    const instance = new CreateContractStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateContractStatusLogDto {
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
    type: () => CreateContractStatusLogDto,
    description: 'Instancia CreateContractStatusLog o UpdateContractStatusLog',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateContractStatusLogDto, { nullable: true })
  input?: CreateContractStatusLogDto | UpdateContractStatusLogDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteContractStatusLogDto {
  // Propiedades específicas de la clase DeleteContractStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteContractStatusLog a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteContractStatusLog a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateContractStatusLogDto extends BaseContractStatusLogDto {
  // Propiedades específicas de la clase UpdateContractStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateContractStatusLog a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateContractStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateContractStatusLogDto>): UpdateContractStatusLogDto {
    const instance = new UpdateContractStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



