"use server";
import Hero from "./hero";
import Navbar from "./navbar";
import Pizzas from "./pizzas";
import Toppings from "./toppings";
import { getToppings, getPizzas } from "./utils/helpers";

export default async function Home() {
  const toppings = await getToppings();
  const pizzas = await getPizzas();
  return (
    <>
      <Navbar />
      <Hero />
      <Pizzas pizzas={pizzas} />
      <Toppings toppings={toppings} />
      <div className="mt-60" id="toppings">
        toppings
      </div>
    </>
  );
}
