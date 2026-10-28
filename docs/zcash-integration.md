# Zcash integration path

## Current decision

ZECGUARD is a Vite browser application. It now reads public aggregate Zcash metrics from the CORS-enabled ZecStats API and checks the response schema, snapshot age, and per-section freshness. This is a read-only third-party data feed, not a direct node connection or independent consensus proof. The application still has no Zcash wallet SDK, lightwalletd client, wallet connection, transaction signing, or transaction submission path. Campaign progress and treasury entries remain local demo/user-entered data.

Do not add a pretend wallet-connect button, hard-coded chain values, or a public explorer lookup that is presented as proof of shielded funds.

## What the official tooling tells us

- [Zcash lightwalletd](https://github.com/zcash/lightwalletd) is a bandwidth-efficient backend interface used by light wallets. Its API is gRPC/protobuf and it can query chain data and submit raw transactions. A production client needs a compatible service and a clear network/privacy threat model.
- [Zcash Android Wallet SDK](https://github.com/zcash/zcash-android-wallet-sdk) is a native Android SDK designed to work with lightwalletd. It is not a drop-in React/Vite browser package.
- [Zcash iOS wallet SDK](https://github.com/zcash/zcash-swift-wallet-sdk) is an iOS Swift framework proof of concept, not a browser integration.
- [Zcash integration tests](https://zcash.github.io/integration-tests/) describe functional tests for node and wallet components. They are a useful reference for a later testnet/regtest phase.

## Phased integration plan

### Phase 1: Public aggregate network context (implemented)

1. Read the documented ZecStats summary endpoint over HTTPS.
2. Validate required fields and reject malformed responses.
3. Check both snapshot age and network/pool source provenance before displaying `LIVE`.
4. Label stale data and show `UNAVAILABLE` on request or schema failures.
5. Attribute ZecStats under CC BY 4.0 and state clearly that aggregate statistics are not individual balances or payment proofs.

### Phase 2: Direct node / wallet path (not implemented)

1. Select and verify a maintained testnet lightwalletd service or run a controlled test service.
2. Choose a supported SDK strategy; the Android SDK is native and is not a drop-in browser library.
3. Keep spending keys outside browser storage and telemetry.
4. Use testnet/regtest for the first transaction flow and verify its status from the network.
5. Add explicit consent, fees, transaction states, failure recovery, and reproducible tests.

### Phase 3: Wallet-aware flows

1. Choose a supported wallet integration strategy with the relevant wallet maintainers.
2. Keep seed phrases, spending keys, and viewing keys outside browser local storage and outside application telemetry.
3. Use testnet or regtest only for the first transaction flow.
4. Verify transaction status from the network, not from a successful button click or a locally created record.
5. Add clear user consent, fee display, transaction state handling, and failure recovery.

### Phase 4: Fundraising integrity

1. Canonicalize campaign rules before opening a campaign.
2. Create a deterministic commitment to those rules and show its fingerprint.
3. Design a contribution reconciliation model that does not imply public visibility of shielded contributors or balances.
4. Define how a verifier checks the claim and which information remains private.
5. Do not label campaign totals as cryptographically verified until the evidence and verification procedure exist.

## Zero-cost constraints

This repository should remain usable without paid APIs. A public community endpoint is not a service-level guarantee and must not be treated as production infrastructure. If a reliable testnet service or wallet integration requires hosting, keys, or paid infrastructure, document that dependency before making it a requirement.

## Acceptance criteria before calling it a real integration

- Public aggregate feed response is schema-validated and attributed.
- UI displays live/stale/unavailable state based on actual response freshness and source provenance.
- Direct node/wallet integration remains a separate acceptance gate; do not imply it exists.
- No hard-coded balances or transaction hashes are presented as chain results.
- No seed phrase, private key, or viewing key is collected by the web app.
- Testnet transaction flow has automated checks and a reproducible demo.
- README and demo clearly distinguish prototype behavior from verified network behavior.
