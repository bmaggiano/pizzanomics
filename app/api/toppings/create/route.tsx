import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
import { authorizeRole } from "../../../utils/roleCheck";

export async function POST(req: NextRequest) {
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

    const existingTopping = await prisma.topping.findUnique({
      where: { name: body?.name || "" },
    });

    if (existingTopping?.name === body?.name) {
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
