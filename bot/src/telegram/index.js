import { Telegraf } from "telegraf";
import {
  guards,
  physiotherapists,
  findUserById,
  getNextAssignationForUser,
  getAllNextAssignationForUser,
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

  ctx.reply(`Hola ${user.firstName} 👋. Soy JuanBot 🤖. ¿Qué deseas hacer?`, {
    reply_markup: {
      inline_keyboard: [
        [
          newActionButton("Guardias Cargadas 🗂️", "getLoadedGuards"),
          newActionButton("Guardias para Asignar 📝", "getNotAssignedGuards"),
        ],
        [
          newActionButton(
            "Mi Próxima Guardia ⏰",
            createCallbackQuery("getNextAssignedGuardForUser", user.id)
          ),
          newActionButton(
            "Mis Guardias 🗓️",
            createCallbackQuery("getAllNextAssignedGuardsForUser", user.id)
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
          newValueButton(guard.dateInfo()),
          newActionButton(
            "ℹ️",
            createCallbackQuery("getGuardInformation", guard.id)
          ),
          newActionButton("❌", createCallbackQuery("deleteGuard", guard.id)),
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
          newValueButton(guard.dateInfo()),
          newActionButton(
            "Asignar ➕",
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
    const { guard, assignations } = getGuardAssignations(guardId);

    if (assignations.length) {
      const assignationsInformations = assignations
        .map((assignation) => assignation.assignedInfo())
        .join("\n");
      ctx.reply(
        `Estas son las asignaciones de la guardia ${guard.dateInfo()}:\n${assignationsInformations}`
      );
    } else {
      ctx.reply(`La guardia ${guard.dateInfo()} no tiene asignaciones.`);
    }
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action(new RegExp("getNextAssignedGuardForUser"), (ctx) => {
  try {
    const [userId] = readCallbackQueryParams(ctx);
    const { user, assignation } = getNextAssignationForUser(userId);
    ctx.reply(
      `${user.info()}, su próxima asignación es el ${assignation.dateInfo()}`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action(new RegExp("getAllNextAssignedGuardsForUser"), (ctx) => {
  try {
    const [userId] = readCallbackQueryParams(ctx);
    const { user, assignations } = getAllNextAssignationForUser(userId);

    const assignationsInformations = assignations
      .map((assignation) => assignation.dateInfo())
      .join("\n");
    ctx.reply(
      `${user.info()}, sus guardias asignadas son:\n${assignationsInformations}`
    );
  } catch (error) {
    ctx.reply(error.message);
  }
});

bot.action(new RegExp("deleteGuard"), (ctx) => {
  try {
    const [guardId] = readCallbackQueryParams(ctx);
    const deletedGuard = deleteGuard(guardId);
    ctx.reply(
      `La guardia ${deletedGuard.dateInfo()} fue eliminada exitosamente! ✅`
    );
  } catch (error) {
    console.error(error);
    ctx.reply("❗Error al eliminar la guardia.");
  }
});

bot.action(new RegExp("showAssignOptionsForGuard"), (ctx) => {
  const [guardId] = readCallbackQueryParams(ctx);
  ctx.reply("Profesionales disponibles para asignar", {
    reply_markup: {
      inline_keyboard: physiotherapists.map((physiotherapist) => [
        newValueButton(physiotherapist.info()),
        newActionButton(
          "Asignar 🧑",
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
    const { guard, assignation } = assignGuardToPhysiotherapist(
      guardId,
      physiotherapistId
    );
    ctx.reply(
      `✅ La guardia ${guard.dateInfo()} fue asignada existosamente a ${assignation.assignedInfo()}`
    );
  } catch (error) {
    console.error(error);
    ctx.reply(`❗${error.message}.`);
  }
});

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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
