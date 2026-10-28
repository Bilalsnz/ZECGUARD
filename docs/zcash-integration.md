# Zcash integration path

## Current decision

ZECGUARD is a Vite browser application. It does not currently have a Zcash wallet SDK, a lightwalletd client, a wallet connection, or a transaction submission path. The UI must continue to label all sample balances, fundraising totals, and ledger records as demo or user-entered data.

Do not add a pretend wallet-connect button, hard-coded chain values, or a public explorer lookup that is presented as proof of shielded funds.

## What the official tooling tells us

- [Zcash lightwalletd](https://github.com/zcash/lightwalletd) is a bandwidth-efficient backend interface used by light wallets. Its API is gRPC/protobuf and it can query chain data and submit raw transactions. A production client needs a compatible service and a clear network/privacy threat model.
- [Zcash Android Wallet SDK](https://github.com/zcash/zcash-android-wallet-sdk) is a native Android SDK designed to work with lightwalletd. It is not a drop-in React/Vite browser package.
- [Zcash iOS wallet SDK](https://github.com/zcash/zcash-swift-wallet-sdk) is an iOS Swift framework proof of concept, not a browser integration.
- [Zcash integration tests](https://zcash.github.io/integration-tests/) describe functional tests for node and wallet components. They are a useful reference for a later testnet/regtest phase.

## Phased integration plan

### Phase 1: Safe read-only network status

1. Select a maintained, permitted testnet lightwalletd endpoint or run a test service.
2. Confirm service health, network identity, tip height, and freshness before showing any result.
3. Put any required network adapter behind a narrow server endpoint if browser gRPC compatibility is not available.
4. Return explicit `live`, `stale`, `demo`, or `unavailable` states. Never fall back silently from a failed live request to demo data.
5. Add tests for network mismatch, timeout, malformed response, and stale data.

### Phase 2: Wallet-aware flows

1. Choose a supported wallet integration strategy with the relevant wallet maintainers.
2. Keep seed phrases, spending keys, and viewing keys outside browser local storage and outside application telemetry.
3. Use testnet or regtest only for the first transaction flow.
4. Verify transaction status from the network, not from a successful button click or a locally created record.
5. Add clear user consent, fee display, transaction state handling, and failure recovery.

### Phase 3: Fundraising integrity

1. Canonicalize campaign rules before opening a campaign.
2. Create a deterministic commitment to those rules and show its fingerprint.
3. Design a contribution reconciliation model that does not imply public visibility of shielded contributors or balances.
4. Define how a verifier checks the claim and which information remains private.
5. Do not label campaign totals as cryptographically verified until the evidence and verification procedure exist.

## Zero-cost constraints

This repository should remain usable without paid APIs. A public community endpoint is not a service-level guarantee and must not be treated as production infrastructure. If a reliable testnet service or wallet integration requires hosting, keys, or paid infrastructure, document that dependency before making it a requirement.

## Acceptance criteria before calling it a real integration

- The selected endpoint's network is positively identified.
- UI displays live/stale/unavailable state based on actual responses.
- No hard-coded balances or transaction hashes are presented as chain results.
- No seed phrase, private key, or viewing key is collected by the web app.
- Testnet transaction flow has automated checks and a reproducible demo.
- README and demo clearly distinguish prototype behavior from verified network behavior.
