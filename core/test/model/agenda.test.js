import GuardsAgenda, {
  GUARD_NOT_FOUND,
  NEXT_GUARD_NOT_FOUND,
  USER_NOT_FOUND,
} from "core/src/model/agenda.js";
import Repository from "core/src/data-source/repository.js";
import { PHYSIOTHERAPIST_ROLE } from "core/src/model/user.js";
import { YESTERDAY, TOMORROW, moreDays } from "core/src/date-utils.js";

describe("Agenda Test", () => {
  let agenda;

  beforeEach(() => {
    const repository = new Repository();
    agenda = new GuardsAgenda(repository);
  });

  describe("Users", () => {
    const userId = "1";
    const firstName = "John";
    const lastName = "Doe";
    const userName = "john_doe";
    const userRole = PHYSIOTHERAPIST_ROLE;

    test("gets an empty list when agenda has not got users", () => {
      //act
      const users = agenda.getAllUsers();

      //assert
      expect(users.length).toBe(0);
    });

    test("create a user", () => {
      //act
      const user = agenda.createUser(
        userId,
        firstName,
        lastName,
        userName,
        userRole
      );

      //assert
      expect(user.id).toBe(userId);
      expect(user.firstName).toBe(firstName);
      expect(user.lastName).toBe(lastName);
      expect(user.userName).toBe(userName);
      expect(user.role).toBe(userRole);
      expect(agenda.findUserById(userId)).toStrictEqual(user);
    });

    test("gets the existing list of users", () => {
      //act
      const user = agenda.createUser(
        userId,
        firstName,
        lastName,
        userName,
        userRole
      );

      //act
      const users = agenda.getAllUsers();

      //assert
      expect(users.length).toBe(1);
      expect(users.includes(user)).toBeTruthy();
    });

    test("error when user does not exists", () => {
      //act
      const getUserThatNotExists = () => agenda.findUserById("1");

      //assert
      expect(getUserThatNotExists).toThrow(new Error(USER_NOT_FOUND));
    });
  });

  describe("Guards", () => {
    let user1, user2;
    beforeEach(() => {
      user1 = agenda.createUser(
        "1",
        "John",
        "Doe",
        "john_doe",
        PHYSIOTHERAPIST_ROLE
      );
      user2 = agenda.createUser(
        "2",
        "Jane",
        "Doe",
        "jane_doe",
        PHYSIOTHERAPIST_ROLE
      );
    });

    test("gets an empty list when agenda has not got guards", () => {
      //act
      const guards = agenda.getAllGuards();

      //assert
      expect(guards.length).toBe(0);
    });

    test("create a guard", () => {
      //act
      const guard = agenda.createGuard(TOMORROW);

      //assert
      expect(guard.getDate()).toStrictEqual(TOMORROW);
      expect(agenda.findGuardById(guard.id)).toStrictEqual(guard);
    });

    test("gets the existing list of guards", () => {
      //arrange
      const guard = agenda.createGuard(TOMORROW);

      //act
      const guards = agenda.getAllGuards();

      //assert
      expect(guards.length).toBe(1);
      expect(guards.includes(guard)).toBeTruthy();
    });

    test("delete a not assigned guard", () => {
      //arrange
      const guard = agenda.createGuard(TOMORROW);

      //act
      agenda.deleteGuard(guard.id);

      //assert
      expect(agenda.getAllGuards().length).toBe(0);
    });

    test("delete an assigned guard", () => {
      //arrange
      const guard = agenda.createGuard(TOMORROW);
      agenda.assignGuardToUser(guard.id, user1.id);

      //act
      agenda.deleteGuard(guard.id);

      //assert
      expect(agenda.getAllGuards().length).toBe(0);
    });

    test("delete a covered guard", () => {
      //arrange
      const guard = agenda.createGuard(TOMORROW);
      agenda.assignGuardToUser(guard.id, user1.id);
      agenda.assignGuardToUser(guard.id, user2.id);

      //act
      agenda.deleteGuard(guard.id);

      //assert
      expect(agenda.getAllGuards().length).toBe(0);
    });

    test("delete a past guard", () => {
      //TODO
    });

    test("error when guard does not exists", () => {
      //act
      const geGuardThatNotExists = () => agenda.findGuardById("1");

      //assert
      expect(geGuardThatNotExists).toThrow(new Error(GUARD_NOT_FOUND));
    });
  });

  describe("Assignations", () => {
    let user1, user2, user3;
    beforeEach(() => {
      user1 = agenda.createUser(
        "1",
        "John",
        "Doe",
        "john_doe",
        PHYSIOTHERAPIST_ROLE
      );
      user2 = agenda.createUser(
        "2",
        "Jane",
        "Doe",
        "jane_doe",
        PHYSIOTHERAPIST_ROLE
      );
      user3 = agenda.createUser(
        "3",
        "Ricky",
        "James",
        "ricky_james",
        PHYSIOTHERAPIST_ROLE
      );
    });

    test("assign a guard to a user", () => {
      //arrange
      const guardToAssign = agenda.createGuard(moreDays(3));

      //act
      const { guard, user } = agenda.assignGuardToUser(
        guardToAssign.id,
        user1.id
      );

      //assert
      expect(guardToAssign.isAssignedTo(user1)).toBeTruthy();
      expect(guardToAssign).toStrictEqual(guard);
      expect(user1).toStrictEqual(user);
    });

    test("gets the next guard for a particular user", () => {
      //arrange
      agenda.createGuard(TOMORROW);
      agenda.createGuard(moreDays(2));
      const nextGuard = agenda.createGuard(moreDays(3));
      const otherGuard = agenda.createGuard(moreDays(4));
      agenda.assignGuardToUser(nextGuard.id, user1.id);
      agenda.assignGuardToUser(otherGuard.id, user1.id);

      //action
      const nextGuardForUser = agenda.getNextGuardForUser(user1);

      //assert
      expect(nextGuardForUser).toStrictEqual(nextGuard);
    });

    test("next guard for a particular user not found", () => {
      //arrange
      agenda.createGuard(TOMORROW);
      agenda.createGuard(moreDays(2));
      const nextGuard = agenda.createGuard(moreDays(3));
      agenda.createGuard(moreDays(4));
      agenda.assignGuardToUser(nextGuard.id, user2.id);

      //action
      const nextGuardForUser = () => agenda.getNextGuardForUser(user1);

      //assert
      expect(nextGuardForUser).toThrow(new Error(NEXT_GUARD_NOT_FOUND));
    });

    test("gets all the next guards for a particular user", () => {
      ///arrange
      const nextGuard = agenda.createGuard(TOMORROW);
      const otherGuard = agenda.createGuard(moreDays(2));
      agenda.createGuard(moreDays(3));
      const lastGuard = agenda.createGuard(moreDays(4));
      [nextGuard, otherGuard, lastGuard].forEach((guard) =>
        agenda.assignGuardToUser(guard.id, user1.id)
      );

      //action
      const nextGuardsForUser = agenda.getAllNextGuardsForUser(user1);

      //assert
      expect(nextGuardsForUser.length).toBe(3);
      expect(nextGuardsForUser.includes(nextGuard)).toBeTruthy();
      expect(nextGuardsForUser.includes(otherGuard)).toBeTruthy();
      expect(nextGuardsForUser.includes(lastGuard)).toBeTruthy();
    });

    test("gets an empty list when a particular user has not next guards", () => {
      ///arrange
      const nextGuard = agenda.createGuard(TOMORROW);
      const otherGuard = agenda.createGuard(moreDays(2));
      agenda.createGuard(moreDays(3));
      const lastGuard = agenda.createGuard(moreDays(4));
      [nextGuard, otherGuard, lastGuard].forEach((guard) =>
        agenda.assignGuardToUser(guard.id, user1.id)
      );

      //action
      const nextGuardsForUser = agenda.getAllNextGuardsForUser(user2);

      //assert
      expect(nextGuardsForUser.length).toBe(0);
    });

    test("gets not covered guards", () => {
      //arrange
      agenda.createGuard(YESTERDAY);
      const coveredGuard = agenda.createGuard(moreDays(2));
      const assignedButNotCoveredGuard = agenda.createGuard(moreDays(4));
      const notAssignedGuard = agenda.createGuard(moreDays(3));

      agenda.assignGuardToUser(coveredGuard.id, user1.id);
      agenda.assignGuardToUser(coveredGuard.id, user2.id);
      agenda.assignGuardToUser(assignedButNotCoveredGuard.id, user3.id);

      //action
      const notCoveredGuards = agenda.getNotCoveredGuards();

      //assert
      expect(notCoveredGuards.length).toBe(2);
      expect(
        notCoveredGuards.includes(assignedButNotCoveredGuard)
      ).toBeTruthy();
      expect(notCoveredGuards.includes(notAssignedGuard)).toBeTruthy();
    });
  });
});
