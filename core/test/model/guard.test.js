import Guard, {
  GUARD_ALREADY_HAPPEND,
  GUARD_ALREADY_ASSIGNED_TO_USER,
  GUARD_ALREADY_COVERED,
} from "core/src/model/guard.js";
import User, { PHYSIOTHERAPIST_ROLE } from "core/src/model/user.js";
import { YESTERDAY, TOMORROW } from "core/src/date-utils.js";

const user1 = new User("1", "John", "Doe", "john_doe", PHYSIOTHERAPIST_ROLE);
const user2 = new User("2", "Jane", "Doe", "jane_doe", PHYSIOTHERAPIST_ROLE);
const user3 = new User(
  "3",
  "Ricky",
  "James",
  "ricky_james",
  PHYSIOTHERAPIST_ROLE
);

describe("Guard Test", () => {
  test("assign a user to a guard", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
  });

  test("is not possible to assign twice a user to a guard ", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error(GUARD_ALREADY_ASSIGNED_TO_USER)
    );
    expect(newGuard.amountOfAssignations()).toEqual(1);
    expect(newGuard.isAssignedTo(user1).toBeTruthy);
  });

  test("is possible to assign different users to a guard ", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

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
    const newGuard = new Guard(1, TOMORROW);

    //act
    const isGuardAssigned = newGuard.isAssigned();

    //assert
    expect(isGuardAssigned).toBeFalsy();
  });

  test("after assign a user to a guard, it is assigned", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(newGuard.isAssigned()).toBeTruthy();
    expect(newGuard.isAssignedTo(user1));
  });

  test("a new guard has not got assignations", () => {
    //arrange
    const newGuard = new Guard(1, new Date());

    //assert
    expect(newGuard.amountOfAssignations()).toEqual(0);
  });

  test("after assign a user to a guard, it has an assignation", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //act
    newGuard.assignTo(user1);

    //assert
    expect(newGuard.amountOfAssignations()).toEqual(1);
    expect(newGuard.isAssignedTo(user1)).toBeTruthy();
  });

  test("a past guard has already happend", () => {
    //arrange
    const newGuard = new Guard(1, YESTERDAY);

    //act
    const pastGuard = newGuard.alreadyHappened();

    //assert
    expect(pastGuard).toBeTruthy();
  });

  test("a future guard has not happend yet", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //act
    const futureGuard = newGuard.alreadyHappened();

    //assert
    expect(futureGuard).toBeFalsy();
  });

  test("is not possible to assign an already happend guard", () => {
    //arrange
    const newGuard = new Guard(1, YESTERDAY);

    //assert
    expect(() => newGuard.assignTo(user1)).toThrow(
      new Error(GUARD_ALREADY_HAPPEND)
    );
    expect(newGuard.amountOfAssignations()).toEqual(0);
    expect(newGuard.isAssignedTo(user1)).toBeFalsy();
  });

  test("a guard without assigment is not covered", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);

    //assert
    expect(newGuard.isCovered()).toBeFalsy();
  });

  test("a guard with two assigments is covered", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(newGuard.isCovered()).toBeTruthy();
  });

  test("is not possible to assign more than two users to a guard", () => {
    //arrange
    const newGuard = new Guard(1, TOMORROW);
    newGuard.assignTo(user1);
    newGuard.assignTo(user2);

    //assert
    expect(() => newGuard.assignTo(user3)).toThrow(
      new Error(GUARD_ALREADY_COVERED)
    );
  });
});
