// types/index.ts
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type Cart = {
  items: CartItem[];
  total: number;
};
