import { describe, expect, it } from "vitest";
import { formatMoney } from "../format";

describe("formatMoney", () => {
  it("formats integer with 2 decimals and comma", () => {
    expect(formatMoney(5)).toBe("$ 5,00");
  });

  it("formats decimals with 2 digits", () => {
    expect(formatMoney(2.5)).toBe("$ 2,50");
  });

  it("rounds correctly to 2 decimals", () => {
    expect(formatMoney(1.005)).toBe("$ 1,00");
    expect(formatMoney(1.999)).toBe("$ 2,00");
  });

  it("handles zero", () => {
    expect(formatMoney(0)).toBe("$ 0,00");
  });

  it("handles negative values", () => {
    expect(formatMoney(-7.6)).toBe("$ -7,60");
  });

  it("handles large values", () => {
    expect(formatMoney(123456.789)).toBe("$ 123456,79");
  });
});
