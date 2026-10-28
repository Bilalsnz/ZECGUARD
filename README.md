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
- SHA-256 fingerprints for normalized local campaign draft rules
- Validated treasury reconciliation helpers
- Vitest unit tests for scanner, campaign fingerprints, and treasury math
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

ZECGUARD reads public aggregate Zcash network metrics from the CORS-enabled [ZecStats API](https://zecstats.org/api), including reported block height and shielded-pool statistics. It checks response shape, snapshot age, and source-level freshness, and attributes the data under CC BY 4.0. This is a third-party read-only data feed, not a wallet connection, independent consensus verification, or proof of an individual balance or payment. No transaction signing or broadcasting is implemented. Read the [Zcash integration path](docs/zcash-integration.md) for the wallet and lightwalletd boundaries. Campaign drafts produce local SHA-256 rule fingerprints only, while treasury records remain user-entered notes.

## Roadmap

- [x] Establish product scope and privacy-first principles
- [x] Build responsive prototype for the three modules
- [x] Add initial heuristic privacy scanner and unit tests
- [x] Add deterministic local campaign-rule fingerprints
- [x] Add validated treasury reconciliation helpers and tests
- [x] Document a phased Zcash integration path
- [x] Add tests for campaign rule commitments and treasury calculations
- [ ] Persist/sign campaign rule commitments in a trusted, independently verifiable way
- [ ] Verify a viable testnet wallet integration strategy
- [x] Integrate attributed public aggregate Zcash data with explicit live/stale/unavailable states
- [ ] Security review before handling real funds

## Read-only Zcash network status adapter

The dashboard includes an optional read-only status adapter. It does **not** connect directly to lightwalletd: lightwalletd exposes gRPC/protobuf, while this frontend adapter expects a separately operated or otherwise trusted HTTPS JSON status endpoint configured through `VITE_ZECGUARD_STATUS_URL`. No endpoint is configured by default, so the dashboard correctly shows `UNAVAILABLE` rather than inventing live chain data.

The endpoint must return JSON in this shape:

```json
{
  "chainName": "main",
  "blockHeight": 3000000,
  "observedAt": "2026-10-28T12:00:00.000Z"
}
```

`chainName` must be `main` or `test`; `blockHeight` must be a non-negative integer; `observedAt` must be an ISO-8601 timestamp generated when the endpoint observed the chain status. Responses older than two minutes are marked `STALE`. The status is still only endpoint-reported data, not an independent consensus proof and not proof of any shielded balance or campaign payment. Do not point this setting at an endpoint unless you trust its operator, and do not send wallet secrets to it.

## Local data behavior

Campaign drafts, ledger entries, and finding review statuses are saved in the current browser using local storage. They are not synced to an account, encrypted by this application, backed up, or published to Zcash. Clearing browser site data can erase them. Use the **Backup** button to download a JSON copy; that file may contain sensitive operational notes, so keep it private. Treat the ledger as an operational note-taking aid, not an accounting source of truth. Seed phrases, private keys, and viewing keys must never be entered.

## Security

This repository is experimental software. It has not been audited. Never enter seed phrases, private keys, or viewing keys into this application. Report suspected vulnerabilities privately to the maintainers rather than publishing exploit details.

## License

MIT. See [LICENSE](LICENSE).


## Submission kit

- [Competition submission kit](docs/submission-kit.md)
- [90-second demo script](docs/demo-script.md)
- [Zcash integration path and limitations](docs/zcash-integration.md)
