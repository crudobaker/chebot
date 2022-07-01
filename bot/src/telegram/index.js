import { Telegraf } from "telegraf";
import {
  guards,
  physiotherapists,
  findUserById,
  findGuardById,
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
          newActionButton("Guardias Cargadas", "getLoadedGuards"),
          newActionButton("Guardias para Asignar", "getNotAssignedGuards"),
        ],
        [
          newActionButton(
            "Mi Próxima Guardia a Cubrir",
            createCallbackQuery("getNextAssignedGuardForUser", user.id)
          ),
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
          newValueButton(guard.info()),
          newActionButton(
            "Info",
            createCallbackQuery("getGuardInformation", guard.id)
          ),
          newActionButton(
            "Borrar",
            createCallbackQuery("deleteGuard", guard.id)
          ),
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
          newValueButton(guard.info()),
          newActionButton(
            "Asignar",
            createCallbackQuery("showAssignOptionsForGuard", guard.id)
          ),
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
      const guard = findGuardById(guardId);
      ctx.reply(`La guardia ${guard.info()} no tiene asignaciones.`);
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
        newValueButton(physiotherapist.info()),
        newActionButton(
          "Asignar",
          createCallbackQuery(
            "assignGuardToPhysiotherapist",
            guardId,
            physiotherapist.id
          )
        ),
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
 * @param {object} ctx: the Telegraf context
 * @return {Array} a list of number params
 */
function readCallbackQueryParams(ctx) {
  const params = ctx.update.callback_query.data.split("=")[1].split("|");
  return params.map(Number);
}

/**
 * Creates the callback_query string data following the conventions.
 * @param {string} actionName: name of the bot action.
 * @param {array} params: a list of params to pass.
 * @return {string} a string to use for the callback_query.
 */
function createCallbackQuery(actionName, ...params) {
  return `${actionName}?params=${params.join("|")}`;
}

/**
 * @param {string} text the button text
 * @param {string} action the button callback_query
 * @return {object} the structure of a Button with an action
 */
function newActionButton(text, action) {
  return {
    text,
    callback_data: action,
  };
}

/**
 * @param {string} text the button tester text
 * @return {object} the structure of a button without an action associated
 */
function newValueButton(text) {
  return {
    text,
    callback_data: "x", //we need to pass something here
  };
}
