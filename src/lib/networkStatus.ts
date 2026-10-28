export type NetworkState = "LIVE" | "STALE" | "UNAVAILABLE";
export type NetworkStatus = {
  state: NetworkState;
  chainName?: "main" | "test";
  blockHeight?: number;
  observedAt?: string;
  checkedAt: string;
  endpoint?: string;
  message: string;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function unavailable(message: string, now: number, endpoint?: string): NetworkStatus {
  return { state: "UNAVAILABLE", checkedAt: new Date(now).toISOString(), endpoint, message };
}

/**
 * Reads a configured status-proxy response. This is not a native lightwalletd
 * client and does not independently verify consensus or shielded balances.
 * Expected JSON: { "chainName": "main"|"test", "blockHeight": integer,
 * "observedAt": ISO-8601 timestamp }.
 */
export async function fetchNetworkStatus(
  endpoint: string | undefined,
  fetcher: FetchLike = fetch,
  now = Date.now(),
): Promise<NetworkStatus> {
  if (!endpoint?.trim()) {
    return unavailable("No status endpoint configured. No live chain data is being shown.", now);
  }

  let url: URL;
  try {
    url = new URL(endpoint);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return unavailable("Status endpoint must use HTTP or HTTPS.", now, endpoint);
    }
  } catch {
    return unavailable("Status endpoint URL is invalid.", now, endpoint);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetcher(url, { method: "GET", cache: "no-store", signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) return unavailable(`Status endpoint returned HTTP ${response.status}.`, now, endpoint);
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object") {
      return unavailable("Status endpoint returned an invalid response.", now, endpoint);
    }
    const value = payload as Record<string, unknown>;
    const chainName = value.chainName;
    const blockHeight = value.blockHeight;
    const observedAt = value.observedAt;
    const observedTime = typeof observedAt === "string" ? Date.parse(observedAt) : Number.NaN;
    if ((chainName !== "main" && chainName !== "test") ||
        typeof blockHeight !== "number" || !Number.isSafeInteger(blockHeight) || blockHeight < 0 ||
        !Number.isFinite(observedTime)) {
      return unavailable("Status response did not match the documented schema.", now, endpoint);
    }

    const ageMs = now - observedTime;
    const fresh = ageMs >= -30_000 && ageMs <= 120_000;
    return {
      state: fresh ? "LIVE" : "STALE",
      chainName,
      blockHeight,
      observedAt: new Date(observedTime).toISOString(),
      checkedAt: new Date(now).toISOString(),
      endpoint,
      message: fresh
        ? "Fresh endpoint-reported network status. This does not verify wallet balances or shielded funds."
        : "Status response is stale or has a future timestamp. Do not rely on it as current chain state.",
    };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "Status request timed out."
      : "Status endpoint could not be reached.";
    return unavailable(message, now, endpoint);
  } finally {
    clearTimeout(timeout);
  }
}
