const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.help((ctx) => {
  ctx.reply("These are my known commands: /hello");
});

bot.command("hello", (ctx) => {
  ctx.reply(`Hola querido ${ctx.update.message.from.first_name}`);
});

bot.launch();
