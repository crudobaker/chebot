/**
 * @param {string} text the button text
 * @param {string} action the button callback_query
 * @param {Array} params to be added at the end of the callback_query
 * @return {object} the structure of a Button with an action
 */
export function newActionButton(text, action, ...params) {
  return {
    text,
    callback_data: params && params.length ? createCallbackQuery(action, params) : action,
  };
}

/**
 * @param {string} text the button tester text
 * @return {object} the structure of a button without an action associated
 */
export function newValueButton(text) {
  return {
    text,
    callback_data: "x", //we need to pass something here
  };
}

/**
 * Reads params from the callback_query object from the context.
 * @param {object} ctx: the Telegraf context
 * @return {Array} a list of params (string type)
 */
export function readCallbackQueryParams(ctx) {
  return ctx.update.callback_query.data.split("=")[1].split("|");
}

/**
 * Creates the callback_query string data following the conventions.
 * @param {string} actionName: name of the bot action.
 * @param {array} params: a list of params to pass.
 * @return {string} a string to use for the callback_query.
 */
function createCallbackQuery(actionName, params) {
  return `${actionName}?params=${params.join("|")}`;
}
