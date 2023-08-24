/**
 * A set of functions called "actions" for `conversation-by-pk`
 */

export default {
  getConversationByUuid: async (ctx, next) => {
    try {
      const result = await strapi.entityService.findMany(
        "api::conversation.conversation",
        {
          populate: {
            messages: true,
            harys: true,
          },
          filters: {
            uuid: ctx.params.uuid,
          },
        }
      );
      if (result.length !== 0) {
        ctx.body = result[0];
      } else {
        ctx.response.status = 404;
        throw new Error("No conversation found");
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  getConversationsByUuids: async (ctx, next) => {
    const { uuids } = ctx.request.body.data;
    if(Array.isArray(uuids) === false) {
      ctx.response.status = 400;
      ctx.body = "uuids must be an array";
      return next()
    }
    try {
      const result = await strapi.entityService.findMany(
        "api::conversation.conversation",
        {
          filters: {
            uuid: {
              $in: uuids,
            },
          },
        }
      );
      if (result.length !== 0) {
        ctx.body = result;
      } else {
        ctx.response.status = 404;
        ctx.body.message = "No conversations found";
        strapi.log.error("No conversations found");
      }
    } catch (err) {
      ctx.body = err;
    }
  },
  deleteConversationByUuid: async (ctx, next) => {
    try {
      const result = await strapi.entityService.findMany(
        "api::conversation.conversation",
        {
          populate: {
            messages: true,
            harys: true,
          },
          filters: {
            uuid: ctx.params.uuid,
          },
        }
      );
      if (result.length !== 0) {
        const conversation = result[0];
        await strapi.entityService.delete(
          "api::conversation.conversation",
          conversation.id
        );
        ctx.body = conversation;
        ctx.status = 200;
      } else {
        ctx.response.status = 404;
        throw new Error("No conversation found");
      }
    } catch (err) {
      ctx.body = err;
    }
  }
};
