import { Telegraf } from "telegraf";
import Guard from "core/src/guard.js";
import Assignation from "core/src/assignation.js"

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

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
            text: "Consultar Guardias",
            callback_data: "GET /guards",
          },
        ],
      ],
    },
  });
});

bot.action("GET /guards", (ctx) => {
  if (guards.length > 0) {
    ctx.reply("Estos son los dias de guardias", {
      reply_markup: {
        inline_keyboard: guards.map((guard) => [
          {
            text: guard.information(),
            callback_data: "jjjj",
          },
          {
            text: "Info",
            callback_data: `GET /guards/${guard.id}`,
          },
          {
            text: "Borrar",
            callback_data: `DELETE /guards/${guard.id}`,
          },
        ]),
      },
    });
  } else {
    ctx.reply("No hay guardias cargadas");
  }
});

bot.action(new RegExp("GET /guards/[^]+", "i"), (ctx) => {
  const guardId = ctx.match.input.split("/")[2];
  const guard = guards.find((guard) => String(guard.id) === guardId);

  if (guard === undefined) {
    ctx.reply(`La guardia no fue encontrada.`);
    return;
  }

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

bot.action(new RegExp("DELETE /guards/[^]+", "i"), (ctx) => {
  const guardId = ctx.match.input.split("/")[2];
  const guard = guards.find((guard) => String(guard.id) === guardId);

  if (guard === undefined) {
    ctx.reply(`La guardia no fue encontrada.`);
    return;
  }

  const guardIndex = guards.indexOf(guard);
  const deletedGuard = guards.splice(guardIndex, 1);

  if (deletedGuard) {
    ctx.reply(`Guardia eliminada exitosamente!`);
  } else {
    ctx.reply(`Error al eliminar la guardia.`);
  }
});

bot.launch();
