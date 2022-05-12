const { Telegraf } = require("telegraf");
const { format } = require("date-fns");

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

class Guard {
  constructor(date) {
    this.date = date;
  }

  information() {
    return format(this.date, "dd/MM/yyyy");
  }
}

class Assignation {
  constructor(guard, physiotherapist) {
    this.guard = guard;
    this.physiotherapist = physiotherapist;
  }
}

const guards = [
  new Guard(new Date(new Date().getTime() + 60 * 60 * 24 * 1000)),
  new Guard(new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 2)),
  new Guard(new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 3)),
];

const assignations = [];

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  ctx.reply(`Hola ${ctx.update.message.from.first_name}. Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Consultar Dias de Guardias",
            callback_data: "consultar-guardias",
          },
        ],
      ],
    },
  });
});

bot.action("consultar-guardias", (ctx) =>
  ctx.reply("Estos son los dias de guardias a cubrir", {
    reply_markup: {
      inline_keyboard: guards.map((guard) => [
        { text: guard.information(), callback_data: "guardia-options" },
      ]),
    },
  })
);

bot.action(
  "guardia-options",
  (ctx) => (console.log(ctx.update.callback_query.message),
  ctx.reply("A quien desea asignar?", {
    reply_markup: {
      inline_keyboard: guards.map((guard) => [
        { text: guard.information(), callback_data: "guardia-options" },
      ]),
    },
  }))
);

bot.launch();
