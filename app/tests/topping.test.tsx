import { POST } from "../api/toppings/create/route";
import { PUT } from "../api/toppings/update/route";
import { DELETE } from "../api/toppings/delete/route";
import prisma from "../clients/prismaClient";
import { getToppings } from "../utils/helpers";
import { authorizeRole } from "../utils/roleCheck";
import { NextRequest, NextResponse } from "next/server";

jest.mock("../clients/prismaClient", () => ({
  topping: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../utils/roleCheck", () => ({
  authorizeRole: jest.fn(),
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("getToppings", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should retrieve a list of toppings", async () => {
    const mockToppings = [
      { id: "1", name: "Cheese", pizzas: [{ id: "1", name: "Margherita" }] },
      {
        id: "2",
        name: "Pepperoni",
        pizzas: [{ id: "2", name: "Pepperoni Pizza" }],
      },
    ];

    (prismaMock.topping.findMany as jest.Mock).mockResolvedValue(mockToppings);

    const toppings = await getToppings(); // Call the function

    // Assert the function returns an array
    expect(toppings).toBeInstanceOf(Array);
    // Assert the function returns the correct data
    expect(toppings).toEqual(mockToppings);
    // Ensure that the mock was called once
    expect(prismaMock.topping.findMany).toHaveBeenCalledTimes(1);
    // Ensure the correct arguments were passed
    expect(prismaMock.topping.findMany).toHaveBeenCalledWith({
      include: { pizzas: true },
    });
  });

  it("should return an empty array if no toppings are found", async () => {
    (prismaMock.topping.findMany as jest.Mock).mockResolvedValue([]); // Mock no data found

    const toppings = await getToppings(); // Call the function

    // Assert the function returns an empty array
    expect(toppings).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    (prismaMock.topping.findMany as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to fetch toppings");
    }); // Simulate a Failed to fetch toppings

    await expect(getToppings()).rejects.toThrow("Failed to fetch toppings");
  });
});

it("should return an empty array if no toppings are found", async () => {
  (prismaMock.topping.findMany as jest.Mock).mockResolvedValue([]); // Mock no data found

  const toppings = await getToppings(); // Call the function

  // Assert the function returns an empty array
  expect(toppings).toEqual([]);
});

it("should handle errors gracefully", async () => {
  (prismaMock.topping.findMany as jest.Mock).mockImplementation(() => {
    throw new Error("Failed to fetch toppings");
  }); // Simulate a Failed to fetch toppings

  await expect(getToppings()).rejects.toThrow("Failed to fetch toppings");
});

describe("POST /api/topping/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new topping successfully", async () => {
    const mockReq = new NextRequest("http://localhost/api/topping/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test",
        pizzas: [{ name: "Test Pizza" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.topping.create as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test",
      pizzas: [{ id: "1", name: "Test Pizza" }],
    });

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { name: "Test" },
    });
    expect(prismaMock.topping.create).toHaveBeenCalledWith({
      data: {
        name: "Test",
        pizzas: { connect: [{ name: "Test Pizza" }] },
      },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Topping added successfully!",
      topping: {
        id: "1",
        name: "Test",
        pizzas: [{ id: "1", name: "Test Pizza" }],
      },
    });
  });

  it("should not create a topping if one already exists", async () => {
    const mockReq = new NextRequest("http://localhost/api/topping/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test",
        pizzas: [{ name: "Test Pizza" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test",
    });

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { name: "Test" },
    });
    expect(prismaMock.topping.create).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Topping already exists",
    });
  });

  it("should handle errors during creation", async () => {
    const mockReq = new NextRequest("http://localhost/api/topping/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Invalid Topping",
        pizzas: [{ name: "Invalid Pizza" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.topping.create as jest.Mock).mockRejectedValue(
      new Error("Failed to create topping")
    );

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to add topping",
    });
  });

  it("should not create a topping if user is not authorized", async () => {
    const mockReq = new NextRequest("http://localhost/api/topping/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test",
        pizzas: [{ name: "Test Pizza" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(false);

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.topping.create).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});

describe("PUT /api/topping/update", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should update a topping successfully", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Updated Topping",
        pizzas: [{ id: "101" }, { id: "102" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Old Topping",
    }); // Simulate an existing topping
    (prismaMock.topping.update as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Updated Topping",
      pizzas: [],
    });

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.topping.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated Topping",
        pizzas: { connect: [{ id: "101" }, { id: "102" }] },
      },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Topping updated successfully!",
    });
  });

  it("should return an error if the topping does not exist", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "999",
        name: "Nonexistent Topping",
        pizzas: [{ id: "101" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });

    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue(null); // Simulate no existing topping

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "999" },
    });
    expect(prismaMock.topping.update).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Topping not found",
    });
  });

  it("should handle errors during the update operation", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Faulty Topping",
        pizzas: [{ id: "101" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });

    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Old Topping",
    }); // Simulate an existing topping

    (prismaMock.topping.update as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to update topping");
    }); // Simulate an error during update

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.topping.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Faulty Topping",
        pizzas: { connect: [{ id: "101" }] },
      },
    });
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to update topping",
    });
  });

  it("should not update a topping if user is not authorized", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Updated Topping",
        pizzas: [{ id: "101" }, { id: "102" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(false);

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.topping.update).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});

describe("DELETE /api/topping/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should delete a topping successfully", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test Topping",
    }); // Simulate an existing topping
    (prismaMock.topping.delete as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test Topping",
    }); // Simulate successful deletion

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.topping.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Topping deleted successfully!",
    });
  });

  it("should return an error if the topping does not exist", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "999" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue(null); // Simulate no existing topping

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "999" },
    });
    expect(prismaMock.topping.delete).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Topping not found",
    });
  });

  it("should handle errors during the delete operation", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.topping.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Faulty Topping",
    }); // Simulate an existing topping

    (prismaMock.topping.delete as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to fetch toppings");
    }); // Simulate an error during delete

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.topping.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to delete topping",
    });
  });

  it("should not delete a topping if user is not authorized", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(false); // Mock unauthorized user

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.topping.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.topping.delete).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});
