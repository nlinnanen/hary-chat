/**
 * hary router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::hary.hary', {
  only: ['find', 'findMany', 'create'],
  config: {}
});
