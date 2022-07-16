export const GUARD_NOT_FOUND = "guard.not.found";
export const NEXT_GUARD_NOT_FOUND = "next.guard.not.found";
export const USER_NOT_FOUND = "user.not.found";

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
    if (!guard) throw new Error(GUARD_NOT_FOUND);

    return guard;
  }

  findUserById(userId) {
    const user = this.repository.findUserById(userId);
    if (!user) throw new Error(USER_NOT_FOUND);

    return user;
  }

  // ################################################################################
  // BUSINESS
  // ################################################################################
  getNextGuardForUser(user) {
    const guards = this.getAllNextGuardsForUser(user);

    if (guards.length === 0) {
      throw new Error(NEXT_GUARD_NOT_FOUND);
    }

    return guards[0];
  }

  getAllNextGuardsForUser(user) {
    const nextGuards = this.repository.findGuardsBy(
      (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
    );

    return nextGuards;
  }

  getNotCoveredGuards() {
    return this.repository.findGuardsBy(
      (guard) => !guard.isCovered() && !guard.alreadyHappened()
    );
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
