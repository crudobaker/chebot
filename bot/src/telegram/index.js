import { Telegraf } from "telegraf";
import {
  users,
  guards,
  physiotherapists,
  assignations,
} from "core/src/data.js";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  const user = findUser(ctx.update.message.from.id);

  ctx.reply(`Hola ${user.firstName}. ¿Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Consultar Guardias Cargadas",
            callback_data: "getLoadedGuards",
          },
          {
            text: "Mi Próxima Guardia Asignada",
            callback_data: `getNextAssignedGuardForUser`,
          },
        ],
      ],
    },
  });
});

bot.action("getLoadedGuards", (ctx) => {
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
  console.log(ctx.update.callback_query)
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
    ctx.reply("La guardia no tiene asignaciones.");
  }
});

bot.action("getNextAssignedGuardForUser", (ctx) => {
  const user = findUser(ctx.update.callback_query.from.id);
  const physiotherapist = physiotherapists.find((physiotherapist) =>
    physiotherapist.isUser(user)
  );

  if (physiotherapist === undefined) {
    ctx.reply(`El profesional no fue encontrado.`);
    return;
  }

  const nextAssignation = assignations.find((assignation) =>
    assignation.isAssignedTo(physiotherapist)
  );

  if (nextAssignation === undefined) {
    ctx.reply(`No tiene próximas guardias asignadas.`);
    return;
  }

  ctx.reply(`Su próxima asignación es ${nextAssignation.information()}`);
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

function findUser(telegramUserId) {
  const user = users.find((user) => user.hasId(telegramUserId));
  //validate user exists

  return user;
}
