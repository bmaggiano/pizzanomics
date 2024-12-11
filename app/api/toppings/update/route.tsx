import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../clients/prismaClient";
export async function PUT(req: NextRequest) {
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
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update topping" },
      { status: 500 }
    );
  }
}