import Guard from "core/src/guard.js";
import Physiotherapist from "core/src/physiotherapist.js";
import User, { COORDINATOR_ROLE, PHYSIOTHERAPIST_ROLE } from "core/src/user.js";

//============================================================================
// DATA (Data Source)
//============================================================================
//USERS
const leoUser = new User(1507587171, "Leonardo Martin", "Crudo", "leo_crudo", PHYSIOTHERAPIST_ROLE);
const pabloUser = new User(5159780344, "Pablo", "Tocalini", "pablo", COORDINATOR_ROLE);
export const users = [leoUser, pabloUser];

//PHYSIOTHERAPIST
const pablo = new Physiotherapist(1, "Pablo", pabloUser);
const leo = new Physiotherapist(2, "Leo", leoUser);
export const physiotherapists = [pablo, leo];

//GUARDS
const oneDayInMiliseconds = 60 * 60 * 24 * 1000;
export const guards = [
  new Guard(1, new Date(new Date().getTime() + oneDayInMiliseconds)),
  new Guard(2, new Date(new Date().getTime() + oneDayInMiliseconds * 2)),
  new Guard(3, new Date(new Date().getTime() + oneDayInMiliseconds * 3)),
  new Guard(4, new Date(new Date().getTime() + oneDayInMiliseconds * 4)),
  new Guard(5, new Date(new Date().getTime() + oneDayInMiliseconds * 5)),
  new Guard(6, new Date(new Date().getTime() + oneDayInMiliseconds * 6)),
  new Guard(7, new Date(new Date().getTime() + oneDayInMiliseconds * 7)),
];

//ASSIGNATIONS
guards[0].assignTo(pablo);
guards[6].assignTo(pablo);
guards[1].assignTo(leo);

//============================================================================
// BUSINESS FUNCTIONS
//============================================================================
export function getNextAssignationForUser(userId) {
  const user = findUserById(userId);
  const physiotherapist = physiotherapists.find((physiotherapist) =>
    physiotherapist.isUser(user)
  );

  if (physiotherapist === undefined) {
    throw new Error("El profesional no fue encontrado.");
  }

  const nextGuard = guards.find(
    (guard) => guard.isAssignedTo(physiotherapist) && !guard.alreadyHappened()
  );

  if (nextGuard === undefined) {
    throw new Error("No tiene próximas guardias asignadas.");
  }

  return {
    user,
    assignation: nextGuard.getAssignationForPhysiotherapist(physiotherapist),
  };
}

export function getAllNextAssignationForUser(userId) {
  const user = findUserById(userId);
  const physiotherapist = physiotherapists.find((physiotherapist) =>
    physiotherapist.isUser(user)
  );

  if (physiotherapist === undefined) {
    throw new Error("El profesional no fue encontrado.");
  }

  const nextGuards = guards.filter(
    (guard) => guard.isAssignedTo(physiotherapist) && !guard.alreadyHappened()
  );

  if (nextGuards.length === 0) {
    throw new Error("No tiene próximas guardias asignadas.");
  }

  return {
    user,
    assignations: nextGuards.flatMap((guard) => guard.getAssignations()),
  };
}

export function getNotAssignedGuards() {
  return guards.filter((guard) => !guard.isAssigned());
}

export function getGuardAssignations(guardId) {
  const guard = findGuardById(guardId);
  return { guard, assignations: guard.getAssignations() };
}

export function deleteGuard(guardId) {
  const guard = findGuardById(guardId);
  const guardIndex = guards.indexOf(guard);
  guards.splice(guardIndex, 1);
  return guard;
}

export function findUserById(userId) {
  const user = users.find((user) => user.id === userId);
  if (!user) throw new Error("Usuario no encontrado.");

  return user;
}

export function assignGuardToPhysiotherapist(guardId, physiotherapistId) {
  const guard = findGuardById(guardId);
  const physiotherapist = findPhysiotherapistById(physiotherapistId);

  return { guard, assignation: guard.assignTo(physiotherapist) };
}

//============================================================================
// PRIVATE FUNCTIONS
//============================================================================
function findGuardById(guardId) {
  const guard = guards.find((guard) => guard.id === guardId);
  if (!guard) throw new Error("Guardia no encontrada.");

  return guard;
}

function findPhysiotherapistById(physiotherapistId) {
  const physiotherapist = physiotherapists.find(
    (physiotherapist) => physiotherapist.id === physiotherapistId
  );
  if (!physiotherapist) throw new Error("Profesional no encontrado.");

  return physiotherapist;
}
