import { Telegraf } from "telegraf";
import configureMiddlewares from "./middlewares.js";
import configureCommands from "./commands/index.js";
import configureActions from "./actions/index.js";
const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

configureMiddlewares(bot);

bot.help((ctx) => {
  const { user } = ctx.state;
  ctx.reply(
    `Hola ${user.firstName} 👋. Soy El Guardian 🤖.\n\n Presiona el botón menú para ver las opciones disponibles.`
  );
});

configureCommands(bot);
configureActions(bot);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
