export default {
  /**
   * For security reasons, we delete messages older than 6 months
   */

  deleteOldMessages: {
    task: async ({ strapi }) => {
      // Get all conversations updated in the last 6 months
      const conversations = await strapi.entityService.findMany(
        "api::conversation.conversation",
        {
          filters: {
            updatedAt: {
              $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          populate: {
            messages: true,
          },
          fields: ["id", "updatedAt"],
        }
      );
      const conversationIds = conversations.map((conversation) => conversation.id);
      const messageIds = conversations.flatMap((conversation) => conversation.messages.map((message) => message.id));

      // Delete all messages and conversations
      await Promise.all(messageIds.map((messageId) => strapi.entityService.delete("api::message.message", messageId)));
      await Promise.all(conversationIds.map((conversationId) => strapi.entityService.delete("api::conversation.conversation", conversationId)));
      console.log("Deleted conversations: ", conversationIds)
    },
    options: {
      rule: "* * 0 * * *",
    },
  },
};
