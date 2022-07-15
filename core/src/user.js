export const COORDINATOR_ROLE = "coordinator";
export const PHYSIOTHERAPIST_ROLE = "physiotherapist";
const validRoles = [COORDINATOR_ROLE, PHYSIOTHERAPIST_ROLE];

export default class User {
  constructor(id, firstName, lastName, userName, userRole) {
    if (!validRoles.includes(userRole)) {
      throw new Error("Invalid role");
    }

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
