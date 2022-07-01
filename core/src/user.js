export default class User {
  constructor(id, firstName, lastName, userName) {
    this.id = Number(id);
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
  }

  hasId(id) {
    return this.id == id;
  }
}
