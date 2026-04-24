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
import { CreateIncentiveDto, UpdateIncentiveDto, DeleteIncentiveDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { SubscriptionPlan } from '../../subscription-plan/entities/subscription-plan.entity';

@Index('idx_incentive_plan_type', ['subscriptionPlanId', 'type'])
@Check('chk_incentive_valid_dates', '"validUntil" IS NULL OR "validFrom" < "validUntil"')
@Check('chk_incentive_value_non_negative', '"value" >= 0')
@ChildEntity('incentive')
@ObjectType()
export class Incentive extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Incentive",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Incentive", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Incentive' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Incentive",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Incentive", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Incentive' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Plan al que pertenece el incentivo',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Plan al que pertenece el incentivo', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Plan al que pertenece el incentivo' })
  subscriptionPlanId!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Valor numérico del incentivo',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Valor numérico del incentivo', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 14, scale: 4, comment: 'Valor numérico del incentivo' })
  value!: number;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Condiciones de aplicación (JSON)',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Condiciones de aplicación (JSON)', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Condiciones de aplicación (JSON)' })
  conditions?: Record<string, any> = {};

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Inicio de validez',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Inicio de validez', nullable: false })
  @Column({ type: 'timestamp', nullable: false, comment: 'Inicio de validez' })
  validFrom!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de validez',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de validez', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fin de validez' })
  validUntil?: Date = new Date();

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
    type: () => SubscriptionPlan,
    nullable: false,
    description: 'Relación con SubscriptionPlan',
  })
  @Field(() => SubscriptionPlan, { nullable: false })
  @ManyToOne(() => SubscriptionPlan, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'subscriptionPlanId' })
  subscriptionPlan!: SubscriptionPlan;

  protected executeDslLifecycle(): void {
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'incentive';
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
  static fromDto(dto: CreateIncentiveDto): Incentive;
  static fromDto(dto: UpdateIncentiveDto): Incentive;
  static fromDto(dto: DeleteIncentiveDto): Incentive;
  static fromDto(dto: any): Incentive {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Incentive, dto);
  }
}
