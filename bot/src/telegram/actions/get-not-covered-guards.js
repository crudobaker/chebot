import agenda from "bot/src/init.js";
import { GET_AVAILABLE_USER_FOR_ASSIGN } from "bot/src/telegram/actions/get-available-user-for-assign.js";
import {
  newValueButton,
  newActionButton,
} from "bot/src/telegram/keyboard-utils.js";

export const GET_NOT_COVERED_GUARDS = {
  name: "get-not-covered-guards",
  apply: (ctx) => {
    const notCoveredGuards = agenda.getNotCoveredGuards();
    if (notCoveredGuards.length > 0) {
      ctx.reply("Estos son las guardias no cubiertas", {
        reply_markup: {
          inline_keyboard: notCoveredGuards.map((guard) => [
            newValueButton(guard.dateInfo()),
            newActionButton("Asignar ➕", GET_AVAILABLE_USER_FOR_ASSIGN.name, [
              guard.id,
            ]),
          ]),
        },
      });
    } else {
      ctx.info("No hay guardias sin asignar.");
    }
  },
};
