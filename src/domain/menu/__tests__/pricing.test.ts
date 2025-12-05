import { describe, expect, it } from "vitest";
import {
  calcSummary,
  getDiscountRate,
  getDiscountRule,
  type DiscountRule,
} from "../pricing";
import type { CartState } from "../pricing";
import type { MenuItem } from "../types";

const sandwich: MenuItem = {
  id: "burger",
  name: "Burger",
  category: "sandwich",
  price: 5,
};

const fries: MenuItem = {
  id: "fries",
  name: "Fries",
  category: "extra",
  price: 2,
};

const drink: MenuItem = {
  id: "soft_drink",
  name: "Soft drink",
  category: "extra",
  price: 2.5,
};

describe("getDiscountRule", () => {
  it("returns none for empty cart", () => {
    expect(getDiscountRule({})).toBe("none");
  });

  it("returns none for sandwich only", () => {
    expect(getDiscountRule({ sandwich })).toBe("none");
  });

  it("returns none for fries only", () => {
    expect(getDiscountRule({ fries })).toBe("none");
  });

  it("returns none for drink only", () => {
    expect(getDiscountRule({ drink })).toBe("none");
  });

  it("returns sandwich_fries_10 for sandwich + fries", () => {
    expect(getDiscountRule({ sandwich, fries })).toBe("sandwich_fries_10");
  });

  it("returns sandwich_drink_15 for sandwich + drink", () => {
    expect(getDiscountRule({ sandwich, drink })).toBe("sandwich_drink_15");
  });

  it("returns none for fries + drink (no sandwich)", () => {
    expect(getDiscountRule({ fries, drink })).toBe("none");
  });

  it("returns combo_20 for sandwich + fries + drink", () => {
    expect(getDiscountRule({ sandwich, fries, drink })).toBe("combo_20");
  });

  it("prioritizes combo_20 over other rules", () => {
    const cart: CartState = { sandwich, fries, drink };
    expect(getDiscountRule(cart)).toBe("combo_20");
  });
});

describe("getDiscountRate", () => {
  it("returns correct rate for each rule", () => {
    const cases: Array<[DiscountRule, number]> = [
      ["combo_20", 0.2],
      ["sandwich_drink_15", 0.15],
      ["sandwich_fries_10", 0.1],
      ["none", 0],
    ];

    for (const [rule, rate] of cases) {
      expect(getDiscountRate(rule)).toBe(rate);
    }
  });
});

describe("calcSummary", () => {
  it("returns empty items and zeros for empty cart", () => {
    const s = calcSummary({});
    expect(s.items).toEqual([]);
    expect(s.subtotal).toBe(0);
    expect(s.rule).toBe("none");
    expect(s.discountRate).toBe(0);
    expect(s.discountAmount).toBe(0);
    expect(s.total).toBe(0);
  });

  it("calculates no discount for sandwich only", () => {
    const s = calcSummary({ sandwich });
    expect(s.items).toEqual([sandwich]);
    expect(s.subtotal).toBe(5);
    expect(s.rule).toBe("none");
    expect(s.discountRate).toBe(0);
    expect(s.discountAmount).toBe(0);
    expect(s.total).toBe(5);
  });

  it("calculates 10% discount for sandwich + fries", () => {
    const s = calcSummary({ sandwich, fries });
    expect(s.rule).toBe("sandwich_fries_10");
    expect(s.subtotal).toBe(7);
    expect(s.discountRate).toBe(0.1);
    expect(s.discountAmount).toBe(0.7);
    expect(s.total).toBe(6.3);
  });

  it("calculates 15% discount for sandwich + drink", () => {
    const s = calcSummary({ sandwich, drink });
    expect(s.rule).toBe("sandwich_drink_15");
    expect(s.subtotal).toBe(7.5);
    expect(s.discountRate).toBe(0.15);
    expect(s.discountAmount).toBe(1.13);
    expect(s.total).toBe(6.37);
  });

  it("calculates 20% discount for sandwich + fries + drink", () => {
    const s = calcSummary({ sandwich, fries, drink });
    expect(s.rule).toBe("combo_20");
    expect(s.subtotal).toBe(9.5);
    expect(s.discountRate).toBe(0.2);
    expect(s.discountAmount).toBe(1.9);
    expect(s.total).toBe(7.6);
  });

  it("applies no discount for fries + drink without sandwich", () => {
    const s = calcSummary({ fries, drink });
    expect(s.rule).toBe("none");
    expect(s.subtotal).toBe(4.5);
    expect(s.discountAmount).toBe(0);
    expect(s.total).toBe(4.5);
  });

  it("rounds discountAmount and total to 2 decimals", () => {
    const weirdSandwich: MenuItem = { ...sandwich, price: 1.99 };
    const s = calcSummary({ sandwich: weirdSandwich, drink: { ...drink, price: 0 } });

    expect(s.rule).toBe("sandwich_drink_15");
    expect(s.subtotal).toBe(1.99);
    expect(s.discountAmount).toBe(0.3);
    expect(s.total).toBe(1.69);
  });

  it("returns items in [sandwich, fries, drink] order and filters missing ones", () => {
    const s = calcSummary({ fries, sandwich });
    expect(s.items).toEqual([sandwich, fries]);
  });

  it("does not mutate the input cart or items", () => {
    const cart: CartState = { sandwich, fries };
    const before = JSON.stringify(cart);

    const s = calcSummary(cart);

    expect(JSON.stringify(cart)).toBe(before);
    expect(s.items[0]).toBe(sandwich);
    expect(s.items[1]).toBe(fries);
  });
});
