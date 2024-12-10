export interface Topping {
  id: number;
  name: string;
  imageUrl: string | null;
}

export type Pizza = {
  id: number;
  name: string;
  createdAt: Date;
  description: string | null;
  toppings: Topping[] | null;
  imageUrl: string | null;
};
