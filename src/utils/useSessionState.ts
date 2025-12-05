import { useCallback, useMemo, useSyncExternalStore } from "react";

function safeParseJSON<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}

export function useSessionState<T>(key: string, initialValue: T) {
  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(key);
  }, [key]);

  const subscribe = useCallback((onStoreChange: () => void) => {
    const handler = () => onStoreChange();
    window.addEventListener("storage", handler);
    window.addEventListener("session-storage", handler as EventListener);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("session-storage", handler as EventListener);
    };
  }, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const value = useMemo(() => {
    const parsed = safeParseJSON<T>(raw);
    return parsed ?? initialValue;
  }, [raw, initialValue]);

  const setValue = useCallback(
    (next: React.SetStateAction<T>) => {
      const current =
        safeParseJSON<T>(sessionStorage.getItem(key)) ?? initialValue;
      const resolved =
        typeof next === "function" ? (next as (p: T) => T)(current) : next;

      const str = safeStringify(resolved);
      if (str === null) return;

      try {
        const prevRaw = sessionStorage.getItem(key);
        if (prevRaw === str) return;

        sessionStorage.setItem(key, str);
        window.dispatchEvent(new Event("session-storage"));
      } catch {}
    },
    [key, initialValue]
  );

  const clear = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      window.dispatchEvent(new Event("session-storage"));
    } catch {}
  }, [key]);

  return [value, setValue, clear] as const;
}
