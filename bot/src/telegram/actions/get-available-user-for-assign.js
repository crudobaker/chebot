import agenda from "bot/src/init.js";
import {
  newValueButton,
  newActionButton,
  readCallbackQueryParams,
} from "bot/src/telegram/keyboard-utils.js";
import { ASSIGN_GUARD } from "bot/src/telegram/actions/assign-guard.js";

export const GET_AVAILABLE_USER_FOR_ASSIGN = {
  name: "get-available-user-for-assign",
  apply: (ctx) => {
    const [guardId] = readCallbackQueryParams(ctx);
    ctx.reply("Usuarios disponibles para asignar:", {
      reply_markup: {
        inline_keyboard: agenda
          .getAllUsers()
          .map((user) => [
            newValueButton(user.info()),
            newActionButton("Asignar 🧑", ASSIGN_GUARD.name, [
              guardId,
              user.id,
            ]),
          ]),
      },
    });
  },
};
