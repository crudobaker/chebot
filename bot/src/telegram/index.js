import { Telegraf } from "telegraf";
import { addRepliesMessages, errorHandling, addUser } from "./middlewares.js";
import agenda from "../init.js";

const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

//============================================================================
// BOT CONFIGURATION
//============================================================================
// add middlewares
bot.use(addRepliesMessages, errorHandling, addUser);

bot.help((ctx) => {
  ctx.reply(
    "Estas son mis acciones disponibles: \n\n/hola: Nos saludamos y te ofrezco las diferentes acciones para que comencemos a interactuar."
  );
});

bot.command("hola", (ctx) => {
  const { user } = ctx.state;
  const message = `Hola ${user.firstName} 👋. Soy JuanBot 🤖. ¿Qué deseas hacer?`;
  const userOptions = {
    reply_markup: {
      inline_keyboard: [
        [
          newActionButton("Guardias Cargadas 🗂️", "getLoadedGuards"),
          newActionButton("Guardias no Cubiertas 📝", "getNotCoveredGuards"),
        ],
        [
          newActionButton("Mi Próxima Guardia ⏰", "getNextGuardForUser"),
          newActionButton("Mis Guardias 🗓️", "getAllNextGuardsForUser"),
        ],
      ],
    },
  };

  const userOptionsNoCoordinator = {
    reply_markup: {
      inline_keyboard: [
        [
          newActionButton("Mi Próxima Guardia ⏰", "getNextGuardForUser"),
          newActionButton("Mis Guardias 🗓️", "getAllNextGuardsForUser"),
        ],
      ],
    },
  };

  if (user.isCoordinator()) {
    ctx.reply(message, userOptions);
  } else {
    ctx.reply(message, userOptionsNoCoordinator);
  }
});

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
    ctx.error(error.message);
  }
});

bot.action(new RegExp("getNextGuardForUser"), (ctx) => {
  try {
    const { user } = ctx.state;
    const guard = agenda.getNextGuardForUser(user);
    ctx.info(`${user.info()}, su próxima asignación es el ${guard.dateInfo()}`);
  } catch (error) {
    if (error.message === "Next guard not found.") {
      ctx.warning(`${user.info()} no tiene una próxima guardia asignada.`);
    }
    ctx.error("Error al recuperar la guardia.");
  }
});

bot.action(new RegExp("getAllNextGuardsForUser"), (ctx) => {
  try {
    const { user } = ctx.state;
    const guards = agenda.getAllNextGuardsForUser(user);

    if (guards.length === 0) {
      ctx.warning(`${user.info()} no tiene guardias asignadas.`);
    }
    const guardsInfo = guards.map((guard) => guard.dateInfo()).join("\n");
    ctx.info(`${user.info()}, sus guardias asignadas son:\n${guardsInfo}`);
  } catch (error) {
    ctx.error("Error al recuperar las guardias.");
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
    ctx.error(`${error.message}`);
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
