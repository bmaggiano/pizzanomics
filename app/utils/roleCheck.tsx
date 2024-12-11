import { NextRequest, NextResponse } from "next/server";
import prisma from "../clients/prismaClient";
import { verifyToken } from "./auth";

// Middleware for role-based access control
export async function authorizeRole(req: NextRequest, requiredRole: string) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Please log in or sign up to access this resource" },
      {
        status: 401,
        statusText: "Please log in or sign up to access this resource",
      }
    );
  }

  const decoded = verifyToken(token);

  const userId =
    typeof decoded === "object" && decoded !== null
      ? decoded.userId
      : undefined;

  if (!userId) {
    return NextResponse.json(
      { message: "User not authenticated" },
      { status: 401, statusText: "User not authenticated" }
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
      {
        status: 403,
        statusText: `Only ${requiredRole}s can perform this action`,
      }
    );
  }

  // Allow request to continue by returning NextResponse directly
  return NextResponse.json({ message: "Role authorized" }, { status: 200 });
}
