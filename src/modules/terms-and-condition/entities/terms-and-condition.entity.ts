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
import { CreateTermsAndConditionDto, UpdateTermsAndConditionDto, DeleteTermsAndConditionDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_terms_version', ['version'], { unique: true })
@Index('idx_terms_is_current', ['isCurrent'])
@Unique('uq_terms_version', ['version'])
@Check('chk_terms_effective_dates', '"effectiveUntil" IS NULL OR "effectiveFrom" < "effectiveUntil"')
@Check('chk_terms_global_payment_days', '"globalPaymentDays" IS NULL OR "globalPaymentDays" >= 0')
@ChildEntity('termsandcondition')
@ObjectType()
export class TermsAndCondition extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de TermsAndCondition",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de TermsAndCondition", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia TermsAndCondition' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de TermsAndCondition",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de TermsAndCondition", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia TermsAndCondition' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión (ej. v2.1)',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión (ej. v2.1)', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 20, unique: true, comment: 'Versión (ej. v2.1)' })
  version!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 200, comment: 'Título' })
  title!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contenido Markdown/HTML',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contenido Markdown/HTML', nullable: false })
  @Column({ type: 'text', nullable: false, comment: 'Contenido Markdown/HTML' })
  content!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio de vigencia',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio de vigencia', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Inicio de vigencia' })
  effectiveFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de vigencia',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de vigencia', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fin de vigencia' })
  effectiveUntil?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Versión vigente (única true en cualquier instante)',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Versión vigente (única true en cualquier instante)', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Versión vigente (única true en cualquier instante)' })
  isCurrent!: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Regla global de pago',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Regla global de pago', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'NONE', comment: 'Regla global de pago' })
  globalPaymentRule!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Días de plazo para la regla global',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días de plazo para la regla global', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Días de plazo para la regla global' })
  globalPaymentDays?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Usuario que aprobó la versión',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Usuario que aprobó la versión', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Usuario que aprobó la versión' })
  approvedBy?: string;

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
    // Rule: effective-from-before-until
    // effectiveFrom debe ser anterior a effectiveUntil si este último está definido
    if (!(!(this.effectiveFrom === undefined || this.effectiveFrom === null || (typeof this.effectiveFrom === 'string' && String(this.effectiveFrom).trim() === '') || (Array.isArray(this.effectiveFrom) && this.effectiveFrom.length === 0) || (typeof this.effectiveFrom === 'object' && !Array.isArray(this.effectiveFrom) && Object.prototype.toString.call(this.effectiveFrom) === '[object Object]' && Object.keys(Object(this.effectiveFrom)).length === 0)))) {
      throw new Error('TERMS_001: effectiveFrom debe ser anterior a effectiveUntil');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'termsandcondition';
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
  static fromDto(dto: CreateTermsAndConditionDto): TermsAndCondition;
  static fromDto(dto: UpdateTermsAndConditionDto): TermsAndCondition;
  static fromDto(dto: DeleteTermsAndConditionDto): TermsAndCondition;
  static fromDto(dto: any): TermsAndCondition {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(TermsAndCondition, dto);
  }
}
