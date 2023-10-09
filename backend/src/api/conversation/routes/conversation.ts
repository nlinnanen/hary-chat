/**
 * conversation router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::conversation.conversation", {
  only: ["find", "create"],
  config: {},
});
