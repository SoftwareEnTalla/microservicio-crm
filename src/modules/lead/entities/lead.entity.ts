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
import { CreateLeadDto, UpdateLeadDto, DeleteLeadDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_lead_status', ['status'])
@Index('idx_lead_source', ['source'])
@Index('idx_lead_owner_id', ['ownerId'])
@Index('idx_lead_email', ['email'])
@Check('chk_lead_score_non_negative', '"score" IS NULL OR "score" >= 0')
@ChildEntity('lead')
@ObjectType()
export class Lead extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Lead",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Lead", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Lead' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Lead",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Lead", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Lead' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Origen del lead',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Origen del lead', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 80, comment: 'Origen del lead' })
  source!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del lead',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del lead', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'NEW', comment: 'Estado del lead' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre del prospecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre del prospecto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Nombre del prospecto' })
  firstName!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Apellido del prospecto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Apellido del prospecto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 120, comment: 'Apellido del prospecto' })
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
    nullable: true,
    description: 'Correo electrónico',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Correo electrónico', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Correo electrónico' })
  email?: string = '';

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
    description: 'Empresa u organización',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Empresa u organización', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 160, comment: 'Empresa u organización' })
  company?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cargo del prospecto',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Cargo del prospecto', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Cargo del prospecto' })
  jobTitle?: string = '';

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
    description: 'Industria declarada',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Industria declarada', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 80, comment: 'Industria declarada' })
  industry?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Responsable comercial asignado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Responsable comercial asignado', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Responsable comercial asignado' })
  ownerId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de asignación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de asignación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de asignación' })
  assignedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de calificación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de calificación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de calificación' })
  qualifiedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de conversión',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de conversión', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de conversión' })
  convertedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Oportunidad resultante de la conversión',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Oportunidad resultante de la conversión', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Oportunidad resultante de la conversión' })
  convertedOpportunityId?: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Score operativo del lead',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Score operativo del lead', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Score operativo del lead' })
  score?: number = 0;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Etiquetas comerciales',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Etiquetas comerciales', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Etiquetas comerciales' })
  tags?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas del equipo comercial',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas del equipo comercial', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Notas del equipo comercial' })
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
    // Rule: lead-qualified-requires-owner
    // Un lead calificado debe tener owner asignado.
    if (!((!(this.status === 'QUALIFIED') || (!(this.ownerId === undefined || this.ownerId === null || (typeof this.ownerId === 'string' && String(this.ownerId).trim() === '') || (Array.isArray(this.ownerId) && this.ownerId.length === 0) || (typeof this.ownerId === 'object' && !Array.isArray(this.ownerId) && Object.prototype.toString.call(this.ownerId) === '[object Object]' && Object.keys(Object(this.ownerId)).length === 0)))))) {
      throw new Error('LEAD_001: Un lead QUALIFIED requiere ownerId');
    }

    // Rule: lead-converted-requires-opportunity
    // Un lead convertido debe apuntar a una oportunidad y registrar fecha de conversión.
    if (!((!(this.status === 'CONVERTED') || (!(this.convertedOpportunityId === undefined || this.convertedOpportunityId === null || (typeof this.convertedOpportunityId === 'string' && String(this.convertedOpportunityId).trim() === '') || (Array.isArray(this.convertedOpportunityId) && this.convertedOpportunityId.length === 0) || (typeof this.convertedOpportunityId === 'object' && !Array.isArray(this.convertedOpportunityId) && Object.prototype.toString.call(this.convertedOpportunityId) === '[object Object]' && Object.keys(Object(this.convertedOpportunityId)).length === 0)) && !(this.convertedAt === undefined || this.convertedAt === null || (typeof this.convertedAt === 'string' && String(this.convertedAt).trim() === '') || (Array.isArray(this.convertedAt) && this.convertedAt.length === 0) || (typeof this.convertedAt === 'object' && !Array.isArray(this.convertedAt) && Object.prototype.toString.call(this.convertedAt) === '[object Object]' && Object.keys(Object(this.convertedAt)).length === 0)))))) {
      throw new Error('LEAD_002: Un lead CONVERTED requiere convertedOpportunityId y convertedAt');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'lead';
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
  static fromDto(dto: CreateLeadDto): Lead;
  static fromDto(dto: UpdateLeadDto): Lead;
  static fromDto(dto: DeleteLeadDto): Lead;
  static fromDto(dto: any): Lead {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Lead, dto);
  }
}
