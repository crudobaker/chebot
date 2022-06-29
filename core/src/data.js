import Guard from "core/src/guard.js";
import Assignation from "core/src/assignation.js";
import Physiotherapist from "core/src/physiotherapist.js";
import User from "core/src/user.js";

//USERS
const leoUser = new User(1507587171, "Leonardo Martin", "Crudo", "leo_crudo");
const pabloUser = undefined;
export const users = [leoUser];

//PHYSIOTHERAPIST
const pablo = new Physiotherapist("Pablo", pabloUser);
const leo = new Physiotherapist("Leo", leoUser);
export const physiotherapists = [pablo, leo];

//GUARDS
const oneDayInMiliseconds = 60 * 60 * 24 * 1000;
export const guards = [
  new Guard(1, new Date(new Date().getTime() - oneDayInMiliseconds)),
  new Guard(2, new Date(new Date().getTime() + oneDayInMiliseconds)),
  new Guard(3, new Date(new Date().getTime() + oneDayInMiliseconds * 2)),
  new Guard(4, new Date(new Date().getTime() + oneDayInMiliseconds * 3)),
  new Guard(5, new Date(new Date().getTime() + oneDayInMiliseconds * 4)),
  new Guard(6, new Date(new Date().getTime() + oneDayInMiliseconds * 5)),
  new Guard(7, new Date(new Date().getTime() + oneDayInMiliseconds * 6)),
];

//ASSIGNATIONS
export const assignations = [
  new Assignation(guards[0], pablo),
  new Assignation(guards[1], leo),
];
