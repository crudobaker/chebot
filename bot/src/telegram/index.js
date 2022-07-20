import { Telegraf } from "telegraf";
import {
  addRepliesMessages,
  errorHandling,
  addUser,
  configureCommands,
} from "./middlewares.js";
import agenda from "../init.js";
import { GUARD_NOT_FOUND } from "core/src/model/agenda.js";
import {
  GUARD_ALREADY_HAPPEND,
  GUARD_ALREADY_ASSIGNED_TO_USER,
  GUARD_ALREADY_COVERED,
} from "core/src/model/guard.js";
import { newActionButton, newValueButton } from "./keyboard-utils.js";
const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

//============================================================================
// BOT CONFIGURATION
//============================================================================
// add middlewares
bot.use(addRepliesMessages, errorHandling, addUser, configureCommands);

bot.help((ctx) => {
  const { user } = ctx.state;
  ctx.reply(
    `Hola ${user.firstName} 👋. Soy El Guardian 🤖.\n\n Presiona el botón menú para ver las opciones disponibles.`
  );
});

import { MY_GUARDS } from "./commands/my-guards-cmd.js";
bot.command(MY_GUARDS.command, MY_GUARDS.execute);

import { MY_NEXT_GUARD } from "./commands/my-next-guard-cmd.js";
bot.command(MY_NEXT_GUARD.command, MY_NEXT_GUARD.execute);

import { ADMIN_GUARDS } from "./commands/admin-guards-cmd.js";
bot.command(ADMIN_GUARDS.command, ADMIN_GUARDS.execute);

bot.action("getLoadedGuards", (ctx) => {
  const guards = agenda.getAllGuards();
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
    ctx.info("No hay guardias cargadas");
  }
});

bot.action("getNotCoveredGuards", (ctx) => {
  const notCoveredGuards = agenda.getNotCoveredGuards();
  if (notCoveredGuards.length > 0) {
    ctx.reply("Estos son las guardias no cubiertas", {
      reply_markup: {
        inline_keyboard: notCoveredGuards.map((guard) => [
          newValueButton(guard.dateInfo()),
          newActionButton(
            "Asignar ➕",
            createCallbackQuery("showAssignOptionsForGuard", guard.id)
          ),
        ]),
      },
    });
  } else {
    ctx.info("No hay guardias sin asignar.");
  }
});

bot.action(new RegExp("getGuardInformation"), (ctx) => {
  try {
    const [guardId] = readCallbackQueryParams(ctx);
    const { guard, users } = agenda.getGuardAssignations(guardId);

    if (users.length > 0) {
      const assignationsInformations = users
        .map((user) => user.info())
        .join("\n");
      ctx.reply(
        `Estas son las asignaciones de la guardia ${guard.dateInfo()}:\n${assignationsInformations}`
      );
    } else {
      ctx.info(`La guardia ${guard.dateInfo()} no tiene asignaciones.`);
    }
  } catch (error) {
    if (error.message === GUARD_NOT_FOUND) {
      ctx.warning(`Guardia no encontrada.`);
    } else {
      ctx.error("Error al recuperar la guardia.");
    }
  }
});

bot.action(new RegExp("deleteGuard"), (ctx) => {
  try {
    const [guardId] = readCallbackQueryParams(ctx);
    const deletedGuard = agenda.deleteGuard(guardId);
    ctx.success(
      `La guardia ${deletedGuard.dateInfo()} fue eliminada exitosamente!`
    );
  } catch (error) {
    ctx.error("Error al eliminar la guardia.");
  }
});

bot.action(new RegExp("showAssignOptionsForGuard"), (ctx) => {
  const [guardId] = readCallbackQueryParams(ctx);
  ctx.reply("Usuarios disponibles para asignar", {
    reply_markup: {
      inline_keyboard: agenda
        .getAllUsers()
        .map((user) => [
          newValueButton(user.info()),
          newActionButton(
            "Asignar 🧑",
            createCallbackQuery("assignGuardToUser", guardId, user.id)
          ),
        ]),
    },
  });
});

bot.action(new RegExp("assignGuardToUser"), (ctx) => {
  try {
    const [guardId, userId] = readCallbackQueryParams(ctx);
    const { guard, user } = agenda.assignGuardToUser(guardId, userId);
    ctx.success(
      `La guardia ${guard.dateInfo()} fue asignada existosamente a ${user.info()}.`
    );
  } catch (error) {
    switch (error.message) {
      case GUARD_ALREADY_HAPPEND:
        ctx.warning("La guardia ya ocurrió.");
        break;
      case GUARD_ALREADY_ASSIGNED_TO_USER:
        ctx.warning("La guardia ya se encuentra asignada al usuario.");
        break;
      case GUARD_ALREADY_COVERED:
        ctx.warning("La guardia ya está cubierta.");
        break;
      default:
        throw error;
    }
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
 * @return {Array} a list of params (string type)
 */
function readCallbackQueryParams(ctx) {
  return ctx.update.callback_query.data.split("=")[1].split("|");
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
