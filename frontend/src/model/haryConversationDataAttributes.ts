/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import type { HaryConversationDataAttributesHarys } from './haryConversationDataAttributesHarys';
import type { HaryConversationDataAttributesMessages } from './haryConversationDataAttributesMessages';
import type { HaryConversationDataAttributesCreatedBy } from './haryConversationDataAttributesCreatedBy';
import type { HaryConversationDataAttributesUpdatedBy } from './haryConversationDataAttributesUpdatedBy';

export type HaryConversationDataAttributes = {
  harys?: HaryConversationDataAttributesHarys;
  messages?: HaryConversationDataAttributesMessages;
  publicKey?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  createdBy?: HaryConversationDataAttributesCreatedBy;
  updatedBy?: HaryConversationDataAttributesUpdatedBy;
};
