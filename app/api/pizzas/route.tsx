import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET() {
  const pizzas = await prisma.pizza.findMany({
    include: {
      toppings: true,
    },
  });
  return NextResponse.json({ pizzas });
}
