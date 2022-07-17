import User, { COORDINATOR_ROLE, PHYSIOTHERAPIST_ROLE } from "core/src/model/user.js";

describe("User Test", () => {
  test("a user with physiotherapist role is not a coordinator", () => {
    const user = new User(
      1507587171,
      "Leonardo Martin",
      "Crudo",
      "leo_crudo",
      PHYSIOTHERAPIST_ROLE
    );

    expect(user.isCoordinator()).toBeFalsy();
  });

  test("a user with coordinator role is a coordinator", () => {
    const user = new User(
      "5159780344",
      "Pablo",
      "Tocalini",
      "pablo",
      COORDINATOR_ROLE
    );

    expect(user.isCoordinator()).toBeTruthy();
  });

  test("a user with invalid role to crash everything", () => {
    expect(
      () => new User("5159780344", "Pablo", "Tocalini", "pablo", "caca")
    ).toThrow(
      new Error("Invalid role")
    );
  });
});
