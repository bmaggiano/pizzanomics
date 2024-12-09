const { getToppings } = require("../utils/helpers");
import prisma from "../clients/prismaClient";

describe("Topping Model", () => {
  it("should retrieve a list of toppings", async () => {
    const toppings = await getToppings(); // Use await to get the resolved data

    // Ensure that toppings is an array
    expect(toppings).toBeInstanceOf(Array);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
