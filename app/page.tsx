"use server";
import Hero from "./hero";
import Pizzas from "./pizzas";
import Toppings from "./toppings";
import { User } from "./types/types";
import { verifyToken } from "./utils/auth";
import { getToppings, getPizzas } from "./utils/helpers";
import { cookies } from "next/headers";

export default async function Home() {
  const toppings = await getToppings();
  const pizzas = await getPizzas();
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = token ? await verifyToken(token) : null;
  return (
    <>
      <Hero user={user as User} />
      <Pizzas user={user as User} pizzas={pizzas} toppings={toppings} />
      <Toppings user={user as User} toppings={toppings} pizzas={pizzas} />
    </>
  );
}
