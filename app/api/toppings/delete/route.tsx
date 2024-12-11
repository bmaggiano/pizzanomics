import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function DELETE(req: NextRequest) {
  const roleResponse = await authorizeRole(req, "chef");
  if (!roleResponse || roleResponse.status !== 200) {
    return NextResponse.json(
      {
        success: false,
        message: "Please log in or sign up to access this resource",
      },
      { status: 401 }
    );
  }
  try {
    const body = await req.json();

    const existingTopping = await prisma.topping.findUnique({
      where: { id: body?.id || "" },
    });

    if (existingTopping) {
      await prisma.topping.delete({
        where: { id: body?.id || "" },
      });
      return NextResponse.json({
        success: true,
        message: "Topping deleted successfully!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Topping not found",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete topping" },
      { status: 500 }
    );
  }
}
