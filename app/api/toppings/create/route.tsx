import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function POST(req: NextRequest) {
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
    const normalizedName = body?.name?.toLowerCase() || "";

    const existingTopping = await prisma.topping.findFirst({
      where: {
        name: {
          equals: normalizedName, // Normalize for comparison
          mode: "insensitive", // Case-insensitive matching
        },
      },
    });

    if (existingTopping?.name.toLowerCase() === body?.name?.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          message: "Topping already exists",
        },
        { status: 400 }
      );
    }

    // Extract the names from the pizzas array
    const pizzaNames =
      body?.pizzas?.map((pizza: { name: string }) => ({
        name: pizza.name,
      })) || [];

    const newTopping = await prisma.topping.create({
      data: {
        name: body?.name || "",
        pizzas: {
          connect: pizzaNames, // Use extracted names
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Topping added successfully!",
      topping: newTopping,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to add topping" },
      { status: 500 }
    );
  }
}
