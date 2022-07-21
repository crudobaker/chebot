import agenda from "../../init.js";
import {
  newValueButton,
  newActionButton,
  readCallbackQueryParams,
} from "../keyboard-utils.js";
import { ASSIGN_GUARD } from "./assign-guard.js";

export const GET_AVAILABLE_USER_FOR_ASSIGN = {
  action: "get-available-user-for-assign",
  execute: (ctx) => {
    const [guardId] = readCallbackQueryParams(ctx);
    ctx.reply("Usuarios disponibles para asignar:", {
      reply_markup: {
        inline_keyboard: agenda
          .getAllUsers()
          .map((user) => [
            newValueButton(user.info()),
            newActionButton("Asignar 🧑", ASSIGN_GUARD.action, [
              guardId,
              user.id,
            ]),
          ]),
      },
    });
  },
};
