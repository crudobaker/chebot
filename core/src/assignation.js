export default class Assignation {
  constructor(guard, physiotherapist) {
    this.guard = guard;
    this.physiotherapist = physiotherapist;
  }

  isFor(guard) {
    return this.guard === guard;
  }

  isAssignedTo(physiotherapist) {
    return this.physiotherapist === physiotherapist;
  }

  info() {
    return `${this.guard.info()} - ${this.physiotherapist.info()}`;
  }

  isAccomplish() {
    return this.guard.alreadyHappened();
  }
}
