import agenda from "core/src/index.js";

export const addRepliesMessages = (ctx, next) => {
  ctx.error = (message) => ctx.reply(`❗${message}`);
  ctx.warning = (message) => ctx.reply(`⚠️ ${message}`);
  ctx.info = (message) => ctx.reply(`ℹ️ ${message}`);
  ctx.success = (message) => ctx.reply(`✅ ${message}`);
  return next();
};

export const errorHandling = (ctx, next) => {
  try {
    return next();
  } catch (error) {
    console.log(error);
    ctx.error("Unknown error.");
  }
};

export const addUser = (ctx, next) => {
  try {
    const userId = (ctx.update.message || ctx.update.callback_query).from.id;
    const user = agenda.findUserById(String(userId));
    ctx.state.user = user;
    return next();
  } catch (error) {
    ctx.error("Usuario inexistente.");
  }
};
