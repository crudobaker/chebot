import agenda from "bot/src/init.js";
import {
  newValueButton,
  newActionButton,
} from "bot/src/telegram/keyboard-utils.js";
import { GET_GUARD_INFORMATION } from "bot/src/telegram/actions/get-guard-information.js";
import { DELETE_GUARD } from "bot/src/telegram/actions//delete-guard.js";

const getLoadedGuards = (ctx) => {
  const guards = agenda.getAllGuards();
  if (guards.length > 0) {
    ctx.reply("Estos son los dias de guardias", {
      reply_markup: {
        inline_keyboard: guards.map((guard) => [
          newValueButton(guard.dateInfo()),
          newActionButton("ℹ️", GET_GUARD_INFORMATION.name, guard.id),
          newActionButton("❌", DELETE_GUARD.name, guard.id),
        ]),
      },
    });
  } else {
    ctx.info("No hay guardias cargadas");
  }
};

const name = "get-loaded-guards";
const configure = (bot) => {
  bot.action(name, getLoadedGuards);
};

export const GET_LOADED_GUARDS = { name, configure };
