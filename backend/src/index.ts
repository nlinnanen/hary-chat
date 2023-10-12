import { createServer } from "https";
import { Telegraf } from "telegraf";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or pserform some special logic.
   */
  async bootstrap() {
    if (process.env.NODE_ENV === "development") {
      const orval = require("orval");
      console.log("Test")
      orval.generate("./orval.config.js");
      return
    }

    if (!process.env.BOT_TOKEN) {
      throw new Error("Bot token not defined!");
    }

    const bot = new Telegraf(process.env.BOT_TOKEN);

    // // // Workaround to avoid issue with TSconfig
    // // const createWebhookListener = async () => {
    // //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // //   strapi.server.use(async (ctx, next) =>
    // //     (await bot.createWebhook({ domain: process.env.DOMAIN }))(
    // //       ctx.req,
    // //       ctx.res,
    // //       next
    // //     )
    // //   );
    // // };

    bot.start((ctx) => {
      strapi.log.info("In start command.");
      return ctx.reply("Welcome, Your chat id is: " + ctx.chat.id);
    });

    bot.launch();

    strapi.server.use(async (ctx, next) => {
      ctx.state.bot = bot;
      await next();
    });
  },
};
