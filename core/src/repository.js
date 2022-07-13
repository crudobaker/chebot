import IdManager from "core/src/id-manager.js";
import Guard from "core/src/model/guard.js";
import User from "core/src/model/user.js";

export default class Repository {
  constructor() {
    this.users = [];
    this.guards = [];
  }

  findAllGuards() {
    return this.guards;
  }

  findAllUsers() {
    return this.users;
  }

  findUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  findGuardById(guardId) {
    return this.guards.find((guard) => guard.id === guardId);
  }

  findGuardsBy(guardFilter) {
    return this.guards
      .filter(guardFilter)
      .sort(
        (oneGuard, anotherGuard) =>
          oneGuard.getDate().getTime() - anotherGuard.getDate().getTime()
      );
  }

  removeGuardById(guardId) {
    const guard = this.findGuardById(guardId);
    const guardIndex = this.guards.indexOf(guard);
    guards.splice(guardIndex, 1);
    return guard;
  }

  createGuard(date) {
    const guardId = IdManager.randomId(date);
    const guard = new Guard(guardId, date);
    this.saveGuard(guard);
    return guard;
  }

  createUser(telegramId, firstName, lastName, userName) {
    const user = new User(telegramId, firstName, lastName, userName);
    this.saveUser(user);
    return user;
  }

  saveUser(user) {
    this.users.push(user);
  }

  saveGuard(guard) {
    this.guards.push(guard);
  }
}
