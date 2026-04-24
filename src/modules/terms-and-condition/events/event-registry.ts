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
import { TermsAndConditionCreatedEvent } from './termsandconditioncreated.event';
import { TermsAndConditionUpdatedEvent } from './termsandconditionupdated.event';
import { TermsAndConditionDeletedEvent } from './termsandconditiondeleted.event';
import { TermsCreatedEvent } from './termscreated.event';
import { TermsUpdatedEvent } from './termsupdated.event';
import { TermsVersionActivatedEvent } from './termsversionactivated.event';

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
  'terms-created': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'terms-updated': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
  'terms-version-activated': {
    version: '1.0.0',
    maxRetries: 5,
    replayable: true,
  },
};

export const EVENT_DEFINITIONS: Record<string, RegisteredEventDefinition> = {
  'terms-and-condition-created': createEventDefinition('terms-and-condition-created', TermsAndConditionCreatedEvent, EVENT_DEFINITION_OVERRIDES['terms-and-condition-created']),
  'terms-and-condition-updated': createEventDefinition('terms-and-condition-updated', TermsAndConditionUpdatedEvent, EVENT_DEFINITION_OVERRIDES['terms-and-condition-updated']),
  'terms-and-condition-deleted': createEventDefinition('terms-and-condition-deleted', TermsAndConditionDeletedEvent, EVENT_DEFINITION_OVERRIDES['terms-and-condition-deleted']),
  'terms-created': createEventDefinition('terms-created', TermsCreatedEvent, EVENT_DEFINITION_OVERRIDES['terms-created']),
  'terms-updated': createEventDefinition('terms-updated', TermsUpdatedEvent, EVENT_DEFINITION_OVERRIDES['terms-updated']),
  'terms-version-activated': createEventDefinition('terms-version-activated', TermsVersionActivatedEvent, EVENT_DEFINITION_OVERRIDES['terms-version-activated']),
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
