import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function PUT(req: NextRequest) {
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

    if (!existingPizza) {
      return NextResponse.json(
        {
          success: false,
          message: "Pizza not found",
        },
        { status: 400 }
      );
    }

    const normalizedName = body?.name?.toLowerCase() || "";

    // Skip name uniqueness check if the name hasn't changed
    if (normalizedName !== existingPizza.name.toLowerCase()) {
      const nameInUse = await prisma.pizza.findFirst({
        where: {
          name: {
            equals: normalizedName, // Normalize for comparison
            mode: "insensitive", // Case-insensitive matching
          },
        },
      });

      if (nameInUse) {
        return NextResponse.json(
          {
            success: false,
            message: "Pizza name already exists",
          },
          { status: 400 }
        );
      }
    }

    // Update the pizza, including toppings
    await prisma.pizza.update({
      where: { id: body?.id || "" },
      data: {
        name: body?.name || existingPizza.name,
        description: body?.description || existingPizza.description,
        imageUrl: body?.imageUrl || existingPizza.imageUrl,
        toppings: {
          set: [], // Clear current toppings
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
