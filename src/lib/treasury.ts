export type LedgerRecord = {
  id: string | number;
  label: string;
  type: "Inflow" | "Outflow";
  amount: number;
  date: string;
  note?: string;
};

export type TreasurySummary = {
  inflows: number;
  outflows: number;
  balance: number;
  recordCount: number;
  invalidRecordIds: Array<string | number>;
};

export function summarizeLedger(records: LedgerRecord[]): TreasurySummary {
  let inflows = 0;
  let outflows = 0;
  const invalidRecordIds: Array<string | number> = [];

  for (const record of records) {
    if (!Number.isFinite(record.amount) || record.amount < 0) {
      invalidRecordIds.push(record.id);
      continue;
    }
    if (record.type === "Inflow") inflows += record.amount;
    else if (record.type === "Outflow") outflows += record.amount;
    else invalidRecordIds.push(record.id);
  }

  // Round display totals to 8 decimal places to avoid common binary float artifacts.
  const round = (amount: number) => Math.round((amount + Number.EPSILON) * 1e8) / 1e8;
  inflows = round(inflows);
  outflows = round(outflows);
  return {
    inflows,
    outflows,
    balance: round(inflows - outflows),
    recordCount: records.length,
    invalidRecordIds,
  };
}
