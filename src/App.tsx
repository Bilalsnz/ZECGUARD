import React, { useMemo, useState } from "react";

type Module = "Overview" | "PrivateRaise" | "Treasury" | "PrivacyGuard";
type Finding = { id: number; title: string; detail: string; severity: "High" | "Medium" | "Low"; status: "Open" | "Reviewed" };
type Campaign = { name: string; category: string; target: number; raised: number; days: number; status: string };
type Entry = { id: number; label: string; type: "Inflow" | "Outflow"; amount: number; date: string; note: string };

const initialCampaigns: Campaign[] = [
  { name: "Shielded community grants", category: "Public goods", target: 50, raised: 34.6, days: 8, status: "Funding" },
  { name: "Open-source wallet UX", category: "Infrastructure", target: 24, raised: 24, days: 0, status: "Target met" },
  { name: "Local privacy meetup", category: "Community", target: 12, raised: 5.25, days: 14, status: "Funding" },
];
const initialEntries: Entry[] = [
  { id: 1, label: "Community grant received", type: "Inflow", amount: 8.5, date: "Oct 26, 2026", note: "Demo record, not chain-verified" },
  { id: 2, label: "Contributor payment", type: "Outflow", amount: 1.2, date: "Oct 25, 2026", note: "Demo record, not chain-verified" },
  { id: 3, label: "Infrastructure budget", type: "Outflow", amount: 0.65, date: "Oct 23, 2026", note: "Demo record, not chain-verified" },
];
const initialFindings: Finding[] = [
  { id: 1, title: "Transparent address in payment path", detail: "A sample payment flow references a transparent address. Review whether public address and amount visibility is intentional.", severity: "High", status: "Open" },
  { id: 2, title: "Transaction identifiers in client logs", detail: "The example configuration logs transaction identifiers to the browser console. Logs can create a link between a user and their activity.", severity: "Medium", status: "Open" },
  { id: 3, title: "Privacy claim needs evidence", detail: "The campaign copy says “fully private” without describing address, amount, wallet, and network-metadata assumptions.", severity: "Low", status: "Reviewed" },
];
const money = (value: number) => value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const severityClass = (severity: string) => severity.toLowerCase();

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
    raise: "M12 3v18 M5 10l7-7 7 7 M4 14v6h16v-6",
    treasury: "M3 9h18 M5 9V6l7-3 7 3v3 M5 9v10 M9 9v10 M15 9v10 M19 9v10 M3 19h18",
    shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z M9 12l2 2 4-4",
    arrow: "M5 12h14 M13 6l6 6-6 6",
    check: "M20 6L9 17l-5-5",
    plus: "M12 5v14 M5 12h14",
    close: "M18 6L6 18 M6 6l12 12",
    lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
    activity: "M3 12h4l3-8 4 16 3-8h4",
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true" className="icon"><path d={paths[name] || paths.grid} /></svg>;
}

