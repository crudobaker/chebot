export default class User {
  constructor(id, firstName, lastName, userName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
  }

  info() {
    return `${this.firstName} ${this.lastName}`;
  }
}
