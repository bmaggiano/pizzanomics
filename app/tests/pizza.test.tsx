const { getPizzas } = require("../utils/helpers");

describe("Pizza Model", () => {
  it("should retrieve a list of pizzas", async () => {
    const pizzas = await getPizzas(); // Use await to get the resolved data

    // Ensure that pizzas is an array
    expect(pizzas).toBeInstanceOf(Array);
  });
});
