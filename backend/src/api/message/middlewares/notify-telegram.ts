/**
 * `notify-telegram` middleware
 */

import { Strapi } from "@strapi/strapi";
import { Context, Telegraf } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export default (config, { strapi }: { strapi: Strapi }) => {
  // Add your own logic here.
  return async (ctx, next) => {
    strapi.log.info("In notify-telegram middleware.");

    const bot = ctx.state.bot as Telegraf<Context<Update>>

    if(!bot) {
      strapi.log.error("Bot not defined!")
      return await next();
    }

    const conversationId = ctx.request.body.data.conversation;
    const sender = ctx.request.body.data.sender;
    console.log(typeof conversationId);

    const conversation = await strapi.entityService.findOne(
      "api::conversation.conversation",
      conversationId,
      {
        populate: {
          harys: {
            populate: {
              user: true,
            },
          }
        },
      }
    );
    const chatIds = conversation.harys.map(hary => hary.publicKey !== sender && hary.user?.telegramChatId)
    chatIds.forEach(chatId => {
      chatId && bot.telegram.sendMessage(chatId, `You have a new message\\! [Link to the conversation](${process.env.FRONTEND_URL}hary/conversation/${conversation.uuid})`, { parse_mode: 'MarkdownV2' })
    })


    await next();
  };
};
