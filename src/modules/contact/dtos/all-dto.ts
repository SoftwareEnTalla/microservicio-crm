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
export class BaseContactDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateContact',
    example: 'Nombre de instancia CreateContact',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateContactDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateContact).',
    example: 'Fecha de creación de la instancia (CreateContact).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateContact).',
    example: 'Fecha de actualización de la instancia (CreateContact).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateContact).',
    example:
      'Usuario que realiza la creación de la instancia (CreateContact).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateContact).',
    example: 'Estado de activación de la instancia (CreateContact).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

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
    nullable: false,
    description: 'Nombre',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre', nullable: false })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido', nullable: false })
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
    nullable: false,
    description: 'Correo electrónico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Correo electrónico', nullable: false })
  email!: string;

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
    description: 'Móvil',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Móvil', nullable: true })
  mobile?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cargo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cargo', nullable: true })
  jobTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Departamento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Departamento', nullable: true })
  department?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Rol comercial',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Rol comercial', nullable: false })
  roleType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contacto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contacto', nullable: false })
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
    description: 'Canal preferido',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Canal preferido', nullable: true })
  preferredChannel?: string = '';

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Consentimiento email',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Consentimiento email', nullable: true })
  consentEmail?: boolean = false;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Consentimiento teléfono',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Consentimiento teléfono', nullable: true })
  consentPhone?: boolean = false;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última interacción',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última interacción', nullable: true })
  lastInteractionAt?: Date = new Date();

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
  constructor(partial: Partial<BaseContactDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class ContactDto extends BaseContactDto {
  // Propiedades específicas de la clase ContactDto en cuestión

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
  constructor(partial: Partial<ContactDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContactDto>): ContactDto {
    const instance = new ContactDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class ContactValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => ContactDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => ContactDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class ContactOutPutDto extends BaseContactDto {
  // Propiedades específicas de la clase ContactOutPutDto en cuestión

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
  constructor(partial: Partial<ContactOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<ContactOutPutDto>): ContactOutPutDto {
    const instance = new ContactOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateContactDto extends BaseContactDto {
  // Propiedades específicas de la clase CreateContactDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateContact a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateContactDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateContactDto>): CreateContactDto {
    const instance = new CreateContactDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateContactDto {
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
    type: () => CreateContactDto,
    description: 'Instancia CreateContact o UpdateContact',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateContactDto, { nullable: true })
  input?: CreateContactDto | UpdateContactDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteContactDto {
  // Propiedades específicas de la clase DeleteContactDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteContact a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteContact a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateContactDto extends BaseContactDto {
  // Propiedades específicas de la clase UpdateContactDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateContact a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateContactDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateContactDto>): UpdateContactDto {
    const instance = new UpdateContactDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



