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
export class BaseContractDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateContract',
    example: 'Nombre de instancia CreateContract',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateContractDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateContract).',
    example: 'Fecha de creación de la instancia (CreateContract).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateContract).',
    example: 'Fecha de actualización de la instancia (CreateContract).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateContract).',
    example:
      'Usuario que realiza la creación de la instancia (CreateContract).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateContract).',
    example: 'Estado de activación de la instancia (CreateContract).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número legible único del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número legible único del contrato', nullable: false })
  contractNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia al crm-client-profile.clientId',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia al crm-client-profile.clientId', nullable: false })
  clientId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Proveedor asociado (opcional)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Proveedor asociado (opcional)', nullable: true })
  providerId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión de T&C aplicada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión de T&C aplicada', nullable: false })
  termsId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Plan de suscripción aplicado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Plan de suscripción aplicado', nullable: false })
  subscriptionPlanId!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Ids de incentivos aplicados',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Ids de incentivos aplicados', nullable: true })
  appliedIncentives?: Record<string, any> = {};

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de inicio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de inicio', nullable: false })
  startDate!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fin',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fin', nullable: true })
  endDate?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Renovación automática',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Renovación automática', nullable: false })
  autoRenew!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Días del periodo de renovación',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días del periodo de renovación', nullable: true })
  renewalPeriodDays?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contrato', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de firma',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de firma', nullable: true })
  signedAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Firmado por cliente',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Firmado por cliente', nullable: false })
  signedByClient!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor total calculado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor total calculado', nullable: true })
  totalValue?: number = 0;

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
    description: 'Días globales de pago del contrato (fallback para milestones)',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días globales de pago del contrato (fallback para milestones)', nullable: true })
  paymentTermsDays?: number = 0;

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
  constructor(partial: Partial<BaseContractDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ContractDto extends BaseContractDto {
  // Propiedades específicas de la clase ContractDto en cuestión

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
  constructor(partial: Partial<ContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContractDto>): ContractDto {
    const instance = new ContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ContractValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ContractDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ContractDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ContractOutPutDto extends BaseContractDto {
  // Propiedades específicas de la clase ContractOutPutDto en cuestión

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
  constructor(partial: Partial<ContractOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContractOutPutDto>): ContractOutPutDto {
    const instance = new ContractOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateContractDto extends BaseContractDto {
  // Propiedades específicas de la clase CreateContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateContract a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateContractDto>): CreateContractDto {
    const instance = new CreateContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateContractDto {
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
    type: () => CreateContractDto,
    description: 'Instancia CreateContract o UpdateContract',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateContractDto, { nullable: true })
  input?: CreateContractDto | UpdateContractDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteContractDto {
  // Propiedades específicas de la clase DeleteContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteContract a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteContract a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateContractDto extends BaseContractDto {
  // Propiedades específicas de la clase UpdateContractDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateContract a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateContractDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateContractDto>): UpdateContractDto {
    const instance = new UpdateContractDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



