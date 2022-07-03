export default class Assignation {
  constructor(guard, physiotherapist) {
    this.guard = guard;
    this.physiotherapist = physiotherapist;
  }

  isForGuard(guard) {
    return this.guard === guard;
  }

  isAssignedTo(physiotherapist) {
    return this.physiotherapist === physiotherapist;
  }

  assignedInfo() {
    return this.physiotherapist.info();
  }

  dateInfo() {
    return this.guard.dateInfo();
  }
}
