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

    // Fetch the existing topping from the database
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

    // Skip name uniqueness check if the name hasn't changed
    if (normalizedName !== existingTopping.name.toLowerCase()) {
      // Check if a topping with the new name already exists
      const nameInUse = await prisma.topping.findFirst({
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
            message: "Topping name already exists",
          },
          { status: 400 }
        );
      }
    }

    // Update the topping, including the associated pizzas
    await prisma.topping.update({
      where: { id: body?.id || "" },
      data: {
        name: body?.name || existingTopping.name, // Keep the existing name if not updated
        pizzas: {
          set: [], // Clear current pizza associations
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
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update topping" },
      { status: 500 }
    );
  }
}
