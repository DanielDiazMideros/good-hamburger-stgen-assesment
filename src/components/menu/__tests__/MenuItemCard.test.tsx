import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/utils/testing/render";
import { MenuItemCard } from "../MenuItemCard";
import type { MenuItem } from "@/domain/menu/types";

describe("<MenuItemCard />", () => {
  const item: MenuItem = {
    id: "burger",
    name: "Burger",
    category: "sandwich",
    price: 5,
  };

  it("renders item name, category and formatted price", () => {
    renderWithProviders(<MenuItemCard item={item} onAdd={() => {}} />);

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("sandwich")).toBeInTheDocument();
    expect(screen.getByText("$ 5,00")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it("calls onAdd with the item when clicking the button", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderWithProviders(<MenuItemCard item={item} onAdd={onAdd} />);

    await user.click(screen.getByTestId("add-burger"));

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(item);
  });

  it("formats decimals with comma and 2 digits", () => {
    const it2: MenuItem = { ...item, id: "egg", name: "Egg", price: 2.5 };

    renderWithProviders(<MenuItemCard item={it2} onAdd={() => {}} />);

    expect(screen.getByText("$ 2,50")).toBeInTheDocument();
  });
});
