import agenda from "../../init.js";
import { NEXT_GUARD_NOT_FOUND } from "core/src/model/agenda.js";

export const MY_NEXT_GUARD = {
  command: "my_next_guard",
  description: "⏰ Mi Próxima Guardia",
  execute: (ctx) => {
    const { user } = ctx.state;
    try {
      const guard = agenda.getNextGuardForUser(user);
      ctx.info(
        `${user.info()}, su próxima asignación es el ${guard.dateInfo()}.`
      );
    } catch (error) {
      if (error.message === NEXT_GUARD_NOT_FOUND) {
        ctx.warning(`${user.info()}, no tiene una próxima guardia asignada.`);
      } else {
        ctx.error("Error al recuperar la guardia.");
      }
    }
  },
};
