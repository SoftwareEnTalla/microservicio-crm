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
export class BasePaymentMilestoneDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreatePaymentMilestone',
    example: 'Nombre de instancia CreatePaymentMilestone',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreatePaymentMilestoneDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreatePaymentMilestone).',
    example: 'Fecha de creación de la instancia (CreatePaymentMilestone).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreatePaymentMilestone).',
    example: 'Fecha de actualización de la instancia (CreatePaymentMilestone).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreatePaymentMilestone).',
    example:
      'Usuario que realiza la creación de la instancia (CreatePaymentMilestone).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreatePaymentMilestone).',
    example: 'Estado de activación de la instancia (CreatePaymentMilestone).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contrato al que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contrato al que pertenece', nullable: false })
  contractId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título del hito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título del hito', nullable: false })
  title!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha planificada en contrato',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha planificada en contrato', nullable: false })
  scheduledDate!: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de regla de cálculo de fecha de pago',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de regla de cálculo de fecha de pago', nullable: true })
  paymentRuleType?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor en días para la regla (si aplica)',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Valor en días para la regla (si aplica)', nullable: true })
  paymentRuleValue?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Expresión segura para CUSTOM_LOGIC',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Expresión segura para CUSTOM_LOGIC', nullable: true })
  customRuleExpression?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del hito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del hito', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Monto del hito',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto del hito', nullable: true })
  amount?: number = 0;

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
    type: () => Date,
    nullable: true,
    description: 'Inicio de ejecución',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Inicio de ejecución', nullable: true })
  executionStartDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de ejecución',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de ejecución', nullable: true })
  executionEndDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aceptación por cliente',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aceptación por cliente', nullable: true })
  clientAcceptanceDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha real de pago calculada al aceptar',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha real de pago calculada al aceptar', nullable: true })
  actualPaymentDueDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Marca temporal de facturación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Marca temporal de facturación', nullable: true })
  invoicedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia a la factura externa (invoice-service)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Referencia a la factura externa (invoice-service)', nullable: true })
  invoiceId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo de rechazo del cliente',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo de rechazo del cliente', nullable: true })
  rejectionReason?: string = '';

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
  constructor(partial: Partial<BasePaymentMilestoneDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class PaymentMilestoneDto extends BasePaymentMilestoneDto {
  // Propiedades específicas de la clase PaymentMilestoneDto en cuestión

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
  constructor(partial: Partial<PaymentMilestoneDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMilestoneDto>): PaymentMilestoneDto {
    const instance = new PaymentMilestoneDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class PaymentMilestoneValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => PaymentMilestoneDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => PaymentMilestoneDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class PaymentMilestoneOutPutDto extends BasePaymentMilestoneDto {
  // Propiedades específicas de la clase PaymentMilestoneOutPutDto en cuestión

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
  constructor(partial: Partial<PaymentMilestoneOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<PaymentMilestoneOutPutDto>): PaymentMilestoneOutPutDto {
    const instance = new PaymentMilestoneOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreatePaymentMilestoneDto extends BasePaymentMilestoneDto {
  // Propiedades específicas de la clase CreatePaymentMilestoneDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreatePaymentMilestone a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreatePaymentMilestoneDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreatePaymentMilestoneDto>): CreatePaymentMilestoneDto {
    const instance = new CreatePaymentMilestoneDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdatePaymentMilestoneDto {
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
    type: () => CreatePaymentMilestoneDto,
    description: 'Instancia CreatePaymentMilestone o UpdatePaymentMilestone',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreatePaymentMilestoneDto, { nullable: true })
  input?: CreatePaymentMilestoneDto | UpdatePaymentMilestoneDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeletePaymentMilestoneDto {
  // Propiedades específicas de la clase DeletePaymentMilestoneDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeletePaymentMilestone a eliminar',
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
      'Se proporciona una lista de identificadores de DeletePaymentMilestone a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdatePaymentMilestoneDto extends BasePaymentMilestoneDto {
  // Propiedades específicas de la clase UpdatePaymentMilestoneDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdatePaymentMilestone a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdatePaymentMilestoneDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdatePaymentMilestoneDto>): UpdatePaymentMilestoneDto {
    const instance = new UpdatePaymentMilestoneDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



