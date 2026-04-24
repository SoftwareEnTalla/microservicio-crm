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
import { SubscriptionPlanDto } from '../dtos/all-dto';
import { SubscriptionPlanGraphqlService } from '../services/subscriptionplan.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => SubscriptionPlanDto)
export class SubscriptionPlanGraphqlQuery {
  constructor(private readonly service: SubscriptionPlanGraphqlService) {}

  @Query(() => [SubscriptionPlanDto], { name: 'findAllSubscriptionPlans' })
  async findAll(): Promise<SubscriptionPlanDto[]> {
    return this.service.findAll();
  }

  @Query(() => SubscriptionPlanDto, { name: 'findSubscriptionPlanById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<SubscriptionPlanDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("SubscriptionPlan con id " + id + " no encontrado");
    }
    return result;
  }
}
