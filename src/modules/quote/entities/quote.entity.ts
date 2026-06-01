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
import { CreateQuoteDto, UpdateQuoteDto, DeleteQuoteDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_quote_status', ['status'])
@Index('idx_quote_number', ['quoteNumber'])
@Index('idx_quote_opportunity_id', ['opportunityId'])
@Check('chk_quote_subtotal_non_negative', '"subtotal" IS NULL OR "subtotal" >= 0')
@Check('chk_quote_grand_total_non_negative', '"grandTotal" IS NULL OR "grandTotal" >= 0')
@ChildEntity('quote')
@ObjectType()
export class Quote extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Quote",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Quote", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Quote' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Quote",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Quote", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Quote' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Oportunidad origen',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Oportunidad origen', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Oportunidad origen' })
  opportunityId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta comercial',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta comercial', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Cuenta comercial' })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto principal',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto principal', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Contacto principal' })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número de cotización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número de cotización', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, comment: 'Número de cotización' })
  quoteNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la cotización',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la cotización', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'DRAFT', comment: 'Estado de la cotización' })
  status!: string;

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
    description: 'Subtotal',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Subtotal', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Subtotal' })
  subtotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Descuento total',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Descuento total', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Descuento total' })
  discountTotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Impuestos',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Impuestos', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Impuestos' })
  taxTotal?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Importe total',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Importe total', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Importe total' })
  grandTotal?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Vigencia', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Vigencia' })
  validUntil?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de envío',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de envío', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de envío' })
  sentAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aceptación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aceptación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de aceptación' })
  acceptedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de rechazo',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de rechazo', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de rechazo' })
  rejectedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Orden ERP derivada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Orden ERP derivada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Orden ERP derivada' })
  erpOrderId?: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Renglones de la cotización',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Renglones de la cotización', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Renglones de la cotización' })
  lineItems?: Record<string, any> = {};

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
    // Rule: quote-accepted-requires-accepted-at
    // Una cotización aceptada debe registrar fecha de aceptación.
    if (!(this.status === 'ACCEPTED' && !(this.acceptedAt === undefined || this.acceptedAt === null || (typeof this.acceptedAt === 'string' && String(this.acceptedAt).trim() === '') || (Array.isArray(this.acceptedAt) && this.acceptedAt.length === 0) || (typeof this.acceptedAt === 'object' && !Array.isArray(this.acceptedAt) && Object.prototype.toString.call(this.acceptedAt) === '[object Object]' && Object.keys(Object(this.acceptedAt)).length === 0)))) {
      throw new Error('QUOTE_001: Una cotización ACCEPTED requiere acceptedAt');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'quote';
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
  static fromDto(dto: CreateQuoteDto): Quote;
  static fromDto(dto: UpdateQuoteDto): Quote;
  static fromDto(dto: DeleteQuoteDto): Quote;
  static fromDto(dto: any): Quote {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Quote, dto);
  }
}
