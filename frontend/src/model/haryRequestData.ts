/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import type { HaryRequestDataAdminUser } from './haryRequestDataAdminUser';
import type { HaryRequestDataConversation } from './haryRequestDataConversation';

export type HaryRequestData = {
  adminUser?: HaryRequestDataAdminUser;
  publicKey?: string;
  conversation?: HaryRequestDataConversation;
};
