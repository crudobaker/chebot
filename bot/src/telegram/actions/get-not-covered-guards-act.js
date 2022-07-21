import agenda from "../../init.js";
import { GET_AVAILABLE_USER_FOR_ASSIGN } from "./get-available-user-for-assign-act.js";
import { newValueButton, newActionButton } from "../keyboard-utils.js";

export const GET_NOT_COVERED_GUARDS = {
  action: "get-not-covered-guards",
  description: "Guardias no Cubiertas 📝",
  execute: (ctx) => {
    const notCoveredGuards = agenda.getNotCoveredGuards();
    if (notCoveredGuards.length > 0) {
      ctx.reply("Estos son las guardias no cubiertas", {
        reply_markup: {
          inline_keyboard: notCoveredGuards.map((guard) => [
            newValueButton(guard.dateInfo()),
            newActionButton(
              "Asignar ➕",
              GET_AVAILABLE_USER_FOR_ASSIGN.action,
              [guard.id]
            ),
          ]),
        },
      });
    } else {
      ctx.info("No hay guardias sin asignar.");
    }
  },
};
