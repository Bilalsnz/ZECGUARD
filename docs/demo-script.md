# ZECGUARD Demo Script

Target duration: 90 seconds. Keep the browser zoom at 100% and use a stable network connection.

## Before recording
- Open the deployed ZECGUARD demo and reload once.
- Wait for the network metrics to settle into LIVE, STALE, or UNAVAILABLE.
- Do not hide a stale/unavailable status. Explain it accurately.
- Ensure no personal browser tabs, passwords, wallet keys, or private data are visible.

## Narration and actions

**0:00–0:10 | The problem**
“Privacy can be lost outside the transaction itself: through application logs, unsafe assumptions, unclear fundraising rules, or bookkeeping that gets mistaken for on-chain proof.”

**0:10–0:25 | Network intelligence**
Show the Overview metrics and visible source link.
“ZECGUARD reads public aggregate Zcash network and shielded-pool metrics. It checks freshness and source status. These are network-level statistics, not an individual's balance. If the feed is stale or unavailable, the interface says so.”

**0:25–0:40 | PrivateRaise**
Open PrivateRaise and create a small campaign draft.
“Campaign rules are normalized and fingerprinted with SHA-256. If a rule changes, the fingerprint changes. Today that commitment is local only, not a blockchain transaction or proof of funds.”

**0:40–0:52 | Treasury**
Open Treasury and show the ledger totals.
“The treasury reconciles entered inflows and outflows, catches invalid amounts, and preserves the boundary between local notes and verified chain data.”

**0:52–1:10 | PrivacyGuard**
Paste or use the example snippet, run the scan, open one finding.
“The scanner checks pasted code locally for risky privacy patterns and suggests mitigations. It is a heuristic review, not a formal audit, and the snippet is not uploaded by the scanner.”

**1:10–1:20 | Persistence and backup**
Show the Backup button and mention local persistence.
“Workspace drafts persist in this browser, and I can export a JSON backup. Local browser storage is not encrypted cloud storage.”

**1:20–1:30 | Close**
“ZECGUARD makes privacy assumptions and evidence boundaries visible in one place. The next milestone is supported wallet/testnet integration and independently verifiable on-chain campaign commitments. Those features are not claimed as implemented yet.”

## Recording fallback
If the public API is unavailable during recording, capture the UNAVAILABLE state and explain the failure behavior. Do not replace it with invented network values.
