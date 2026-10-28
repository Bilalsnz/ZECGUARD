# ZECGUARD

**Find privacy leaks before they ship.**

ZECGUARD is a privacy-review tool for Zcash builders. Its primary workflow scans pasted source snippets locally for risky patterns and explains what to review next. Public network context, campaign-rule fingerprints, and a local treasury ledger are supporting tools, clearly separated from verified chain data.

**Live demo:** https://zecguard.vercel.app

ZECGUARD is an early-stage, open-source privacy-review workspace for people building applications around Zcash. The core workflow is PrivacyGuard: paste a small source snippet, run local heuristic rules, inspect findings, and review suggested mitigations. Supporting modules provide public network context and local operational prototypes.

## What it does

- **PrivacyGuard (core workflow)** — runs heuristic checks on pasted source snippets inside the browser for sensitive logging, risky browser key storage, transparent-address assumptions, telemetry, and absolute privacy claims. It displays rule IDs, evidence summaries, and remediation suggestions.
- **Network Intelligence (supporting)** — reads public aggregate Zcash metrics from the ZecStats API, validates response fields and source freshness, and labels data as LIVE, STALE, or UNAVAILABLE.
- **PrivateRaise (prototype)** — creates local campaign drafts and deterministic SHA-256 fingerprints of normalized rules so edits are detectable.
- **Treasury (prototype)** — reconciles user-entered inflows and outflows, rounds calculations to eight decimal places, and flags invalid amounts.
- **Local workspace** — persists campaign drafts, ledger entries, and review status in browser storage and exports a JSON backup.

## Current status and boundaries

This is a prototype, not a production financial system.

- Network Intelligence uses a **third-party, read-only aggregate data feed**. It is not a direct node connection or independent consensus verification.
- Aggregate shielded-pool statistics are not an individual's wallet balance and cannot prove ownership or payment.
- Campaign fingerprints are local SHA-256 digests, not signatures, timestamps, on-chain commitments, or proof of funds.
- Treasury entries are user-entered operational notes, not verified transactions.
- PrivacyGuard only scans pasted snippets. It is not a full parser, repository scanner, formal audit, or proof that code without findings is safe.
- No wallet is connected. The app does not request seed phrases, spending keys, or viewing keys, and it does not sign or broadcast transactions.
- Browser local storage and downloaded backups are not encrypted by this application. Keep backups private.

## Data source and attribution

Network Intelligence uses the public [ZecStats API](https://zecstats.org/api), which documents browser-readable GET endpoints, source-level freshness, and a CC BY 4.0 licence. ZECGUARD displays attribution and warns that the feed can be stale or unavailable. The browser request may expose ordinary connection metadata such as the user’s IP address to the third-party service, but it sends no wallet address or key. The data is useful network context, not cryptographic proof.

## Tech stack

- React 18, TypeScript, Vite
- Vitest unit tests
- GitHub Actions test and production-build workflow
- No paid API key required for the current public aggregate data feed

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

Run automated tests and the production build:

```bash
npm test
npm run build
```

## Roadmap

- [x] PrivacyGuard-first responsive workflow with local snippet scanning and remediation guidance
- [x] Responsive privacy-operations dashboard
- [x] Local heuristic snippet scanner and tests
- [x] Canonical local campaign-rule fingerprints and tests
- [x] Treasury reconciliation helpers and tests
- [x] Browser-local persistence and downloadable JSON backup
- [x] Attributed public aggregate Zcash metrics with freshness checks
- [x] Competition submission kit and demo script
- [ ] Supported wallet/testnet integration with reproducible transaction verification
- [ ] Independently verifiable campaign commitments and contribution accounting
- [ ] Security review before handling real funds

## Documentation

- [Competition submission kit](docs/submission-kit.md)
- [90-second demo script](docs/demo-script.md)
- [Zcash integration path and limitations](docs/zcash-integration.md)

## Security

This repository has not been audited. Never enter seed phrases, private keys, or viewing keys. Do not send funds or make financial decisions based on this prototype. Report suspected vulnerabilities privately to the maintainer rather than publishing exploit details.

## License

MIT. See [LICENSE](LICENSE).
