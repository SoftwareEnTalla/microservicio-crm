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
export class BaseActivityDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateActivity',
    example: 'Nombre de instancia CreateActivity',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateActivityDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateActivity).',
    example: 'Fecha de creación de la instancia (CreateActivity).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateActivity).',
    example: 'Fecha de actualización de la instancia (CreateActivity).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateActivity).',
    example:
      'Usuario que realiza la creación de la instancia (CreateActivity).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateActivity).',
    example: 'Estado de activación de la instancia (CreateActivity).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de actividad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de actividad', nullable: false })
  activityType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la actividad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la actividad', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Asunto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Asunto', nullable: false })
  subject!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ejecutor o responsable',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ejecutor o responsable', nullable: false })
  ownerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead relacionado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead relacionado', nullable: true })
  leadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta relacionada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta relacionada', nullable: true })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto relacionado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto relacionado', nullable: true })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Oportunidad relacionada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Oportunidad relacionada', nullable: true })
  opportunityId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha planificada',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha planificada', nullable: true })
  plannedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de inicio',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de inicio', nullable: true })
  startedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cierre', nullable: true })
  completedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Resultado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Resultado', nullable: true })
  outcome?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Prioridad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Prioridad', nullable: true })
  priority?: string = '';

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
  constructor(partial: Partial<BaseActivityDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ActivityDto extends BaseActivityDto {
  // Propiedades específicas de la clase ActivityDto en cuestión

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
  constructor(partial: Partial<ActivityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ActivityDto>): ActivityDto {
    const instance = new ActivityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ActivityValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ActivityDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ActivityDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ActivityOutPutDto extends BaseActivityDto {
  // Propiedades específicas de la clase ActivityOutPutDto en cuestión

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
  constructor(partial: Partial<ActivityOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ActivityOutPutDto>): ActivityOutPutDto {
    const instance = new ActivityOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateActivityDto extends BaseActivityDto {
  // Propiedades específicas de la clase CreateActivityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateActivity a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateActivityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateActivityDto>): CreateActivityDto {
    const instance = new CreateActivityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateActivityDto {
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
    type: () => CreateActivityDto,
    description: 'Instancia CreateActivity o UpdateActivity',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateActivityDto, { nullable: true })
  input?: CreateActivityDto | UpdateActivityDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteActivityDto {
  // Propiedades específicas de la clase DeleteActivityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteActivity a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteActivity a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateActivityDto extends BaseActivityDto {
  // Propiedades específicas de la clase UpdateActivityDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateActivity a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateActivityDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateActivityDto>): UpdateActivityDto {
    const instance = new UpdateActivityDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



