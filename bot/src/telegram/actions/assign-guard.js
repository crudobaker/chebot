import agenda from "bot/src/init.js";
import {
  GUARD_ALREADY_HAPPEND,
  GUARD_ALREADY_ASSIGNED_TO_USER,
  GUARD_ALREADY_COVERED,
} from "core/src/model/guard.js";
import { readCallbackQueryParams } from "bot/src/telegram/keyboard-utils.js";

const name = "assign-guard";

const assignGuard = (ctx) => {
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
};

const configure = (bot) => {
  bot.action(new RegExp(name), assignGuard);
};

export const ASSIGN_GUARD = { name, configure };
