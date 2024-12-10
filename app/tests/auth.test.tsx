import { signUp } from "../utils/authFunctions";
import prisma from "../clients/prismaClient";
import { hashPassword, generateToken } from "../utils/auth";
import { cookies } from "next/headers";

// Mock the imported dependencies
jest.mock("../clients/prismaClient", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../utils/auth", () => ({
  hashPassword: jest.fn(),
  generateToken: jest.fn(),
}));

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

describe("signUp", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return success", async () => {
    // Mock `prisma.user.findUnique` to return `null` (no existing user)
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    // Mock `hashPassword` to return a fake hashed password
    (hashPassword as jest.Mock).mockResolvedValue("hashedPassword123");

    // Mock `prisma.user.create` to return a fake user object
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "test@example.com",
      role: "owner",
      password: "hashedPassword123",
    });

    // Mock `generateToken` to return a fake token
    (generateToken as jest.Mock).mockReturnValue("fakeToken123");

    // Mock `cookies` to provide a mock implementation for `set`
    const mockSet = jest.fn();
    (cookies as jest.Mock).mockReturnValue({
      set: mockSet,
    });

    // Call the `signUp` function
    const result = await signUp(
      "Test User",
      "test@example.com",
      "password123",
      "owner"
    );

    // Assert the result
    expect(result).toEqual({
      success: true,
      user: { email: "test@example.com", role: "owner" },
    });

    // Assert the mocks were called with expected arguments
    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(hashPassword).toHaveBeenCalledWith("password123");
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: "Test User",
        email: "test@example.com",
        password: "hashedPassword123",
        role: "owner",
      },
    });
    expect(generateToken).toHaveBeenCalledWith(1, "test@example.com", "owner");
    expect(mockSet).toHaveBeenCalledWith("auth_token", "fakeToken123", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
  });
});
