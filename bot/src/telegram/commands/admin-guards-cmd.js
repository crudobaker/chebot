import { newActionButton } from "bot/src/telegram/keyboard-utils.js";
import { GET_LOADED_GUARDS } from "bot/src/telegram/actions/get-loaded-guards.js";
import { GET_NOT_COVERED_GUARDS } from "bot/src/telegram/actions/get-not-covered-guards.js";

export const ADMIN_GUARDS = {
  name: "admin_guards",
  description: "📝 Administrar Guardias",
  apply: (ctx) => {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [newActionButton("Guardias Cargadas 🗂️", GET_LOADED_GUARDS.name)],
          [
            newActionButton(
              "Guardias No Cubiertas 📝",
              GET_NOT_COVERED_GUARDS.name
            ),
          ],
        ],
      },
    };
    ctx.reply("Estas son las opciones de administración:", options);
  },
};
