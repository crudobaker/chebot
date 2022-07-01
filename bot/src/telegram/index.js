import { Telegraf } from "telegraf";
import {
  guards,
  physiotherapists,
  findUserById,
  getNextAssignationForUser,
  getGuardAssignations,
  deleteGuard,
  getNotAssignedGuards,
  assignGuardToPhysiotherapist,
} from "core/src/data.js";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);


//============================================================================
// BOT CONFIGURATION
//============================================================================
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
            text: "Guardias para Asignar",
            callback_data: `getNotAssignedGuards`,
          },
        ],
        [
          {
            text: "Mi Próxima Guardia a Cubrir",
            callback_data: createCallbackQuery(
              "getNextAssignedGuardForUser",
              user.id
            ),
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
            text: guard.info(),
            callback_data: "x",
          },
          {
            text: "Info",
            callback_data: createCallbackQuery("getGuardInformation", guard.id),
          },
          {
            text: "Borrar",
            callback_data: createCallbackQuery("deleteGuard", guard.id),
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
            text: guard.info(),
            callback_data: "x",
          },
          {
            text: "Asignar",
            callback_data: createCallbackQuery(
              "showAssignOptionsForGuard",
              guard.id
            ),
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
    const [guardId] = readCallbackQueryParams(ctx);
    const guardAssignations = getGuardAssignations(guardId);

    if (guardAssignations.length) {
      const guardAssignationsInformations = guardAssignations
        .map((guardAssignation) => guardAssignation.info())
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

bot.action(new RegExp("getNextAssignedGuardForUser"), (ctx) => {
  try {
    const [userId] = readCallbackQueryParams(ctx);
    const nextAssignation = getNextAssignationForUser(userId);
    ctx.reply(`Su próxima asignación es ${nextAssignation.info()}`);
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action(new RegExp("deleteGuard"), (ctx) => {
  const [guardId] = readCallbackQueryParams(ctx);
  deleteGuard(guardId);
  ctx.reply(`Guardia eliminada exitosamente!`);
});

bot.action(new RegExp("showAssignOptionsForGuard"), (ctx) => {
  const [guardId] = readCallbackQueryParams(ctx);
  ctx.reply("Profesionales disponibles para asignar", {
    reply_markup: {
      inline_keyboard: physiotherapists.map((physiotherapist) => [
        {
          text: physiotherapist.info(),
          callback_data: "x",
        },
        {
          text: "Asignar",
          callback_data: createCallbackQuery(
            "assignGuardToPhysiotherapist",
            guardId,
            physiotherapist.id
          ),
        },
      ]),
    },
  });
});

bot.action(new RegExp("assignGuardToPhysiotherapist"), (ctx) => {
  try {
    const [guardId, physiotherapistId] = readCallbackQueryParams(ctx);
    const newAssignation = assignGuardToPhysiotherapist(
      guardId,
      physiotherapistId
    );
    ctx.reply(`Guardia asignada existosamente!\n${newAssignation.info()}`);
  } catch (error) {
    ctx.reply("Error al asignar la guardia.");
  }
});

bot.launch();


//============================================================================
// BOT UTILS FUNCTIONS
//============================================================================
/**
 * Reads params from the callback_query object from the context.
 * @params ctx: the Telegraf context
 * @return {Array} a list of number params
 */
function readCallbackQueryParams(ctx) {
  const params = ctx.update.callback_query.data.split("=")[1].split("|");
  return params.map(Number);
}

/**
 * Creates the callback_query string data following the conventions.
 * @params {string} actionName: name of the bot action.
 * @params {array} params: a list of params to pass.
 * @return {string} a string to use for the callback_query.
 */
function createCallbackQuery(actionName, ...params) {
  return `${actionName}?params=${params.join("|")}`;
}
