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

  information() {
    return `${this.guard.information()} - ${this.physiotherapist.getName()}`;
  }

  isAccomplish() {
    return this.guard.alreadyHappened();
  }
}
