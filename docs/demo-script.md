# ZECGUARD Demo Script

Target duration: 60 seconds. Keep browser zoom at 100% and use a stable network connection.

## Before recording
- Open the deployed ZECGUARD demo and reload once.
- The app should open directly on PrivacyGuard. If not, select it in the sidebar.
- Ensure no personal browser tabs, passwords, wallet keys, or private data are visible.
- Show the real app behavior. Do not imply a full repository was scanned.

## Narration and actions

**0:00–0:08 | The problem**  
Show the PrivacyGuard landing screen.  
“Zcash privacy can be undermined by the application around a transaction. Sensitive logs, unsafe key storage, telemetry, and overconfident privacy claims can expose users or mislead them.”

**0:08–0:20 | Run the scan**  
Leave the prefilled sample visible and click **Run sample scan**.  
“PrivacyGuard checks pasted source snippets locally in the browser. It does not upload this snippet as part of the scan.”

**0:20–0:38 | Inspect findings**  
Point at the rule IDs, severity, evidence, and remediation.  
“Each match has a rule ID, a short explanation of the risk, and a practical next step. These are heuristic matches, so they can produce false positives and miss issues.”

**0:38–0:48 | Show a high-severity rule**  
Replace the sample with a harmless illustrative snippet such as `localStorage.setItem("viewingKey", value)`, then click **Scan snippet**.  
“This rule flags a possible key-handling footgun. The recommendation is to avoid browser web storage for sensitive key material and keep key handling behind a trusted wallet boundary.”

**0:48–0:55 | Be honest about scope**  
Show the scope-and-limitations notice.  
“This is a snippet-level early warning tool, not a full repository scanner, formal audit, or proof that unflagged code is safe.”

**0:55–1:00 | Supporting context**  
Briefly open Overview if time allows.  
“The other modules are supporting prototypes. Public network metrics come from a third-party feed, while campaign and treasury records are local demo data, not verified chain activity.”

## Recording fallback
If the public network API is unavailable, show its actual UNAVAILABLE state. Do not replace it with invented network values. PrivacyGuard's local snippet scan can still be demonstrated independently.
