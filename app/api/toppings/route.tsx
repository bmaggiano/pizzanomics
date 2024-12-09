import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET(res: NextResponse) {
  const toppings = await prisma.topping.findMany();
  return NextResponse.json({ toppings });
}
