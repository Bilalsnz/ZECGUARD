export type StorageLike = Pick<Storage, "getItem" | "setItem">;

export function readLocalState<T>(
  key: string,
  fallback: T,
  isValid: (value: unknown) => value is T,
  storage?: StorageLike,
): T {
  try {
    const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    if (!target) return fallback;
    const raw = target.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : fallback;
  } catch {
    // Storage can be unavailable in private browsing or when access is blocked.
    return fallback;
  }
}

export function writeLocalState<T>(key: string, value: T, storage?: StorageLike): boolean {
  try {
    const target = storage ?? (typeof window !== "undefined" ? window.localStorage : undefined);
    if (!target) return false;
    target.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Keep the app usable if storage is full or disabled.
    return false;
  }
}
