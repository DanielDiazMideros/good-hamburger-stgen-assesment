import { describe, expect, it, vi, beforeAll, afterAll } from "vitest";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@/utils/testing/render";
import { OrdersList } from "../OrdersList";
import type { SubmittedOrder } from "@/domain/order/types";

vi.mock("@/utils/format", () => ({
  formatMoney: (v: number) => `$${v.toFixed(2)}`,
}));

describe("<OrdersList />", () => {
  const originalToLocaleString = Date.prototype.toLocaleString;

  beforeAll(() => {
    Date.prototype.toLocaleString = vi.fn(() => "2025-01-01 12:00:00");
  });

  afterAll(() => {
    Date.prototype.toLocaleString = originalToLocaleString;
  });

  it("renders a list of orders with customer name, total, date and items", () => {
    const orders: SubmittedOrder[] = [
      {
        id: "1",
        customerName: "Daniel",
        createdAt: "2025-01-01T17:00:00.000Z",
        cart: {
          sandwich: {
            id: "burger",
            name: "Burger",
            category: "sandwich",
            price: 5,
          },
          fries: { id: "fries", name: "Fries", category: "extra", price: 2 },
          drink: {
            id: "soft_drink",
            name: "Soft drink",
            category: "extra",
            price: 2.5,
          },
        },
        subtotal: 9.5,
        discountRule: "combo_20",
        discountAmount: 1.9,
        total: 7.6,
      },
      {
        id: "2",
        customerName: "Ana",
        createdAt: "2025-01-02T17:00:00.000Z",
        cart: {
          sandwich: { id: "egg", name: "Egg", category: "sandwich", price: 6 },
        },
        subtotal: 6,
        discountRule: "none",
        discountAmount: 0,
        total: 6,
      },
    ];

    renderWithProviders(<OrdersList orders={orders} />);

    const order1 = within(screen.getByTestId("order-1"));
    expect(order1.getByText("Daniel")).toBeInTheDocument();
    expect(order1.getByText("$7.60")).toBeInTheDocument();
    expect(order1.getByText("2025-01-01 12:00:00")).toBeInTheDocument();
    expect(order1.getByText("Burger / Fries / Soft drink")).toBeInTheDocument();

    const order2 = within(screen.getByTestId("order-2"));
    expect(order2.getByText("Ana")).toBeInTheDocument();
    expect(order2.getByText("$6.00")).toBeInTheDocument();
    expect(order2.getByText("2025-01-01 12:00:00")).toBeInTheDocument();
    expect(order2.getByText("Egg / — / —")).toBeInTheDocument();
  });
});
