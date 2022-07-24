const addRepliesMessages = (ctx, next) => {
  ctx.error = (message) => ctx.reply(`❗${message}`);
  ctx.warning = (message) => ctx.reply(`⚠️ ${message}`);
  ctx.info = (message) => ctx.reply(`ℹ️ ${message}`);
  ctx.success = (message) => ctx.reply(`✅ ${message}`);
  return next();
};

const errorHandling = (ctx, next) => {
  try {
    return next();
  } catch (error) {
    console.log(error);
    ctx.error("Unknown error.");
  }
};

import agenda from "bot/src/init.js";
const addUser = (ctx, next) => {
  try {
    const userId = (ctx.update.message || ctx.update.callback_query).from.id;
    const user = agenda.findUserById(String(userId));
    ctx.state.user = user;
    return next();
  } catch (error) {
    ctx.error("Usuario inexistente.");
  }
};

import {
  DEFAULT_COMMANDS,
  COORDINATOR_COMMANDS,
} from "bot/src/telegram/commands/index.js";
const configureCommands = (ctx, next) => {
  try {
    const { user } = ctx.state;
    let commands = [];
    if (user.isCoordinator()) {
      commands = COORDINATOR_COMMANDS;
    } else {
      commands = DEFAULT_COMMANDS;
    }
    ctx.telegram.setMyCommands(
      commands.map(({ name, description }) => ({
        command: name,
        description,
      }))
    );
    return next();
  } catch (error) {
    ctx.error("Error adding commands.");
  }
};

import Calendar from "telegraf-calendar-telegram";
import { toDate } from "core/src/date-utils.js";
const addCalendarPicker = (bot) => (ctx, next) => {
  const calendar = new Calendar(bot);
  const calendarWrapper = {
    markup: () => calendar.getCalendar(),
    onDateSelect: (callback) => {
      calendar.setDateListener((context, date) => {
        const dateObj = toDate(date);
        callback(context, dateObj);
      });
    },
  };
  ctx.state.calendar = calendarWrapper;
  next();
};

export default function configureMiddlewares(bot) {
  bot.use(
    addRepliesMessages,
    errorHandling,
    addUser,
    configureCommands,
    addCalendarPicker(bot)
  );
}
