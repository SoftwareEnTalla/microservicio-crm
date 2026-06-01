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
import { CreateOpportunityDto, UpdateOpportunityDto, DeleteOpportunityDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_opportunity_stage', ['stage'])
@Index('idx_opportunity_status', ['status'])
@Index('idx_opportunity_owner_id', ['ownerId'])
@Index('idx_opportunity_expected_close', ['expectedCloseDate'])
@Check('chk_opportunity_probability_range', '"probability" IS NULL OR ("probability" >= 0 AND "probability" <= 100)')
@Check('chk_opportunity_estimated_non_negative', '"estimatedValue" IS NULL OR "estimatedValue" >= 0')
@Check('chk_opportunity_weighted_non_negative', '"weightedValue" IS NULL OR "weightedValue" >= 0')
@ChildEntity('opportunity')
@ObjectType()
export class Opportunity extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Opportunity",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Opportunity", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Opportunity' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Opportunity",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Opportunity", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Opportunity' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead origen',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead origen', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Lead origen' })
  leadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta comercial asociada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta comercial asociada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Cuenta comercial asociada' })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto principal asociado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto principal asociado', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Contacto principal asociado' })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título de la oportunidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título de la oportunidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 180, comment: 'Título de la oportunidad' })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Etapa del pipeline',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Etapa del pipeline', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'DISCOVERY', comment: 'Etapa del pipeline' })
  stage!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado operativo de la oportunidad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado operativo de la oportunidad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'OPEN', comment: 'Estado operativo de la oportunidad' })
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
    type: () => Date,
    nullable: true,
    description: 'Fecha esperada de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha esperada de cierre', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha esperada de cierre' })
  expectedCloseDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cierre', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de cierre' })
  closedAt?: Date = new Date();

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor estimado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor estimado', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Valor estimado' })
  estimatedValue?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor ponderado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor ponderado', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Valor ponderado' })
  weightedValue?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Moneda ISO-4217',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Moneda ISO-4217', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 3, default: 'USD', comment: 'Moneda ISO-4217' })
  currency!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Probabilidad de cierre 0..100',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Probabilidad de cierre 0..100', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Probabilidad de cierre 0..100' })
  probability?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Categoría de forecast',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Categoría de forecast', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Categoría de forecast' })
  forecastCategory?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo de pérdida',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo de pérdida', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Motivo de pérdida' })
  lossReason?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Sales order creada en ERP al ganar',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Sales order creada en ERP al ganar', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Sales order creada en ERP al ganar' })
  wonOrderId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Próxima acción comercial',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Próxima acción comercial', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Próxima acción comercial' })
  nextActionAt?: Date = new Date();

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
    // Rule: opportunity-won-requires-close-data
    // Una oportunidad ganada debe registrar cierre y orden ERP si ya se materializó.
    if (!((!(this.status === 'WON') || (!(this.closedAt === undefined || this.closedAt === null || (typeof this.closedAt === 'string' && String(this.closedAt).trim() === '') || (Array.isArray(this.closedAt) && this.closedAt.length === 0) || (typeof this.closedAt === 'object' && !Array.isArray(this.closedAt) && Object.prototype.toString.call(this.closedAt) === '[object Object]' && Object.keys(Object(this.closedAt)).length === 0)))))) {
      throw new Error('OPPORTUNITY_001: Una oportunidad WON requiere closedAt');
    }

    // Rule: opportunity-lost-requires-reason
    // Una oportunidad perdida debe registrar motivo.
    if (!((!(this.status === 'LOST') || (!(this.lossReason === undefined || this.lossReason === null || (typeof this.lossReason === 'string' && String(this.lossReason).trim() === '') || (Array.isArray(this.lossReason) && this.lossReason.length === 0) || (typeof this.lossReason === 'object' && !Array.isArray(this.lossReason) && Object.prototype.toString.call(this.lossReason) === '[object Object]' && Object.keys(Object(this.lossReason)).length === 0)))))) {
      throw new Error('OPPORTUNITY_002: Una oportunidad LOST requiere lossReason');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'opportunity';
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
  static fromDto(dto: CreateOpportunityDto): Opportunity;
  static fromDto(dto: UpdateOpportunityDto): Opportunity;
  static fromDto(dto: DeleteOpportunityDto): Opportunity;
  static fromDto(dto: any): Opportunity {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Opportunity, dto);
  }
}
