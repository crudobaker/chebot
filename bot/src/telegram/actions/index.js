import { GET_LOADED_GUARDS } from "bot/src/telegram/actions/get-loaded-guards.js";
import { GET_NOT_COVERED_GUARDS } from "bot/src/telegram/actions/get-not-covered-guards.js";
import { GET_GUARD_INFORMATION } from "bot/src/telegram/actions/get-guard-information.js";
import { DELETE_GUARD } from "bot/src/telegram/actions/delete-guard.js";
import { GET_AVAILABLE_USER_FOR_ASSIGN } from "bot/src/telegram/actions/get-available-user-for-assign.js";
import { ASSIGN_GUARD } from "bot/src/telegram/actions/assign-guard.js";

export default function configureActions(bot) {
  bot.action(GET_LOADED_GUARDS.name, GET_LOADED_GUARDS.apply);
  bot.action(GET_NOT_COVERED_GUARDS.name, GET_NOT_COVERED_GUARDS.apply);
  bot.action(
    new RegExp(GET_GUARD_INFORMATION.name),
    GET_GUARD_INFORMATION.apply
  );
  bot.action(new RegExp(DELETE_GUARD.name), DELETE_GUARD.apply);
  bot.action(
    new RegExp(GET_AVAILABLE_USER_FOR_ASSIGN.name),
    GET_AVAILABLE_USER_FOR_ASSIGN.apply
  );
  bot.action(new RegExp(ASSIGN_GUARD.name), ASSIGN_GUARD.apply);
}
