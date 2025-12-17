import prisma from "../clients/prismaClient";
import { getUsers } from "../utils/helpers";

jest.mock("../clients/prismaClient", () => ({
  user: {
    findMany: jest.fn(),
  },
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should retrieve a list of users", async () => {
    const mockUsers = [
      { id: 1, name: "John Doe", email: "john@example.com", role: "chef" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "owner" },
    ];

    (prismaMock.user.findMany as jest.Mock).mockResolvedValue(mockUsers);

    const users = await getUsers(); // Use await to get the resolved data

    // Ensure that users is an array
    expect(users).toBeInstanceOf(Array);
    // Assert the function returns the correct data
    expect(users).toEqual(mockUsers);
    // Ensure that the mock was called once
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return an empty array if no users are found", async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([]); // Mock no data found

    const users = await getUsers(); // Call the function

    // Assert the function returns an empty array
    expect(users).toEqual([]);
  });

  it("should handle errors gracefully and return empty array", async () => {
    (prismaMock.user.findMany as jest.Mock).mockRejectedValue(
      new Error("Database connection failed")
    );

    const users = await getUsers(); // Call the function

    // Assert the function returns an empty array on error
    expect(users).toEqual([]);
  });
});
