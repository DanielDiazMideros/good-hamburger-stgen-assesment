import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/utils/testing/render";
import { CartSlots } from "../CartSlots";
import type { CartState } from "@/domain/menu/pricing";

vi.mock("@/utils/format", () => ({
  formatMoney: (v: number) => `$${v.toFixed(2)}`,
}));

describe("<CartSlots />", () => {
  it("renders the three slot titles", () => {
    const cart: CartState = {};
    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={() => {}} />);

    expect(screen.getByText("Sandwich")).toBeInTheDocument();
    expect(screen.getByText("Fries")).toBeInTheDocument();
    expect(screen.getByText("Soft drink")).toBeInTheDocument();
  });

  it("shows dashes when slots are empty and no Remove buttons", () => {
    const cart: CartState = {};
    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={() => {}} />);
    expect(screen.getAllByText("-")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: /remove/i })).toBeNull();
  });

  it("renders item name and formatted price for filled slots", () => {
    const cart: CartState = {
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
    };

    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={() => {}} />);

    expect(screen.getByText("Burger ($5.00)")).toBeInTheDocument();
    expect(screen.getByText("Fries ($2.00)")).toBeInTheDocument();
    expect(screen.getByText("Soft drink ($2.50)")).toBeInTheDocument();
  });

  it("shows Remove buttons only for slots that have a value", () => {
    const cart: CartState = {
      sandwich: {
        id: "burger",
        name: "Burger",
        category: "sandwich",
        price: 5,
      },
      drink: {
        id: "soft_drink",
        name: "Soft drink",
        category: "extra",
        price: 2.5,
      },
    };

    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={() => {}} />);
    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(2);
  });

  it("calls onRemoveSlot with correct slot when clicking Remove", async () => {
    const user = userEvent.setup();
    const onRemoveSlot = vi.fn();

    const cart: CartState = {
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
    };

    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={onRemoveSlot} />);

    const removeButtons = screen.getAllByRole("button", { name: "Remove" });

    await user.click(removeButtons[0]);
    expect(onRemoveSlot).toHaveBeenCalledWith("sandwich");

    await user.click(removeButtons[1]);
    expect(onRemoveSlot).toHaveBeenCalledWith("fries");

    await user.click(removeButtons[2]);
    expect(onRemoveSlot).toHaveBeenCalledWith("drink");

    expect(onRemoveSlot).toHaveBeenCalledTimes(3);
  });

  it("does not call onRemoveSlot when slot is empty (no button rendered)", async () => {
    const user = userEvent.setup();
    const onRemoveSlot = vi.fn();

    const cart: CartState = {};
    renderWithProviders(<CartSlots cart={cart} onRemoveSlot={onRemoveSlot} />);

    expect(screen.queryByRole("button", { name: "Remove" })).toBeNull();

    await user.click(document.body);
    expect(onRemoveSlot).not.toHaveBeenCalled();
  });
});
