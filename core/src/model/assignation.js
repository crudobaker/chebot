export default class Assignation {
  constructor(guard, user) {
    this.guard = guard;
    this.user = user;
  }

  isForGuard(guard) {
    return this.guard === guard;
  }

  isAssignedTo(user) {
    return this.user === user;
  }

  assignedInfo() {
    return this.user.info();
  }

  dateInfo() {
    return this.guard.dateInfo();
  }
}
