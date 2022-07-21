import { GET_LOADED_GUARDS } from "./get-loaded-guards.js";
import { GET_NOT_COVERED_GUARDS } from "./get-not-covered-guards.js";
import { GET_GUARD_INFORMATION } from "./get-guard-information.js";
import { DELETE_GUARD } from "./delete-guard.js";
import { GET_AVAILABLE_USER_FOR_ASSIGN } from "./get-available-user-for-assign.js";
import { ASSIGN_GUARD } from "./assign-guard.js";

export default function configureActions(bot) {
  bot.action(GET_LOADED_GUARDS.action, GET_LOADED_GUARDS.execute);
  bot.action(GET_NOT_COVERED_GUARDS.action, GET_NOT_COVERED_GUARDS.execute);
  bot.action(
    new RegExp(GET_GUARD_INFORMATION.action),
    GET_GUARD_INFORMATION.execute
  );
  bot.action(new RegExp(DELETE_GUARD.action), DELETE_GUARD.execute);
  bot.action(
    new RegExp(GET_AVAILABLE_USER_FOR_ASSIGN.action),
    GET_AVAILABLE_USER_FOR_ASSIGN.execute
  );
  bot.action(new RegExp(ASSIGN_GUARD.action), ASSIGN_GUARD.execute);
}
