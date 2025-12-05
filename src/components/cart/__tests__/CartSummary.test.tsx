import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/utils/testing/render";
import { CartSummary } from "../CartSummary";

vi.mock("@/utils/format", () => ({
  formatMoney: (v: number) => `$${v.toFixed(2)}`,
}));

describe("<CartSummary />", () => {
  it("renders totals and discount label", () => {
    renderWithProviders(
      <CartSummary subtotal={9.5} rule="none" discountAmount={0} total={9.5} />
    );

    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("No discount")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getAllByText("$9.50")).toHaveLength(2);
    expect(screen.getByText("-$0.00")).toBeInTheDocument();
  });

  it("renders combo label when rule is combo_20", () => {
    renderWithProviders(
      <CartSummary
        subtotal={9.5}
        rule="combo_20"
        discountAmount={1.9}
        total={7.6}
      />
    );

    expect(
      screen.getByText("Combo (Sandwich + Fries + Soft drink) (-20%)")
    ).toBeInTheDocument();
    expect(screen.getByText("-$1.90")).toBeInTheDocument();
    expect(screen.getByText("$7.60")).toBeInTheDocument();
  });
});
