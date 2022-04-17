const { Telegraf } = require("telegraf");
const BOT_TOKEN = "5110592591:AAHQ28z7FJnPArRyL3k1FAN7H0IscRBOQTc";

const bot = new Telegraf(BOT_TOKEN);

bot.help((ctx) => {
  ctx.reply("These are my known commands: /hello");
});

bot.command("hello", (ctx) => {
  ctx.reply(`Hola querido ${ctx.update.message.from.first_name}`);
});

bot.launch();
