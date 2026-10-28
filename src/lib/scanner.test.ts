import { describe, expect, it } from "vitest";
import { scanPrivacySnippet } from "./scanner";

describe("scanPrivacySnippet", () => {
  it("returns no findings for an empty or unrelated snippet", () => {
    expect(scanPrivacySnippet("")).toEqual([]);
    expect(scanPrivacySnippet("const greeting = 'hello';")).toEqual([]);
  });

  it("flags possible secrets stored in browser storage as high severity", () => {
    const results = scanPrivacySnippet(
      'localStorage.setItem("privateKey", privateKey);',
    );
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      ruleId: "ZG-SECRET-001",
      severity: "High",
    });
    expect(results[0].remediation).toContain("Do not store");
  });

  it("flags absolute privacy claims without treating them as proof of a vulnerability", () => {
    const results = scanPrivacySnippet('const headline = "100% private and anonymous";');
    expect(results.map((result) => result.ruleId)).toContain("ZG-CLAIM-001");
    expect(results[0].severity).toBe("Low");
  });

  it("flags transaction-related values in console logging", () => {
    const results = scanPrivacySnippet("console.log('balance', accountBalance);");
    expect(results.map((result) => result.ruleId)).toContain("ZG-LOG-001");
  });

  it("can return multiple independent findings for one snippet", () => {
    const results = scanPrivacySnippet(
      'console.log("transaction", txid);\nconst claim = "fully private";',
    );
    expect(results.map((result) => result.ruleId)).toEqual(
      expect.arrayContaining(["ZG-LOG-001", "ZG-CLAIM-001"]),
    );
  });
});
