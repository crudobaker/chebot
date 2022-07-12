import Guard from "core/src/model/guard.js";
import User from "core/src/model/user.js";
import IdManager from "core/src/id-manager.js";

export default class GuardsAgenda {
  constructor(repository) {
    this.repository = repository;
  }

  getAllGuards() {
    return this.repository.findAllGuards();
  }

  getAllUsers() {
    return this.repository.findAllUsers();
  }

  getNextAssignationForUser(userId) {
    const user = this.repository.findUserById(userId);
    if (user === undefined) {
      throw new Error("Usuario no encontrado.");
    }

    const nextGuards = this.repository.findGuardsBy(
      (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
    );
    if (!nextGuards.length > 0) {
      throw new Error("No tiene próximas guardias asignadas.");
    }

    const nextGuard = nextGuards[0];

    return {
      user,
      assignation: nextGuard.getAssignationForUser(user),
    };
  }

  getAllNextAssignationForUser(userId) {
    const user = this.repository.findUserById(userId);

    const nextGuards = this.repository.findGuardsBy(
      (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
    );

    if (nextGuards.length === 0) {
      throw new Error("No tiene próximas guardias asignadas.");
    }

    return {
      user,
      assignations: nextGuards.map((guard) =>
        guard.getAssignationForUser(user)
      ),
    };
  }

  getNotAssignedGuards() {
    return this.repository.findGuardsBy((guard) => !guard.isAssigned());
  }

  getGuardAssignations(guardId) {
    const guard = this.findGuardById(guardId);
    return { guard, assignations: guard.getAssignations() };
  }

  deleteGuard(guardId) {
    return this.repository.removeGuardById(guardId);
  }

  assignGuardToUser(guardId, user) {
    const guard = this.findGuardById(guardId);
    const assignation = guard.assignTo(user);
    return { guard, assignation };
  }

  findGuardById(guardId) {
    const guard = this.repository.findGuardById(guardId);
    if (!guard) throw new Error("Guardia no encontrada.");

    return guard;
  }

  findUserById(userId) {
    const user = this.repository.findUserById(userId);
    if (!user) throw new Error("Usuario no encontrado.");

    return user;
  }

  createUser(telegramId, firstName, lastName, userName) {
    const user = new User(telegramId, firstName, lastName, userName);
    this.repository.saveUser(user);
    return user;
  }

  createGuard(date) {
    const guardId = IdManager.randomId(date);
    const guard = new Guard(guardId, date);
    this.repository.saveGuard(guard);
    return guard;
  }
}
