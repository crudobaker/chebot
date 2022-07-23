import agenda from "bot/src/init.js";
import { readCallbackQueryParams } from "bot/src/telegram/keyboard-utils.js";

export const DELETE_GUARD = {
  name: "delete-guard",
  apply: (ctx) => {
    try {
      const [guardId] = readCallbackQueryParams(ctx);
      const deletedGuard = agenda.deleteGuard(guardId);
      ctx.success(
        `La guardia ${deletedGuard.dateInfo()} fue eliminada exitosamente!`
      );
    } catch (error) {
      ctx.error("Error al eliminar la guardia.");
    }
  },
};
