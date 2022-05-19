const { Telegraf } = require("telegraf");
const { format } = require("date-fns");

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

class Guard {
  constructor(id, date) {
    this.id = id;
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
  new Guard(1, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)),
  new Guard(2, new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 2)),
  new Guard(3, new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 3)),
];

const assignations = [];

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  ctx.reply(`Hola ${ctx.update.message.from.first_name}. ¿Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Consultar Dias de Guardias",
            callback_data: "/guards/query",
          },
        ],
      ],
    },
  });
});

bot.action("/guards/query", (ctx) =>
  ctx.reply("Estos son los dias de guardias a cubrir", {
    reply_markup: {
      inline_keyboard: guards.map((guard) => [
        {
          text: guard.information(),
          callback_data: `/guards/query?id=${guard.id}`,
        },
      ]),
    },
  })
);

bot.action(new RegExp("/guards/query", "i"), (ctx) => {
  const guardId = ctx.match.input.split("id=")[1];
  console.log('guardId', guardId)
  ctx.reply(
    `Usted seleccionó la guardia ${
      guards.find((guard) => String(guard.id) === guardId).information()
    } `
  );
});

bot.launch();
