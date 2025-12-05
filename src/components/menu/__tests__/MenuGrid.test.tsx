import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/utils/testing/render";
import { MenuGrid } from "../MenuGrid";
import type { MenuItem } from "@/domain/menu/types";

vi.mock("../MenuItemCard", () => ({
  MenuItemCard: ({ item, onAdd }: { item: MenuItem; onAdd: (i: MenuItem) => void }) => (
    <div data-testid={`menu-item-${item.id}`}>
      <span>{item.name}</span>
      <button onClick={() => onAdd(item)}>Add</button>
    </div>
  ),
}));

const burger: MenuItem = {
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

describe("<MenuGrid />", () => {
  it("renders loading state", () => {
    renderWithProviders(<MenuGrid loading items={[burger]} onAdd={() => {}} />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it("renders items when not loading", () => {
    renderWithProviders(
      <MenuGrid loading={false} items={[burger, fries]} onAdd={() => {}} />
    );

    expect(screen.getByTestId("menu-item-burger")).toBeInTheDocument();
    expect(screen.getByTestId("menu-item-fries")).toBeInTheDocument();

    expect(screen.getByText("Burger")).toBeInTheDocument();
    expect(screen.getByText("Fries")).toBeInTheDocument();

    expect(screen.queryByText(/loading\.\.\./i)).toBeNull();
  });

  it("calls onAdd with the item when clicking Add on a card", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderWithProviders(
      <MenuGrid loading={false} items={[burger, fries]} onAdd={onAdd} />
    );
    await user.click(screen.getAllByRole("button", { name: /add/i })[0]);

    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd).toHaveBeenCalledWith(burger);

    const friesCard = screen.getByTestId("menu-item-fries");
    await user.click(within(friesCard).getByRole("button", { name: /add/i }));

    expect(onAdd).toHaveBeenCalledTimes(2);
    expect(onAdd).toHaveBeenLastCalledWith(fries);
  });
});
