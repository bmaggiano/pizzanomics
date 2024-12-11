import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET() {
  const toppings = await prisma.topping.findMany({
    include: {
      pizzas: true,
    },
  });
  if (!toppings) {
    return NextResponse.json([]);
  }
  return NextResponse.json({ toppings });
}
