import { GET_LOADED_GUARDS } from "bot/src/telegram/actions/get-loaded-guards.js";
import { GET_NOT_COVERED_GUARDS } from "bot/src/telegram/actions/get-not-covered-guards.js";
import { GET_GUARD_INFORMATION } from "bot/src/telegram/actions/get-guard-information.js";
import { DELETE_GUARD } from "bot/src/telegram/actions/delete-guard.js";
import { GET_AVAILABLE_USER_FOR_ASSIGN } from "bot/src/telegram/actions/get-available-user-for-assign.js";
import { ASSIGN_GUARD } from "bot/src/telegram/actions/assign-guard.js";
import { CREATE_GUARD } from "bot/src/telegram/actions/create-guard.js";

export default function configureActions(bot) {
  [
    GET_LOADED_GUARDS,
    GET_NOT_COVERED_GUARDS,
    GET_GUARD_INFORMATION,
    DELETE_GUARD,
    GET_AVAILABLE_USER_FOR_ASSIGN,
    ASSIGN_GUARD,
    CREATE_GUARD,
  ].forEach((action) => action.configure(bot));
}
