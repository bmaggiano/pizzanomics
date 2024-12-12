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

    const existingPizza = await prisma.pizza.findUnique({
      where: { id: body?.id || "" },
    });

    if (!existingPizza) {
      return NextResponse.json(
        {
          success: false,
          message: "Pizza not found",
        },
        { status: 400 }
      );
    }

    await prisma.pizza.update({
      where: { id: body?.id || "" },
      data: {
        name: body?.name || "",
        description: body?.description || "",
        imageUrl: body?.imageUrl || "",
        toppings: {
          connect:
            body?.toppings?.map((topping: { id: string }) => ({
              id: topping.id,
            })) || [],
        },
      },
    });
    return NextResponse.json({
      success: true,
      message: "Pizza updated successfully!",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to update pizza" },
      { status: 500 }
    );
  }
}
