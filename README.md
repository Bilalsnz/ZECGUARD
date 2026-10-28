# ZECGUARD

**Your funds. Your privacy. Your proof.**

ZECGUARD is an open-source exploration of privacy-aware financial tooling for the Zcash ecosystem. It brings three related workflows together:

- **PrivateRaise** — fundraising campaigns with explicit rules and verifiable outcomes.
- **Private Treasury** — team cash-flow records and reporting that distinguish user-entered records from verified chain data.
- **PrivacyGuard** — developer-oriented checks for potential privacy leaks and unsafe assumptions.

## Status

Early-stage prototype. The UI and local demo workflows are not a production financial system.

**No real Zcash transactions are currently sent or verified.** Sample figures are illustrative. Do not send funds or use this prototype to make financial decisions.

## Product principles

1. **Privacy claims must be specific.** Shielded transaction contents, network metadata, wallet behavior, and application logs are different privacy surfaces.
2. **Verification must be evidence-backed.** A UI, indexer result, or self-reported record is not automatically cryptographic proof.
3. **No silent rule changes.** Fundraising conditions should be committed before accepting contributions, with changes detectable.
4. **Demo data stays labelled.** Sample data must never be presented as live blockchain information.
5. **Zero paid dependencies by default.** Local development should work with open-source tooling.

## Planned architecture

- React + TypeScript + Vite frontend
- Pure, testable domain logic for campaign rules and treasury reconciliation
- Privacy checks with severity, evidence, limitations, and remediation
- Zcash integration only after wallet, SDK, and test-network capabilities are verified
- No private keys or viewing keys stored in frontend local storage

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Roadmap

- [x] Establish product scope and privacy-first principles
- [x] Build responsive prototype for the three modules
- [ ] Add tests for campaign rule commitments and treasury calculations
- [ ] Implement evidence-based privacy checks
- [ ] Verify current Zcash testnet and wallet integration options
- [ ] Integrate real chain data with explicit live/stale/demo states
- [ ] Security review before handling real funds

## Security

This repository is experimental software. It has not been audited. Never enter seed phrases, private keys, or viewing keys into this application. Report suspected vulnerabilities privately to the maintainers rather than publishing exploit details.

## License

MIT. See [LICENSE](LICENSE).
