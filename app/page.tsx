"use server";
import Hero from "./hero";
import Pizzas from "./pizzas";
import Toppings from "./toppings";
import { getToppings, getPizzas } from "./utils/helpers";

export default async function Home() {
  const toppings = await getToppings();
  const pizzas = await getPizzas();
  return (
    <>
      <Hero />
      <Pizzas pizzas={pizzas} toppings={toppings} />
      <Toppings toppings={toppings} pizzas={pizzas} />
    </>
  );
}
