export const COORDINATOR_ROLE = "coordinator";
export const PHYSIOTHERAPIST_ROLE = "physiotherapist";

export default class User {
  constructor(id, firstName, lastName, userName, userRole) {
    this.id = Number(id);
    this.firstName = firstName;
    this.lastName = lastName;
    this.userName = userName;
    this.role = userRole;
  }

  info() {
    return `${this.firstName} ${this.lastName}`;
  }

  isCoordinator() {
    return this.role === COORDINATOR_ROLE;
  }
}
