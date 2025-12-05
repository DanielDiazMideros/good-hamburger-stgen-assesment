import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/utils/testing/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerForm } from "../CustomerForm";

describe("<CustomerForm />", () => {
  it("renders the input with label", () => {
    renderWithProviders(<CustomerForm value="" onChange={() => {}} />);
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
  });

  it("shows the controlled value", () => {
    renderWithProviders(<CustomerForm value="Daniel" onChange={() => {}} />);
    const input = screen.getByLabelText(/customer name/i) as HTMLInputElement;
    expect(input.value).toBe("Daniel");
  });

  it("calls onChange with empty string when cleared", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithProviders(<CustomerForm value="John" onChange={onChange} />);

    const input = screen.getByLabelText(/customer name/i);
    await user.clear(input);

    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenLastCalledWith("");
  });
});
