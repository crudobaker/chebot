import { format } from "date-fns";

export const GUARD_ALREADY_HAPPEND = "guard.already.happend";
export const GUARD_ALREADY_COVERED = "guard.already.covered";
export const GUARD_ALREADY_ASSIGNED_TO_USER = "guard.already.assigned.to.user";

const AMOUNT_OF_ASSIGNATIONS_TO_BE_COVERED = 2;

export default class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
    this.assignations = [];
  }

  getDate() {
    return this.date;
  }

  getAssignations() {
    return this.assignations;
  }

  assignTo(user) {
    if (this.alreadyHappened()) {
      throw new Error(GUARD_ALREADY_HAPPEND);
    }

    if (this.isAssignedTo(user)) {
      throw new Error(GUARD_ALREADY_ASSIGNED_TO_USER);
    }

    if (this.isCovered()) {
      throw new Error(GUARD_ALREADY_COVERED);
    }

    this.assignations.push(user);
  }

  isAssignedTo(user) {
    return this.assignations.includes(user);
  }

  //TODO: need to extract it into the bot
  dateInfo() {
    return format(this.date, "dd/MM/yyyy");
  }

  alreadyHappened() {
    const today = new Date();
    return this.date.getTime() < today.getTime();
  }

  amountOfAssignations() {
    return this.assignations.length;
  }

  isAssigned() {
    return this.assignations.length > 0;
  }

  isCovered() {
    return this.assignations.length === AMOUNT_OF_ASSIGNATIONS_TO_BE_COVERED;
  }
}
