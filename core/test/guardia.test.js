const Guardia = require("../src/guardia.js");

describe("Guardia Test", () => {
  test("a test", async () => {
    const nuevaGuardia = new Guardia();

    expect(nuevaGuardia.name).toBe("nueva guardia");
  });
});
