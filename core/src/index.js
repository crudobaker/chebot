import Repository from "core/src/repository.js";
import GuardsAgenda from "core/src/model/agenda.js";

const repository = new Repository();
const agenda = new GuardsAgenda(repository);

//USERS
const leoUser = agenda.createUser(
  "1507587171",
  "Leonardo Martin",
  "Crudo",
  "leo_crudo"
);
const pabloUser = agenda.createUser("5159780344", "Pablo", "Tocalini", "pablo");
agenda.createUser("xxxxxxxx", "John", "Doe", "john_doe");

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
