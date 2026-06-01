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
import { CreateAccountDto, UpdateAccountDto, DeleteAccountDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_account_status', ['status'])
@Index('idx_account_owner_id', ['ownerId'])
@Index('idx_account_security_user_id', ['securityUserId'])
@Index('idx_account_security_profile_id', ['securityProfileId'])
@Index('idx_account_tax_id', ['taxId'])
@Index('idx_account_email', ['email'])
@Check('chk_account_annual_revenue_non_negative', '"annualRevenue" IS NULL OR "annualRevenue" >= 0')
@Check('chk_account_employee_count_non_negative', '"employeeCount" IS NULL OR "employeeCount" >= 0')
@ChildEntity('account')
@ObjectType()
export class Account extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Account",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Account", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Account' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Account",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Account", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Account' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Razón social',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Razón social', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 220, comment: 'Razón social' })
  legalName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de cuenta',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de cuenta', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'CUSTOMER', comment: 'Tipo de cuenta' })
  accountType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la cuenta',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la cuenta', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'ACTIVE', comment: 'Estado de la cuenta' })
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
    description: 'Industria',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Industria' })
  industry?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sitio web',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Sitio web', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Sitio web' })
  website?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono principal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Teléfono principal' })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Correo principal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correo principal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Correo principal' })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador fiscal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador fiscal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 60, comment: 'Identificador fiscal' })
  taxId?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Dirección de facturación',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Dirección de facturación', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Dirección de facturación' })
  billingAddress?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Dirección operativa',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Dirección operativa', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Dirección operativa' })
  shippingAddress?: Record<string, any> = {};

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Ingresos anuales estimados',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Ingresos anuales estimados', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Ingresos anuales estimados' })
  annualRevenue?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Cantidad estimada de empleados',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Cantidad estimada de empleados', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Cantidad estimada de empleados' })
  employeeCount?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead origen convertido',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead origen convertido', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Lead origen convertido' })
  sourceLeadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas de la cuenta',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas de la cuenta', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Notas de la cuenta' })
  notes?: string = '';

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
    // Rule: customer-account-requires-owner
    // Una cuenta de cliente debe tener owner asignado.
    if (!((!(this.accountType === 'CUSTOMER') || (!(this.ownerId === undefined || this.ownerId === null || (typeof this.ownerId === 'string' && String(this.ownerId).trim() === '') || (Array.isArray(this.ownerId) && this.ownerId.length === 0) || (typeof this.ownerId === 'object' && !Array.isArray(this.ownerId) && Object.prototype.toString.call(this.ownerId) === '[object Object]' && Object.keys(Object(this.ownerId)).length === 0)))))) {
      throw new Error('ACCOUNT_001: Una cuenta CUSTOMER requiere ownerId');
    }

    // Rule: inactive-account-requires-status
    // Una cuenta inactiva debe reflejar status INACTIVE.
    if (!(!(this.status === undefined || this.status === null || (typeof this.status === 'string' && String(this.status).trim() === '') || (Array.isArray(this.status) && this.status.length === 0) || (typeof this.status === 'object' && !Array.isArray(this.status) && Object.prototype.toString.call(this.status) === '[object Object]' && Object.keys(Object(this.status)).length === 0)))) {
      throw new Error('ACCOUNT_002: La cuenta debe tener un status válido');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'account';
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
  static fromDto(dto: CreateAccountDto): Account;
  static fromDto(dto: UpdateAccountDto): Account;
  static fromDto(dto: DeleteAccountDto): Account;
  static fromDto(dto: any): Account {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Account, dto);
  }
}
