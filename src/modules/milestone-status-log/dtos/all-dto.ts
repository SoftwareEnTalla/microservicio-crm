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
export class BaseMilestoneStatusLogDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateMilestoneStatusLog',
    example: 'Nombre de instancia CreateMilestoneStatusLog',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateMilestoneStatusLogDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateMilestoneStatusLog).',
    example: 'Fecha de creación de la instancia (CreateMilestoneStatusLog).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateMilestoneStatusLog).',
    example: 'Fecha de actualización de la instancia (CreateMilestoneStatusLog).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateMilestoneStatusLog).',
    example:
      'Usuario que realiza la creación de la instancia (CreateMilestoneStatusLog).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateMilestoneStatusLog).',
    example: 'Estado de activación de la instancia (CreateMilestoneStatusLog).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Hito asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Hito asociado', nullable: false })
  paymentMilestoneId!: string;

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
  constructor(partial: Partial<BaseMilestoneStatusLogDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class MilestoneStatusLogDto extends BaseMilestoneStatusLogDto {
  // Propiedades específicas de la clase MilestoneStatusLogDto en cuestión

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
  constructor(partial: Partial<MilestoneStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MilestoneStatusLogDto>): MilestoneStatusLogDto {
    const instance = new MilestoneStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class MilestoneStatusLogValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => MilestoneStatusLogDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => MilestoneStatusLogDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class MilestoneStatusLogOutPutDto extends BaseMilestoneStatusLogDto {
  // Propiedades específicas de la clase MilestoneStatusLogOutPutDto en cuestión

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
  constructor(partial: Partial<MilestoneStatusLogOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MilestoneStatusLogOutPutDto>): MilestoneStatusLogOutPutDto {
    const instance = new MilestoneStatusLogOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateMilestoneStatusLogDto extends BaseMilestoneStatusLogDto {
  // Propiedades específicas de la clase CreateMilestoneStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateMilestoneStatusLog a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateMilestoneStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateMilestoneStatusLogDto>): CreateMilestoneStatusLogDto {
    const instance = new CreateMilestoneStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateMilestoneStatusLogDto {
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
    type: () => CreateMilestoneStatusLogDto,
    description: 'Instancia CreateMilestoneStatusLog o UpdateMilestoneStatusLog',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateMilestoneStatusLogDto, { nullable: true })
  input?: CreateMilestoneStatusLogDto | UpdateMilestoneStatusLogDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteMilestoneStatusLogDto {
  // Propiedades específicas de la clase DeleteMilestoneStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteMilestoneStatusLog a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteMilestoneStatusLog a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateMilestoneStatusLogDto extends BaseMilestoneStatusLogDto {
  // Propiedades específicas de la clase UpdateMilestoneStatusLogDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateMilestoneStatusLog a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateMilestoneStatusLogDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateMilestoneStatusLogDto>): UpdateMilestoneStatusLogDto {
    const instance = new UpdateMilestoneStatusLogDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



