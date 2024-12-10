import { Topping } from "./types/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";

export default function Toppings({ toppings }: { toppings: Topping[] }) {
  return (
    <section id="toppings" className="py-12 sm:py-20 bg-gray-100">
      <div className="container mx-auto px-4 flex flex-col items-start justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-between w-full">
          <h2 className="text-3xl font-bold mb-4">
            Our pizzas are made with the highest quality ingredients
          </h2>
          <Button className="font-semibold" variant={"outline"}>
            Add Topping +
          </Button>
        </div>
        <div className="flex justify-start w-full items-center">
          <div className="grid sm:grid-cols-6 grid-cols-3 gap-4 pt-4">
            {toppings.map((topping) => (
              <Card key={topping.id} className="flex flex-col items-center">
                <CardHeader>
                  <p className="font-semibold">{topping.name}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
