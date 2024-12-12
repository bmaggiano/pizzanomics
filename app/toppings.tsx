"use client";
import { useEffect, useState } from "react";
import { Topping, Pizza, User } from "./types/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import AddTopping from "./addTopping";
import { Edit, Loader2 } from "lucide-react";
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
import toppingFetches from "./fetches/toppingFetches";

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
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (open && topping?.pizzas) {
      setOnPizza(topping.pizzas);
    }
  }, [open, topping]);

  const handleSubmit = async (e: React.FormEvent) => {
    await toppingFetches.updateTopping(
      e,
      setEditLoading,
      toast,
      router,
      setMessage,
      setOpen,
      topping,
      toppingName,
      onPizza
    );
  };

  const handleDelete = async (e: React.FormEvent) => {
    await toppingFetches.deleteTopping(
      e,
      setLoading,
      toast,
      router,
      setMessage,
      setOpen,
      topping
    );
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
            {editLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" /> Saving Topping
              </Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
            {loading ? (
              <Button disabled variant={"destructive"}>
                <Loader2 className="animate-spin" /> Deleting Topping
              </Button>
            ) : (
              <Button variant={"destructive"} onClick={(e) => handleDelete(e)}>
                Delete
              </Button>
            )}
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
  user,
  toppings,
  pizzas,
}: {
  user: User | null;
  toppings: Topping[];
  pizzas: Pizza[];
}) {
  return (
    <section id="toppings" className="py-12 sm:py-20 bg-gray-100">
      <div className="container mx-auto px-4 flex flex-col items-start justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-between w-full">
          <div>
            <h2 className="text-3xl tracking-tight font-bold mb-2">
              Our pizzas are made with the highest quality ingredients
            </h2>
            <h3 className="text-lg text-gray-500 mb-4">
              As an owner at Pizzanomics, you can add your own toppings to our
              database of toppings.
            </h3>
          </div>
          {user && user.role === "owner" ? (
            <AddTopping pizzas={pizzas} />
          ) : (
            <Button disabled variant={"outline"}>
              Add Topping +
            </Button>
          )}
        </div>
        <ScrollArea className="w-full">
          <div className="flex justify-start w-full items-center py-4 gap-4">
            {toppings.map((topping) => (
              <Card
                key={topping.id}
                className="w-[150px] relative flex flex-col items-center"
              >
                {user && user.role === "owner" && (
                  <EditTopping pizzas={pizzas} topping={topping} />
                )}
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
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
