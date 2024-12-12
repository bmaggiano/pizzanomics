import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function DELETE(req: NextRequest) {
  const roleResponse = await authorizeRole(req, "chef");
  if (!roleResponse || roleResponse.status !== 200) {
    return NextResponse.json(
      {
        success: false,
        message: roleResponse.statusText,
      },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();

    const existingPizza = await prisma.pizza.findUnique({
      where: { id: body?.id || "" },
    });

    if (existingPizza) {
      await prisma.pizza.delete({
        where: { id: body?.id || "" },
      });
      return NextResponse.json({
        success: true,
        message: "Pizza deleted successfully!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Pizza not found",
        },
        { status: 400 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to delete pizza" },
      { status: 500 }
    );
  }
}
