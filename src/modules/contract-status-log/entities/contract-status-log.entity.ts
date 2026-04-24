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
import { CreateContractStatusLogDto, UpdateContractStatusLogDto, DeleteContractStatusLogDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Contract } from '../../contract/entities/contract.entity';

@Index('idx_contract_status_log_contract_id', ['contractId'])
@ChildEntity('contractstatuslog')
@ObjectType()
export class ContractStatusLog extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de ContractStatusLog",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de ContractStatusLog", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia ContractStatusLog' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de ContractStatusLog",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de ContractStatusLog", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia ContractStatusLog' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Contrato asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Contrato asociado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Contrato asociado' })
  contractId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Estado anterior',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Estado anterior', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 40, comment: 'Estado anterior' })
  oldStatus?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nuevo estado',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nuevo estado', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, comment: 'Nuevo estado' })
  newStatus!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Usuario que realizó el cambio',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Usuario que realizó el cambio', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Usuario que realizó el cambio' })
  changedBy?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Motivo del cambio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Motivo del cambio', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Motivo del cambio' })
  reason?: string = '';

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

  protected executeDslLifecycle(): void {
    // No se definieron business-rules en el DSL.
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'contractstatuslog';
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
  static fromDto(dto: CreateContractStatusLogDto): ContractStatusLog;
  static fromDto(dto: UpdateContractStatusLogDto): ContractStatusLog;
  static fromDto(dto: DeleteContractStatusLogDto): ContractStatusLog;
  static fromDto(dto: any): ContractStatusLog {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(ContractStatusLog, dto);
  }
}
