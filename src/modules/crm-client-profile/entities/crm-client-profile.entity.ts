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
import { CreateCrmClientProfileDto, UpdateCrmClientProfileDto, DeleteCrmClientProfileDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_crm_client_profile_client_id', ['clientId'], { unique: true })
@Index('idx_crm_client_profile_segment', ['segmentCode'])
@Unique('uq_crm_client_profile_client_id', ['clientId'])
@Check('chk_crm_client_profile_churn_range', '"churnRiskScore" >= 0 AND "churnRiskScore" <= 1')
@Check('chk_crm_client_profile_ltv_non_negative', '"lifetimeValue" >= 0')
@ChildEntity('crmclientprofile')
@ObjectType()
export class CrmClientProfile extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de CrmClientProfile",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de CrmClientProfile", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia CrmClientProfile' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de CrmClientProfile",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de CrmClientProfile", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia CrmClientProfile' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia canónica al client del microservicio client-service',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia canónica al client del microservicio client-service', nullable: false })
  @Column({ type: 'uuid', nullable: false, unique: true, comment: 'Referencia canónica al client del microservicio client-service' })
  clientId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Snapshot del código del cliente (proyección, no autoritativo)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Snapshot del código del cliente (proyección, no autoritativo)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 50, comment: 'Snapshot del código del cliente (proyección, no autoritativo)' })
  clientCode?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Snapshot del email del cliente (proyección)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Snapshot del email del cliente (proyección)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Snapshot del email del cliente (proyección)' })
  clientEmail?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Snapshot del nombre visible del cliente (proyección)',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Snapshot del nombre visible del cliente (proyección)', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Snapshot del nombre visible del cliente (proyección)' })
  clientDisplayName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado del perfil CRM del cliente',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado del perfil CRM del cliente', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'ACTIVE', comment: 'Estado del perfil CRM del cliente' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Segmento comercial interno del CRM',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Segmento comercial interno del CRM', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 60, comment: 'Segmento comercial interno del CRM' })
  segmentCode?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Etiquetas libres del gestor CRM',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Etiquetas libres del gestor CRM', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Etiquetas libres del gestor CRM' })
  tags?: Record<string, any> = {};

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Probabilidad de churn calculada (0..1)',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'Probabilidad de churn calculada (0..1)', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 4, scale: 3, default: 0, comment: 'Probabilidad de churn calculada (0..1)' })
  churnRiskScore?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'LTV cacheado (sum totalValue contratos)',
  })
  @IsNumber()
  @IsOptional()
  @Field(() => Float, { description: 'LTV cacheado (sum totalValue contratos)', nullable: true })
  @Column({ type: 'decimal', nullable: true, precision: 14, scale: 2, default: 0, comment: 'LTV cacheado (sum totalValue contratos)' })
  lifetimeValue?: number = 0;

  @ApiProperty({
    type: () => Number,
    nullable: true,
    description: 'Total de contratos históricos del cliente',
  })
  @IsInt()
  @IsOptional()
  @Field(() => Int, { description: 'Total de contratos históricos del cliente', nullable: true })
  @Column({ type: 'int', nullable: true, default: 0, comment: 'Total de contratos históricos del cliente' })
  totalContracts?: number = 0;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha del primer contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha del primer contrato', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha del primer contrato' })
  firstContractAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha del último contrato',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha del último contrato', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha del último contrato' })
  lastContractAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas libres del gestor CRM',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas libres del gestor CRM', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Notas libres del gestor CRM' })
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
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'crmclientprofile';
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
  static fromDto(dto: CreateCrmClientProfileDto): CrmClientProfile;
  static fromDto(dto: UpdateCrmClientProfileDto): CrmClientProfile;
  static fromDto(dto: DeleteCrmClientProfileDto): CrmClientProfile;
  static fromDto(dto: any): CrmClientProfile {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(CrmClientProfile, dto);
  }
}
