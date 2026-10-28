import { describe, expect, it, vi } from "vitest";
import { fetchZcashSnapshot } from "./zcashSnapshot";

const now = Date.parse("2026-10-28T13:00:00.000Z");
const payload = {
  generatedAt: "2026-10-28T12:59:00.000Z",
  network: { height: 3_500_000 },
  pools: { shieldedTotal: 4_000_000, shieldedPct: 28.4 },
  price: { usd: 42 },
  sources: {
    network: { source: "node-feed", ok: true, stale: false },
    pools: { source: "indexer-feed", ok: true, stale: false },
  },
  warnings: [],
};
const ok = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200 });

describe("Zcash public aggregate snapshot", () => {
  it("accepts recent metrics with fresh provenance", async () => {
    const result = await fetchZcashSnapshot(vi.fn().mockResolvedValue(ok(payload)), now);
    expect(result.state).toBe("LIVE");
    expect(result.blockHeight).toBe(3_500_000);
    expect(result.shieldedTotalZec).toBe(4_000_000);
    expect(result.shieldedPercent).toBe(28.4);
  });

  it("marks an old snapshot stale", async () => {
    const result = await fetchZcashSnapshot(vi.fn().mockResolvedValue(ok({
      ...payload,
      generatedAt: "2026-10-28T12:40:00.000Z",
    })), now);
    expect(result.state).toBe("STALE");
  });

  it("marks source-level stale data stale even if generated recently", async () => {
    const result = await fetchZcashSnapshot(vi.fn().mockResolvedValue(ok({
      ...payload,
      sources: { ...payload.sources, pools: { source: "cache", ok: true, stale: true } },
    })), now);
    expect(result.state).toBe("STALE");
  });

  it("fails closed for missing or invalid metrics", async () => {
    const missing = await fetchZcashSnapshot(vi.fn().mockResolvedValue(ok({})), now);
    const invalid = await fetchZcashSnapshot(vi.fn().mockResolvedValue(ok({
      ...payload, network: { height: -1 },
    })), now);
    expect(missing.state).toBe("UNAVAILABLE");
    expect(invalid.state).toBe("UNAVAILABLE");
  });

  it("handles HTTP and network failures", async () => {
    const http = await fetchZcashSnapshot(vi.fn().mockResolvedValue(new Response("", { status: 503 })), now);
    const offline = await fetchZcashSnapshot(vi.fn().mockRejectedValue(new Error("offline")), now);
    expect(http.state).toBe("UNAVAILABLE");
    expect(offline.state).toBe("UNAVAILABLE");
  });
});
