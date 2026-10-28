# ZECGUARD — Competition Submission Kit

**Time-sensitive:** the official ZECATHON page lists submissions due **October 28, 2026 at 23:59 UTC**. The portal requires sign-in to view the exact track rules and submit. Confirm the current countdown and all required fields in the official portal before finalizing.

## One-line pitch

ZECGUARD is a privacy-operations workspace for Zcash builders that combines attributed network privacy metrics, tamper-evident local fundraising rules, treasury reconciliation, and a browser-local privacy-pattern scanner.

## Short description (about 75 words)

Zcash privacy is more than hiding transaction details. Teams also need to understand network-level shielded-pool trends, avoid leaking sensitive metadata in application code, keep fundraising rules from silently changing, and reconcile operational records without confusing them with on-chain proof. ZECGUARD brings those workflows into one privacy-aware workspace. It reads public aggregate Zcash metrics with source freshness checks, fingerprints normalized campaign rules locally, validates treasury calculations, and scans pasted snippets in the browser. It does not request wallet secrets or claim unimplemented verification.

## Problem

Teams building around privacy-preserving money can accidentally undermine privacy through application logs, transparent-address assumptions, telemetry, unclear fundraising rules, or overconfident product claims. Meanwhile, operational spreadsheets often mix user-entered notes with verified chain data. Builders need tools that make the boundary between observed public data, local records, and cryptographic proof explicit.

## Solution

ZECGUARD is a mobile-friendly operational workspace with four connected capabilities:

1. **Network & shielded-pool intelligence.** Reads public aggregate Zcash metrics from the ZecStats API, validates the response schema, checks snapshot age and source-level freshness, and labels stale or unavailable data rather than inventing values. Source attribution is displayed in the interface.
2. **PrivateRaise rule integrity.** Normalizes a campaign draft and creates a SHA-256 fingerprint so a changed rule set produces a different local fingerprint. This is a tamper-evidence primitive for local drafts, not an on-chain commitment or proof of received funds.
3. **Treasury reconciliation.** Sums user-entered inflows and outflows with eight-decimal precision and flags invalid records. The ledger is operational bookkeeping, not verified wallet accounting.
4. **PrivacyGuard.** Runs heuristic checks on source snippets directly in the browser, looking for patterns such as sensitive logging, risky key storage, transparent-address assumptions, telemetry, and absolute privacy claims. Snippets are not uploaded by this scanner.

## What is genuinely implemented

- React, TypeScript, Vite responsive dashboard.
- Public, read-only aggregate Zcash metrics through the documented ZecStats API, with schema and freshness checks.
- Explicit LIVE, STALE, and UNAVAILABLE states.
- Browser-local campaign, ledger, and finding-status persistence.
- Downloadable JSON workspace backup.
- Deterministic local SHA-256 campaign-rule fingerprints.
- Treasury reconciliation helpers and unit tests.
- Local snippet scanner and unit tests.
- GitHub Actions workflow that runs tests and a production build.

## Security and honesty boundaries

- No seed phrase, private key, or viewing key is requested.
- No wallet is connected.
- No transaction is signed, broadcast, or verified by this prototype.
- Aggregate pool statistics are not individual balances and cannot identify who owns shielded funds.
- The browser contacts ZecStats for public metrics; that third party may observe ordinary connection metadata such as the visitor’s IP address. The request does not include wallet addresses or keys.
- A local SHA-256 fingerprint is not a signature, timestamp, chain commitment, or proof of payment.
- The snippet scanner is heuristic, not a formal audit or full repository scanner.
- Browser local storage is not encrypted cloud storage.
- Third-party aggregate metrics can be stale or wrong; provenance and limitations are shown.

## Demo flow (90 seconds)

1. Open Overview and point out the network metrics, data freshness status, and visible ZecStats attribution.
2. Explain that the shielded-pool figure is aggregate network context, not an individual wallet balance.
3. Open PrivateRaise, create a draft with a purpose, target, and deadline, then show its local fingerprint. Explain that changing draft rules changes the fingerprint but does not publish it to the blockchain.
4. Open Treasury and explain how inflows/outflows are reconciled and why user-entered entries are not represented as verified chain transactions.
5. Open PrivacyGuard, scan the prefilled snippet, inspect a finding and its suggested mitigation, and state that processing is local and heuristic.
6. Use Backup to download the local workspace JSON.
7. End with the explicit roadmap: wallet SDK/testnet transactions and independently verifiable on-chain commitments are future work, not claims made by this build.

## Suggested spoken pitch (about 45 seconds)

“Zcash protects transaction details, but privacy can still fail in the applications and workflows built around it. ZECGUARD helps teams see those risks earlier. It brings together public shielded-pool context with source freshness, a local scanner for risky code patterns, deterministic fingerprints for fundraising rules, and treasury reconciliation that never pretends a spreadsheet is blockchain proof. The important design choice is honesty: stale data is marked stale, local commitments are labelled local, and the app never asks for wallet secrets. This is an early-stage privacy-operations tool, and the next milestone is supported wallet and testnet integration.”

## Known gaps judges should hear honestly

- The network data is sourced from a third-party public API; it is not an independently verified node connection.
- The application currently has no Zcash wallet SDK, no transaction signing/broadcast, and no on-chain campaign contract.
- The product is a prototype, not audited production financial software.
- Browser storage and the downloaded backup are not encrypted by this app.
- The privacy scanner can produce false positives and false negatives.

## Submission checklist

- [ ] Sign in to the official ZECATHON portal and confirm the actual track, rules, and submission fields.
- [ ] Paste the short description and problem/solution sections into the form.
- [ ] Link the public repository and deployed demo.
- [ ] Record a short demo following the flow above; show the actual live/stale/unavailable state, not fabricated values.
- [ ] Include screenshots or a demo video link if requested by the form.
- [ ] Confirm the submission is saved before the published deadline.
- [ ] Keep a copy of the final text and submitted links.

Project repository: https://github.com/Bilalsnz/ZECGUARD  
Configured demo URL: https://zecguard.vercel.app  
Official event information and submission portal: https://thezecathon.com/
