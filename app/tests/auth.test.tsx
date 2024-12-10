import { signUp, logout, login } from "../utils/authFunctions";
import prisma from "../clients/prismaClient";
import { hashPassword, generateToken, comparePasswords } from "../utils/auth";
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
  comparePasswords: jest.fn(),
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

describe("logout function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should clear the auth token cookie", async () => {
    // Mock behavior
    (cookies as jest.Mock).mockReturnValue({
      set: jest.fn(),
    });

    const result = await logout();

    // Assert the result
    expect(result).toEqual({
      success: true,
      message: "Logged out successfully",
    });

    // Assert the mocks were called with expected arguments

    const cookieStore = await cookies();
    expect(cookies).toHaveBeenCalledWith();
    expect(cookieStore.set).toHaveBeenCalledWith("auth_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    });
  });
});

describe("login", () => {
  it("should successfully log in a user with valid credentials", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword123",
      role: "user",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (comparePasswords as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("mockedToken");

    const result = await login("test@example.com", "correctPassword");

    expect(result).toEqual({
      success: true,
      user: { id: 1, email: "test@example.com", role: "user" },
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(comparePasswords).toHaveBeenCalledWith(
      "correctPassword",
      "hashedPassword123"
    );
    expect(generateToken).toHaveBeenCalledWith(1, "test@example.com", "user");
  });

  it("should fail if the user does not exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await login("nonexistent@example.com", "somePassword");

    expect(result).toEqual({
      success: false,
      message: "Invalid credentials",
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
  });

  it("should fail if the password is incorrect", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedPassword123",
      role: "user",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
    (comparePasswords as jest.Mock).mockResolvedValue(false);

    const result = await login("test@example.com", "wrongPassword");

    expect(result).toEqual({
      success: false,
      message: "Invalid credentials",
    });

    expect(comparePasswords).toHaveBeenCalledWith(
      "wrongPassword",
      "hashedPassword123"
    );
  });

  it("should handle errors gracefully", async () => {
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database error")
    );

    const result = await login("test@example.com", "password");

    expect(result).toEqual({
      success: false,
      message: "An error occurred during login",
    });
  });
});
