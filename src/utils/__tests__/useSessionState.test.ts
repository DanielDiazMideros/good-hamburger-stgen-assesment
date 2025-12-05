import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSessionState } from "../useSessionState";

describe("useSessionState", () => {
  const KEY = "test_key";

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("returns initialValue when sessionStorage is empty", () => {
    const { result } = renderHook(() => useSessionState(KEY, 123));

    const [value] = result.current;
    expect(value).toBe(123);
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it("returns stored value when sessionStorage has valid JSON", () => {
    sessionStorage.setItem(KEY, JSON.stringify(999));

    const { result } = renderHook(() => useSessionState(KEY, 123));
    const [value] = result.current;

    expect(value).toBe(999);
  });

  it("falls back to initialValue when sessionStorage has invalid JSON", () => {
    sessionStorage.setItem(KEY, "{not-json");

    const { result } = renderHook(() => useSessionState(KEY, 123));
    const [value] = result.current;

    expect(value).toBe(123);
  });

  it("setValue writes to sessionStorage and updates the hook value", async () => {
    const { result } = renderHook(() => useSessionState(KEY, 0));

    act(() => {
      const [, setValue] = result.current;
      setValue(10);
    });

    expect(sessionStorage.getItem(KEY)).toBe(JSON.stringify(10));

    await waitFor(() => {
      expect(result.current[0]).toBe(10);
    });
  });

  it("setValue supports functional updates", async () => {
    sessionStorage.setItem(KEY, JSON.stringify(5));

    const { result } = renderHook(() => useSessionState(KEY, 0));

    act(() => {
      const [, setValue] = result.current;
      setValue((prev) => prev + 2);
    });

    expect(sessionStorage.getItem(KEY)).toBe(JSON.stringify(7));

    await waitFor(() => {
      expect(result.current[0]).toBe(7);
    });
  });

  it("clear removes sessionStorage value and resets to initialValue", async () => {
    sessionStorage.setItem(KEY, JSON.stringify(42));

    const { result } = renderHook(() => useSessionState(KEY, 0));
    expect(result.current[0]).toBe(42);

    act(() => {
      const [, , clear] = result.current;
      clear();
    });

    expect(sessionStorage.getItem(KEY)).toBeNull();

    await waitFor(() => {
      expect(result.current[0]).toBe(0);
    });
  });

  it("reacts to external sessionStorage changes when 'session-storage' event is dispatched", async () => {
    const { result } = renderHook(() =>
      useSessionState<{ a: number }>(KEY, { a: 1 })
    );

    expect(result.current[0]).toEqual({ a: 1 });

    act(() => {
      sessionStorage.setItem(KEY, JSON.stringify({ a: 2 }));
      window.dispatchEvent(new Event("session-storage"));
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ a: 2 });
    });
  });
});
