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
export class BaseAccountDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateAccount',
    example: 'Nombre de instancia CreateAccount',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateAccountDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateAccount).',
    example: 'Fecha de creación de la instancia (CreateAccount).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateAccount).',
    example: 'Fecha de actualización de la instancia (CreateAccount).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateAccount).',
    example:
      'Usuario que realiza la creación de la instancia (CreateAccount).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateAccount).',
    example: 'Estado de activación de la instancia (CreateAccount).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Razón social',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Razón social', nullable: true })
  legalName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de cuenta',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de cuenta', nullable: false })
  accountType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la cuenta',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la cuenta', nullable: false })
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
    type: () => String,
    nullable: true,
    description: 'FK soft al usuario canónico en Security',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft al usuario canónico en Security', nullable: true })
  securityUserId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft al perfil canónico en Security',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft al perfil canónico en Security', nullable: true })
  securityProfileId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Estado de sincronización con Security',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Estado de sincronización con Security', nullable: true })
  securitySyncStatus?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última sincronización exitosa con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última sincronización exitosa con Security', nullable: true })
  securitySyncedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del último snapshot sincronizado con Security',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del último snapshot sincronizado con Security', nullable: true })
  securityHash?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último error de sincronización con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último error de sincronización con Security', nullable: true })
  securityLastErrorAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento de sincronización con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento de sincronización con Security', nullable: true })
  securityLastAttemptAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Industria',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria', nullable: true })
  industry?: string = '';

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
    type: () => String,
    nullable: true,
    description: 'Teléfono principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono principal', nullable: true })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correo principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correo principal', nullable: true })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador fiscal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador fiscal', nullable: true })
  taxId?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Dirección de facturación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Dirección de facturación', nullable: true })
  billingAddress?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Dirección operativa',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Dirección operativa', nullable: true })
  shippingAddress?: Record<string, any> = {};

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Ingresos anuales estimados',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Ingresos anuales estimados', nullable: true })
  annualRevenue?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Cantidad estimada de empleados',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Cantidad estimada de empleados', nullable: true })
  employeeCount?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead origen convertido',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead origen convertido', nullable: true })
  sourceLeadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas de la cuenta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas de la cuenta', nullable: true })
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
  constructor(partial: Partial<BaseAccountDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class AccountDto extends BaseAccountDto {
  // Propiedades específicas de la clase AccountDto en cuestión

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
  constructor(partial: Partial<AccountDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AccountDto>): AccountDto {
    const instance = new AccountDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class AccountValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => AccountDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => AccountDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class AccountOutPutDto extends BaseAccountDto {
  // Propiedades específicas de la clase AccountOutPutDto en cuestión

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
  constructor(partial: Partial<AccountOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<AccountOutPutDto>): AccountOutPutDto {
    const instance = new AccountOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateAccountDto extends BaseAccountDto {
  // Propiedades específicas de la clase CreateAccountDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateAccount a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateAccountDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateAccountDto>): CreateAccountDto {
    const instance = new CreateAccountDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateAccountDto {
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
    type: () => CreateAccountDto,
    description: 'Instancia CreateAccount o UpdateAccount',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateAccountDto, { nullable: true })
  input?: CreateAccountDto | UpdateAccountDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteAccountDto {
  // Propiedades específicas de la clase DeleteAccountDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteAccount a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteAccount a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateAccountDto extends BaseAccountDto {
  // Propiedades específicas de la clase UpdateAccountDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateAccount a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateAccountDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateAccountDto>): UpdateAccountDto {
    const instance = new UpdateAccountDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



