import { format } from "date-fns";

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
      throw new Error("La guardia ya pasó.");
    }

    if (this.isAssignedTo(user)) {
      throw new Error("La guardia ya se encuentra asignada al usuario.");
    }

    if (this.isCover()) {
      throw new Error("La guardia ya se encuentra cubierta.");
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

  isCover() {
    return this.assignations.length === AMOUNT_OF_ASSIGNATIONS_TO_BE_COVERED;
  }
}
