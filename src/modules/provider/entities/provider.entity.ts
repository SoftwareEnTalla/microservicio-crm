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
import { CreateProviderDto, UpdateProviderDto, DeleteProviderDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_provider_tax_id', ['taxId'], { unique: true })
@Index('idx_provider_status', ['status'])
@Unique('uq_provider_tax_id', ['taxId'])
@Check('chk_provider_rating_range', '"rating" >= 0 AND "rating" <= 5')
@ChildEntity('provider')
@ObjectType()
export class Provider extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Provider",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Provider", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Provider' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Provider",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Provider", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Provider' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'NIF/CIF único',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'NIF/CIF único', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, unique: true, comment: 'NIF/CIF único' })
  taxId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de persona: natural hereda de hrms:person directamente; jurídica referencia contactPersonId',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de persona: natural hereda de hrms:person directamente; jurídica referencia contactPersonId', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'JURIDICAL', comment: 'Tipo de persona: natural hereda de hrms:person directamente; jurídica referencia contactPersonId' })
  personType!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sitio web',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Sitio web', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 200, comment: 'Sitio web' })
  website?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Rating 0..5',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Rating 0..5', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 3, scale: 2, default: 0, comment: 'Rating 0..5' })
  rating?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del proveedor',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del proveedor', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado del proveedor' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Dirección',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Dirección', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 240, comment: 'Dirección' })
  address?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Ciudad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Ciudad', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Ciudad' })
  city?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'País ISO-3166-1 alpha-2',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'País ISO-3166-1 alpha-2', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 2, comment: 'País ISO-3166-1 alpha-2' })
  country?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Código postal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Código postal', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 20, comment: 'Código postal' })
  postalCode?: string = '';

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

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft a hrms:person canónica del provider (caso persona natural)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft a hrms:person canónica del provider (caso persona natural)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'FK soft a hrms:person canónica del provider (caso persona natural)' })
  personId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'FK soft a hrms:person del contacto comercial (caso persona jurídica)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'FK soft a hrms:person del contacto comercial (caso persona jurídica)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'FK soft a hrms:person del contacto comercial (caso persona jurídica)' })
  contactPersonId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Nombre — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Nombre — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Nombre — mirror de hrms:person' })
  firstName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Apellido — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Apellido — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Apellido — mirror de hrms:person' })
  lastName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de documento — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Tipo de documento — mirror de hrms:person' })
  documentType?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Número de documento — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Número de documento — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 60, comment: 'Número de documento — mirror de hrms:person' })
  documentNumber?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Persona de contacto — mirror (displayName de hrms:person via contactPersonId)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Persona de contacto — mirror (displayName de hrms:person via contactPersonId)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Persona de contacto — mirror (displayName de hrms:person via contactPersonId)' })
  contactPerson?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Email de contacto — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Email de contacto — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Email de contacto — mirror de hrms:person' })
  email?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Teléfono de contacto — mirror de hrms:person',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Teléfono de contacto — mirror de hrms:person', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Teléfono de contacto — mirror de hrms:person' })
  phone?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de sincronización con el upstream hrms:person',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de sincronización con el upstream hrms:person', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'LOCAL_ONLY', comment: 'Estado de sincronización con el upstream hrms:person' })
  upstreamSyncStatus!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Última sincronización exitosa con upstream',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Última sincronización exitosa con upstream', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Última sincronización exitosa con upstream' })
  upstreamSyncedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Hash SHA-256 del snapshot mirror recibido del upstream',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Hash SHA-256 del snapshot mirror recibido del upstream', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 64, comment: 'Hash SHA-256 del snapshot mirror recibido del upstream' })
  upstreamHash?: string = '';

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento fallido de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento fallido de sincronización', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último intento fallido de sincronización' })
  upstreamLastErrorAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Último intento (ok o ko) de sincronización',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Último intento (ok o ko) de sincronización', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Último intento (ok o ko) de sincronización' })
  upstreamLastAttemptAt?: Date = new Date();

  protected executeDslLifecycle(): void {
    // Rule: rating-in-valid-range
    // El rating debe estar en [0,5]
    if (!((this.rating === undefined || this.rating === null || this.rating >= 0) && (this.rating === undefined || this.rating === null || this.rating <= 5))) {
      throw new Error('PROVIDER_001: Rating fuera de rango');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'provider';
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
  static fromDto(dto: CreateProviderDto): Provider;
  static fromDto(dto: UpdateProviderDto): Provider;
  static fromDto(dto: DeleteProviderDto): Provider;
  static fromDto(dto: any): Provider {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Provider, dto);
  }
}
