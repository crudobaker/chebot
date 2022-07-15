export default class GuardsAgenda {
  constructor(repository) {
    this.repository = repository;
  }

  // ################################################################################
  // CREATIONS
  // ################################################################################
  createUser(telegramId, firstName, lastName, userName, userRole) {
    return this.repository.createUser(
      telegramId,
      firstName,
      lastName,
      userName,
      userRole
    );
  }

  createGuard(date) {
    return this.repository.createGuard(date);
  }

  // ################################################################################
  // GETTERS & FINDERS
  // ################################################################################
  getAllGuards() {
    return this.repository.findAllGuards();
  }

  getAllUsers() {
    return this.repository.findAllUsers();
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

  // ################################################################################
  // BUSINESS
  // ################################################################################
  getNextAssignationForUser(userId) {
    const user = this.findUserById(userId);

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

  assignGuardToUser(guardId, userId) {
    const guard = this.findGuardById(guardId);
    const user = this.findUserById(userId);
    const assignation = guard.assignTo(user);
    return { guard, assignation };
  }
}
