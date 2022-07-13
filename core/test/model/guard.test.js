import Guard from "../../src/model/guard.js";
import User from "../../src/model/user.js";

const user1 = new User(1, "John", "Doe", "john_doe");
const user2 = new User(2, "Jane", "Doe", "jane_doe");
const user3 = new User(3, "Ricky", "James", "ricky_james");
const yesterday = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
const tomorrow = new Date(new Date().getTime() + 1000 * 60 * 60 * 24);

describe("Guard Test", () => {
  test("assign a user to a guard", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
  });

  test("is not possible to assign twice a user to a guard ", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error("La guardia ya se encuentra asignada al usuario.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(1);
    expect(newGuard.isAssignedTo(user1).toBeTruthy);
  });

  test("is possible to assign different users to a guard ", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(newGuard.amountOfAssignations()).toEqual(2);
    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
    expect(newGuard.isAssignedTo(user2)).toBeTruthy();
  });

  test("a new guard is not assigned", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    const isGuardAssigned = newGuard.isAssigned();

    //assert
    expect(isGuardAssigned).toBeFalsy();
  });

  test("after assign a user to a guard, it is assigned", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    const newAssignation = newGuard.assignTo(user1);

    //assert
    expect(newGuard.isAssigned()).toBeTruthy();
    expect(newAssignation.isAssignedTo(user1));
    expect(newAssignation.isForGuard(newGuard));
  });

  test("a new guard has not got assignations", () => {
    //arrange
    const newGuard = new Guard(1, new Date());

    //assert
    expect(newGuard.getAssignations().length).toEqual(0);
  });

  test("after assign a user to a guard, it has an assignation", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    newGuard.assignTo(user1);
    const assignations = newGuard.getAssignations();

    //assert
    expect(assignations.length).toEqual(1);
    expect(assignations[0].isForGuard(newGuard)).toBeTruthy();
    expect(assignations[0].isAssignedTo(user1)).toBeTruthy();
  });

  test("a past guard has already happend", () => {
    //arrange
    const newGuard = new Guard(1, yesterday);

    //act
    const pastGuard = newGuard.alreadyHappened();

    //assert
    expect(pastGuard).toBeTruthy();
  });

  test("a future guard has not happend yet", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //act
    const futureGuard = newGuard.alreadyHappened();

    //assert
    expect(futureGuard).toBeFalsy();
  });

  test("is not possible to assign an already happend guard", () => {
    //arrange
    const newGuard = new Guard(1, yesterday);

    //assert
    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error("La guardia ya pasó.")
    );
    expect(newGuard.amountOfAssignations()).toEqual(0);
    expect(newGuard.isAssignedTo(user1)).toBeFalsy();
  });

  test("a guard without assigment is not covered", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);

    //assert
    expect(newGuard.isCover()).toBeFalsy();
  });

  test("a guard with two assigments is covered", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(newGuard.isCover()).toBeTruthy();
  });

  test("is not possible to assign more than two users to a guard", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(() => newGuard.assignTo(user3)).toThrow(
      new Error("La guardia ya se encuentra cubierta.")
    );
  });

  test("gets only the assignations for each user of the guard", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //act
    const assignationForUser1 = newGuard.getAssignationForUser(user1);
    const assignationForUser2 = newGuard.getAssignationForUser(user2);

    //assert
    expect(assignationForUser1.isAssignedTo(user1)).toBeTruthy();
    expect(assignationForUser1.isForGuard(newGuard)).toBeTruthy();
    expect(assignationForUser2.isAssignedTo(user2)).toBeTruthy();
    expect(assignationForUser2.isForGuard(newGuard)).toBeTruthy();
  });

  test("gets an error when there is not an assignation for some user", () => {
    //arrange
    const newGuard = new Guard(1, tomorrow);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(() => newGuard.getAssignationForUser(user3)).toThrow(
      new Error("La guardia no se encuentra asignada al usuario.")
    );
  });
});
