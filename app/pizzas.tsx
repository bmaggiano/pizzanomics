"use client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pizza, Topping, User } from "./types/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import AddPizza from "./addPizza";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Loader2 } from "lucide-react";

function EditPizza({ topping, pizzas }: { topping: Topping[]; pizzas: Pizza }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pizzaName, setPizzaName] = useState(pizzas.name);
  const [pizzaDescription, setPizzaDescription] = useState(
    pizzas.description || ""
  );
  const [pizzaImage, setPizzaImage] = useState(pizzas.imageUrl);
  const [onTopping, setOnTopping] = useState<{ id: number; name: string }[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [eidtLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (open && pizzas?.toppings) {
      setOnTopping(pizzas.toppings);
    }
  }, [open, pizzas]);

  useEffect(() => {
    setDescriptionCount(pizzaDescription.length);
  }, [pizzaDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const result = await fetch("/api/pizzas/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: pizzas.id,
          name: pizzaName,
          description: pizzaDescription,
          imageUrl: pizzaImage,
          toppings: onTopping,
        }),
      });
      if (result.ok) {
        toast({
          title: "Pizza edited successfully!",
        });
        setMessage("");
        router.refresh();
        setOpen(false);
      } else {
        const error = await result.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error("Error adding pizza:", error);
    }
    setEditLoading(false);
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await fetch("/api/pizzas/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: pizzas.id }),
      });

      if (result.ok) {
        toast({
          title: "Pizza deleted successfully!",
        });
        setMessage("");
        router.refresh();
        setOpen(false);
      } else {
        const error = await result.json();
        setMessage(error.message);
      }
    } catch (error) {
      console.error("Error deleting pizza:", error);
    }
    setLoading(false);
  };

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
          <DialogTitle>Edit Pizza</DialogTitle>
          <DialogDescription>Make sure to save your changes!</DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pizzaName">Pizza</Label>
            <Input
              id="pizzaName"
              placeholder="The Sicilian"
              value={pizzaName}
              onChange={(e) => setPizzaName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pizzaDescription">
              Description {`(80 characters max)`}{" "}
              <span className="text-xs text-gray-700">
                {descriptionCount}/80
              </span>
            </Label>
            <Input
              id="pizzaDescription"
              placeholder="A thin crust classic with tomato, mozzarella, and basil."
              value={pizzaDescription || ""}
              onChange={(e) => setPizzaDescription(e.target.value)}
              required
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pizzaImage">
              Pizza image Url (only unsplash images allowed)
            </Label>
            <Input
              id="pizzaImage"
              placeholder="https://images.unsplash.com/photos/1-1"
              value={pizzaImage || ""}
              onChange={(e) => setPizzaImage(e.target.value)}
            />
          </div>
          {topping?.map((topping) => (
            <div key={topping.id} className="flex items-center space-x-2">
              <Checkbox
                id={topping.name}
                value={topping.name}
                onCheckedChange={(checked: boolean) =>
                  handleAddToppings(checked, topping)
                }
                checked={onTopping.some((p) => p.id === topping.id)}
              />
              <label
                htmlFor={topping.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {topping.name}
              </label>
            </div>
          ))}
          <div className="flex justify-end gap-4 w-full">
            {eidtLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" /> Saving Pizza
              </Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
            {loading ? (
              <Button disabled variant={"destructive"}>
                <Loader2 className="animate-spin" /> Deleting Pizza
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

export default function Pizzas({
  user,
  pizzas,
  toppings,
}: {
  user: User | null;
  pizzas: Pizza[];
  toppings: Topping[];
}) {
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
          {user && user.role === "owner" ? (
            <AddPizza toppings={toppings} />
          ) : (
            <Button variant={"outline"} disabled>
              Add Pizza +
            </Button>
          )}
        </div>
        <ScrollArea className="w-full">
          <div className="flex justify-start gap-6 py-4">
            {pizzas.map((pizza) => (
              <Card key={pizza.id} className="w-[220px] h-[340px] relative">
                {user && user.role === "owner" && (
                  <EditPizza pizzas={pizza} topping={toppings} />
                )}
                <CardHeader className="m-0 p-0">
                  <Image
                    src={
                      pizza?.imageUrl ||
                      "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Default image if no imageUrl is available
                    }
                    alt={pizza.name}
                    width={220}
                    height={200}
                    className="rounded-t-xl max-h-[140px] object-cover"
                  />
                  <CardTitle className="p-2">{pizza.name}</CardTitle>
                  <span className="px-2 text-sm text-gray-700">
                    Ingredients:
                  </span>
                  <ScrollArea className="p-2 w-[100%] whitespace-nowrap rounded-md">
                    {pizza.toppings?.map((topping) => (
                      <Badge
                        className="mr-1 text-gray-700 font-normal"
                        variant={"outline"}
                        key={topping.id}
                      >
                        {topping.name}
                      </Badge>
                    ))}
                    <ScrollBar className="mt-2" orientation="horizontal" />
                  </ScrollArea>
                  <CardDescription className="text-elipsis p-2 m-0">
                    - {pizza?.description || "No description."}
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
