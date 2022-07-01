import { format } from "date-fns";

export default class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
  }

  information() {
    return format(this.date, "dd/MM/yyyy");
  }

  wasCovered() {
    const today = new Date();
    return this.date.getTime() >= today.getTime();
  }
}
