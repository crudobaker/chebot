export default class Physiotherapist {
  constructor(name, user) {
    this.name = name;
    this.user = user;
  }

  isUser(user) {
    return this.user === user;
  }

  getName() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
