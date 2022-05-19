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

  isFor(guard) {
    return this.guard === guard;
  }

  information() {
    return `${this.guard.information()} - ${this.physiotherapist}`;
  }
}

const guards = [
  new Guard(1, new Date(new Date().getTime() + 60 * 60 * 24 * 1000)),
  new Guard(2, new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 2)),
  new Guard(3, new Date(new Date().getTime() + 60 * 60 * 24 * 1000 * 3)),
];

const assignations = [new Assignation(guards[0], "Pablo")];

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
            callback_data: "/guards/get",
          },
        ],
        [
          {
            text: "Eliminar Guardias",
            callback_data: "/guards/delete",
          },
        ],
      ],
    },
  });
});

bot.action("/guards/get", (ctx) =>
  ctx.reply("Estos son los dias de guardias a cubrir", {
    reply_markup: {
      inline_keyboard: guards.map((guard) => [
        {
          text: guard.information(),
          callback_data: `/guards/${guard.id}/get`,
        },
      ]),
    },
  })
);

bot.action("/guards/delete", (ctx) =>
  ctx.reply("Estas son las guardias a eliminar", {
    reply_markup: {
      inline_keyboard: guards.map((guard) => [
        {
          text: guard.information(),
          callback_data: `/guards/${guard.id}/get`,
        },
        {
          text: "Borrar",
          callback_data: `/guards/${guard.id}/delete`,
        },
      ]),
    },
  })
);

bot.action(new RegExp("/guards/[^]+/get", "i"), (ctx) => {
  const guardId = ctx.match.input.split("/")[2];
  const guard = guards.find((guard) => String(guard.id) === guardId);
  const guardAssignations = assignations.filter((assignation) =>
    assignation.isFor(guard)
  );

  if (guardAssignations.length) {
    ctx.reply(
      `Estas son las asignaciones de la guardia ${guardAssignations[0].information()}`
    );
  } else {
    ctx.reply(`No hay asignaciones para la guardia ${guard.information()}`);
  }
});

bot.action(new RegExp("/guards/[^]+/delete", "i"), (ctx) => {
  const guardId = ctx.match.input.split("/")[2];
  const guard = guards.find((guard) => String(guard.id) === guardId);
  const deletedGuard = guards.splice(guards.indexOf(guard), 1)

  if (deletedGuard) {
    ctx.reply(
      `Guardia eliminada exitosamente!`
    );
  } else {
    ctx.reply(`Error al eliminar la guardia.`);
  }
});

bot.launch();
