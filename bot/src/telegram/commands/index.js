import { MY_GUARDS } from "./my-guards-cmd.js";
import { MY_NEXT_GUARD } from "./my-next-guard-cmd.js";
import { ADMIN_GUARDS } from "./admin-guards-cmd.js";

export const COORDINATOR_COMMANDS = [MY_GUARDS, MY_NEXT_GUARD, ADMIN_GUARDS];
export const DEFAULT_COMMANDS = [MY_GUARDS, MY_NEXT_GUARD];

export default function configureCommands(bot) {
  bot.command(MY_GUARDS.command, MY_GUARDS.execute);
  bot.command(MY_NEXT_GUARD.command, MY_NEXT_GUARD.execute);
  bot.command(ADMIN_GUARDS.command, ADMIN_GUARDS.execute);
}
