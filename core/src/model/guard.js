import { format } from "date-fns";
import Assignation from "core/src/model/assignation.js";

const AMOUNT_OF_ASSIGNATIONS_TO_BE_COVERED = 2;

export default class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
    this.assignations = [];
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

    const newAssignation = new Assignation(this, user);
    this.assignations.push(newAssignation);

    return newAssignation;
  }

  isAssignedTo(user) {
    return this.assignations.some((assignation) =>
      assignation.isAssignedTo(user)
    );
  }

  dateInfo() {
    return format(this.date, "dd/MM/yyyy");
  }

  getDate() {
    return this.date;
  }

  alreadyHappened() {
    const today = new Date();
    return this.date.getTime() < today.getTime();
  }

  amountOfAssignations() {
    return this.assignations.length;
  }

  getAssignations() {
    return this.assignations;
  }

  isAssigned() {
    return this.assignations.length > 0;
  }

  getAssignationForUser(user) {
    if (this.isAssignedTo(user)) {
      return this.assignations.find((assignation) =>
        assignation.isAssignedTo(user)
      );
    }
    throw new Error("La guardia no se encuentra asignada al usuario.");
  }

  isCover() {
    return this.assignations.length === AMOUNT_OF_ASSIGNATIONS_TO_BE_COVERED;
  }
}
