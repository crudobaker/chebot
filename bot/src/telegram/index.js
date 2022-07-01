import { Telegraf } from "telegraf";
import {
  findUserById,
  guards,
  getNextAssignationForUser,
  getGuardAssignations,
  deleteGuard,
  getNotAssignedGuards,
} from "core/src/data.js";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  const user = findUserById(Number(ctx.update.message.from.id));

  ctx.reply(`Hola ${user.firstName}. ¿Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Guardias Cargadas",
            callback_data: "getLoadedGuards",
          },
          {
            text: "Mi Próxima Guardia a Cubrir",
            callback_data: `getNextAssignedGuardForUser`,
          },
          {
            text: "Guardias para Asignar",
            callback_data: `getNotAssignedGuards`,
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
            callback_data: `getGuardInformation?id=${guard.id}`,
          },
          {
            text: "Borrar",
            callback_data: `deleteGuard?id=${guard.id}`,
          },
        ]),
      },
    });
  } else {
    ctx.reply("No hay guardias cargadas");
  }
});

bot.action("getNotAssignedGuards", (ctx) => {
  const notAssignedGuards = getNotAssignedGuards();
  if (notAssignedGuards.length > 0) {
    ctx.reply("Estos son los días de guardias no asignados", {
      reply_markup: {
        inline_keyboard: notAssignedGuards.map((guard) => [
          {
            text: guard.information(),
            callback_data: "jjjj",
          },
          {
            text: "Info",
            callback_data: `getGuardInformation?id=${guard.id}`,
          },
          {
            text: "Borrar",
            callback_data: `deleteGuard?id=${guard.id}`,
          },
        ]),
      },
    });
  } else {
    ctx.reply("No hay guardias sin asignar");
  }
});

bot.action(new RegExp("getGuardInformation"), (ctx) => {
  try {
    const guardId = Number(ctx.update.callback_query.data.split("=")[1]);
    const guardAssignations = getGuardAssignations(guardId);

    if (guardAssignations.length) {
      const guardAssignationsInformations = guardAssignations
        .map((guardAssignation) => guardAssignation.information())
        .join("\n");
      ctx.reply(
        `Estas son las asignaciones de la guardia:\n${guardAssignationsInformations}`
      );
    } else {
      ctx.reply("La guardia no tiene asignaciones.");
    }
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action("getNextAssignedGuardForUser", (ctx) => {
  try {
    const userId = Number(ctx.update.callback_query.from.id);
    const nextAssignation = getNextAssignationForUser(userId);
    ctx.reply(`Su próxima asignación es ${nextAssignation.information()}`);
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action(new RegExp("deleteGuard"), (ctx) => {
  const guardId = Number(ctx.update.callback_query.data.split("=")[1]);
  deleteGuard(guardId);
  ctx.reply(`Guardia eliminada exitosamente!`);
});

bot.launch();
