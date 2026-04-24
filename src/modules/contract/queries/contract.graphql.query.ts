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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { ContractDto } from '../dtos/all-dto';
import { ContractGraphqlService } from '../services/contract.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => ContractDto)
export class ContractGraphqlQuery {
  constructor(private readonly service: ContractGraphqlService) {}

  @Query(() => [ContractDto], { name: 'findAllContracts' })
  async findAll(): Promise<ContractDto[]> {
    return this.service.findAll();
  }

  @Query(() => ContractDto, { name: 'findContractById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<ContractDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("Contract con id " + id + " no encontrado");
    }
    return result;
  }
}
