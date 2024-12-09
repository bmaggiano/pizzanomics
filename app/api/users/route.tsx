import { NextResponse } from "next/server";
import prisma from "../../clients/prismaClient";
export async function GET(res: NextResponse) {
  const users = await prisma.user.findMany();
  return NextResponse.json({ users });
}
