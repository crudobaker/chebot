import Guard from "../src/guard.js";
import User from "../src/user.js";

const user1 = new User(1, "John", "Doe", "john_doe");
const user2 = new User(1, "Jane", "Doe", "jane_doe");
const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

describe("Guardia Test", () => {
  test("assign a user to a guard", () => {
    const newGuard = new Guard(1, tomorrow);

    newGuard.assignTo(user1);

    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
  });

  test("is not possible to assign twice a user to a guard ", () => {
    const newGuard = new Guard(1, tomorrow);

    newGuard.assignTo(user1);

    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error("La guardia ya se encuentra asignada al usuario.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(1);
    expect(newGuard.isAssignedTo(user1).toBeTruthy);
  });

  test("is possible to assign different users to a guard ", () => {
    const newGuard = new Guard(1, tomorrow);

    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    expect(newGuard.amountOfAssignations()).toEqual(2);
    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
    expect(newGuard.isAssignedTo(user2)).toBeTruthy();
  });

  test("a new guard is not assigned", () => {
    const newGuard = new Guard(1, new Date());

    const isGuardAssigned = newGuard.isAssigned();

    expect(isGuardAssigned).toBeFalsy();
  });

  test("after assign a user to a guard, it is assigned", () => {
    const newGuard = new Guard(1, tomorrow);

    const newAssignation = newGuard.assignTo(user1);

    expect(newGuard.isAssigned()).toBeTruthy();
    expect(newAssignation.isAssignedTo(user1));
    expect(newAssignation.isForGuard(newGuard));
  });

  test("a new guard has not got assignations", () => {
    const newGuard = new Guard(1, new Date());

    expect(newGuard.getAssignations().length).toEqual(0);
  });

  test("after assign a user to a guard, it has an assignation", () => {
    const newGuard = new Guard(1, tomorrow);

    newGuard.assignTo(user1);
    const assignations = newGuard.getAssignations();

    expect(assignations.length).toEqual(1);
    expect(assignations[0].isForGuard(newGuard)).toBeTruthy();
    expect(assignations[0].isAssignedTo(user1)).toBeTruthy();
  });

  test("a past guard has already happend", () => {
    const newGuard = new Guard(1, yesterday);

    const pastGuard = newGuard.alreadyHappened();

    expect(pastGuard).toBeTruthy();
  });

  test("a future guard has not happend yet", () => {
    const newGuard = new Guard(1, tomorrow);

    const futureGuard = newGuard.alreadyHappened();

    expect(futureGuard).toBeFalsy();
  });

  test("is not possible to assign an already happend guard", () => {
    const newGuard = new Guard(1, yesterday);

    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error("La guardia ya pasó.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(0);
    expect(newGuard.isAssignedTo(user1)).toBeFalsy();
  });

  test("a guard without assigment is not covered", () => {
    const newGuard = new Guard(1, new Date());

    expect(newGuard.isCover()).toBeFalsy();
  });

  test("a guard with assigment is covered", () => {
    const newGuard = new Guard(1, tomorrow);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    expect(newGuard.isCover()).toBeTruthy();
  });
});
