import agenda from "../init.js";
import { DEFAULT_COMMANDS, COORDINATOR_COMMANDS } from "./commands/index.js";

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

const configureCommands = (ctx, next) => {
  try {
    const { user } = ctx.state;
    if (user.isCoordinator()) {
      ctx.telegram.setMyCommands(COORDINATOR_COMMANDS);
    } else {
      ctx.telegram.setMyCommands(DEFAULT_COMMANDS);
    }
    return next();
  } catch (error) {
    ctx.error("Error adding commands.");
  }
};

export default function configureMiddlewares(bot) {
  bot.use(addRepliesMessages, errorHandling, addUser, configureCommands);
}
