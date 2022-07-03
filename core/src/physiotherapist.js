export default class Physiotherapist {
  constructor(id, name, user) {
    this.id = Number(id);
    this.name = name;
    this.user = user;
  }

  isUser(user) {
    return this.user === user;
  }

  info() {
    return `${this.user.firstName} ${this.user.lastName}`;
  }
}
