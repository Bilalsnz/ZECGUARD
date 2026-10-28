export type ScanSeverity = "High" | "Medium" | "Low";
export type ScanResult = {
  ruleId: string;
  title: string;
  severity: ScanSeverity;
  evidence: string;
  remediation: string;
};

/**
 * Small heuristic scanner for source snippets pasted by the user.
 * It is not a full parser, security audit, or proof that unflagged code is safe.
 */
export function scanPrivacySnippet(source: string): ScanResult[] {
  const results: ScanResult[] = [];
  const rules: Array<{
    id: string;
    title: string;
    severity: ScanSeverity;
    pattern: RegExp;
    evidence: string;
    remediation: string;
  }> = [
    {
      id: "ZG-LOG-001",
      title: "Potential sensitive data in console logs",
      severity: "Medium",
      pattern: /console\.(?:log|debug|info|table)\s*\([^\n]*(?:amount|balance|address|txid|transaction|viewing.?key|seed|memo)/i,
      evidence: "A console logging call appears to reference financial or transaction-related data.",
      remediation: "Remove sensitive values from logs. Review browser telemetry and production logging before release.",
    },
    {
      id: "ZG-ADDR-001",
      title: "Transparent-address terminology detected",
      severity: "Medium",
      pattern: /\b(?:t1|t3)[a-km-zA-HJ-NP-Z1-9]{20,}\b|transparentAddress|transparent_address/i,
      evidence: "The snippet contains a transparent-address pattern or identifier.",
      remediation: "Confirm whether public address visibility is intentional and explain the resulting privacy trade-offs to users.",
    },
    {
      id: "ZG-CLAIM-001",
      title: "Absolute privacy claim detected",
      severity: "Low",
      pattern: /(?:100%|fully|completely|totally)\s+(?:private|anonymous|untraceable)/i,
      evidence: "The snippet contains an absolute privacy or anonymity claim.",
      remediation: "Replace absolute claims with a precise threat model covering transaction data, wallet behavior, metadata, logs, and network exposure.",
    },
    {
      id: "ZG-SECRET-001",
      title: "Possible secret or viewing-key handling",
      severity: "High",
      pattern: /(?:localStorage|sessionStorage)\s*\.\s*setItem\s*\([^\n]*(?:private.?key|seed.?phrase|mnemonic|viewing.?key)/i,
      evidence: "The snippet may store a private key, seed phrase, mnemonic, or viewing key in browser storage.",
      remediation: "Do not store seed phrases or private keys in web storage. Rework key management around a trusted wallet boundary.",
    },
    {
      id: "ZG-TELEMETRY-001",
      title: "Outbound telemetry call detected",
      severity: "Low",
      pattern: /(?:navigator\.sendBeacon|fetch|XMLHttpRequest)\s*\([^\n]*(?:txid|transaction|address|balance|amount|memo)/i,
      evidence: "An outbound request appears near transaction-related fields. This heuristic can produce false positives.",
      remediation: "Inspect the full request payload and destination. Minimize telemetry and never send sensitive transaction data without a clear need and consent.",
    },
  ];

  for (const rule of rules) {
    const match = source.match(rule.pattern);
    if (match) {
      results.push({
        ruleId: rule.id,
        title: rule.title,
        severity: rule.severity,
        evidence: rule.evidence,
        remediation: rule.remediation,
      });
    }
  }
  return results;
}
