

import type { MenuItem } from "./types";

export type CartState = {
  sandwich?: MenuItem;
  fries?: MenuItem;
  drink?: MenuItem;
};

export type DiscountRule = "combo_20" | "sandwich_drink_15" | "sandwich_fries_10" | "none";

export function getDiscountRule(cart: CartState): DiscountRule {
  const hasSandwich = !!cart.sandwich;
  const hasFries = !!cart.fries;
  const hasDrink = !!cart.drink;

  if (hasSandwich && hasFries && hasDrink) return "combo_20";
  if (hasSandwich && hasDrink) return "sandwich_drink_15";
  if (hasSandwich && hasFries) return "sandwich_fries_10";
  return "none";
}

export function getDiscountRate(rule: DiscountRule): number {
  switch (rule) {
    case "combo_20":
      return 0.2;
    case "sandwich_drink_15":
      return 0.15;
    case "sandwich_fries_10":
      return 0.1;
    default:
      return 0;
  }
}

export function calcSummary(cart: CartState) {
  const items = [cart.sandwich, cart.fries, cart.drink].filter(Boolean) as MenuItem[];
  const subtotal = items.reduce((acc, it) => acc + it.price, 0);

  const rule = getDiscountRule(cart);
  const discountRate = getDiscountRate(rule);
  const discountAmount = +(subtotal * discountRate).toFixed(2);
  const total = +(subtotal - discountAmount).toFixed(2);

  return { items, subtotal, rule, discountRate, discountAmount, total };
}
