import prisma from "../clients/prismaClient";
export const getToppings = async () => {
  const toppings = await prisma.topping.findMany();
  return toppings;
};

export const getPizzas = async () => {
  const pizzas = await prisma.pizza.findMany({
    include: { toppings: true },
  });
  return pizzas;
};

export const getUser = async () => {
  const users = await prisma.user.findMany();
  return users;
};
