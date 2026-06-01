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


import { BaseEvent } from './base.event';
import { OpportunityCreatedEvent } from './opportunitycreated.event';
import { OpportunityUpdatedEvent } from './opportunityupdated.event';
import { OpportunityDeletedEvent } from './opportunitydeleted.event';
import { OpportunityStageChangedEvent } from './opportunitystagechanged.event';
import { OpportunityWonEvent } from './opportunitywon.event';
import { OpportunityLostEvent } from './opportunitylost.event';

export type RegisteredEventClass<T extends BaseEvent = BaseEvent> = new (
  aggregateId: string,
  payload: any
) => T;

export interface RegisteredEventDefinition<T extends BaseEvent = BaseEvent> {
  topic: string;
  eventName: string;
  version: string;
  eventClass: RegisteredEventClass<T>;
  retryTopic: string;
  dlqTopic: string;
  maxRetries: number;
  replayable: boolean;
}

const createEventDefinition = <T extends BaseEvent>(
  topic: string,
  eventClass: RegisteredEventClass<T>,
  overrides?: Partial<Omit<RegisteredEventDefinition<T>, 'topic' | 'eventName' | 'eventClass'>>,
): RegisteredEventDefinition<T> => ({
  topic,
  eventName: eventClass.name,
  version: overrides?.version ?? '1.0.0',
  eventClass,
  retryTopic: overrides?.retryTopic ?? topic + '-retry',
  dlqTopic: overrides?.dlqTopic ?? topic + '-dlq',
  maxRetries: overrides?.maxRetries ?? 3,
  replayable: overrides?.replayable ?? true,
});

const EVENT_DEFINITION_OVERRIDES: Partial<Record<string, Partial<Omit<RegisteredEventDefinition, 'topic' | 'eventName' | 'eventClass'>>>> = {
  'opportunity-created': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'opportunity-updated': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'opportunity-stage-changed': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'opportunity-won': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'opportunity-lost': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'opportunity-deleted': {
    version: '1.0.0',
    maxRetries: 2,
    replayable: false,
  },
};

export const EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'opportunity-created': createEventDefinition('opportunity-created', OpportunityCreatedEvent, EVENT_DEFINITION_OVERRIDES['opportunity-created']),
  'opportunity-updated': createEventDefinition('opportunity-updated', OpportunityUpdatedEvent, EVENT_DEFINITION_OVERRIDES['opportunity-updated']),
  'opportunity-deleted': createEventDefinition('opportunity-deleted', OpportunityDeletedEvent, EVENT_DEFINITION_OVERRIDES['opportunity-deleted']),
  'opportunity-stage-changed': createEventDefinition('opportunity-stage-changed', OpportunityStageChangedEvent, EVENT_DEFINITION_OVERRIDES['opportunity-stage-changed']),
  'opportunity-won': createEventDefinition('opportunity-won', OpportunityWonEvent, EVENT_DEFINITION_OVERRIDES['opportunity-won']),
  'opportunity-lost': createEventDefinition('opportunity-lost', OpportunityLostEvent, EVENT_DEFINITION_OVERRIDES['opportunity-lost']),
};

export const EVENT_REGISTRY: Record<string, RegisteredEventClass> = Object.fromEntries(
  Object.values(EVENT_DEFINITIONS).map((definition) => [definition.topic, definition.eventClass])
);

export const EVENT_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.topic);
export const EVENT_RETRY_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.retryTopic);
export const EVENT_DLQ_TOPICS = Object.values(EVENT_DEFINITIONS).map((definition) => definition.dlqTopic);
export const EVENT_CONSUMER_TOPICS = Array.from(new Set([...EVENT_TOPICS, ...EVENT_RETRY_TOPICS]));
export const EVENT_ADMIN_TOPICS = Array.from(new Set([...EVENT_TOPICS, ...EVENT_RETRY_TOPICS, ...EVENT_DLQ_TOPICS]));

export const resolveEventDefinition = (candidate?: string): RegisteredEventDefinition | undefined => {
  if (!candidate) {
    return undefined;
  }

  if (EVENT_DEFINITIONS[candidate]) {
    return EVENT_DEFINITIONS[candidate];
  }

  return Object.values(EVENT_DEFINITIONS).find(
    (definition) =>
      definition.topic === candidate ||
      definition.retryTopic === candidate ||
      definition.dlqTopic === candidate ||
      definition.eventName === candidate,
  );
};
