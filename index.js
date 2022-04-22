const { Telegraf } = require("telegraf");

const token = process.env.BOT_TOKEN
const bot = new Telegraf(token);

bot.help((ctx) => {
  ctx.reply("These are my known commands: /hello");
});

bot.command("hello", (ctx) => {
  ctx.reply(`Hola querido ${ctx.update.message.from.first_name}`);
});

bot.launch();


