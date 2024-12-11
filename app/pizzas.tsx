import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pizza } from "./types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Pizzas({ pizzas }: { pizzas: Pizza[] }) {
  return (
    <section id="pizzas" className="bg-white py-12 sm:py-20">
      <div className="container mx-auto px-4 flex flex-col items-start justify-start">
        <div className="flex flex-col sm:flex-row justify-between w-full">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Our world famous pizzas are made fresh to order
            </h2>
            <h3 className="text-lg text-gray-500 mb-4">
              As an owner at Pizzanomics you can add your own pizzas to our
              database of pizzas.
            </h3>
          </div>
          <Button variant={"outline"} className="font-semibold">
            Add Pizza +
          </Button>
        </div>
        <ScrollArea className="w-full">
          <div className="flex justify-start gap-6 py-4">
            {pizzas.map((pizza) => (
              <Card key={pizza.id} className="w-[220px] overflow-hidden">
                <CardHeader className="m-0 p-0">
                  <Image
                    src={
                      pizza?.imageUrl || "/pizza.png" // Default image if no imageUrl is available
                    }
                    alt={pizza.name}
                    width={220}
                    height={200}
                  />
                  <CardTitle className="p-2">{pizza.name}</CardTitle>
                  <ScrollArea className="p-2 w-[100%] whitespace-nowrap rounded-md">
                    {pizza.toppings?.map((topping) => (
                      <Badge
                        className="mr-1"
                        variant={"outline"}
                        key={topping.id}
                      >
                        {topping.name}
                      </Badge>
                    ))}
                    <ScrollBar className="mt-2" orientation="horizontal" />
                  </ScrollArea>
                  <CardDescription className="p-2 m-0">
                    {pizza?.description || "No description."}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
