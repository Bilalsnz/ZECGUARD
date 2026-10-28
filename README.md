# ZECGUARD

**Your funds. Your privacy. Your proof.**

ZECGUARD is an open-source exploration of privacy-aware financial tooling for the Zcash ecosystem. It brings three related workflows together:

- **PrivateRaise** — fundraising campaign drafts with explicit boundaries and a path toward verifiable outcomes.
- **Private Treasury** — team cash-flow records and reporting that distinguish user-entered records from verified chain data.
- **PrivacyGuard** — developer-oriented heuristic checks for potential privacy leaks and unsafe assumptions.

## Status

Early-stage prototype. The UI and local demo workflows are not a production financial system.

**No real Zcash transactions are currently sent or verified.** Sample figures are illustrative. Do not send funds or use this prototype to make financial decisions.

PrivacyGuard currently scans only source snippets pasted into the browser. The snippet is processed locally by heuristic rules and is not uploaded by the scanner. It is not a full parser, repository scanner, formal audit, or proof that code without findings is safe. Findings may include false positives and false negatives.

## Product principles

1. **Privacy claims must be specific.** Shielded transaction contents, network metadata, wallet behavior, and application logs are different privacy surfaces.
2. **Verification must be evidence-backed.** A UI, indexer result, or self-reported record is not automatically cryptographic proof.
3. **No silent rule changes.** Fundraising conditions should be committed before accepting contributions, with changes detectable.
4. **Demo data stays labelled.** Sample data must never be presented as live blockchain information.
5. **Zero paid dependencies by default.** Local development should work with open-source tooling.

## Stack

- React + TypeScript + Vite
- Local, heuristic PrivacyGuard scanner
- SHA-256 fingerprints for normalized local campaign draft rules\n- Validated treasury reconciliation helpers\n- Vitest unit tests for scanner, campaign fingerprints, and treasury math
- GitHub Actions test and production-build checks

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

Run the scanner unit tests and production build:

```bash
npm test
npm run build
```

## Zcash integration

The integration is intentionally not faked. Read the [Zcash integration path](docs/zcash-integration.md) for the official tooling references, phased approach, security boundaries, and acceptance criteria for a real testnet integration. Campaign drafts can now produce a local SHA-256 fingerprint of normalized rules. This detects changes to the rule text, but it is not on-chain, signed, timestamped, or proof of funds. The treasury helper validates amounts and reconciles user-entered ledger records only.

## Roadmap

- [x] Establish product scope and privacy-first principles
- [x] Build responsive prototype for the three modules
- [x] Add initial heuristic privacy scanner and unit tests\n- [x] Add deterministic local campaign-rule fingerprints\n- [x] Add validated treasury reconciliation helpers and tests
- [x] Document a phased Zcash integration path
- [ ] Add tests for campaign rule commitments and treasury calculations
- [ ] Persist/sign campaign rule commitments in a trusted, independently verifiable way\n- [ ] Verify a viable testnet endpoint and wallet integration strategy
- [ ] Integrate real chain data with explicit live/stale/demo states
- [ ] Security review before handling real funds

## Local data behavior

Campaign drafts, ledger entries, and finding review statuses are saved in the current browser using local storage. They are not synced to an account, encrypted by this application, backed up, or published to Zcash. Clearing browser site data can erase them. Use the **Backup** button to download a JSON copy; that file may contain sensitive operational notes, so keep it private. Treat the ledger as an operational note-taking aid, not an accounting source of truth. Seed phrases, private keys, and viewing keys must never be entered.

## Security

This repository is experimental software. It has not been audited. Never enter seed phrases, private keys, or viewing keys into this application. Report suspected vulnerabilities privately to the maintainers rather than publishing exploit details.

## License

MIT. See [LICENSE](LICENSE).
