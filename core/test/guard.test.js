import Guard from "../src/guard.js";
import Physiotherapist from "../src/physiotherapist.js";
import User from "../src/user.js";

const user1 = new User(1, "John", "Doe", "john_doe");
const user2 = new User(1, "Jane", "Doe", "jane_doe");
const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

describe("Guardia Test", () => {
  test("assign a physiotherapist to a guard", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist = new Physiotherapist(1, "Test", user1);

    newGuard.assignTo(physiotherapist);

    expect(newGuard.isAssignedTo(physiotherapist)).toBeTruthy();
  });

  test("is not possible to assign twice a physiotherapist to a guard ", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist = new Physiotherapist(1, "Test", user1);

    newGuard.assignTo(physiotherapist);

    expect(() => newGuard.assignTo(physiotherapist)).toThrow(
      new Error("La guardia ya se encuentra asignada al fisioterapeuta.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(1);
    expect(newGuard.isAssignedTo(physiotherapist).toBeTruthy);
  });

  test("is possible to assign different physiotherapists to a guard ", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist1 = new Physiotherapist(1, "Test", user1);
    const physiotherapist2 = new Physiotherapist(2, "Tes2", user2);

    newGuard.assignTo(physiotherapist1);
    newGuard.assignTo(physiotherapist2);

    expect(newGuard.amountOfAssignations()).toEqual(2);
    expect(newGuard.isAssignedTo(physiotherapist1)).toBeTruthy();
    expect(newGuard.isAssignedTo(physiotherapist2)).toBeTruthy();
  });

  test("a new guard is not assigned", () => {
    const newGuard = new Guard(1, new Date());

    const isGuardAssigned = newGuard.isAssigned();

    expect(isGuardAssigned).toBeFalsy();
  });

  test("after assign a physiotherapist to a guard, it is assigned", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist = new Physiotherapist(1, "Test", user1);

    const newAssignation = newGuard.assignTo(physiotherapist);

    expect(newGuard.isAssigned()).toBeTruthy();
    expect(newAssignation.isAssignedTo(physiotherapist));
    expect(newAssignation.isForGuard(newGuard));
  });

  test("a new guard has not got assignations", () => {
    const newGuard = new Guard(1, new Date());

    expect(newGuard.getAssignations().length).toEqual(0);
  });

  test("after assign a physiotherapist to a guard, it has an assignation", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist = new Physiotherapist(1, "Test", user1);

    newGuard.assignTo(physiotherapist);
    const assignations = newGuard.getAssignations();

    expect(assignations.length).toEqual(1);
    expect(assignations[0].isForGuard(newGuard)).toBeTruthy();
    expect(assignations[0].isAssignedTo(physiotherapist)).toBeTruthy();
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
    const physiotherapist = new Physiotherapist(1, "Test", user1);


    expect(() => newGuard.assignTo(physiotherapist)).toThrow(
      new Error("La guardia ya pasó.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(0);
    expect(newGuard.isAssignedTo(physiotherapist)).toBeFalsy();
  });

  test("a guard without assigment is not covered", () => {
    const newGuard = new Guard(1, new Date());

    expect(newGuard.isCover()).toBeFalsy();
  })

  test("a guard with assigment is covered", () => {
    const newGuard = new Guard(1, tomorrow);
    const physiotherapist1 = new Physiotherapist(1, "Test", user1);
    const physiotherapist2 = new Physiotherapist(2, "Test", user2);
    newGuard.assignTo(physiotherapist1);
    newGuard.assignTo(physiotherapist2);

    expect(newGuard.isCover()).toBeTruthy();
  })
});
