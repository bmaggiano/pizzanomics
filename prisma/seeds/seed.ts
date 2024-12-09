import prisma from "../../app/clients/prismaClient";

const toppings = [
  { name: "Mozzarella" },
  { name: "Tomato" },
  { name: "Basil" },
  { name: "Olive" },
  { name: "Pepperoni" },
];

async function main() {
  // Seed the toppings
  for (const topping of toppings) {
    await prisma.topping.create({
      data: topping,
    });
  }
}

main();
