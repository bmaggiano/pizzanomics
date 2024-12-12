"use client";
import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import pizzaFetches from "./fetches/pizzaFetches";

export default function AddPizza({ toppings }: { toppings: Topping[] }) {
  const [message, setMessage] = useState("");
  const [pizzaDescription, setPizzaDescription] = useState("");
  const [pizzaName, setPizzaName] = useState("");
  const [pizzaImage, setPizzaImage] = useState("");
  const [onTopping, setOnTopping] = useState<{ name: string }[]>([]);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddToppings = (checked: boolean, topping: Topping) => {
    if (checked) {
      // Add topping to the state when the checkbox is checked
      setOnTopping((prevState) => [
        ...prevState,
        { id: topping.id, name: topping.name },
      ]);
    } else {
      // Remove topping from the state when the checkbox is unchecked
      setOnTopping((prevState) =>
        prevState.filter((p) => p.name !== topping.name)
      );
    }
  };

  useEffect(() => {
    setDescriptionCount(pizzaDescription.length);
  }, [pizzaDescription]);

  const handleSubmit = async (e: React.FormEvent) => {
    await pizzaFetches.createPizza(
      e,
      setLoading,
      toast,
      router,
      setMessage,
      setOpen,
      pizzaName,
      pizzaDescription,
      onTopping
    );
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
            <Label htmlFor="pizzaDescription">
              Description {`(80 characters max)`}{" "}
              <span className="text-xs text-gray-700">
                {descriptionCount}/80
              </span>
            </Label>
            <Input
              id="pizzaDescription"
              placeholder="A thin crust classic with tomato, mozzarella, and basil."
              value={pizzaDescription}
              onChange={(e) => setPizzaDescription(e.target.value)}
              required
              maxLength={80}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pizzaImage">
              Pizza image URL (only unsplash images allowed)
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
          {loading ? (
            <Button disabled className="flex w-full">
              <Loader2 className="animate-spin" /> Adding Pizza
            </Button>
          ) : (
            <Button className="flex w-full" type="submit">
              Add Pizza
            </Button>
          )}
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
