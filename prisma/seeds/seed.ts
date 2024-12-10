import prisma from "../../app/clients/prismaClient";

const toppings = [
  { name: "Mozzarella" },
  { name: "Tomato" },
  { name: "Basil" },
  { name: "Olive" },
  { name: "Pepperoni" },
];

const pizzas = [
  {
    name: "Margherita",
    description: "Classic pizza with tomato, mozzarella, and basil.",
    toppings: ["Tomato", "Mozzarella", "Basil"],
    imageUrl:
      "https://images.unsplash.com/photo-1649688423692-308d2fc1027d?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Pepperoni Pizza",
    description: "Pepperoni, mozzarella, and tomato sauce.",
    toppings: ["Tomato", "Mozzarella", "Pepperoni"],
    imageUrl:
      "https://images.unsplash.com/photo-1630281483897-32ae5a2f7915?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Vegetarian",
    description: "Loaded with olives, tomato, and basil.",
    toppings: ["Tomato", "Olive", "Basil"],
    imageUrl:
      "https://images.unsplash.com/photo-1617343251257-b5d709934ddd?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dmVnZXRhcmlhbiUyMHBpenphfGVufDB8fDB8fHww",
  },
];

async function main() {
  // Seed the toppings
  for (const topping of toppings) {
    await prisma.topping.upsert({
      where: { name: topping.name },
      update: {},
      create: topping,
    });
  }

  // Seed the pizzas
  for (const pizza of pizzas) {
    const toppingConnections = await prisma.topping.findMany({
      where: { name: { in: pizza.toppings } },
    });

    // Create or update pizza with imageUrl and connected toppings
    await prisma.pizza.upsert({
      where: { name: pizza.name },
      update: {},
      create: {
        name: pizza.name,
        description: pizza.description,
        imageUrl: pizza.imageUrl, // Store image URL
        toppings: {
          connect: toppingConnections.map((topping) => ({ id: topping.id })),
        },
      },
    });
  }
}

main()
  .then(() => {
    console.log("Seeding completed!");
    prisma.$disconnect();
  })
  .catch((error) => {
    console.error("Error seeding data:", error);
    prisma.$disconnect();
    process.exit(1);
  });
