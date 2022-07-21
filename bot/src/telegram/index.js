import { Telegraf } from "telegraf";
import {
  addRepliesMessages,
  errorHandling,
  addUser,
  configureCommands,
} from "./middlewares.js";
const token = process.env.BOT_TOKEN;
const bot = new Telegraf(token);

//============================================================================
// BOT CONFIGURATION
//============================================================================
// add middlewares
bot.use(addRepliesMessages, errorHandling, addUser, configureCommands);

bot.help((ctx) => {
  const { user } = ctx.state;
  ctx.reply(
    `Hola ${user.firstName} 👋. Soy El Guardian 🤖.\n\n Presiona el botón menú para ver las opciones disponibles.`
  );
});

import { MY_GUARDS } from "./commands/my-guards-cmd.js";
bot.command(MY_GUARDS.command, MY_GUARDS.execute);

import { MY_NEXT_GUARD } from "./commands/my-next-guard-cmd.js";
bot.command(MY_NEXT_GUARD.command, MY_NEXT_GUARD.execute);

import { ADMIN_GUARDS } from "./commands/admin-guards-cmd.js";
bot.command(ADMIN_GUARDS.command, ADMIN_GUARDS.execute);

import { GET_LOADED_GUARDS } from "./actions/get-loaded-guards-act.js";
bot.action(GET_LOADED_GUARDS.action, GET_LOADED_GUARDS.execute);

import { GET_NOT_COVERED_GUARDS } from "./actions/get-not-covered-guards-act.js";
bot.action(GET_NOT_COVERED_GUARDS.action, GET_NOT_COVERED_GUARDS.execute);

import { GET_GUARD_INFORMATION } from "./actions/get-guard-information-act.js";
bot.action(
  new RegExp(GET_GUARD_INFORMATION.action),
  GET_GUARD_INFORMATION.execute
);

import { DELETE_GUARD } from "./actions/delete-guard-act.js";
bot.action(new RegExp(DELETE_GUARD.action), DELETE_GUARD.execute);

import { GET_AVAILABLE_USER_FOR_ASSIGN } from "./actions/get-available-user-for-assign-act.js";
bot.action(
  new RegExp(GET_AVAILABLE_USER_FOR_ASSIGN.action),
  GET_AVAILABLE_USER_FOR_ASSIGN.execute
);

import { ASSIGN_GUARD } from "./actions/assign-guard-act.js";
bot.action(new RegExp(ASSIGN_GUARD.action), ASSIGN_GUARD.execute);

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
