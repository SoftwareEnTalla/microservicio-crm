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
import { CreatePaymentMilestoneDto, UpdatePaymentMilestoneDto, DeletePaymentMilestoneDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Contract } from '../../contract/entities/contract.entity';
import { MilestoneStatusLog } from '../../milestone-status-log/entities/milestone-status-log.entity';

@Index('idx_milestone_contract_id', ['contractId'])
@Index('idx_milestone_status', ['status'])
@Index('idx_milestone_due_date', ['actualPaymentDueDate'])
@Check('chk_milestone_rule_value_non_negative', '"paymentRuleValue" IS NULL OR "paymentRuleValue" >= 0')
@Check('chk_milestone_execution_dates', '"executionStartDate" IS NULL OR "executionEndDate" IS NULL OR "executionStartDate" <= "executionEndDate"')
@Check('chk_milestone_amount_non_negative', '"amount" >= 0')
@ChildEntity('paymentmilestone')
@ObjectType()
export class PaymentMilestone extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de PaymentMilestone",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de PaymentMilestone", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia PaymentMilestone' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de PaymentMilestone",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de PaymentMilestone", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia PaymentMilestone' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contrato al que pertenece',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contrato al que pertenece', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Contrato al que pertenece' })
  contractId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Título del hito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Título del hito', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 180, comment: 'Título del hito' })
  title!: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
    description: 'Fecha planificada en contrato',
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { description: 'Fecha planificada en contrato', nullable: false })
  @Column({ type: 'date', nullable: false, comment: 'Fecha planificada en contrato' })
  scheduledDate!: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Tipo de regla de cálculo de fecha de pago',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Tipo de regla de cálculo de fecha de pago', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 255, comment: 'Tipo de regla de cálculo de fecha de pago' })
  paymentRuleType?: string = '';

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Valor en días para la regla (si aplica)',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Valor en días para la regla (si aplica)', nullable: true })
  @Column({ type: 'int', nullable: true, comment: 'Valor en días para la regla (si aplica)' })
  paymentRuleValue?: number = 0;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Expresión segura para CUSTOM_LOGIC',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Expresión segura para CUSTOM_LOGIC', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Expresión segura para CUSTOM_LOGIC' })
  customRuleExpression?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del hito',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del hito', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'PENDING', comment: 'Estado del hito' })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Monto del hito',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Monto del hito', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'Monto del hito' })
  amount?: number = 0;

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
    type: () => Date,
    nullable: true,
    description: 'Inicio de ejecución',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Inicio de ejecución', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Inicio de ejecución' })
  executionStartDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fin de ejecución',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fin de ejecución', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fin de ejecución' })
  executionEndDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de aceptación por cliente',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de aceptación por cliente', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha de aceptación por cliente' })
  clientAcceptanceDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha real de pago calculada al aceptar',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha real de pago calculada al aceptar', nullable: true })
  @Column({ type: 'date', nullable: true, comment: 'Fecha real de pago calculada al aceptar' })
  actualPaymentDueDate?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Marca temporal de facturación',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Marca temporal de facturación', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Marca temporal de facturación' })
  invoicedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Referencia a la factura externa (invoice-service)',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Referencia a la factura externa (invoice-service)', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Referencia a la factura externa (invoice-service)' })
  invoiceId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo de rechazo del cliente',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo de rechazo del cliente', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Motivo de rechazo del cliente' })
  rejectionReason?: string = '';

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
    type: () => Contract,
    nullable: false,
    description: 'Relación con Contract',
  })
  @Field(() => Contract, { nullable: false })
  @ManyToOne(() => Contract, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contractId' })
  contract!: Contract;

  @ApiProperty({
    type: () => [MilestoneStatusLog],
    nullable: true,
    description: 'Bitácora de estados del hito',
  })
  @Field(() => [MilestoneStatusLog], { nullable: true })
  @OneToMany(() => MilestoneStatusLog, (milestoneStatusLog) => milestoneStatusLog.paymentMilestone, { cascade: true })
  statusLogs?: MilestoneStatusLog[];

  protected executeDslLifecycle(): void {
    // Rule: accepted-requires-acceptance-date
    // Al transitar a ACCEPTED debe existir clientAcceptanceDate
    if (!(this.status === 'ACCEPTED' && !(this.clientAcceptanceDate === undefined || this.clientAcceptanceDate === null || (typeof this.clientAcceptanceDate === 'string' && String(this.clientAcceptanceDate).trim() === '') || (Array.isArray(this.clientAcceptanceDate) && this.clientAcceptanceDate.length === 0) || (typeof this.clientAcceptanceDate === 'object' && !Array.isArray(this.clientAcceptanceDate) && Object.prototype.toString.call(this.clientAcceptanceDate) === '[object Object]' && Object.keys(Object(this.clientAcceptanceDate)).length === 0)))) {
      throw new Error('MILESTONE_001: ACCEPTED requiere clientAcceptanceDate');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'paymentmilestone';
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
  static fromDto(dto: CreatePaymentMilestoneDto): PaymentMilestone;
  static fromDto(dto: UpdatePaymentMilestoneDto): PaymentMilestone;
  static fromDto(dto: DeletePaymentMilestoneDto): PaymentMilestone;
  static fromDto(dto: any): PaymentMilestone {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(PaymentMilestone, dto);
  }
}
