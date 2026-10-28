import { describe, expect, it, vi } from "vitest";
import { fetchNetworkStatus } from "./networkStatus";

const now = Date.parse("2026-10-28T12:00:00.000Z");
const ok = (body: unknown): Response => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } });
const fresh = { chainName: "main", blockHeight: 3_000_000, observedAt: "2026-10-28T11:59:30.000Z" };

describe("configured Zcash status endpoint adapter", () => {
  it("does not pretend to have live data when no endpoint is configured", async () => {
    const status = await fetchNetworkStatus(undefined, vi.fn(), now);
    expect(status.state).toBe("UNAVAILABLE");
    expect(status.message).toContain("No live chain data");
  });

  it("accepts fresh, schema-valid endpoint-reported status", async () => {
    const status = await fetchNetworkStatus("https://status.example.test/zcash", vi.fn().mockResolvedValue(ok(fresh)), now);
    expect(status.state).toBe("LIVE");
    expect(status.chainName).toBe("main");
    expect(status.blockHeight).toBe(3_000_000);
  });

  it("marks old responses stale", async () => {
    const status = await fetchNetworkStatus("https://status.example.test/zcash", vi.fn().mockResolvedValue(ok({ ...fresh, observedAt: "2026-10-28T11:50:00.000Z" })), now);
    expect(status.state).toBe("STALE");
  });

  it("rejects invalid schemas and non-http URLs", async () => {
    const badBody = await fetchNetworkStatus("https://status.example.test/zcash", vi.fn().mockResolvedValue(ok({ ...fresh, blockHeight: "unknown" })), now);
    const badUrl = await fetchNetworkStatus("file:///etc/passwd", vi.fn(), now);
    expect(badBody.state).toBe("UNAVAILABLE");
    expect(badUrl.state).toBe("UNAVAILABLE");
  });

  it("reports HTTP and network errors as unavailable", async () => {
    const http = await fetchNetworkStatus("https://status.example.test/zcash", vi.fn().mockResolvedValue(new Response("", { status: 503 })), now);
    const network = await fetchNetworkStatus("https://status.example.test/zcash", vi.fn().mockRejectedValue(new Error("offline")), now);
    expect(http.state).toBe("UNAVAILABLE");
    expect(network.state).toBe("UNAVAILABLE");
  });
});
