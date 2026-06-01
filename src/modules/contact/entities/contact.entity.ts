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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateContactDto, UpdateContactDto, DeleteContactDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_contact_email', ['email'])
@Index('idx_contact_account_id', ['accountId'])
@Index('idx_contact_security_user_id', ['securityUserId'])
@Index('idx_contact_security_profile_id', ['securityProfileId'])
@Index('idx_contact_status', ['status'])
@Check('chk_contact_email_not_blank', '"email" IS NOT NULL AND "email" <> \'\'')
@ChildEntity('contact')
@ObjectType()
export class Contact extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Contact",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Contact", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Contact' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Contact",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Contact", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Contact' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta relacionada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta relacionada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Cuenta relacionada' })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Nombre' })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Apellido' })
  lastName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre completo derivado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre completo derivado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 240, comment: 'Nombre completo derivado' })
  fullName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Correo electrónico',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Correo electrónico', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Correo electrónico' })
  email!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Teléfono' })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Móvil',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Móvil', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Móvil' })
  mobile?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cargo',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cargo', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Cargo' })
  jobTitle?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Departamento',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Departamento', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Departamento' })
  department?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Rol comercial',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Rol comercial', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'DECISION_MAKER', comment: 'Rol comercial' })
  roleType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contacto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contacto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'ACTIVE', comment: 'Estado del contacto' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Responsable comercial',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Responsable comercial', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Responsable comercial' })
  ownerId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft al usuario canónico en Security',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft al usuario canónico en Security', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'FK soft al usuario canónico en Security' })
  securityUserId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft al perfil canónico en Security',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft al perfil canónico en Security', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'FK soft al perfil canónico en Security' })
  securityProfileId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Estado de sincronización con Security',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Estado de sincronización con Security', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, default: 'LOCAL_ONLY', comment: 'Estado de sincronización con Security' })
  securitySyncStatus?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última sincronización exitosa con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última sincronización exitosa con Security', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Última sincronización exitosa con Security' })
  securitySyncedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del último snapshot sincronizado con Security',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del último snapshot sincronizado con Security', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 64, comment: 'Hash SHA-256 del último snapshot sincronizado con Security' })
  securityHash?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último error de sincronización con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último error de sincronización con Security', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último error de sincronización con Security' })
  securityLastErrorAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento de sincronización con Security',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento de sincronización con Security', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último intento de sincronización con Security' })
  securityLastAttemptAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Canal preferido',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Canal preferido', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Canal preferido' })
  preferredChannel?: string = '';

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Consentimiento email',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Consentimiento email', nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false, comment: 'Consentimiento email' })
  consentEmail?: boolean = false;

  @ApiProperty({
    type: () => Boolean,
    nullable: true,
    description: 'Consentimiento teléfono',
  })
  @IsBoolean()
  @IsOptional()
  @Field(() => Boolean, { description: 'Consentimiento teléfono', nullable: true })
  @Column({ type: 'boolean', nullable: true, default: false, comment: 'Consentimiento teléfono' })
  consentPhone?: boolean = false;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última interacción',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última interacción', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Última interacción' })
  lastInteractionAt?: Date = new Date();

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadata libre',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadata libre', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadata libre' })
  metadata?: Record<string, any> = {};

  protected executeDslLifecycle(): void {
    // Rule: contact-active-requires-account-or-owner
    // Un contacto activo debe estar vinculado a una cuenta o tener owner asignado.
    if (!(this.status === 'ACTIVE')) {
      throw new Error('CONTACT_001: Un contacto ACTIVE requiere accountId o ownerId');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'contact';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateContactDto): Contact;
  static fromDto(dto: UpdateContactDto): Contact;
  static fromDto(dto: DeleteContactDto): Contact;
  static fromDto(dto: any): Contact {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Contact, dto);
  }
}
