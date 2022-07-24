import Calendar from "telegraf-calendar-telegram";
import { toDate, formatDate } from "core/src/date-utils.js";
import { newActionButton } from "bot/src/telegram/keyboard-utils.js";

const name = "create-guard";
const createGuard = (bot) => (ctx) => {
  try {
    const calendar = new Calendar(bot);
    calendar.setDateListener((context, date) => {
      const dateObj = toDate(date);
      const options = {
        reply_markup: {
          inline_keyboard: [
            [newActionButton("Si", "x"), newActionButton("No", "x")],
          ],
        },
      };
      context.reply(
        `Desea crear una guardia para la fecha ${formatDate(dateObj)}?`,
        options
      );
    });
    ctx.reply("Elija una fecha para la nueva guardia:", calendar.getCalendar());
  } catch (error) {
    ctx.error("Error al crear la guardia.");
  }
};

const configure = (bot) => {
  bot.action(name, createGuard(bot));
};

export const CREATE_GUARD = { name, configure };
