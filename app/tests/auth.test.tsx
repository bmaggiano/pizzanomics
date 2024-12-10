import { login } from "../utils/authFunctions";

describe("Auth Model", () => {
  it("should ", async () => {
    const username = "test@example.com";
    const password = "password";
    const user = await login(username, password); // Use await to get the resolved data

    // Ensure that pizzas is an array
    expect(user).toBeInstanceOf(Array);
  });
});
