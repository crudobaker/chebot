import { Telegraf } from "telegraf";
import configureMiddlewares from "bot/src/telegram/middlewares.js";
import configureCommands from "bot/src/telegram/commands/index.js";
import configureActions from "bot/src/telegram/actions/index.js";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

configureMiddlewares(bot);
configureCommands(bot);
configureActions(bot);

bot.help((ctx) => {
  const { user } = ctx.state;
  ctx.reply(
    `Hola ${user.firstName} 👋. Soy El Guardian 🤖.\n\n Presiona el botón menú para ver las opciones disponibles.`
  );
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
