import Guard from "core/src/guard.js";
import User from "core/src/user.js";

//============================================================================
// DATA (Data Source)
//============================================================================
//USERS
const leoUser = new User(1507587171, "Leonardo Martin", "Crudo", "leo_crudo");
const pabloUser = new User(5159780344, "Pablo", "Tocalini", "pablo");
export const users = [leoUser, pabloUser];

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
guards[2].assignTo(leoUser);
guards[2].assignTo(pabloUser);

//============================================================================
// BUSINESS FUNCTIONS
//============================================================================
export function getNextAssignationForUser(userId) {
  const user = findUserById(userId);

  const nextGuard = guards.find(
    (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
  );

  if (nextGuard === undefined) {
    throw new Error("No tiene próximas guardias asignadas.");
  }

  return {
    user,
    assignation: nextGuard.getAssignationForUser(user),
  };
}

export function getAllNextAssignationForUser(userId) {
  const user = findUserById(userId);

  const nextGuards = guards.filter(
    (guard) => guard.isAssignedTo(user) && !guard.alreadyHappened()
  );

  if (nextGuards.length === 0) {
    throw new Error("No tiene próximas guardias asignadas.");
  }

  return {
    user,
    assignations: nextGuards.map((guard) => guard.getAssignationForUser(user)),
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

export function assignGuardToUser(guardId, user) {
  const guard = findGuardById(guardId);

  return { guard, assignation: guard.assignTo(user) };
}

//============================================================================
// PRIVATE FUNCTIONS
//============================================================================
function findGuardById(guardId) {
  const guard = guards.find((guard) => guard.id === guardId);
  if (!guard) throw new Error("Guardia no encontrada.");

  return guard;
}
