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

    const existingPizza = await prisma.pizza.findUnique({
      where: { name: body?.name || "" },
    });

    if (existingPizza?.name.toLowerCase() === body?.name?.toLowerCase()) {
      return NextResponse.json(
        {
          success: false,
          message: "Pizza already exists",
        },
        { status: 400 }
      );
    }

    // Extract the names from the toppings array
    const toppingNames =
      body?.toppings?.map((topping: { name: string }) => ({
        name: topping.name,
      })) || [];

    const newPizza = await prisma.pizza.create({
      data: {
        name: body?.name || "",
        description: body?.description || "",
        imageUrl: body?.imageUrl || "",
        toppings: {
          connect: toppingNames, // Use extracted names
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pizza added successfully!",
      pizza: newPizza,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to add pizza" },
      { status: 500 }
    );
  }
}
