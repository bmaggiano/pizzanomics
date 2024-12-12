import { POST } from "../api/pizzas/create/route";
import { PUT } from "../api/pizzas/update/route";
import { DELETE } from "../api/pizzas/delete/route";
import prisma from "../clients/prismaClient";
import { getPizzas } from "../utils/helpers";
import { authorizeRole } from "../utils/roleCheck";
import { NextRequest, NextResponse } from "next/server";

jest.mock("../clients/prismaClient", () => ({
  pizza: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("../utils/roleCheck", () => ({
  authorizeRole: jest.fn(),
}));

const prismaMock = prisma as jest.Mocked<typeof prisma>;

describe("getPizzas", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should retrieve a list of pizzas", async () => {
    const mockPizzas = [
      { id: "1", name: "Cheese Pizza", pizzas: [{ id: "1", name: "Cheese" }] },
      {
        id: "2",
        name: "Pepperoni Pizza",
        pizzas: [{ id: "2", name: "Pepperoni" }],
      },
    ];

    (prismaMock.pizza.findMany as jest.Mock).mockResolvedValue(mockPizzas);

    const pizzas = await getPizzas(); // Call the function

    // Assert the function returns an array
    expect(pizzas).toBeInstanceOf(Array);
    // Assert the function returns the correct data
    expect(pizzas).toEqual(mockPizzas);
    // Ensure that the mock was called once
    expect(prismaMock.pizza.findMany).toHaveBeenCalledTimes(1);
    // Ensure the correct arguments were passed
    expect(prismaMock.pizza.findMany).toHaveBeenCalledWith({
      include: { toppings: true },
    });
  });

  it("should return an empty array if no pizzas are found", async () => {
    (prismaMock.pizza.findMany as jest.Mock).mockResolvedValue([]); // Mock no data found

    const pizzas = await getPizzas(); // Call the function

    // Assert the function returns an empty array
    expect(pizzas).toEqual([]);
  });

  it("should handle errors gracefully", async () => {
    (prismaMock.pizza.findMany as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to fetch pizzas");
    }); // Simulate a Failed to fetch pizzas

    await expect(getPizzas()).rejects.toThrow("Failed to fetch pizzas");
  });
});

describe("POST /api/pizzas/create", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new pizza successfully", async () => {
    const mockReq = new NextRequest("http://localhost/api/pizzas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test",
        description: "test description",
        imageUrl: "test image url",
        toppings: [{ name: "Test topping" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.pizza.create as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test",
      description: "test description",
      imageUrl: "test image url",
      toppings: [{ id: "1", name: "Test topping" }],
    });

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: "test",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.pizza.create).toHaveBeenCalledWith({
      data: {
        name: "Test",
        description: "test description",
        imageUrl: "test image url",
        toppings: { connect: [{ name: "Test topping" }] },
      },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Pizza added successfully!",
      pizza: {
        id: "1",
        name: "Test",
        description: "test description",
        imageUrl: "test image url",
        toppings: [{ id: "1", name: "Test topping" }],
      },
    });
  });

  it("should not create a pizza if one already exists", async () => {
    const mockReq = new NextRequest("http://localhost/api/pizzas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "test",
        toppings: [{ name: "Test topping" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.pizza.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
      name: "test",
    });

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: "test",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.pizza.create as jest.Mock).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Pizza already exists",
    });
  });

  it("should handle errors during creation", async () => {
    const mockReq = new NextRequest("http://localhost/api/pizzas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Invalid Pizza",
        toppings: [{ name: "Invalid toppings" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue(null);
    (prismaMock.pizza.create as jest.Mock).mockRejectedValue(
      new Error("Failed to create pizza")
    );

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to add pizza",
    });
  });

  it("should not create a pizza if user is not authorized", async () => {
    const mockReq = new NextRequest("http://localhost/api/pizzas/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test",
        pizzas: [{ name: "Test topping" }],
      }),
    });

    (authorizeRole as jest.Mock).mockResolvedValue(false);

    const response = await POST(mockReq);
    expect(response).toBeInstanceOf(NextResponse);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.pizza.create).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});

