import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function PUT(req: NextRequest) {
  const roleResponse = await authorizeRole(req, "owner");
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

    const existingTopping = await prisma.topping.findUnique({
      where: { id: body?.id || "" },
    });

    if (!existingTopping) {
      return NextResponse.json(
        {
          success: false,
          message: "Topping not found",
        },
        { status: 400 }
      );
    }

    const normalizedName = body?.name?.toLowerCase() || "";

    const nameInUse = await prisma.topping.findFirst({
      where: {
        name: {
          equals: normalizedName, // Normalize for comparison
          mode: "insensitive", // Case-insensitive matching
        },
      },
    });

    if (nameInUse?.name.toLowerCase() === body?.name?.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          message: "Topping name already exists",
        },
        { status: 400 }
      );
    }

    await prisma.topping.update({
      where: { id: body?.id || "" },
      data: {
        name: body?.name || "",
        pizzas: {
          connect:
            body?.pizzas?.map((pizza: { id: string }) => ({
              id: pizza.id,
            })) || [],
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Topping updated successfully!",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update topping" },
      { status: 500 }
    );
  }
}
