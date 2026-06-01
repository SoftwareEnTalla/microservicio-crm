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
import { CreateActivityDto, UpdateActivityDto, DeleteActivityDto } from '../dtos/all-dto';
import { IsArray, IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';


@Index('idx_activity_type', ['activityType'])
@Index('idx_activity_status', ['status'])
@Index('idx_activity_owner_id', ['ownerId'])
@Index('idx_activity_opportunity_id', ['opportunityId'])
@ChildEntity('activity')
@ObjectType()
export class Activity extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de Activity",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de Activity", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia Activity' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de Activity",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de Activity", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia Activity' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Tipo de actividad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Tipo de actividad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'TASK', comment: 'Tipo de actividad' })
  activityType!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de la actividad',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de la actividad', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 40, default: 'PLANNED', comment: 'Estado de la actividad' })
  status!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Asunto',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Asunto', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 180, comment: 'Asunto' })
  subject!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Ejecutor o responsable',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Ejecutor o responsable', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Ejecutor o responsable' })
  ownerId!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Lead relacionado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Lead relacionado', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Lead relacionado' })
  leadId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Cuenta relacionada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Cuenta relacionada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Cuenta relacionada' })
  accountId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Contacto relacionado',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Contacto relacionado', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Contacto relacionado' })
  contactId?: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Oportunidad relacionada',
  })
  @IsUUID()
  @IsOptional()
  @Field(() => String, { description: 'Oportunidad relacionada', nullable: true })
  @Column({ type: 'uuid', nullable: true, comment: 'Oportunidad relacionada' })
  opportunityId?: string;

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha planificada',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha planificada', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha planificada' })
  plannedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de inicio',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de inicio', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de inicio' })
  startedAt?: Date = new Date();

  @ApiProperty({
    type: () => Date,
    nullable: true,
    description: 'Fecha de cierre',
  })
  @IsDate()
  @IsOptional()
  @Field(() => Date, { description: 'Fecha de cierre', nullable: true })
  @Column({ type: 'timestamp', nullable: true, comment: 'Fecha de cierre' })
  completedAt?: Date = new Date();

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Resultado',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Resultado', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 180, comment: 'Resultado' })
  outcome?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Prioridad',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Prioridad', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 20, default: 'MEDIUM', comment: 'Prioridad' })
  priority?: string = '';

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
    // Rule: completed-activity-requires-completed-at
    // Una actividad completada debe registrar fecha de finalización.
    if (!(this.status === 'COMPLETED' && !(this.completedAt === undefined || this.completedAt === null || (typeof this.completedAt === 'string' && String(this.completedAt).trim() === '') || (Array.isArray(this.completedAt) && this.completedAt.length === 0) || (typeof this.completedAt === 'object' && !Array.isArray(this.completedAt) && Object.prototype.toString.call(this.completedAt) === '[object Object]' && Object.keys(Object(this.completedAt)).length === 0)))) {
      throw new Error('ACTIVITY_001: Una actividad COMPLETED requiere completedAt');
    }

    // Rule: activity-must-link-commercial-context
    // Una actividad debe vincular al menos un contexto comercial.
    if (!(!(this.subject === undefined || this.subject === null || (typeof this.subject === 'string' && String(this.subject).trim() === '') || (Array.isArray(this.subject) && this.subject.length === 0) || (typeof this.subject === 'object' && !Array.isArray(this.subject) && Object.prototype.toString.call(this.subject) === '[object Object]' && Object.keys(Object(this.subject)).length === 0)))) {
      throw new Error('ACTIVITY_002: La actividad debe relacionarse con leadId, accountId, contactId u opportunityId');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'activity';
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
  static fromDto(dto: CreateActivityDto): Activity;
  static fromDto(dto: UpdateActivityDto): Activity;
  static fromDto(dto: DeleteActivityDto): Activity;
  static fromDto(dto: any): Activity {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(Activity, dto);
  }
}
