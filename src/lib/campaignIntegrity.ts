export type CampaignRules = {
  name: string;
  description: string;
  targetZec: number;
  deadlineUtc: string;
  minimumContributionZec: number;
  refundIfTargetNotMet: boolean;
};

export type NormalizedCampaignRules = {
  schema: "zecguard.campaign-rules.v1";
  name: string;
  description: string;
  targetZec: string;
  deadlineUtc: string;
  minimumContributionZec: string;
  refundIfTargetNotMet: boolean;
};

function decimal(value: number, field: string): string {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${field} must be a finite, non-negative number.`);
  }
  // A fixed precision avoids hashes changing because of insignificant float formatting.
  return value.toFixed(8).replace(/(?:\.0+|(?:(\.\d*?)0+))$/, "$1");
}

/**
 * Validate and serialize campaign rules into a stable, versioned representation.
 * This is a commitment to the supplied rule text, not proof that funds were received.
 */
export function normalizeCampaignRules(input: CampaignRules): NormalizedCampaignRules {
  const name = input.name.trim().normalize("NFC");
  const description = input.description.trim().normalize("NFC");
  if (!name) throw new Error("Campaign name is required.");
  if (!description) throw new Error("Campaign description is required.");
  if (!Number.isFinite(input.targetZec) || input.targetZec <= 0) {
    throw new Error("Funding target must be greater than zero.");
  }
  if (!Number.isFinite(input.minimumContributionZec) || input.minimumContributionZec < 0) {
    throw new Error("Minimum contribution must be a finite, non-negative number.");
  }
  if (input.minimumContributionZec > input.targetZec) {
    throw new Error("Minimum contribution cannot exceed the funding target.");
  }
  const date = new Date(input.deadlineUtc);
  if (!Number.isFinite(date.getTime())) throw new Error("Deadline must be a valid date.");
  return {
    schema: "zecguard.campaign-rules.v1",
    name,
    description,
    targetZec: decimal(input.targetZec, "Funding target"),
    deadlineUtc: date.toISOString(),
    minimumContributionZec: decimal(input.minimumContributionZec, "Minimum contribution"),
    refundIfTargetNotMet: Boolean(input.refundIfTargetNotMet),
  };
}

/** Stable JSON string: keys are emitted in an explicit, versioned order. */
export function canonicalCampaignRules(input: CampaignRules): string {
  const rules = normalizeCampaignRules(input);
  return JSON.stringify({
    schema: rules.schema,
    name: rules.name,
    description: rules.description,
    targetZec: rules.targetZec,
    deadlineUtc: rules.deadlineUtc,
    minimumContributionZec: rules.minimumContributionZec,
    refundIfTargetNotMet: rules.refundIfTargetNotMet,
  });
}

/**
 * SHA-256 fingerprint for detecting edits to campaign rules.
 * A fingerprint is not a smart contract, timestamp, signature, or proof of payment.
 */
export async function commitCampaignRules(input: CampaignRules): Promise<string> {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure SHA-256 is unavailable in this environment.");
  }
  const bytes = new TextEncoder().encode(canonicalCampaignRules(input));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
