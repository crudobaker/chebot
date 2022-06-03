import Guard from "../src/guard.js";

describe("Guardia Test", () => {
  test("a test", async () => {
    const newGuard = new Guard(1, new Date());

    expect(newGuard.id).toEqual(1);
  });
});
