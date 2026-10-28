import { describe, expect, it } from "vitest";
import { readLocalState, writeLocalState, type StorageLike } from "./storage";

function memoryStorage(seed: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(seed));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => { values.set(key, value); },
  };
}

describe("local state persistence", () => {
  it("writes and restores validated state", () => {
    const storage = memoryStorage();
    const value = { label: "local draft", target: 4 };
    expect(writeLocalState("draft", value, storage)).toBe(true);
    expect(readLocalState("draft", { label: "fallback", target: 0 }, (x): x is typeof value =>
      typeof x === "object" && x !== null && "label" in x && typeof x.label === "string" &&
      "target" in x && typeof x.target === "number", storage)).toEqual(value);
  });

  it("falls back for malformed JSON or invalid shapes", () => {
    const storage = memoryStorage({ broken: "{", wrong: JSON.stringify({ nope: true }) });
    const fallback = ["safe"];
    const isStringList = (x: unknown): x is string[] => Array.isArray(x) && x.every((v) => typeof v === "string");
    expect(readLocalState("broken", fallback, isStringList, storage)).toBe(fallback);
    expect(readLocalState("wrong", fallback, isStringList, storage)).toBe(fallback);
  });

  it("does not throw when storage fails", () => {
    const unavailable: StorageLike = {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("quota"); },
    };
    expect(readLocalState("x", 7, (x): x is number => typeof x === "number", unavailable)).toBe(7);
    expect(writeLocalState("x", 8, unavailable)).toBe(false);
  });
});
