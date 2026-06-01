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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { Lead } from "../entities/lead.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de lead" })
export class LeadResponse<T extends Lead> extends GQResponseBase {
  @ApiProperty({ type: Lead,nullable:false,description:"Datos de respuesta de Lead" })
  @Field(() => Lead, { description: "Instancia de Lead", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de leads" })
export class LeadsResponse<T extends Lead> extends GQResponseBase {
  @ApiProperty({ type: [Lead],nullable:false,description:"Listado de Lead",default:[] })
  @Field(() => [Lead], { description: "Listado de Lead", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de Lead",default:0 })
  @Field(() => Number, { description: "Cantidad de Lead", nullable: false,defaultValue:0 })
  count: number = 0;
}






