import Repository from "core/src/data-source/repository";
import GuardsAgenda from "core/src/model/agenda.js";
import { PHYSIOTHERAPIST_ROLE, COORDINATOR_ROLE } from "core/src/model/user.js";

const repository = new Repository();
const agenda = new GuardsAgenda(repository);

//USERS
const leoUser = agenda.createUser(
  "1507587171",
  "Leonardo Martin",
  "Crudo",
  "leo_crudo",
  COORDINATOR_ROLE
);
const pabloUser = agenda.createUser(
  "5159780344",
  "Pablo",
  "Tocalini",
  "pablo",
  COORDINATOR_ROLE
);

//this user does not exist really but we need at least three users to test some scenarios.
agenda.createUser("xxxxxxxx", "John", "Doe", "john_doe", PHYSIOTHERAPIST_ROLE);

//GUARDS
const oneDayInMiliseconds = 60 * 60 * 24 * 1000;

agenda.createGuard(new Date(new Date().getTime() - oneDayInMiliseconds));
agenda.createGuard(new Date(new Date().getTime() + oneDayInMiliseconds));
const guard = agenda.createGuard(
  new Date(new Date().getTime() + oneDayInMiliseconds * 2)
);
agenda.createGuard(new Date(new Date().getTime() + oneDayInMiliseconds * 3));
agenda.createGuard(new Date(new Date().getTime() + oneDayInMiliseconds * 4));
agenda.createGuard(new Date(new Date().getTime() + oneDayInMiliseconds * 5));
agenda.createGuard(new Date(new Date().getTime() + oneDayInMiliseconds * 6));

//ASSIGNATIONS
agenda.assignGuardToUser(guard.id, leoUser.id);
agenda.assignGuardToUser(guard.id, pabloUser.id);

export default agenda;