describe("PUT /api/pizzas/update", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should update a pizza successfully", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Updated pizza",
        description: "Updated description",
        imageUrl: "Updated imageUrl",
        toppings: [{ id: "101" }, { id: "102" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Old pizza",
    });
    (prismaMock.pizza.findFirst as jest.Mock).mockResolvedValue(null);
    (prismaMock.pizza.update as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Updated pizza",
      description: "Updated description",
      imageUrl: "Updated imageUrl",
      toppings: [],
    });

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json();

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.pizza.findFirst).toHaveBeenCalledWith({
      where: {
        name: {
          equals: "updated pizza",
          mode: "insensitive",
        },
      },
    });
    expect(prismaMock.pizza.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Updated pizza",
        description: "Updated description",
        imageUrl: "Updated imageUrl",
        toppings: {
          set: [],
          connect: [{ id: "101" }, { id: "102" }],
        },
      },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Pizza updated successfully!",
    });
  });
  it("should return an error if the pizza does not exist", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "999",
        name: "Nonexistent pizza",
        description: "Nonexistent description",
        imageUrl: "Nonexistent imageUrl",
        toppings: [{ id: "101" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue(null); // Simulate no existing pizza

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "999" },
    });
    expect(prismaMock.pizza.update).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Pizza not found",
    });
  });

  it("should handle errors during the update operation", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Faulty pizza",
        description: "Faulty description",
        imageUrl: "Faulty imageUrl",
        toppings: [{ id: "101" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });

    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Old pizza",
      description: "Old description",
      imageUrl: "Old imageUrl",
    });

    (prismaMock.pizza.update as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to update pizza");
    });

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.pizza.update).toHaveBeenCalledWith({
      where: { id: "1" },
      data: {
        name: "Faulty pizza",
        description: "Faulty description",
        imageUrl: "Faulty imageUrl",
        toppings: { set: [], connect: [{ id: "101" }] },
      },
    });
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to update pizza",
    });
  });

  it("should not update a pizza if user is not authorized", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({
        id: "1",
        name: "Updated pizza",
        toppings: [{ id: "101" }, { id: "102" }],
      }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(false);

    const response = await PUT(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.pizza.update).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});

describe("DELETE /api/pizzas/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it("should delete a pizza successfully", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test pizza",
    }); // Simulate an existing pizza
    (prismaMock.pizza.delete as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Test pizza",
    }); // Simulate successful deletion

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.pizza.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(responseJson).toEqual({
      success: true,
      message: "Pizza deleted successfully!",
    });
  });

  it("should return an error if the pizza does not exist", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "999" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue(null); // Simulate no existing pizza

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "999" },
    });
    expect(prismaMock.pizza.delete).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
      message: "Pizza not found",
    });
  });

  it("should handle errors during the delete operation", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(true);
    (authorizeRole as jest.Mock).mockResolvedValue({ status: 200 });
    // Mock authorization
    (prismaMock.pizza.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      name: "Faulty pizza",
    }); // Simulate an existing pizza

    (prismaMock.pizza.delete as jest.Mock).mockImplementation(() => {
      throw new Error("Failed to fetch pizzas");
    }); // Simulate an error during delete

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(prismaMock.pizza.delete).toHaveBeenCalledWith({
      where: { id: "1" },
    });
    expect(responseJson).toEqual({
      success: false,
      message: "Failed to delete pizza",
    });
  });

  it("should not delete a pizza if user is not authorized", async () => {
    const mockReq = {
      json: jest.fn().mockResolvedValue({ id: "1" }),
    } as Partial<NextRequest>;

    (authorizeRole as jest.Mock).mockResolvedValue(false); // Mock unauthorized user

    const response = await DELETE(mockReq as NextRequest);
    const responseJson = await response.json(); // Convert NextResponse to JSON

    expect(authorizeRole).toHaveBeenCalledWith(mockReq, "chef");
    expect(prismaMock.pizza.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.pizza.delete).not.toHaveBeenCalled();
    expect(responseJson).toEqual({
      success: false,
    });
  });
});
