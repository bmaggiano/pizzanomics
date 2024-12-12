export default {
  createPizza: async (
    e: React.FormEvent,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    pizzaName: string,
    pizzaDescription: string,
    onTopping: any
  ) => {
    e.preventDefault();
    setLoading(true);
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
      if (result.ok) {
        toast({
          title: "Pizza added successfully!",
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
    setLoading(false);
  },
  updatePizza: async (
    e: React.FormEvent,
    setEditLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    pizzas: any,
    pizzaName: string,
    pizzaImage: string,
    pizzaDescription: string,
    onTopping: any
  ) => {
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
  },
  deletePizza: async (
    e: React.FormEvent,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    pizzas: any
  ) => {
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
  },
};
