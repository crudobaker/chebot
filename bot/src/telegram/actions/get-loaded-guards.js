import agenda from "../../init.js";
import { newValueButton, newActionButton } from "../keyboard-utils.js";
import { GET_GUARD_INFORMATION } from "./get-guard-information.js";
import { DELETE_GUARD } from "./delete-guard.js";

export const GET_LOADED_GUARDS = {
  name: "get-loaded-guards",
  apply: (ctx) => {
    const guards = agenda.getAllGuards();
    if (guards.length > 0) {
      ctx.reply("Estos son los dias de guardias", {
        reply_markup: {
          inline_keyboard: guards.map((guard) => [
            newValueButton(guard.dateInfo()),
            newActionButton("ℹ️", GET_GUARD_INFORMATION.name, [guard.id]),
            newActionButton("❌", DELETE_GUARD.name, [guard.id]),
          ]),
        },
      });
    } else {
      ctx.info("No hay guardias cargadas");
    }
  },
};
