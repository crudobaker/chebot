const { Telegraf } = require("telegraf");
const { format } = require("date-fns");

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  ctx.reply(`Hola ${ctx.update.message.from.first_name}. Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [{ text: "Inicio Guardia", callback_data: "inicio-guardia" }],
        [{ text: "Fin Guardia", callback_data: "fin-guardia" }],
      ],
    },
  });
});

bot.action("inicio-guardia", (ctx) =>
  ctx.reply(
    `Guardia iniciada a las ${format(new Date(), "dd/MM/yyyy hh:mm")} para ${
      ctx.update.callback_query.from.first_name
    }.`
  )
);

bot.action("fin-guardia", (ctx) =>
  ctx.reply(
    `Guardia finalizada a las ${format(new Date(), "dd/MM/yyyy hh:mm")} para ${
      ctx.update.callback_query.from.first_name
    }.`
  )
);

bot.launch();
