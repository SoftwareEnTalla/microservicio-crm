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
import { CreateContractDto, UpdateContractDto, DeleteContractDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { PaymentMilestone } from '../../payment-milestone/entities/payment-milestone.entity';
import { ContractStatusLog } from '../../contract-status-log/entities/contract-status-log.entity';

@Index('idx_contract_number', ['contractNumber'], { unique: true })
@Index('idx_contract_client_id', ['clientId'])
@Index('idx_contract_status', ['status'])
@Unique('uq_contract_number', ['contractNumber'])
@Check('chk_contract_dates', '"endDate" IS NULL OR "startDate" <= "endDate"')
@Check('chk_contract_total_value_non_negative', '"totalValue" >= 0')
@Check('chk_contract_payment_terms_non_negative', '"paymentTermsDays" IS NULL OR "paymentTermsDays" >= 0')
@ChildEntity('contract')
@ObjectType()
export class Contract extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Contract",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Contract", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Contract' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Contract",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Contract", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Contract' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Número legible único del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Número legible único del contrato', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, unique: true, comment: 'Número legible único del contrato' })
  contractNumber!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia al crm-client-profile.clientId',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia al crm-client-profile.clientId', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Referencia al crm-client-profile.clientId' })
  clientId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Proveedor asociado (opcional)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Proveedor asociado (opcional)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Proveedor asociado (opcional)' })
  providerId?: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Versión de T&C aplicada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Versión de T&C aplicada', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Versión de T&C aplicada' })
  termsId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Plan de suscripción aplicado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Plan de suscripción aplicado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Plan de suscripción aplicado' })
  subscriptionPlanId!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Ids de incentivos aplicados',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Ids de incentivos aplicados', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Ids de incentivos aplicados' })
  appliedIncentives?: Record<string, any> = {};

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha de inicio',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha de inicio', nullable: false })
  @Column({ type: 'date', nullable: false, comment: 'Fecha de inicio' })
  startDate!: Date;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de fin',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de fin', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha de fin' })
  endDate?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Renovación automática',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Renovación automática', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Renovación automática' })
  autoRenew!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Días del periodo de renovación',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días del periodo de renovación', nullable: true })
  @Column({ type: 'int', nullable: true, default: 365, comment: 'Días del periodo de renovación' })
  renewalPeriodDays?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del contrato',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del contrato', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'DRAFT', comment: 'Estado del contrato' })
  status!: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de firma',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de firma', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de firma' })
  signedAt?: Date = new Date();

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
    description: 'Firmado por cliente',
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { description: 'Firmado por cliente', nullable: false })
  @Column({ type: 'boolean', nullable: false, default: false, comment: 'Firmado por cliente' })
  signedByClient!: boolean;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor total calculado',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Valor total calculado', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Valor total calculado' })
  totalValue?: number = 0;

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
    description: 'Días globales de pago del contrato (fallback para milestones)',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Días globales de pago del contrato (fallback para milestones)', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Días globales de pago del contrato (fallback para milestones)' })
  paymentTermsDays?: number = 0;

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
    type: () => [PaymentMilestone],
    nullable: true,
    description: 'Hitos de pago del contrato',
  })
  @Field(() => [PaymentMilestone], { nullable: true })
  @OneToMany(() => PaymentMilestone, (paymentMilestone) => paymentMilestone.contract, { cascade: true })
  paymentMilestones?: PaymentMilestone[];

  @ApiProperty({
    type: () => [ContractStatusLog],
    nullable: true,
    description: 'Bitácora de cambios de estado',
  })
  @Field(() => [ContractStatusLog], { nullable: true })
  @OneToMany(() => ContractStatusLog, (contractStatusLog) => contractStatusLog.contract, { cascade: true })
  statusLogs?: ContractStatusLog[];

  protected executeDslLifecycle(): void {
    // Rule: signed-contract-requires-signed-at-and-flag
    // Para transitar DRAFT→ACTIVE debe existir signedAt y signedByClient=true
    if (!(this.status === 'ACTIVE' && this.signedByClient === true && !(this.signedAt === undefined || this.signedAt === null || (typeof this.signedAt === 'string' && String(this.signedAt).trim() === '') || (Array.isArray(this.signedAt) && this.signedAt.length === 0) || (typeof this.signedAt === 'object' && !Array.isArray(this.signedAt) && Object.prototype.toString.call(this.signedAt) === '[object Object]' && Object.keys(Object(this.signedAt)).length === 0)))) {
      throw new Error('CONTRACT_001: Un contrato ACTIVE requiere firma y signedAt');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'contract';
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
  static fromDto(dto: CreateContractDto): Contract;
  static fromDto(dto: UpdateContractDto): Contract;
  static fromDto(dto: DeleteContractDto): Contract;
  static fromDto(dto: any): Contract {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Contract, dto);
  }
}
