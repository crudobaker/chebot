const { format } = require("date-fns");

const guardClass = class Guard {
  constructor(id, date) {
    this.id = id;
    this.date = date;
  }

  information() {
    return format(this.date, "dd/MM/yyyy");
  }
};

export default guardClass;
