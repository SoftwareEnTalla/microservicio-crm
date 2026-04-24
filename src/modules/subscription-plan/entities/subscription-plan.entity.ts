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
import { CreateSubscriptionPlanDto, UpdateSubscriptionPlanDto, DeleteSubscriptionPlanDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Incentive } from '../../incentive/entities/incentive.entity';

@Index('idx_subscription_plan_name', ['name'], { unique: true })
@Unique('uq_subscription_plan_name', ['name'])
@Check('chk_subscription_plan_base_price_positive', '"basePrice" > 0')
@ChildEntity('subscriptionplan')
@ObjectType()
export class SubscriptionPlan extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de SubscriptionPlan",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de SubscriptionPlan", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia SubscriptionPlan' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de SubscriptionPlan",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de SubscriptionPlan", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia SubscriptionPlan' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ciclo de facturación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ciclo de facturación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'MONTHLY', comment: 'Ciclo de facturación' })
  billingCycle!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Precio base',
  })
  @IsNumber()
  @IsNotEmpty()
  @Field(() => Float, { description: 'Precio base', nullable: false })
  @Column({ type: 'decimal', nullable: false, precision: 14, scale: 2, comment: 'Precio base' })
  basePrice!: number;

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
    type: () => [Incentive],
    nullable: true,
    description: 'Incentivos del plan',
  })
  @Field(() => [Incentive], { nullable: true })
  @OneToMany(() => Incentive, (incentive) => incentive.subscriptionPlan, { cascade: true })
  incentives?: Incentive[];

  protected executeDslLifecycle(): void {
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'subscriptionplan';
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
  static fromDto(dto: CreateSubscriptionPlanDto): SubscriptionPlan;
  static fromDto(dto: UpdateSubscriptionPlanDto): SubscriptionPlan;
  static fromDto(dto: DeleteSubscriptionPlanDto): SubscriptionPlan;
  static fromDto(dto: any): SubscriptionPlan {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(SubscriptionPlan, dto);
  }
}
