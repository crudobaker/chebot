export default class User {
  //TODO: the is shoud be called telegramId, or contactId. The id should be the id from the DB.
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
