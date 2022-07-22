import agenda from "../../init.js";

export const MY_GUARDS = {
  name: "my_guards",
  description: "🗓️ Mis Guardias",
  apply: (ctx) => {
    try {
      const { user } = ctx.state;
      const guards = agenda.getAllNextGuardsForUser(user);

      if (guards.length === 0) {
        ctx.warning(`${user.info()} no tiene guardias asignadas.`);
      } else {
        const guardsInfo = guards.map((guard) => guard.dateInfo()).join("\n");
        ctx.info(`${user.info()}, sus guardias asignadas son:\n${guardsInfo}`);
      }
    } catch (error) {
      ctx.error("Error al recuperar las guardias.");
    }
  },
};
