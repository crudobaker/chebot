import agenda from "bot/src/init.js";
import { GUARD_NOT_FOUND } from "core/src/model/agenda.js";
import { readCallbackQueryParams } from "bot/src/telegram/keyboard-utils.js";

const name = "get-guard-information";
const getGuardInformation = (ctx) => {
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
};

const configure = (bot) => {
  bot.action(name, getGuardInformation);
};

export const GET_GUARD_INFORMATION = { name, configure };
