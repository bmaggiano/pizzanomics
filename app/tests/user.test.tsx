import { getUsers } from "../utils/helpers";

describe("User Model", () => {
  it("should retrieve a list of users", async () => {
    const users = await getUsers(); // Use await to get the resolved data

    // Ensure that users is an array
    expect(users).toBeInstanceOf(Array);
  });
});
