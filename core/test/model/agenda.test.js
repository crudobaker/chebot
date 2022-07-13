import GuardsAgenda from "../../src/model/agenda.js";
import Repository from "../../src/repository.js";

const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

const userId = "1";
const firstName = "John";
const lastName = "Doe";
const userName = "john_doe";

describe("Agenda Test", () => {
  let agenda, repository;

  beforeEach(() => {
    repository = new Repository();
    agenda = new GuardsAgenda(repository);
  });

  test("gets an empty list when agenda has not got users", () => {
    //act
    const users = agenda.getAllUsers();

    //assert
    expect(users.length).toBe(0);
  });

  test("create a user", () => {
    //act
    const user = agenda.createUser(userId, firstName, lastName, userName);

    //assert
    expect(user.id).toBe(userId);
    expect(user.firstName).toBe(firstName);
    expect(user.lastName).toBe(lastName);
    expect(user.userName).toBe(userName);
    expect(agenda.findUserById(userId)).toStrictEqual(user);
  });

  test("gets the existing list of users", () => {
    //act
    const user = agenda.createUser(userId, firstName, lastName, userName);

    //act
    const users = agenda.getAllUsers();

    //assert
    expect(users.length).toBe(1);
    expect(users.includes(user)).toBeTruthy();
  });

  test("gets an empty list when agenda has not got guards", () => {
    //act
    const guards = agenda.getAllGuards();

    //assert
    expect(guards.length).toBe(0);
  });

  test("create a guard", () => {
    //act
    const guard = agenda.createGuard(tomorrow);

    //assert
    expect(guard.getDate()).toStrictEqual(tomorrow);
    expect(agenda.findGuardById(guard.id)).toStrictEqual(guard);
  });

  test("gets the existing list of guards", () => {
    //arrange
    const guard = agenda.createGuard(tomorrow);

    //act
    const guards = agenda.getAllGuards();

    //assert
    expect(guards.length).toBe(1);
    expect(guards.includes(guard)).toBeTruthy();
  });

  test("gets the next guard for a particular user", () => {
    //TODO
  });

  test("gets all the next guards for a particular user", () => {
    //TODO
  });
});
