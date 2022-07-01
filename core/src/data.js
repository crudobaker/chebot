import Guard from "core/src/guard.js";
import Assignation from "core/src/assignation.js";
import Physiotherapist from "core/src/physiotherapist.js";
import User from "core/src/user.js";

//USERS
const leoUser = new User(1507587171, "Leonardo Martin", "Crudo", "leo_crudo");
const pabloUser = new User(5159780344, "Pablo", "Tocalini", "pablo");
export const users = [leoUser, pabloUser];

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
  new Assignation(guards[6], pablo),
  new Assignation(guards[1], leo),
];

//PUBLIC FUNCTIONS
export function getNextAssignationForUser(userId) {
  const user = findUserById(userId);
  const physiotherapist = physiotherapists.find((physiotherapist) =>
    physiotherapist.isUser(user)
  );

  if (physiotherapist === undefined) {
    throw new Error("El profesional no fue encontrado.");
  }

  const nextAssignation = assignations.find(
    (assignation) =>
      assignation.isAssignedTo(physiotherapist) && !assignation.isAccomplish()
  );

  if (nextAssignation === undefined) {
    throw new Error("No tiene próximas guardias asignadas.");
  }

  return nextAssignation;
}

export function getNotAssignedGuards(){
  return [];
}

export function getGuardAssignations(guardId) {
  const guard = findGuardById(guardId);
  const guardAssignations = assignations.filter((assignation) =>
    assignation.isFor(guard)
  );

  return guardAssignations;
}

export function deleteGuard(guardId) {
  //delete guard assignations first
  const guardAssignations = getGuardAssignations(guardId);
  guardAssignations.forEach((guardAssignation) => {
    const assignationIndex = assignations.indexOf(guardAssignation);
    assignations.splice(assignationIndex, 1);
  });

  //delete guard at the end
  const guard = findGuardById(guardId);
  const guardIndex = guards.indexOf(guard);
  guards.splice(guardIndex, 1);
}

export function findUserById(userId) {
  const user = users.find((user) => user.hasId(userId));
  if (!user) throw new Error("Usuario no encontrado.");

  return user;
}

//PRIVATE FUNCTIONS

function findGuardById(guardId) {
  const guard = guards.find((guard) => guard.id === guardId);
  if (!guard) throw new Error("Guardia no encontrada.");

  return guard;
}
