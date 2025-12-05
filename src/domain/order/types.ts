import type { MenuItem } from "../menu/types";
import type { DiscountRule } from "../menu/pricing";

export type CartState = {
  sandwich?: MenuItem;
  fries?: MenuItem;
  drink?: MenuItem;
};

export type SubmittedOrder = {
  id: string;
  customerName: string;
  createdAt: string;
  cart: CartState;
  subtotal: number;
  discountRule: DiscountRule;
  discountAmount: number;
  total: number;
};
