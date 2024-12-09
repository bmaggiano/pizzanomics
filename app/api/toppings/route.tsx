import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET() {
  const toppings = await prisma.topping.findMany();
  return NextResponse.json({ toppings });
}
