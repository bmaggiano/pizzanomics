import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Topping } from "./types/types";

export default function Toppings({ toppings }: { toppings: Topping[] }) {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 flex flex-col items-start justify-between">
        <h2 className="text-3xl font-bold mb-4">
          Our pizzas are made with the highest quality ingredients
        </h2>
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-4 gap-4">
            {toppings.map((topping) => (
              <div key={topping.id} className="flex flex-col items-center">
                <p className="text-xl font-bold">{topping.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
