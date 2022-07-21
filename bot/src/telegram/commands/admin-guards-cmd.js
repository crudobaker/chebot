import { newActionButton } from "../keyboard-utils.js";
import { GET_LOADED_GUARDS } from "../actions/get-loaded-guards.js";
import { GET_NOT_COVERED_GUARDS } from "../actions/get-not-covered-guards.js";

export const ADMIN_GUARDS = {
  command: "admin_guards",
  description: "📝 Administrar Guardias",
  execute: (ctx) => {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            newActionButton(
              GET_LOADED_GUARDS.description,
              GET_LOADED_GUARDS.action
            ),
          ],
          [newActionButton(GET_NOT_COVERED_GUARDS.description, GET_NOT_COVERED_GUARDS.action)],
        ],
      },
    };
    ctx.reply("Estas son las opciones de administración:", options);
  },
};
