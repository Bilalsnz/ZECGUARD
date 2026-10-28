export type SnapshotState = "LIVE" | "STALE" | "UNAVAILABLE";

export type ZcashSnapshot = {
  state: SnapshotState;
  generatedAt?: string;
  checkedAt: string;
  blockHeight?: number;
  shieldedTotalZec?: number;
  shieldedPercent?: number;
  priceUsd?: number;
  networkSource?: string;
  poolsSource?: string;
  warnings: string[];
  message: string;
};

type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

const SUMMARY_URL = "https://zecstats.org/api/zec/summary";
const MAX_AGE_MS = 3 * 60 * 1000;

function unavailable(message: string, now: number): ZcashSnapshot {
  return { state: "UNAVAILABLE", checkedAt: new Date(now).toISOString(), warnings: [], message };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reads public aggregate Zcash network metrics from the CORS-enabled ZecStats API.
 * This is a third-party, read-only data feed, not a wallet connection or a consensus proof.
 * Attribution is required under CC BY 4.0: https://zecstats.org.
 */
export async function fetchZcashSnapshot(
  fetcher: FetchLike = fetch,
  now = Date.now(),
): Promise<ZcashSnapshot> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetcher(SUMMARY_URL, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return unavailable(`ZecStats returned HTTP ${response.status}. Live metrics are unavailable.`, now);
    const payload: unknown = await response.json();
    if (!isObject(payload) || !isObject(payload.network) || !isObject(payload.pools) || !isObject(payload.sources)) {
      return unavailable("The public data feed returned an unexpected schema.", now);
    }

    const generatedAt = payload.generatedAt;
    const height = payload.network.height;
    const shieldedTotal = payload.pools.shieldedTotal;
    const shieldedPercent = payload.pools.shieldedPct;
    const price = isObject(payload.price) ? payload.price.usd : undefined;
    const networkProvenance = isObject(payload.sources.network) ? payload.sources.network : undefined;
    const poolsProvenance = isObject(payload.sources.pools) ? payload.sources.pools : undefined;
    const generatedTime = typeof generatedAt === "string" ? Date.parse(generatedAt) : Number.NaN;

    if (!Number.isFinite(generatedTime) ||
        typeof height !== "number" || !Number.isSafeInteger(height) || height < 0 ||
        typeof shieldedTotal !== "number" || !Number.isFinite(shieldedTotal) || shieldedTotal < 0 ||
        typeof shieldedPercent !== "number" || !Number.isFinite(shieldedPercent) || shieldedPercent < 0 || shieldedPercent > 100) {
      return unavailable("The public data feed did not contain valid network and shielded-pool metrics.", now);
    }

    const networkOk = networkProvenance?.ok === true && networkProvenance?.stale === false;
    const poolsOk = poolsProvenance?.ok === true && poolsProvenance?.stale === false;
    const ageMs = now - generatedTime;
    const recent = ageMs >= -30_000 && ageMs <= MAX_AGE_MS;
    const live = recent && networkOk && poolsOk;
    const warnings = Array.isArray(payload.warnings)
      ? payload.warnings.filter((item): item is string => typeof item === "string").slice(0, 5)
      : [];

    return {
      state: live ? "LIVE" : "STALE",
      generatedAt: new Date(generatedTime).toISOString(),
      checkedAt: new Date(now).toISOString(),
      blockHeight: height,
      shieldedTotalZec: shieldedTotal,
      shieldedPercent,
      ...(typeof price === "number" && Number.isFinite(price) && price >= 0 ? { priceUsd: price } : {}),
      ...(typeof networkProvenance?.source === "string" ? { networkSource: networkProvenance.source } : {}),
      ...(typeof poolsProvenance?.source === "string" ? { poolsSource: poolsProvenance.source } : {}),
      warnings,
      message: live
        ? "Recent third-party aggregate metrics. These do not verify any individual wallet or payment."
        : "The feed or one of its upstream sources is stale. Treat these metrics as historical context, not current chain state.",
    };
  } catch (error) {
    const message = error instanceof Error && error.name === "AbortError"
      ? "ZecStats request timed out."
      : "ZecStats could not be reached. No live metrics are being shown.";
    return unavailable(message, now);
  } finally {
    clearTimeout(timeout);
  }
}
