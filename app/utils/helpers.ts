import prisma from "../clients/prismaClient";
import { Topping, Pizza, User } from "../types/types";

// Fetch all toppings with associated pizzas
export const getToppings = async (): Promise<Topping[]> => {
  try {
    const toppings = await prisma.topping.findMany({
      include: { pizzas: true },
    });
    return toppings as Topping[];
  } catch {
    throw new Error("Failed to fetch toppings");
  }
};

// Fetch all pizzas with associated toppings
export const getPizzas = async (): Promise<Pizza[]> => {
  try {
    const pizzas = await prisma.pizza.findMany({
      include: { toppings: true },
    });
    return pizzas as Pizza[];
  } catch {
    throw new Error("Failed to fetch pizzas");
  }
};

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const users = await prisma.user.findMany();
    return users as User[];
  } catch {
    throw new Error("Failed to fetch users");
  }
};
