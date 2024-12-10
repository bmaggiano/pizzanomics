import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pizza } from "./types/types";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Pizzas({ pizzas }: { pizzas: Pizza[] }) {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4 flex flex-col items-start justify-between">
        <div className="flex justify-between w-full">
          <h2 className="text-3xl font-bold mb-4">
            Our world famous pizzas are made fresh to order
          </h2>
          <Button variant={"outline"} className="text-black">
            Add Pizza +
          </Button>
        </div>
        <div className="flex justify-center gap-6 py-4 items-center">
          {pizzas.map((pizza) => (
            <Card key={pizza.id} className="max-w-[220px] overflow-hidden">
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
            // <Card key={pizza.id} className="max">
            //   <div className="flex flex-col items-start">
            //     <Image
            //       src={
            //         pizza?.imageUrl || "/pizza.png" // Default image if no imageUrl is available
            //       }
            //       alt={pizza.name}
            //       width={200}
            //       height={200}
            //       className="rounded-lg"
            //     />
            //     <p className="text-xl font-bold">{pizza.name}</p>
            //     <p>{pizza?.description || "No description available."}</p>
            //     <p>
            //       {pizza.toppings?.map((topping) => topping.name).join(", ")}
            //     </p>
            //   </div>
            // </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
