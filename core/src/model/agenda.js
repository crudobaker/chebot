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
  getNextGuardForUser(userId) {
    const { user, guards } = this.getAllNextGuardsForUser(userId);

    if (guards.length === 0) {
      throw new Error("Next guard not found.");
    }

    return {
      user,
      guard: guards[0],
    };
  }

  getAllNextGuardsForUser(userId) {
    const user = this.repository.findUserById(userId);

    const nextGuards = this.repository.findGuardsBy(
      (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
    );

    return {
      user,
      guards: nextGuards,
    };
  }

  getNotCoveredGuards() {
    return this.repository.findGuardsBy((guard) => !guard.isCover());
  }

  getGuardAssignations(guardId) {
    const guard = this.findGuardById(guardId);
    return { guard, users: guard.getAssignations() };
  }

  deleteGuard(guardId) {
    const guard = this.findGuardById(guardId);
    return this.repository.removeGuard(guard);
  }

  assignGuardToUser(guardId, userId) {
    const guard = this.findGuardById(guardId);
    const user = this.findUserById(userId);
    guard.assignTo(user);
    return { guard, user };
  }
}
