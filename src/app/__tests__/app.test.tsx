import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/utils/testing/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../page";

vi.mock("@/services/menu/menu.service", () => ({
  fetchMenu: vi.fn(async () => [
    { id: "burger", name: "Burger", category: "sandwich", price: 5 },
    { id: "fries", name: "Fries", category: "extra", price: 2 },
  ]),
}));

describe("App page", () => {
  it("shows loading then renders menu items", async () => {
    renderWithProviders(<Page />);

    expect(screen.getAllByText(/loading/i).length).toBeGreaterThan(0);
    const menuCard = await screen.findByTestId("menu-card");
    const menuUI = within(menuCard);

    expect(await menuUI.findByText("Burger")).toBeInTheDocument();
    expect(menuUI.getByText("Fries")).toBeInTheDocument();
  });

  it("requires customer name to submit an order", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Page />);

    const menuCard = await screen.findByTestId("menu-card");
    const menuUI = within(menuCard);
    const addButtons = menuUI.getAllByRole("button", { name: /add/i });
    await user.click(addButtons[0]);

    const cartCard = screen.getByTestId("cart-card");
    const cartUI = within(cartCard);

    await user.click(cartUI.getByRole("button", { name: /submit order/i }));

    expect(
      await screen.findByText(/Customer name is required/i)
    ).toBeInTheDocument();
  });
});
