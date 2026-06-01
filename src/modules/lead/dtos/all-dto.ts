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
export class BaseLeadDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateLead',
    example: 'Nombre de instancia CreateLead',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateLeadDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateLead).',
    example: 'Fecha de creación de la instancia (CreateLead).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateLead).',
    example: 'Fecha de actualización de la instancia (CreateLead).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateLead).',
    example:
      'Usuario que realiza la creación de la instancia (CreateLead).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateLead).',
    example: 'Estado de activación de la instancia (CreateLead).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Origen del lead',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Origen del lead', nullable: false })
  source!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del lead',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del lead', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre del prospecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre del prospecto', nullable: false })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido del prospecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido del prospecto', nullable: false })
  lastName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre completo derivado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre completo derivado', nullable: true })
  fullName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correo electrónico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correo electrónico', nullable: true })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono', nullable: true })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Empresa u organización',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Empresa u organización', nullable: true })
  company?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cargo del prospecto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cargo del prospecto', nullable: true })
  jobTitle?: string = '';

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
    description: 'Industria declarada',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria declarada', nullable: true })
  industry?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Responsable comercial asignado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Responsable comercial asignado', nullable: true })
  ownerId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de asignación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de asignación', nullable: true })
  assignedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de calificación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de calificación', nullable: true })
  qualifiedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de conversión',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de conversión', nullable: true })
  convertedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Oportunidad resultante de la conversión',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Oportunidad resultante de la conversión', nullable: true })
  convertedOpportunityId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Score operativo del lead',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Score operativo del lead', nullable: true })
  score?: number = 0;

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
    type: () => String,
    nullable: true,
    description: 'Notas del equipo comercial',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas del equipo comercial', nullable: true })
  notes?: string = '';

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
  constructor(partial: Partial<BaseLeadDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class LeadDto extends BaseLeadDto {
  // Propiedades específicas de la clase LeadDto en cuestión

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
  constructor(partial: Partial<LeadDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<LeadDto>): LeadDto {
    const instance = new LeadDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class LeadValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => LeadDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => LeadDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class LeadOutPutDto extends BaseLeadDto {
  // Propiedades específicas de la clase LeadOutPutDto en cuestión

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
  constructor(partial: Partial<LeadOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<LeadOutPutDto>): LeadOutPutDto {
    const instance = new LeadOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateLeadDto extends BaseLeadDto {
  // Propiedades específicas de la clase CreateLeadDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateLead a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateLeadDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateLeadDto>): CreateLeadDto {
    const instance = new CreateLeadDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateLeadDto {
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
    type: () => CreateLeadDto,
    description: 'Instancia CreateLead o UpdateLead',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateLeadDto, { nullable: true })
  input?: CreateLeadDto | UpdateLeadDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteLeadDto {
  // Propiedades específicas de la clase DeleteLeadDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteLead a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteLead a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateLeadDto extends BaseLeadDto {
  // Propiedades específicas de la clase UpdateLeadDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateLead a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateLeadDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateLeadDto>): UpdateLeadDto {
    const instance = new UpdateLeadDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



