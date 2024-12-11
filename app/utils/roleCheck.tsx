import { NextRequest, NextResponse } from "next/server";
import prisma from "../clients/prismaClient";
import { verifyToken } from "./auth";

// Middleware for role-based access control
export async function authorizeRole(req: NextRequest, requiredRole: string) {
  const token = req.cookies.get("auth_token")?.value;
  console.log(token);

  if (!token) {
    return NextResponse.json(
      { message: "Please log in or sign up to access this resource" },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  console.log(decoded);

  const userId =
    typeof decoded === "object" && decoded !== null
      ? decoded.userId
      : undefined;

  console.log(userId);
  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401 }
    );
  }

  // Fetch the user based on the ID to check their role
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (user.role !== requiredRole) {
    return NextResponse.json(
      { message: `Only ${requiredRole}s can perform this action` },
      { status: 403 }
    );
  }

  // Allow request to continue by returning NextResponse directly
  return NextResponse.json({ message: "Role authorized" }, { status: 200 });
}