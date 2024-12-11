"use client";
import { Topping } from "./types/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AddPizza({ toppings }: { toppings: Topping[] }) {
  const [message, setMessage] = useState("");
  const [pizzaDescription, setPizzaDescription] = useState("");
  const [pizzaName, setPizzaName] = useState("");
  const [pizzaImage, setPizzaImage] = useState("");
  const [onTopping, setOnTopping] = useState<{ name: string }[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleAddToppings = (checked: boolean, topping: Topping) => {
    if (checked) {
      // Add pizza to the state when the checkbox is checked
      setOnTopping((prevState) => [
        ...prevState,
        { id: topping.id, name: topping.name },
      ]);
    } else {
      // Remove pizza from the state when the checkbox is unchecked
      setOnTopping((prevState) =>
        prevState.filter((p) => p.name !== topping.name)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch("/api/pizzas/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: pizzaName,
          description: pizzaDescription,
          toppings: onTopping,
        }),
      });
      console.log(result);
      if (result.ok) {
        toast({
          title: "Topping added successfully!",
        });
        router.refresh();
        setMessage("");
        setOpen(false);
      } else {
        const error = await result.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error("Error adding topping:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold" variant={"outline"}>
          Add Pizza +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add a pizza</DialogTitle>
        <DialogDescription>All ideas are great ideas!</DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pizza">Pizza</Label>
            <Input
              id="pizzaName"
              placeholder="The Sicilian"
              value={pizzaName}
              onChange={(e) => setPizzaName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pizzaDescription">Description</Label>
            <Input
              id="pizzaDescription"
              placeholder="A thin crust classic with tomato, mozzarella, and basil."
              value={pizzaDescription}
              onChange={(e) => setPizzaDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pizzaImage">
              Pizza Image (only unsplash images allowed)
            </Label>
            <Input
              id="pizzaImage"
              placeholder="https://images.unsplash.com/photos/1-1"
              value={pizzaImage}
              onChange={(e) => setPizzaImage(e.target.value)}
            />
          </div>
          <br />
          <Label className="pt-4">Does this pizza include any toppings?</Label>
          {toppings?.map((topping) => (
            <div key={topping.id} className="flex items-center space-x-2">
              <Checkbox
                id={topping.name}
                value={topping.name}
                onCheckedChange={(checked: boolean) =>
                  handleAddToppings(checked, topping)
                }
              />
              <label
                htmlFor={topping.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {topping.name}
              </label>
            </div>
          ))}
          <Button className="flex w-full" type="submit">
            Add Pizza
          </Button>
          {message && (
            <p
              className={cn(
                "mt-2 text-sm text-center",
                message.includes("successful")
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {message}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
