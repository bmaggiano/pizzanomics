import { getToppings } from "../utils/helpers";

describe("Topping Model", () => {
  it("should retrieve a list of toppings", async () => {
    const toppings = await getToppings(); // Use await to get the resolved data

    // Ensure that toppings is an array
    expect(toppings).toBeInstanceOf(Array);
  });
});
