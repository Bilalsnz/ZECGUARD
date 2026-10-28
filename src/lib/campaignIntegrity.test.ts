import { describe, expect, it } from "vitest";
import { canonicalCampaignRules, commitCampaignRules, normalizeCampaignRules, type CampaignRules } from "./campaignIntegrity";

const baseRules: CampaignRules = {
  name: "Community wallet grants",
  description: "Fund maintenance and accessibility work.",
  targetZec: 12,
  deadlineUtc: "2027-01-15T12:00:00Z",
  minimumContributionZec: 0.1,
  refundIfTargetNotMet: true,
};

describe("campaign rule commitments", () => {
  it("normalizes whitespace and date formats deterministically", () => {
    const variant = { ...baseRules, name: "  Community wallet grants  ", deadlineUtc: "2027-01-15T12:00:00.000Z" };
    expect(canonicalCampaignRules(variant)).toBe(canonicalCampaignRules(baseRules));
  });

  it("rejects empty names and invalid targets", () => {
    expect(() => normalizeCampaignRules({ ...baseRules, name: " " })).toThrow("Campaign name is required");
    expect(() => normalizeCampaignRules({ ...baseRules, targetZec: 0 })).toThrow("greater than zero");
    expect(() => normalizeCampaignRules({ ...baseRules, minimumContributionZec: 13 })).toThrow("cannot exceed");
  });

  it("produces a 64-character SHA-256 fingerprint", async () => {
    const fingerprint = await commitCampaignRules(baseRules);
    expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  it("changes the fingerprint when a committed rule changes", async () => {
    const original = await commitCampaignRules(baseRules);
    const changed = await commitCampaignRules({ ...baseRules, targetZec: 13 });
    expect(changed).not.toBe(original);
  });
});
