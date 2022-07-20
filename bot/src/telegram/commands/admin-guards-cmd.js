import { newActionButton } from "../keyboard-utils.js";

export const ADMIN_GUARDS = {
  command: "admin_guards",
  description: "📝 Administrar Guardias",
  execute: (ctx) => {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [newActionButton("Guardias Cargadas 🗂️", "getLoadedGuards")],
          [newActionButton("Guardias no Cubiertas 📝", "getNotCoveredGuards")],
        ],
      },
    };
    ctx.reply("Estas son las opciones de administración:", options);
  },
};
