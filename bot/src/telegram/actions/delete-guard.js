import agenda from "bot/src/init.js";
import {
  yesCancelKeyboard,
  readCallbackQueryParams,
} from "bot/src/telegram/keyboard-utils.js";

const initGuardDeletionFlow = (ctx) => {
  const [guardId] = readCallbackQueryParams(ctx);
  const guard = agenda.findGuardById(guardId);
  const options = yesCancelKeyboard({
    yes: { name: deleteGuardActionName, params: guardId },
  });
  ctx.warning(
    `Está seguro que desea eliminar la guardia ${guard.dateInfo()}?`,
    options
  );
};

const deleteGuard = (ctx) => {
  try {
    const [guardId] = readCallbackQueryParams(ctx);
    const deletedGuard = agenda.deleteGuard(guardId);
    ctx.success(
      `La guardia ${deletedGuard.dateInfo()} fue eliminada exitosamente!`
    );
  } catch (error) {
    ctx.error("Error al eliminar la guardia.");
  }
};

const name = "delete-guard";
const deleteGuardActionName = "yes-delete-guard";
const configure = (bot) => {
  bot.action(name, initGuardDeletionFlow);
  bot.action(deleteGuardActionName, deleteGuard);
};

export const DELETE_GUARD = { name, configure };
