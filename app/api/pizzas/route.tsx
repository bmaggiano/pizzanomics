import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET(res: NextResponse) {
  const pizzas = await prisma.pizza.findMany();
  return NextResponse.json({ pizzas });
}
