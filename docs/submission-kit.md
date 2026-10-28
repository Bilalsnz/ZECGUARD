# ZECGUARD — Competition Submission Kit

**Time-sensitive:** the official ZECATHON page lists submissions due **October 28, 2026 at 23:59 UTC**. The portal requires sign-in to view the exact track rules and submit. Confirm the current countdown and all required fields in the official portal before finalizing.

## One-line pitch

ZECGUARD is a privacy-review tool for Zcash builders. PrivacyGuard scans pasted source snippets locally for risky patterns such as sensitive logs, unsafe key storage, telemetry, and overconfident privacy claims, then provides rule-level findings and remediation guidance.

## Short description (about 75 words)

Zcash privacy can be undermined by application code that logs financial metadata, stores secrets unsafely, sends transaction details to analytics, or promises more privacy than it can prove. ZECGUARD addresses this developer-facing risk with PrivacyGuard, a browser-local snippet scanner that flags common patterns, explains the evidence, and suggests mitigations. The supporting workspace keeps public network context separate from local campaign drafts and bookkeeping. It never requests wallet secrets and does not claim that heuristic checks are a formal audit.

## Problem

Teams building around privacy-preserving money can accidentally undermine privacy through application logs, transparent-address assumptions, telemetry, unclear fundraising rules, or overconfident product claims. Meanwhile, operational spreadsheets often mix user-entered notes with verified chain data. Builders need tools that make the boundary between observed public data, local records, and cryptographic proof explicit.

## Solution

ZECGUARD is a mobile-friendly privacy-review tool with one primary workflow and supporting prototypes:

1. **PrivacyGuard (core).** Runs heuristic checks on pasted source snippets in the browser, identifying patterns such as sensitive logging, risky key storage, transparent-address assumptions, telemetry, and absolute privacy claims. Each finding includes a rule ID and remediation guidance. The scanner does not upload the snippet.
2. **Network intelligence (supporting).** Reads public aggregate Zcash metrics from ZecStats with source freshness checks and clear stale/unavailable states.
3. **PrivateRaise (supporting prototype).** Fingerprints local campaign rules with SHA-256. This is not an on-chain commitment or proof of funds.
4. **Treasury (supporting prototype).** Reconciles user-entered inflows and outflows. It is not verified wallet accounting.

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

## Demo flow (60 seconds, PrivacyGuard-first)

1. Open the default PrivacyGuard screen and show the prefilled sample snippet.
2. Click **Run sample scan** and point out the rule IDs, severity, evidence summary, and suggested mitigation.
3. Explain that scanning runs in the browser and the snippet is not uploaded by this scanner.
4. Replace the sample with a harmless example that stores a viewing-key-named value in browser storage, run the scan, and show the high-severity warning.
5. State the boundary clearly: this is a heuristic snippet scanner, not a full repository scanner or formal security audit.
6. If time remains, briefly show the Overview network metrics and explain that campaign and treasury values are local demo data, not chain-verified.

## Suggested spoken pitch (about 45 seconds)

“Zcash privacy can be undermined by the application code around it. A log line can expose an amount, unsafe storage can put key material at risk, and absolute privacy claims can mislead users. ZECGUARD’s core feature, PrivacyGuard, checks a pasted snippet locally, shows the rule that matched, and suggests a safer next step. It does not upload the snippet, scan a whole repository, or replace a security audit. The goal is to help builders catch common privacy footguns before shipping, while being clear about what the tool can and cannot prove.”

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
