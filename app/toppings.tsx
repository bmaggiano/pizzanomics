"use client";
import { useEffect, useState } from "react";
import { Topping, Pizza } from "./types/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import AddTopping from "./addTopping";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import AvatarCircles from "@/components/ui/avatar-circles";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

function EditTopping({
  topping,
  pizzas,
}: {
  topping: Topping;
  pizzas: Pizza[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [toppingName, setToppingName] = useState(topping.name);
  const [onPizza, setOnPizza] = useState<{ id: number; name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && topping?.pizzas) {
      setOnPizza(topping.pizzas);
    }
  }, [open, topping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");
    try {
      const result = await fetch("/api/toppings/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: topping.id,
          name: toppingName,
          pizzas: onPizza,
        }),
      });
      if (result.ok) {
        toast({
          title: "Topping edited successfully!",
        });
        setMessage("");
        router.refresh();
        setOpen(false);
      } else {
        const error = await result.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error("Error adding topping:", error);
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleDelete");
    try {
      const result = await fetch("/api/toppings/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: topping.id }),
      });

      if (result.ok) {
        toast({
          title: "Topping deleted successfully!",
        });
        setMessage("");
        router.refresh();
        setOpen(false);
      } else {
        const error = await result.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error("Error deleting topping:", error);
    }
  };

  const handleAddPizzas = (checked: boolean, pizza: Pizza) => {
    if (checked) {
      // Add pizza to the state when the checkbox is checked
      setOnPizza((prevState) => [
        ...prevState,
        { id: pizza.id, name: pizza.name },
      ]);
    } else {
      // Remove pizza from the state when the checkbox is unchecked
      setOnPizza((prevState) => prevState.filter((p) => p.name !== pizza.name));
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="p-[0.5rem] rounded-full absolute z-10 -right-2 -top-2"
          variant={"outline"}
        >
          <Edit className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Topping</DialogTitle>
          <DialogDescription>Make sure to save your changes!</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topping">Topping</Label>
            <Input
              id="toppingName"
              placeholder="pepperoni"
              value={toppingName}
              onChange={(e) => setToppingName(e.target.value)}
              required
            />
          </div>
          {pizzas?.map((pizza) => (
            <div key={pizza.id} className="flex items-center space-x-2">
              <Checkbox
                id={pizza.name}
                value={pizza.name}
                onCheckedChange={(checked: boolean) =>
                  handleAddPizzas(checked, pizza)
                }
                checked={onPizza.some((p) => p.id === pizza.id)}
              />
              <label
                htmlFor={pizza.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {pizza.name}
              </label>
            </div>
          ))}
          <div className="flex justify-end gap-4 w-full">
            <Button type="submit">Save</Button>
            <Button variant={"destructive"} onClick={(e) => handleDelete(e)}>
              Delete
            </Button>
          </div>
        </form>
        {message && (
          <p
            className={cn(
              "mt-2 text-sm text-center",
              message.includes("successful") ? "text-green-600" : "text-red-600"
            )}
          >
            {message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Toppings({
  toppings,
  pizzas,
}: {
  toppings: Topping[];
  pizzas: Pizza[];
}) {
  return (
    <section id="toppings" className="py-12 sm:py-20 bg-gray-100">
      <div className="container mx-auto px-4 flex flex-col items-start justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-between w-full">
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Our pizzas are made with the highest quality ingredients
            </h2>
            <h3 className="text-lg text-gray-500 mb-4">
              As a chef at Pizzanomics, you can add your own toppings to our
              database of toppings.
            </h3>
          </div>
          <AddTopping pizzas={pizzas} />
        </div>
        <ScrollArea className="w-full">
          <div className="flex justify-start w-full items-center py-4 gap-4">
            {/* <div className="grid sm:grid-cols-6 grid-cols-2 gap-4 pt-4"> */}
            {toppings.map((topping) => (
              <Card
                key={topping.id}
                className="w-[150px] relative flex flex-col items-center"
              >
                <EditTopping pizzas={pizzas} topping={topping} />
                <CardHeader className="p-4">
                  <p className="font-semibold">{topping.name}</p>
                  {topping?.pizzas && topping?.pizzas?.length > 0 ? (
                    <>
                      <p className="text-xs text-gray-500">
                        Used in {topping?.pizzas?.length} pizza
                        {topping?.pizzas?.length > 1 && "s"}
                      </p>
                      <AvatarCircles
                        numPeople={topping?.pizzas?.length ?? 0}
                        avatarUrls={topping?.pizzas || []}
                      />
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">Not on any pizzas</p>
                  )}
                </CardHeader>
              </Card>
            ))}
            {/* </div> */}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
