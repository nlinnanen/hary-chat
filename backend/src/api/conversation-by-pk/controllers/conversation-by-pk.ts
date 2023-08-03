/**
 * A set of functions called "actions" for `conversation-by-pk`
 */

export default {
  getConversationByPk: async (ctx, next) => {
    try {
      const result = await strapi.entityService.findMany(
        "api::conversation.conversation",
        {
          populate: {
            messages: true,
            harys: true
          },
          filters: {
            uuid: ctx.params.publicKey,
          }
        }
      );
      if(result.length !== 0) {
        ctx.body = result[0];
      } else {
        ctx.response.status = 404;
        throw new Error('No conversation found');
      }
    } catch (err) {
      ctx.body = err;
    }
  }
};
