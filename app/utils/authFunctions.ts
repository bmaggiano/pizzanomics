"use server";

import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePasswords, generateToken } from "./auth";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function signUp(
  name: string,
  email: string,
  password: string,
  role: string
) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });

    const token = generateToken(user.id, user.email, user.role);

    // Set the token as an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, message: "An error occurred during sign up" };
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials" };
    }

    const token = generateToken(user.id, user.email, user.role);

    // Set the token as an HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return {
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An error occurred during login" };
  }
}

export async function logout() {
  try {
    // Clear the auth token cookie
    const cookieStore = await cookies(); // Await the promise
    cookieStore.set("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });

    return { success: true, message: "Logged out successfully" };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, message: "An error occurred during logout" };
  }
}
