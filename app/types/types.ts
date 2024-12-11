export interface Topping {
  id: number;
  name: string;
  pizzas?: Pizza[] | null;
}

export type Pizza = {
  id: number;
  name: string;
  createdAt: Date;
  description: string | null;
  toppings?: Topping[] | null;
  imageUrl: string | null;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
};
