import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/utils/testing/render";
import { MenuFilters, type Filter } from "../MenuFilters";

describe("<MenuFilters />", () => {
  it("renders the three filter buttons", () => {
    renderWithProviders(<MenuFilters value="all" onChange={() => {}} />);

    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sandwiches" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Extras" })).toBeInTheDocument();
  });

  it("calls onChange with the selected filter when clicking", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(v: Filter) => void>();

    renderWithProviders(<MenuFilters value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Sandwiches" }));
    expect(onChange).toHaveBeenCalledWith("sandwich");

    await user.click(screen.getByRole("button", { name: "Extras" }));
    expect(onChange).toHaveBeenCalledWith("extra");

    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("does not call onChange when clicking the already selected option (MUI sends null)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn<(v: Filter) => void>();
    renderWithProviders(<MenuFilters value="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "All" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows correct pressed state for the selected value", () => {
    renderWithProviders(<MenuFilters value="extra" onChange={() => {}} />);

    const all = screen.getByRole("button", { name: "All" });
    const sandwiches = screen.getByRole("button", { name: "Sandwiches" });
    const extras = screen.getByRole("button", { name: "Extras" });

    expect(all).toHaveAttribute("aria-pressed", "false");
    expect(sandwiches).toHaveAttribute("aria-pressed", "false");
    expect(extras).toHaveAttribute("aria-pressed", "true");
  });
});
