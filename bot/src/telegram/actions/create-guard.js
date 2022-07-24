import agenda from "bot/src/init.js";
import { formatDate } from "core/src/date-utils.js";
import {
  newActionButton,
  readCallbackQueryParams,
} from "bot/src/telegram/keyboard-utils.js";

const name = "create-guard";
const createGuardName = "create-guard-yes";

const initCreateGuardFlow = (ctx) => {
  try {
    const { calendar } = ctx.state;
    calendar.onDateSelect((context, date) => {
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              newActionButton("Si", createGuardName, date.getTime()),
              newActionButton("Cancelar", "x"),
            ],
          ],
        },
      };
      context.reply(
        `Desea crear una guardia para la fecha ${formatDate(date)}?`,
        options
      );
    });
    ctx.reply("Elija una fecha para la nueva guardia:", calendar.markup());
  } catch (error) {
    console.log(error)
    ctx.error("Error al crear la guardia.");
  }
};

const createGuard = (ctx) => {
  const [dateTimeGuard] = readCallbackQueryParams(ctx);
  const dateGuard = new Date(Number(dateTimeGuard));
  agenda.createGuard(dateGuard);
  ctx.success(
    `La guardia para la fecha ${formatDate(dateGuard)} fue creada con éxito.`
  );
};

const configure = (bot) => {
  bot.action(name, initCreateGuardFlow);
  bot.action(new RegExp(createGuardName), createGuard);
};

export const CREATE_GUARD = { name, configure };
