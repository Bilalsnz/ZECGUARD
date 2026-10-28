import { describe, expect, it } from "vitest";
import { summarizeLedger, type LedgerRecord } from "./treasury";

const records: LedgerRecord[] = [
  { id: 1, label: "Grant", type: "Inflow", amount: 8.5, date: "2026-10-26" },
  { id: 2, label: "Contributor payment", type: "Outflow", amount: 1.2, date: "2026-10-25" },
  { id: 3, label: "Hosting", type: "Outflow", amount: 0.65, date: "2026-10-23" },
];

describe("summarizeLedger", () => {
  it("calculates inflows, outflows, and balance from records", () => {
    expect(summarizeLedger(records)).toEqual({
      inflows: 8.5,
      outflows: 1.85,
      balance: 6.65,
      recordCount: 3,
      invalidRecordIds: [],
    });
  });

  it("rounds binary floating point artifacts", () => {
    const summary = summarizeLedger([
      { id: "a", label: "A", type: "Inflow", amount: 0.1, date: "" },
      { id: "b", label: "B", type: "Inflow", amount: 0.2, date: "" },
    ]);
    expect(summary.inflows).toBe(0.3);
    expect(summary.balance).toBe(0.3);
  });

  it("excludes negative and non-finite values from totals and reports them", () => {
    const summary = summarizeLedger([
      { id: "bad-negative", label: "Bad", type: "Inflow", amount: -2, date: "" },
      { id: "bad-nan", label: "Bad", type: "Outflow", amount: Number.NaN, date: "" },
      { id: "good", label: "Good", type: "Inflow", amount: 1, date: "" },
    ]);
    expect(summary.inflows).toBe(1);
    expect(summary.outflows).toBe(0);
    expect(summary.invalidRecordIds).toEqual(["bad-negative", "bad-nan"]);
    expect(summary.recordCount).toBe(3);
  });
});