export default function App() {
  const [active, setActive] = useState<Module>("Overview");
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [entries, setEntries] = useState(initialEntries);
  const [findings, setFindings] = useState(initialFindings);
  const [campaignModal, setCampaignModal] = useState(false);
  const [entryModal, setEntryModal] = useState(false);
  const [campaignName, setCampaignName] = useState("");
  const [campaignTarget, setCampaignTarget] = useState("10");
  const [entryLabel, setEntryLabel] = useState("");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryType, setEntryType] = useState<"Inflow" | "Outflow">("Inflow");
  const [scanDone, setScanDone] = useState(false);
  const [toast, setToast] = useState("");

  const totalRaised = campaigns.reduce((sum, item) => sum + item.raised, 0);
  const balance = entries.reduce((sum, item) => sum + (item.type === "Inflow" ? item.amount : -item.amount), 0);
  const openFindings = findings.filter((item) => item.status === "Open").length;
  const nav: { name: Module; icon: string; eyebrow?: string }[] = [
    { name: "Overview", icon: "grid" },
    { name: "PrivateRaise", icon: "raise", eyebrow: "FUNDING" },
    { name: "Treasury", icon: "treasury", eyebrow: "OPERATIONS" },
    { name: "PrivacyGuard", icon: "shield", eyebrow: "SECURITY" },
  ];
  const pageTitle: Record<Module, string> = {
    Overview: "Privacy operations, at a glance.",
    PrivateRaise: "Fundraise without oversharing.",
    Treasury: "Keep the books. Protect the details.",
    PrivacyGuard: "Find the leaks before they ship.",
  };
  const pageSubtitle: Record<Module, string> = {
    Overview: "A single workspace for private fundraising, treasury records, and privacy checks.",
    PrivateRaise: "Campaign rules and progress in one place. Funding figures shown here are illustrative demo data.",
    Treasury: "A practical ledger for team operations with a clear boundary between entered records and verified chain data.",
    PrivacyGuard: "Review common privacy footguns and get remediation guidance. This demo does not scan a live repository.",
  };

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }
  function createCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = Number(campaignTarget);
    if (!campaignName.trim() || !Number.isFinite(target) || target <= 0) return;
    setCampaigns((items) => [{ name: campaignName.trim(), category: "Community", target, raised: 0, days: 30, status: "Draft" }, ...items]);
    setCampaignName("");
    setCampaignTarget("10");
    setCampaignModal(false);
    setActive("PrivateRaise");
    notify("Draft campaign created locally.");
  }
  function createEntry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(entryAmount);
    if (!entryLabel.trim() || !Number.isFinite(amount) || amount <= 0) return;
    setEntries((items) => [{ id: Date.now(), label: entryLabel.trim(), type: entryType, amount, date: "Today", note: "User-entered demo record, not chain-verified" }, ...items]);
    setEntryLabel("");
    setEntryAmount("");
    setEntryModal(false);
    notify("Ledger entry added locally.");
  }
  const checkedFindings = useMemo(() => findings.filter((item) => item.status === "Open"), [findings]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setActive("Overview"); }}>
          <span className="brand-mark"><Icon name="shield" /></span>
          <span className="brand-name">ZEC<span>GUARD</span><small>PRIVACY INFRASTRUCTURE</small></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {nav.map((item) => <button key={item.name} className={active === item.name ? "nav-item active" : "nav-item"} onClick={() => setActive(item.name)}>
            <Icon name={item.icon} /><span>{item.name}</span>{item.name === "PrivacyGuard" && openFindings > 0 && <b className="nav-count">{openFindings}</b>}
          </button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="network-card">
            <span className="network-dot" />
            <div><strong>Prototype mode</strong><small>No live chain connection</small></div>
          </div>
          <div className="sidebar-footer"><span className="tiny-shield">◈</span> Built for a more private internet <span className="version">v0.1</span></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>{active}</strong></div>
          <div className="topbar-right"><span className="demo-pill"><span /> DEMO DATA</span><button className="avatar" aria-label="Local demo profile">B</button></div>
        </header>

        <section className="page-content">
          <div className="page-heading">
            <div><div className="overline"><span className="overline-line" /> ZCASH PRIVACY SUITE</div><h1>{pageTitle[active]}</h1><p>{pageSubtitle[active]}</p></div>
            <div className="heading-actions"><span className="shielded-badge"><Icon name="lock" /> PRIVACY-FIRST BY DESIGN</span></div>
          </div>

          {active === "Overview" && <Overview campaigns={campaigns} entries={entries} findings={findings} balance={balance} totalRaised={totalRaised} openFindings={openFindings} setActive={setActive} />}
          {active === "PrivateRaise" && <Raise campaigns={campaigns} onCreate={() => setCampaignModal(true)} />}
          {active === "Treasury" && <Treasury entries={entries} balance={balance} onCreate={() => setEntryModal(true)} />}
          {active === "PrivacyGuard" && <Privacy findings={findings} setFindings={setFindings} scanDone={scanDone} setScanDone={setScanDone} checkedFindings={checkedFindings} notify={notify} />}

          <footer className="global-footer"><span>◈ ZECGUARD</span><span>Privacy is a property to verify, not a promise to assume.</span><a href="https://z.cash/" target="_blank" rel="noreferrer">Built around Zcash principles <Icon name="arrow" /></a></footer>
        </section>
      </main>

      {campaignModal && <Modal title="Create a campaign draft" onClose={() => setCampaignModal(false)}><form onSubmit={createCampaign} className="modal-form"><label>Campaign name<input autoFocus value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Open-source wallet UX" required maxLength={80} /></label><label>Funding target (ZEC)<input type="number" min="0.01" step="0.01" value={campaignTarget} onChange={(e) => setCampaignTarget(e.target.value)} required /></label><div className="notice small-notice"><Icon name="activity" /> This creates a local draft only. No wallet is connected and no funds can be received.</div><button className="button primary full" type="submit">Create local draft <Icon name="arrow" /></button></form></Modal>}
      {entryModal && <Modal title="Add a ledger record" onClose={() => setEntryModal(false)}><form onSubmit={createEntry} className="modal-form"><label>Record description<input autoFocus value={entryLabel} onChange={(e) => setEntryLabel(e.target.value)} placeholder="e.g. Contributor payment" required maxLength={100} /></label><label>Record type<select value={entryType} onChange={(e) => setEntryType(e.target.value as "Inflow" | "Outflow")}><option>Inflow</option><option>Outflow</option></select></label><label>Amount (ZEC)<input type="number" min="0.01" step="0.01" value={entryAmount} onChange={(e) => setEntryAmount(e.target.value)} required /></label><div className="notice small-notice">This is a user-entered record, not a verified blockchain transaction.</div><button className="button primary full" type="submit">Add record <Icon name="arrow" /></button></form></Modal>}
      {toast && <div className="toast"><Icon name="check" />{toast}</div>}
    </div>
  );
}

function Overview({ campaigns, entries, findings, balance, totalRaised, openFindings, setActive }: { campaigns: Campaign[]; entries: Entry[]; findings: Finding[]; balance: number; totalRaised: number; openFindings: number; setActive: (module: Module) => void }) {
  const progress = campaigns.length ? Math.round(campaigns.reduce((sum, c) => sum + Math.min(c.raised / c.target, 1), 0) / campaigns.length * 100) : 0;
  return <>
    <div className="welcome-banner"><div className="banner-grid" /><div className="banner-content"><div className="banner-chip"><span /> YOUR PRIVACY WORKSPACE</div><h2>Private by default.<br /><em>Verifiable by design.</em></h2><p>Tools for fundraising, team finances, and safer Zcash applications, without pretending privacy is a checkbox.</p><button className="button banner-button" onClick={() => setActive("PrivacyGuard")}>Review privacy checks <Icon name="arrow" /></button></div><div className="banner-art" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core-shield"><Icon name="shield" /></div><div className="art-tag tag-a"><span className="mini-dot green" /> SHIELDED</div><div className="art-tag tag-b"><span className="mini-dot amber" /> VERIFY</div></div></div>
    <div className="section-row"><div><div className="section-kicker">WORKSPACE HEALTH</div><h2 className="section-title">Your overview</h2></div><span className="muted-inline">Illustrative local data <span className="status-dot amber" /></span></div>
    <div className="stats-grid">
      <Stat label="Campaigns tracked" value={String(campaigns.length).padStart(2, "0")} delta="Local campaign registry" icon="raise" accent="violet" />
      <Stat label="Total raised" value={`${money(totalRaised)} ZEC`} delta="Demo figures, not chain-verified" icon="activity" accent="green" />
      <Stat label="Treasury balance" value={`${money(balance)} ZEC`} delta="Calculated from demo ledger" icon="treasury" accent="blue" />
      <Stat label="Open privacy findings" value={String(openFindings).padStart(2, "0")} delta={openFindings ? "Review recommended" : "No open demo findings"} icon="shield" accent="amber" />
    </div>
    <div className="content-grid overview-grid">
      <section className="panel">
        <div className="panel-header"><div><div className="section-kicker">FUNDRAISING</div><h3>Campaign activity</h3></div><button className="text-link" onClick={() => setActive("PrivateRaise")}>View all <Icon name="arrow" /></button></div>
        <div className="campaign-list compact">{campaigns.slice(0, 3).map((campaign, i) => <div className="campaign-row" key={campaign.name}><div className={`campaign-icon icon-${i % 3}`}>{i === 0 ? "◈" : i === 1 ? "↗" : "✳"}</div><div className="campaign-info"><strong>{campaign.name}</strong><span>{campaign.category} <i>·</i> {campaign.days ? `${campaign.days} days left` : "Target reached"}</span><div className="progress-track"><div style={{ width: `${Math.min(campaign.raised / campaign.target * 100, 100)}%` }} /></div></div><div className="campaign-amount"><strong>{money(campaign.raised)} <small>ZEC</small></strong><span>{Math.round(campaign.raised / campaign.target * 100)}% of target</span></div></div>)}</div>
        <div className="panel-bottom-note"><span className="status-dot amber" /> Progress is illustrative and not backed by live chain data.</div>
      </section>
      <section className="panel">
        <div className="panel-header"><div><div className="section-kicker">PRIVACYGUARD</div><h3>Findings to review</h3></div><button className="text-link" onClick={() => setActive("PrivacyGuard")}>Open scanner <Icon name="arrow" /></button></div>
        <div className="finding-summary"><div className="finding-ring"><span>{openFindings}</span><small>OPEN</small></div><div className="finding-copy"><strong>Potential privacy risks</strong><p>Review the sample findings and their suggested mitigations.</p><div className="severity-legend"><span><i className="sev-dot high" /> High</span><span><i className="sev-dot medium" /> Medium</span><span><i className="sev-dot low" /> Low</span></div></div></div>
        <div className="mini-findings">{findings.slice(0, 2).map((finding) => <div key={finding.id} className="mini-finding"><i className={`sev-dot ${severityClass(finding.severity)}`} /><span>{finding.title}</span><b className={`severity-text ${severityClass(finding.severity)}`}>{finding.severity}</b></div>)}</div>
      </section>
    </div>
    <section className="panel ledger-panel"><div className="panel-header"><div><div className="section-kicker">TREASURY</div><h3>Recent ledger records</h3></div><button className="text-link" onClick={() => setActive("Treasury")}>Open treasury <Icon name="arrow" /></button></div><LedgerTable entries={entries.slice(0, 3)} /></section>
  </>;
}

function Stat({ label, value, delta, icon, accent }: { label: string; value: string; delta: string; icon: string; accent: string }) {
  return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${accent}`}><Icon name={icon} /></span></div><strong className="stat-value">{value}</strong><div className="stat-delta"><span className="status-dot amber" />{delta}</div></div>;
}

function Raise({ campaigns, onCreate }: { campaigns: Campaign[]; onCreate: () => void }) {
  return <><div className="module-toolbar"><div className="toolbar-copy"><span className="status-dot green" /> Campaign registry <span className="divider">/</span> {campaigns.length} campaigns</div><button className="button primary" onClick={onCreate}><Icon name="plus" /> New campaign</button></div>
    <div className="notice"><Icon name="lock" /><div><strong>Privacy with honest boundaries</strong><p>Shielded payments can conceal transaction details from public observers, but campaign totals require a real accounting and verification mechanism. These cards use sample data.</p></div></div>
    <div className="campaign-grid">{campaigns.map((c, i) => { const pct = Math.min(c.raised / c.target * 100, 100); return <article className="campaign-card" key={c.name}><div className="campaign-card-top"><div className={`campaign-icon large icon-${i % 3}`}>{["◈", "↗", "✳"][i % 3]}</div><span className={c.status === "Target met" ? "badge badge-green" : c.status === "Draft" ? "badge badge-muted" : "badge badge-amber"}>{c.status}</span></div><span className="category-label">{c.category}</span><h3>{c.name}</h3><div className="raised-number">{money(c.raised)} <small>ZEC <span>raised</span></small></div><div className="progress-track thick"><div style={{ width: `${pct}%` }} /></div><div className="progress-meta"><span>{Math.round(pct)}% funded</span><span>Target {money(c.target)} ZEC</span></div><div className="campaign-card-bottom"><span><Icon name="activity" /> {c.days ? `${c.days} days left` : "Target met"}</span><button className="icon-button" onClick={() => alert("Demo only: campaign details and contribution flow are not connected to a wallet.")} aria-label={`View ${c.name}`}><Icon name="arrow" /></button></div></article>; })}</div>
    <div className="panel rule-panel"><div className="panel-header"><div><div className="section-kicker">PROPOSED PROTOCOL</div><h3>Campaign integrity checklist</h3></div><span className="badge badge-violet">DESIGN TARGET</span></div><div className="checklist-grid">{["Commit campaign rules before accepting funds", "Make later rule changes detectable", "Define threshold and refund conditions", "Publish verifiable settlement evidence"].map((item, i) => <div className="checklist-item" key={item}><span className="check-number">0{i + 1}</span><span>{item}</span><span className="check-pending">PLANNED</span></div>)}</div></div>
  </>;
}

function Treasury({ entries, balance, onCreate }: { entries: Entry[]; balance: number; onCreate: () => void }) {
  const inflows = entries.filter((e) => e.type === "Inflow").reduce((s, e) => s + e.amount, 0);
  const outflows = entries.filter((e) => e.type === "Outflow").reduce((s, e) => s + e.amount, 0);
  return <><div className="module-toolbar"><div className="toolbar-copy"><span className="status-dot green" /> Local ledger <span className="divider">/</span> {entries.length} records</div><button className="button primary" onClick={onCreate}><Icon name="plus" /> Add record</button></div>
    <div className="notice"><Icon name="activity" /><div><strong>Ledger records are not blockchain proof</strong><p>This workspace calculates totals from records you enter. It is not connected to a Zcash wallet, and its current records must not be represented as independently verified funds.</p></div></div>
    <div className="stats-grid treasury-stats"><Stat label="Ledger balance" value={`${money(balance)} ZEC`} delta="Inflows minus outflows" icon="treasury" accent="blue" /><Stat label="Total inflows" value={`${money(inflows)} ZEC`} delta="All local inflow records" icon="raise" accent="green" /><Stat label="Total outflows" value={`${money(outflows)} ZEC`} delta="All local outflow records" icon="activity" accent="amber" /><Stat label="Verified on-chain" value="0.00 ZEC" delta="No chain integration yet" icon="shield" accent="violet" /></div>
    <section className="panel ledger-panel"><div className="panel-header"><div><div className="section-kicker">TRANSACTION REGISTER</div><h3>All ledger records</h3></div><span className="badge badge-muted">LOCAL DEMO</span></div><LedgerTable entries={entries} /></section>
    <div className="panel note-panel"><div className="note-icon"><Icon name="lock" /></div><div><h3>Selective disclosure is a design goal</h3><p>Future versions should let a team share a scoped report with an auditor without handing over unnecessary wallet history. This needs a defined proof model and careful key handling, not just a private-looking interface.</p></div></div>
  </>;
}

function LedgerTable({ entries }: { entries: Entry[] }) {
  if (!entries.length) return <div className="empty-state"><span>◈</span><strong>No records yet</strong><p>Add an inflow or outflow to begin your local ledger.</p></div>;
  return <div className="table-wrap"><table><thead><tr><th>DESCRIPTION</th><th>DATE</th><th>RECORD TYPE</th><th>AMOUNT</th><th>STATUS</th></tr></thead><tbody>{entries.map((e) => <tr key={e.id}><td><div className="table-title">{e.label}</div><div className="table-subtitle">{e.note}</div></td><td className="date-cell">{e.date}</td><td><span className={e.type === "Inflow" ? "type-pill inflow" : "type-pill outflow"}><i />{e.type}</span></td><td className={e.type === "Inflow" ? "amount-positive" : "amount-negative"}>{e.type === "Inflow" ? "+" : "−"}{money(e.amount)} ZEC</td><td><span className="status-unverified"><span /> Not verified</span></td></tr>)}</tbody></table></div>;
}

function Privacy({ findings, setFindings, scanDone, setScanDone, checkedFindings, notify }: { findings: Finding[]; setFindings: React.Dispatch<React.SetStateAction<Finding[]>>; scanDone: boolean; setScanDone: (value: boolean) => void; checkedFindings: Finding[]; notify: (message: string) => void }) {
  const [filter, setFilter] = useState("All");
  const visible = findings.filter((f) => filter === "All" || f.severity === filter || f.status === filter);
  const markReviewed = (id: number) => { setFindings((items) => items.map((item) => item.id === id ? { ...item, status: "Reviewed" } : item)); notify("Finding marked reviewed."); };
  return <><div className="module-toolbar"><div className="toolbar-copy"><span className="status-dot amber" /> {scanDone ? "Demo review complete" : "Ready for review"} <span className="divider">/</span> {checkedFindings.length} open findings</div><button className="button primary" onClick={() => { setScanDone(true); notify("Sample checks reviewed. No repository was scanned."); }}><Icon name="activity" /> {scanDone ? "Review again" : "Run demo review"}</button></div>
    <div className="scan-banner"><div className="scan-icon"><Icon name="shield" /></div><div><span className="section-kicker">PRIVACY REVIEW ENGINE</span><h2>{scanDone ? "Sample review completed." : "Catch risky assumptions early."}</h2><p>{scanDone ? "The sample findings below were reviewed. This did not scan source code, network traffic, or blockchain transactions." : "Review illustrative checks for transparent address usage, sensitive logging, and unsupported privacy claims."}</p></div><div className="scan-status"><span className="status-dot amber" /> DEMO RULESET</div></div>
    <div className="scan-metrics"><div><span>Open findings</span><strong>{checkedFindings.length.toString().padStart(2, "0")}</strong></div><div><span>High severity</span><strong>{findings.filter((f) => f.severity === "High" && f.status === "Open").length.toString().padStart(2, "0")}</strong></div><div><span>Reviewed</span><strong>{findings.filter((f) => f.status === "Reviewed").length.toString().padStart(2, "0")}</strong></div><div><span>Live scans</span><strong>00</strong></div></div>
    <section className="panel findings-panel"><div className="panel-header"><div><div className="section-kicker">FINDINGS REGISTER</div><h3>Potential privacy issues</h3></div><select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter findings"><option>All</option><option>High</option><option>Medium</option><option>Low</option><option>Open</option><option>Reviewed</option></select></div>
      {visible.length ? <div className="finding-list">{visible.map((f) => <article className="finding-card" key={f.id}><div className={`finding-severity-bar ${severityClass(f.severity)}`} /><div className="finding-body"><div className="finding-heading"><span className={`severity-badge ${severityClass(f.severity)}`}>{f.severity} severity</span><span className={f.status === "Open" ? "finding-status open" : "finding-status"}>{f.status}</span></div><h4>{f.title}</h4><p>{f.detail}</p><div className="remediation"><strong>Suggested next step</strong><span>{f.id === 1 ? "Inspect address types and transaction construction. Document which details are publicly observable." : f.id === 2 ? "Remove sensitive console logs, review telemetry, and avoid sending transaction metadata to third-party analytics." : "Replace absolute privacy promises with a precise threat model and evidence for each claim."}</span></div></div>{f.status === "Open" && <button className="button secondary review-button" onClick={() => markReviewed(f.id)}><Icon name="check" /> Mark reviewed</button>}</article>)}</div> : <div className="empty-state"><span>✓</span><strong>No matching findings</strong><p>Try another filter or review all findings.</p></div>}
    </section>
    <div className="notice bottom-notice"><Icon name="lock" /><div><strong>Scope and limitations</strong><p>This is a guided demo review, not an automated security audit. Findings are illustrative and cannot establish whether an application is secure. A real scanner needs defined rules, test fixtures, evidence, and false-positive handling.</p></div></div>
  </>;
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><div className="modal-header"><div><span className="section-kicker">ZECGUARD WORKSPACE</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button></div>{children}</section></div>;
}
