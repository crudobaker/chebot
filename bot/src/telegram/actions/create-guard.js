import agenda from "bot/src/init.js";
import { formatDate } from "core/src/date-utils.js";
import {
  yesCancelKeyboard,
  readCallbackQueryParams,
} from "bot/src/telegram/keyboard-utils.js";

const askForConfirmation = (ctx, date) => {
  const options = yesCancelKeyboard({
    yes: { name: createGuardAction, params: date.getTime() },
  });
  ctx.info(
    `Desea crear una guardia para la fecha ${formatDate(date)}?`,
    options
  );
};

const initCreateGuardFlow = (ctx) => {
  try {
    const { calendar } = ctx.state;
    calendar.onDateSelect((context, date) => {
      askForConfirmation(context, date);
    });
    ctx.reply("Elija una fecha para la nueva guardia:", calendar.markup());
  } catch (error) {
    ctx.error("Error al crear la guardia.");
  }
};

const createGuard = (ctx) => {
  try {
    const [dateTimeGuard] = readCallbackQueryParams(ctx);
    const dateGuard = new Date(Number(dateTimeGuard));
    agenda.createGuard(dateGuard);
    ctx.success(
      `La guardia para la fecha ${formatDate(dateGuard)} fue creada con éxito.`
    );
  } catch (error) {
    ctx.error("Error al crear la guardia.");
  }
};

const name = "create-guard";
const createGuardAction = "yes-create-guard";
const configure = (bot) => {
  bot.action(name, initCreateGuardFlow);
  bot.action(createGuardAction, createGuard);
};

export const CREATE_GUARD = { name, configure };
