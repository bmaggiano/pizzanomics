export default {
  createTopping: async (
    e: React.FormEvent,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    toppingName: string,
    onPizza: any
  ) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await fetch("/api/toppings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: toppingName,
          pizzas: onPizza,
        }),
      });
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
    setLoading(false);
  },
  updateTopping: async (
    e: React.FormEvent,
    setEditLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    topping: any,
    toppingName: string,
    onPizza: any
  ) => {
    e.preventDefault();
    setEditLoading(true);
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
    setEditLoading(false);
  },
  deleteTopping: async (
    e: React.FormEvent,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    toast: any,
    router: any,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    topping: any
  ) => {
    e.preventDefault();
    setLoading(true);
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
    setLoading(false);
  },
};
