const addRepliesMessages = (ctx, next) => {
  ctx.error = (message, args) => ctx.reply(`❗${message}`, args);
  ctx.warning = (message, args) => ctx.reply(`⚠️ ${message}`, args);
  ctx.info = (message, args) => ctx.reply(`ℹ️ ${message}`, args);
  ctx.success = (message, args) => ctx.reply(`✅ ${message}`, args);
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
const configureMainMenuCommands = (ctx, next) => {
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
/**
 * This function creates a Calendar date picker, with a basic configuration and make it available from the ctx.state object.
 * Also transforms the date info, from string into a Date object, to avoid dealing with transformations in the business code.
 * @param {*} bot
 */
const addCalendarPicker = (bot) => (ctx, next) => {
  const calendar = new Calendar(bot, {
    weekDayNames: ["D", "L", "M", "M", "J", "V", "S"],
    monthNames: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
  });
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

/**
 * This function makes a monkey-patching for the bot action function. It is basically
 * a dynamic replacement of attributes at runtime. So, when you specify a bot action name,
 * the action is registered with a regexp that matches the action name starts-with condition.
 * @param {Object} bot
 */
const configureActionsRegEx = (bot) => {
  const actionFunction = bot.action;
  bot.action = (name, callback) =>
    Reflect.apply(actionFunction, bot, [new RegExp(`^${name}`), callback]);
};

export default function configureMiddlewares(bot) {
  bot.use(
    addRepliesMessages,
    errorHandling,
    addUser,
    configureMainMenuCommands,
    addCalendarPicker(bot),
    configureActionsRegEx(bot)
  );
}
