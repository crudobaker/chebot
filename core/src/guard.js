import { format } from "date-fns";

export default class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
  }

  info() {
    return format(this.date, "dd/MM/yyyy");
  }

  alreadyHappened() {
    const today = new Date();
    return this.date.getTime() < today.getTime(); //comentario de prueba
  }
}
