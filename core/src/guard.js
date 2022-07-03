import { format } from "date-fns";
import Assignation from "core/src/assignation.js";

export default class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
    this.assignations = [];
  }

  assignTo(physiotherapist) {
    if (this.isAssignedTo(physiotherapist)) {
      throw new Error("La guardia ya se encuentra asignada al fisioterapeuta.");
    }
    this.assignations.push(physiotherapist);

    return new Assignation(this, physiotherapist);
  }

  isAssignedTo(physiotherapist) {
    return this.assignations.includes(physiotherapist);
  }

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

  getAssignations() {
    return this.assignations.map(
      (physiotherapist) => new Assignation(this, physiotherapist)
    );
  }

  isAssigned() {
    return this.assignations.length > 0;
  }

  getAssignationForPhysiotherapist(physiotherapist) {
    if (this.isAssignedTo(physiotherapist)) {
      return new Assignation(this, physiotherapist);
    }
    throw new Error("La guardia no se encuentra asignada al fisioterapeuta.");
  }
}
