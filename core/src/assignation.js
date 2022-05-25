export default class Assignation {
  constructor(guard, physiotherapist) {
    this.guard = guard;
    this.physiotherapist = physiotherapist;
  }

  isFor(guard) {
    return this.guard === guard;
  }

  information() {
    return `${this.guard.information()} - ${this.physiotherapist}`;
  }
}
