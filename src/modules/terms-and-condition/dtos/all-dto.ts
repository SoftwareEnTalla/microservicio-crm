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
export class BaseTermsAndConditionDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateTermsAndCondition',
    example: 'Nombre de instancia CreateTermsAndCondition',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateTermsAndConditionDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateTermsAndCondition).',
    example: 'Fecha de creación de la instancia (CreateTermsAndCondition).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateTermsAndCondition).',
    example: 'Fecha de actualización de la instancia (CreateTermsAndCondition).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateTermsAndCondition).',
    example:
      'Usuario que realiza la creación de la instancia (CreateTermsAndCondition).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateTermsAndCondition).',
    example: 'Estado de activación de la instancia (CreateTermsAndCondition).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión (ej. v2.1)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión (ej. v2.1)', nullable: false })
  version!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título', nullable: false })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contenido Markdown/HTML',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contenido Markdown/HTML', nullable: false })
  content!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio de vigencia',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio de vigencia', nullable: false })
  effectiveFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de vigencia', nullable: true })
  effectiveUntil?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Versión vigente (única true en cualquier instante)',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Versión vigente (única true en cualquier instante)', nullable: false })
  isCurrent!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Regla global de pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Regla global de pago', nullable: false })
  globalPaymentRule!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Días de plazo para la regla global',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días de plazo para la regla global', nullable: true })
  globalPaymentDays?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Usuario que aprobó la versión',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Usuario que aprobó la versión', nullable: true })
  approvedBy?: string;

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
  constructor(partial: Partial<BaseTermsAndConditionDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class TermsAndConditionDto extends BaseTermsAndConditionDto {
  // Propiedades específicas de la clase TermsAndConditionDto en cuestión

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
  constructor(partial: Partial<TermsAndConditionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TermsAndConditionDto>): TermsAndConditionDto {
    const instance = new TermsAndConditionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class TermsAndConditionValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => TermsAndConditionDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => TermsAndConditionDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class TermsAndConditionOutPutDto extends BaseTermsAndConditionDto {
  // Propiedades específicas de la clase TermsAndConditionOutPutDto en cuestión

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
  constructor(partial: Partial<TermsAndConditionOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<TermsAndConditionOutPutDto>): TermsAndConditionOutPutDto {
    const instance = new TermsAndConditionOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateTermsAndConditionDto extends BaseTermsAndConditionDto {
  // Propiedades específicas de la clase CreateTermsAndConditionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateTermsAndCondition a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateTermsAndConditionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateTermsAndConditionDto>): CreateTermsAndConditionDto {
    const instance = new CreateTermsAndConditionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateTermsAndConditionDto {
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
    type: () => CreateTermsAndConditionDto,
    description: 'Instancia CreateTermsAndCondition o UpdateTermsAndCondition',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateTermsAndConditionDto, { nullable: true })
  input?: CreateTermsAndConditionDto | UpdateTermsAndConditionDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteTermsAndConditionDto {
  // Propiedades específicas de la clase DeleteTermsAndConditionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteTermsAndCondition a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteTermsAndCondition a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateTermsAndConditionDto extends BaseTermsAndConditionDto {
  // Propiedades específicas de la clase UpdateTermsAndConditionDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateTermsAndCondition a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateTermsAndConditionDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateTermsAndConditionDto>): UpdateTermsAndConditionDto {
    const instance = new UpdateTermsAndConditionDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



