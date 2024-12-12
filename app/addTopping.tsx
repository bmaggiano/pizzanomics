"use client";
import { useState } from "react";
import { Pizza } from "./types/types";
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
import toppingFetches from "./fetches/toppingFetches";

export default function AddTopping({ pizzas }: { pizzas: Pizza[] }) {
  const [message, setMessage] = useState("");
  const [toppingName, setToppingName] = useState("");
  const [onPizza, setOnPizza] = useState<{ name: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    await toppingFetches.createTopping(
      e,
      setLoading,
      toast,
      router,
      setMessage,
      setOpen,
      toppingName,
      onPizza as Pizza[]
    );
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold" variant={"outline"}>
          Add Topping +
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Add a topping</DialogTitle>
        <DialogDescription>
          Remember, our ingredients are our top priority!
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topping">Topping</Label>
            <Input
              id="toppingName"
              placeholder="Pepperoni"
              value={toppingName}
              onChange={(e) => setToppingName(e.target.value)}
              required
            />
          </div>
          <br />
          <Label className="pt-4">Does this belong on any pizzas?</Label>
          {pizzas?.map((pizza) => (
            <div key={pizza.id} className="flex items-center space-x-2">
              <Checkbox
                id={pizza.name}
                value={pizza.name}
                onCheckedChange={(checked: boolean) =>
                  handleAddPizzas(checked, pizza)
                }
              />
              <label
                htmlFor={pizza.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {pizza.name}
              </label>
            </div>
          ))}
          {loading ? (
            <Button disabled className="flex w-full">
              <Loader2 className="animate-spin" /> Adding Topping
            </Button>
          ) : (
            <Button className="flex w-full" type="submit">
              Add Topping
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
