/**
 * message router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::message.message', {
  config: {
    create: {
      middlewares: [
        'api::message.notify-telegram'
      ],
      policies: [
        'global::is-valid'
      ]
    }
  }
});
