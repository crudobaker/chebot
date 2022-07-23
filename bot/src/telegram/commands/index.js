import { MY_GUARDS } from "bot/src/telegram/commands/my-guards-cmd.js";
import { MY_NEXT_GUARD } from "bot/src/telegram/commands/my-next-guard-cmd.js";
import { ADMIN_GUARDS } from "bot/src/telegram/commands/admin-guards-cmd.js";

export const COORDINATOR_COMMANDS = [MY_GUARDS, MY_NEXT_GUARD, ADMIN_GUARDS];
export const DEFAULT_COMMANDS = [MY_GUARDS, MY_NEXT_GUARD];

export default function configureCommands(bot) {
  bot.command(MY_GUARDS.name, MY_GUARDS.apply);
  bot.command(MY_NEXT_GUARD.name, MY_NEXT_GUARD.apply);
  bot.command(ADMIN_GUARDS.name, ADMIN_GUARDS.apply);
}
