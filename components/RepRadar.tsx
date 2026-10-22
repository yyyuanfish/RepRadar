"use client";
import Link from "next/link";
import { useState, useEffect, useMemo, useRef } from "react";
import DashboardCharts from "./DashboardCharts";
import DetailedInsights, {type SignalDrilldown} from "./DetailedInsights";
import TeamHandoff, {type ModelHealth} from "./TeamHandoff";
import {intentReply} from "@/lib/assistant";
import {
  Activity,
  Mail,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Globe2,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  Leaf,
  MessageSquare,
  MoreHorizontal,
  Play,
  Radar,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  AlertTriangle,
  ExternalLink,
  Menu,
  Lock,
  GitBranch,
  Scale,
  Plus,
  ClipboardCheck,
  Info,
  CheckSquare,
} from "lucide-react";
import {
  roles,
  scenarios,
  signals,
  incomingSignal,
  knowledge,
  defaultWeights,
  trend,
  type Role,
  type ScenarioId,
  type RiskWeights,
  type Signal,
  type KnowledgeDoc,
  type Decision,
} from "@/lib/data";
import {
  scoreRisk,
  priority,
  recommendations,
  actionScore,
  extractiveAnswer,
  lessonDocs,
  type Recommendation,
} from "@/lib/engine";
type View = "overview" | "signals" | "workspace" | "knowledge" | "decisions" | "handoff";
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  sources?: KnowledgeDoc[];
  mode?: string;
  notice?: string;
  suggestions?: string[];
};
const nav = [
  { id: "overview" as View, label: "Overview", icon: LayoutDashboard },
  { id: "signals" as View, label: "Signal inbox", icon: Inbox },
  { id: "workspace" as View, label: "Risk workspace", icon: Target },
  { id: "knowledge" as View, label: "Knowledge library", icon: BookOpen },
  { id: "decisions" as View, label: "Decision log", icon: ClipboardCheck },
  { id: "handoff" as View, label: "Team handoff", icon: Mail },
];
function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className={`brand ${small ? "small" : ""}`}>
      <span className="brand-icon">
        <img src="/assets/repradar-mark-color.svg" alt="" width={small ? 26 : 42} height={small ? 26 : 42} />
      </span>
      <span>
        Rep<span className="brand-light">Radar</span>
        <small>STAKEHOLDER INTELLIGENCE</small>
      </span>
    </div>
  );
}
function Tag({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`tag ${tone}`}>{children}</span>;
}
function Metric({
  icon: Icon,
  label,
  value,
  detail,
  tone = "green",
}: {
  icon: typeof Radar;
  label: string;
  value: string | number;
  detail: string;
  tone?: string;
}) {
  return (
    <div className={`metric metric-${tone}`}>
      <div className="metric-top">
        <span>{label}</span>
        <Icon size={18} />
      </div>
      <div className="metric-value">{value}</div>
      <div className={`metric-detail ${tone}`}>{detail}</div>
    </div>
  );
}
export default function RepRadar() {
  const [view, setView] = useState<View>("overview");
  const [role, setRole] = useState<Role>("Communications");
  const [scenario, setScenario] = useState<ScenarioId>("residue");
  const [weights, setWeights] = useState<RiskWeights>(defaultWeights);
  const [prefs, setPrefs] = useState({ evidence: 45, trust: 35, speed: 20 });
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("All languages");
  const [stakeholder, setStakeholder] = useState("All stakeholders");
  const [drilldown, setDrilldown] = useState<SignalDrilldown>({});
  const detailRequested=useRef(false);
  const [tab, setTab] = useState("Analysis");
  const [incoming, setIncoming] = useState(false);
  const [toast, setToast] = useState("");
  const [copilot, setCopilot] = useState(false);
  const [guide, setGuide] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [about, setAbout] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDoc | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [ready, setReady] = useState(false);
  const [health, setHealth] = useState<ModelHealth>({live:false,reason:"Checking model connection…"});
  const live=health.live;
  const [simple,setSimple]=useState(true);
  const contextRef=useRef("");
  contextRef.current=`${scenario}:${role}`;
  const [checkingModel,setCheckingModel]=useState(false);
  const refreshModel=async()=>{
    setCheckingModel(true);
    try {const r=await fetch("/api/status");if(!r.ok)throw new Error();const status=await r.json();setHealth(status);return status;}
    catch {const status={live:false,reason:"Connection check failed."};setHealth(status);return status;}
    finally {setCheckingModel(false);}
  };
  const checkConnection=async()=>{const status=await refreshModel();setToast(status.live?`Connected to ${status.model}. Ready for questions.`:status.reason||"Knowledge search is available. Model not connected.");};
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);
  const [decisionAction, setDecisionAction] = useState<Recommendation | null>(
    null,
  );
  const [outcome, setOutcome] = useState<Decision["outcome"]>("Approved");
  const [rationale, setRationale] = useState("");
  const [owner, setOwner] = useState("Maya Keller");
  const [ack, setAck] = useState(false);
  const [formError, setFormError] = useState("");
  const [verified, setVerified] = useState<string[]>([]);
  const [annotation, setAnnotation] = useState("");
  const [annotations, setAnnotations] = useState<Record<string, string>>({});
  const [lessonTarget, setLessonTarget] = useState<Decision | null>(null);
  const [lesson, setLesson] = useState("");
  const chatEnd = useRef<HTMLDivElement>(null);
  const storageKey = "repradar-demo-v1";
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.decisions)) setDecisions(s.decisions);
        if (s.annotations) setAnnotations(s.annotations);
        if (Array.isArray(s.verified)) setVerified(s.verified);
        setIncoming(!!s.incoming);
      }
    } catch {}
    if (new URLSearchParams(window.location.search).get("tour") === "1") setGuide(true);
    setReady(true);
    refreshModel();
  }, []);
  useEffect(() => {
    if (ready) {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ decisions, annotations, verified, incoming }),
        );
      } catch {
        setToast(
          "Browser storage unavailable. Export the decision log to keep your work.",
        );
      }
    }
  }, [decisions, annotations, verified, incoming, ready]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4200);
      return () => clearTimeout(t);
    }
  }, [toast]);
  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);
  useEffect(() => {
    if (!copilot) return;
    const previous = document.activeElement as HTMLElement | null;
    const drawer = document.querySelector<HTMLElement>(".copilot");
    drawer?.querySelector<HTMLElement>("button")?.focus();
    const handler = (e: KeyboardEvent) => {
      if (document.querySelector(".modal-backdrop")) return;
      if (e.key === "Escape") setCopilot(false);
      if (e.key === "Tab") {
        const els = drawer?.querySelectorAll<HTMLElement>(
          "button:not(:disabled),textarea,select",
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, [copilot]);
  useEffect(()=>{if(copilot)refreshModel();},[copilot]);
  useEffect(()=>{
    if(!detailRequested.current)return;
    detailRequested.current=false;
    const target=document.getElementById(!simple&&view==='overview'?'detailed-insights':'main');
    target?.scrollIntoView({block:'start',behavior:'instant'});
    if(!simple&&view==='overview')target?.focus({preventScroll:true});
  },[simple,view]);
  const changeDetail=(next:boolean)=>{if(next===simple){document.getElementById(!next&&view==='overview'?'detailed-insights':'main')?.scrollIntoView({block:'start',behavior:'instant'});return;}detailRequested.current=true;setSimple(next);};
  const allSignals = incoming ? [...signals, incomingSignal] : signals;
  const s = scenarios[scenario];
  const factors = {
    ...s.factors,
    momentum: scenario === "water" && incoming ? 5 : s.factors.momentum,
  };
  const risk = scoreRisk(factors, weights);
  const currentSignals = allSignals.filter((x) => x.scenario === scenario);
  const reviewedDocs = lessonDocs(decisions);
  const accessibleDocs = [...knowledge, ...reviewedDocs].filter(
    (d) => d.domain === role || d.domain === "Shared",
  );
  const docs = accessibleDocs.filter(
    (d) =>
      (d.scenario === scenario || d.scenario === "all") &&
      `${d.title} ${d.text}`.toLowerCase().includes(query.toLowerCase()),
  );
  const ranked = recommendations(scenario).sort(
    (a, b) => actionScore(b, prefs) - actionScore(a, prefs),
  );
  const filtered = allSignals.filter(
    (x) =>
      (lang === "All languages" || x.language === lang) &&
      (stakeholder === "All stakeholders" || x.stakeholder === stakeholder) &&
      (!drilldown.sentiment || x.sentiment === drilldown.sentiment) &&
      (!drilldown.channel || x.channel === drilldown.channel) &&
      (!drilldown.review || (drilldown.review === "reviewed" ? verified.includes(x.id) : !verified.includes(x.id))) &&
      `${x.title} ${x.source} ${x.translation} ${x.original}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const openView = (v: View) => {
    setView(v);
    setQuery("");
    setMobile(false);
    if(v === "signals") {setLang("All languages");setStakeholder("All stakeholders");setDrilldown({});}
    window.scrollTo({top:0,behavior:"instant"});
  };
  const changeScenario = (id: ScenarioId) => {
    setScenario(id);
    setMessages([]);
    setQuery("");
  };
  const notify = (text: string) => setToast(text);
  const exportFile = (data: unknown, name: string) => {
    const blob = new Blob(
      [typeof data === "string" ? data : JSON.stringify(data, null, 2)],
      { type: typeof data === "string" ? "text/markdown" : "application/json" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    notify("Export downloaded.");
  };
  const brief = () =>
    exportFile(
      `# RepRadar decision brief\n\nSYNTHETIC HACKATHON DEMO — not a real incident.\n\n## ${s.title}\nRole: ${role}\nPriority score: ${risk}/100 (heuristic, not a probability)\nWeights: ${JSON.stringify(weights)}\n\n${s.summary}\n\nEvidence gap: ${s.uncertainty}\n\n## Ranked options\n${ranked.map((a, i) => `${i + 1}. ${a.title} (${actionScore(a, prefs)}/100 preference fit)\n${a.description}\nTradeoff: ${a.tradeoff}\nReferences: ${a.citations.join(", ")}\n`).join("\n")}\n\n## Human decisions\n${
        decisions
          .filter((d) => d.scenario === scenario)
          .map(
            (d) =>
              `${d.outcome}: ${d.action}\nOwner: ${d.owner}\nReason: ${d.rationale}\nRecorded: ${d.createdAt}`,
          )
          .join("\n\n") || "Pending human review."
      }\n\nAll referenced KB documents are synthetic demo guidance.`,
      `RepRadar-${scenario}-brief.md`,
    );
  async function ask(q = question) {
    if (!q.trim() || sending) return;
    const value=q.trim(), context=`${scenario}:${role}`;
    setQuestion("");setSending(true);
    setMessages(m=>[...m,{role:"user",text:value}]);
    try {
      const local=extractiveAnswer(value,role,scenario,reviewedDocs);
      let reply;
      if(local.sources.some(d=>d.id.startsWith('LEARN-'))) reply={...local,notice:'Includes a locally reviewed lesson. This browser history is not sent to the model.'};
      else {
        const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:value,role,scenario,history:messages.slice(-4).map(m=>({role:m.role,content:m.text.slice(0,900)}))})});
        reply=await res.json();if(!res.ok||reply.error)throw new Error('unavailable');
      }
      if(contextRef.current===context)setMessages(m=>[...m,{role:'assistant',text:reply.answer,sources:reply.sources,mode:reply.mode,notice:reply.notice,suggestions:reply.suggestions}]);
    }catch{
      const reply=intentReply(value,scenario)||extractiveAnswer(value,role,scenario,reviewedDocs);
      if(contextRef.current===context)setMessages(m=>[...m,{role:'assistant',text:reply.answer,sources:reply.sources,mode:reply.mode,notice:'Connection unavailable. Local knowledge used instead.'}]);
    }finally{setSending(false);}
  }
  function saveDecision() {
    if (!decisionAction) return;
    if (!rationale.trim() || !owner.trim() || !ack) {
      setFormError(
        "Add an owner and rationale, and acknowledge the evidence limitations.",
      );
      return;
    }
    const d: Decision = {
      id: crypto.randomUUID().slice(0, 8),
      scenario,
      action: decisionAction.title,
      outcome,
      rationale: rationale.trim(),
      owner: owner.trim(),
      role,
      createdAt: new Date().toISOString(),
      weights: { ...weights },
    };
    setDecisions((ds) => [d, ...ds]);
    setDecisionAction(null);
    notify(`${outcome} decision saved with your rationale.`);
    openView("decisions");
  }
  function startDecision(a: Recommendation) {
    setDecisionAction(a);
    setOutcome("Approved");
    setRationale("");
    setAck(false);
    setFormError("");
  }
  function reset() {
    setDecisions([]);
    setAnnotations({});
    setVerified([]);
    setIncoming(false);
    setMessages([]);
    setWeights(defaultWeights);
    setPrefs({ evidence: 45, trust: 35, speed: 20 });
    setSimple(true);
    setDrilldown({});
    setLang("All languages");
    setStakeholder("All stakeholders");
    setTab("Analysis");
    setRole("Communications");
    setScenario("residue");
    setAbout(false);
    openView("overview");
    notify("Demo reset. Ready for your next walkthrough.");
  }
  const openSource = (id: string) => {
    const doc = [...knowledge, ...reviewedDocs].find((d) => d.id === id);
    if (doc) {
      if (doc.domain !== role && doc.domain !== "Shared") {
        notify(
          `This source belongs to ${doc.domain}. Switch the demo role to inspect it.`,
        );
        return;
      }
      setSelectedDoc(doc);
    }
  };
  return (
    <div className={`app-shell ${simple?"simple-view":"detailed-view"}`}>
      <a className="skip" href="#main">
        Skip to main content
      </a>
      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <div className="sidebar-top">
          <Link href="/" className="sidebar-brands" aria-label="Back to RepRadar welcome" style={{textDecoration:"none"}}><Brand /></Link>
          <button
            className="icon-button mobile-close"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">
          CORPORATE AFFAIRS <span>WORKSPACE</span>
        </div>
        <nav aria-label="Main navigation">
          {nav.map((n) => (
            <button
              key={n.id}
              onClick={() => openView(n.id)}
              className={`nav-item ${view === n.id ? "active" : ""}`}
              aria-current={view === n.id ? "page" : undefined}
            >
              <n.icon size={19} />
              <span>{n.label}</span>
              {n.id === "signals" && (
                <span className="nav-count">{allSignals.length}</span>
              )}
              {n.id === "decisions" && decisions.length > 0 && (
                <span className="nav-count">{decisions.length}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-support">
          <div className="principle">
            <ShieldCheck size={22} />
            <strong>
              Human judgment.
              <br />
              Always at the center.
            </strong>
            <p>
              AI informs the next step.
              <br />
              You make the decision.
            </p>
            <button onClick={() => setAbout(true)}>
              Our responsible AI principles <ArrowUpRight size={13} />
            </button>
          </div>
          <button className="nav-item" onClick={() => setGuide(true)}>
            <Play size={18} />
            <span>Demo walkthrough</span>
            <span className="tiny">2 min</span>
          </button>
          <button className="nav-item" onClick={() => setAbout(true)}>
            <HelpCircle size={18} />
            <span>About this prototype</span>
          </button>
          <div className="partner">
            <span>BUILT FOR THE SYNGENTA CHALLENGE</span>
            <img src="/assets/syngenta-group.png" alt="Syngenta Group" />
            <small>UZH.ai Hackathon · Concept prototype</small>
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Open navigation"
              onClick={() => setMobile(true)}
            >
              <Menu size={20} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{nav.find((n) => n.id === view)?.label}</strong>
          </div>
          <div className="top-actions">{(view === "overview" || view === "workspace") && <div className="view-mode" aria-label="Display detail"><button aria-pressed={simple} onClick={()=>changeDetail(true)}>Simple view</button><button aria-pressed={!simple} aria-controls={view === "overview" ? "detailed-insights" : undefined} onClick={()=>changeDetail(false)}>Detailed view</button></div>}
            <span className="demo-status">
              <i /> Synthetic demo
            </span>
            <span className="top-separator" />
            <div className="role-select">
              <span>YOUR PERSPECTIVE</span>
              <select
                aria-label="Employee role"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role);
                  setMessages([]);
                  notify("Knowledge collection updated for your role.");
                }}
              >
                {roles.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="avatar" title="Maya Keller, demo persona">
              MK
            </div>
          </div>
        </header>
        <main id="main" className={view === "overview" ? "overview-main" : undefined}>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                {view === "overview"
                  ? "YOUR EARLY-WARNING WORKSPACE"
                  : "LISTEN. INTERPRET. DECIDE."}
              </div>
              <h1>
                {view === "overview"
                  ? "Stakeholder risk dashboard"
                  : view === "signals"
                    ? "Every signal has a context."
                    : view === "workspace"
                      ? "Better-informed decisions."
                      : view === "knowledge"
                        ? "The right context for your role."
                        : view === "handoff" ? "A clear handoff. Less back-and-forth." : "Human decisions. Clear accountability."}
              </h1>
              <p>
                {view === "overview"
                  ? "Good morning, Maya. See the concerns, check the evidence, choose the next step."
                  : view === "signals"
                    ? "Read the original. Check the source. Hear the people behind the signal."
                    : view === "workspace"
                      ? "Understand the evidence, weigh your options, and choose the next step."
                      : view === "knowledge"
                        ? `${role} guidance, historical context, and reviewed lessons.`
                        : view === "handoff" ? "Prepare a reviewed brief for a colleague, in the tools they already use." : "Your reasoning stays with every decision, from review to learning."}
              </p>
            </div>
            <div className="heading-actions">
              {view === "overview" ? (
                <button
                  className="button secondary"
                  onClick={() => {
                    setGuide(true);
                  }}
                >
                  <Play size={15} /> Run demo
                </button>
              ) : (
                <button className="button secondary" onClick={brief}>
                  <Download size={15} /> Export brief
                </button>
              )}
              <button
                className="button primary"
                onClick={() => setCopilot(true)}
              >
                <Sparkles size={16} /> Ask RepRadar
              </button>
            </div>
          </div>
          {view === "handoff" && <TeamHandoff key={`${scenario}:${decisions.find(d=>d.scenario===scenario)?.id||'draft'}`} scenario={scenario} decision={decisions.find(d=>d.scenario===scenario)} health={health} checking={checkingModel} refresh={checkConnection} notify={notify}/>}
          {view === "overview" && (
            <>
              <section className="metrics-grid" aria-label="Workspace metrics">
                <Metric
                  icon={Activity}
                  label="Signals to understand"
                  tone="blue"
                  value={allSignals.length}
                  detail={`${new Set(allSignals.map(x=>x.language)).size} languages · source text available`}
                />
                <Metric
                  icon={AlertTriangle}
                  label="Topics needing review"
                  value={Object.keys(scenarios).length}
                  detail="Check evidence and assign an owner"
                  tone="red"
                />
                <Metric
                  icon={Globe2}
                  label="Stakeholder groups"
                  tone="purple"
                  value={new Set(allSignals.map(x=>x.stakeholder)).size}
                  detail="Including quieter community voices"
                />
                <Metric
                  icon={ClipboardCheck}
                  label="Human decisions"
                  value={decisions.length}
                  detail={
                    decisions.length
                      ? "Recorded with rationale"
                      : "You have the final say"
                  }
                  tone="green"
                />
              </section>
              {!simple && <DetailedInsights signals={allSignals} incoming={incoming} verified={verified} weights={weights} onFilter={f=>{openView('signals');setDrilldown(f);}} onLanguage={l=>{openView('signals');setLang(l);}} onTopic={id=>{changeScenario(id);setTab('Analysis');openView('workspace');}}/>}
              <DashboardCharts signals={allSignals} incoming={incoming} onGroup={g=>{openView('signals');setStakeholder(g);}}/>
              <section className="panel priority-panel">
                <div className="panel-heading">
                  <div>
                    <h3>
                      What needs your attention{" "}
                      <span className="count-light">02</span>
                    </h3>
                    <p>Explainable priorities. Accountable next steps.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => openView("workspace")}
                  >
                    Open workspace <ArrowRight size={14} />
                  </button>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>EMERGING TOPIC</th>
                        <th>STAKEHOLDERS</th>
                        <th>PRIORITY</th>
                        <th>WHAT NEEDS CHECKING</th>
                        <th>NEXT STEP</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {(Object.keys(scenarios) as ScenarioId[])
                        .sort(
                          (a, b) =>
                            scoreRisk(scenarios[b].factors, weights) -
                            scoreRisk(scenarios[a].factors, weights),
                        )
                        .map((id, i) => {
                          const x = scenarios[id];
                          const sc = scoreRisk(
                            {
                              ...x.factors,
                              momentum:
                                id === "water" && incoming
                                  ? 5
                                  : x.factors.momentum,
                            },
                            weights,
                          );
                          return (
                            <tr key={id}>
                              <td>
                                <button
                                  className="topic-button"
                                  onClick={() => {
                                    changeScenario(id);
                                    openView("workspace");
                                    setTab("Analysis");
                                  }}
                                >
                                  <span
                                    className={`topic-symbol ${i ? "gold" : ""}`}
                                  >
                                    {i ? (
                                      <FileText size={18} />
                                    ) : (
                                      <Leaf size={18} />
                                    )}
                                  </span>
                                  <span>
                                    <strong>{x.title}</strong>
                                    <small>{x.region}</small>
                                  </span>
                                </button>
                              </td>
                              <td>
                                <span className="muted">
                                  {id === "water"
                                    ? "Communities, NGOs, media"
                                    : "Policymakers, growers"}
                                </span>
                              </td>
                              <td>
                                <Tag tone={sc >= 75 ? "red" : "amber"}>
                                  {priority(sc)} · {sc}
                                </Tag>
                              </td>
                              <td>
                                <span className="evidence-dot" /> {id === "water" ? "Measurements & product link" : "Crop, product & local rules"}
                              </td>
                              <td>
                                <span className="table-next">
                                  {id === "water"
                                    ? "Verify measurements"
                                    : "Check local applicability"}
                                </span>
                              </td>
                              <td>
                                <button
                                  className="icon-button"
                                  aria-label={`Review ${x.title}`}
                                  onClick={() => {
                                    changeScenario(id);
                                    openView("workspace");
                                  }}
                                >
                                  <ArrowUpRight size={17} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
                <div className="panel-footer">
                  <ShieldCheck size={14} /> Priority is a transparent triage
                  score, not a probability of controversy.
                </div>
              </section>
              <section className="hero dashboard-focus">
                <div className="focus-icon"><Leaf size={24}/></div>
                <div className="hero-copy"><span className="hero-eyebrow">TODAY’S WALKTHROUGH · FICTIONAL CASE</span><h2>{s.headline}</h2><p>{scenario === "residue" ? "Follow Lin’s question from China to Maya’s locally reviewed response plan." : "Follow a community’s water question to an accountable response plan."}</p></div>
                <button className="button white" onClick={()=>{openView("workspace");setTab("Analysis");}}>Explore the risk <ArrowRight size={15}/></button>
              </section>
              <div className="workflow-strip" aria-label="Your next steps"><button onClick={()=>{openView('signals');setLang(scenario === 'residue' ? 'ZH' : 'All languages');setStakeholder('All stakeholders');}}><b>1</b><span>Understand the concern</span><ArrowRight size={14}/></button><button onClick={()=>{openView('workspace');setTab('Recommendations');}}><b>2</b><span>Review the next step</span><ArrowRight size={14}/></button><button onClick={()=>openView('handoff')}><b>3</b><span>Bring in a colleague</span><ArrowRight size={14}/></button></div>
            </>
          )}
          {view === "signals" && (
            <>
              <div className="filter-bar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    aria-label="Search signals"
                    placeholder="Search signals, sources, or original text…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Filter language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                >
                  {["All languages", "EN", "DE", "IT", "ES", "ZH"].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <select
                  aria-label="Filter stakeholder"
                  value={stakeholder}
                  onChange={(e) => setStakeholder(e.target.value)}
                >
                  {[
                    "All stakeholders",
                    "Media",
                    "NGOs",
                    "Communities",
                    "Customers",
                    "Policymakers",
                    "Employees",
                    "Analysts",
                  ].map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
                <button
                  className="button secondary"
                  disabled={incoming}
                  onClick={() => {
                    setIncoming(true);
                    notify(
                      "One synthetic German signal added. Water momentum increased.",
                    );
                  }}
                >
                  <Plus size={15} />
                  {incoming ? "Signal added" : "Simulate new signal"}
                </button>
              </div>
              {Object.keys(drilldown).length > 0 && <div className="active-drilldown"><span>Showing {drilldown.sentiment || drilldown.channel || (drilldown.review === 'reviewed' ? 'human-reviewed' : 'awaiting review')} signals</span><button className="text-button" onClick={()=>setDrilldown({})}>Clear chart filter <X size={13}/></button></div>}
              <div className="section-label">
                {filtered.length} SIGNALS{" "}
                <span>
                  All sources and content are fictional · 22 Oct 2026 scenario
                  clock
                </span>
              </div>
              <div className="signal-grid">
                {filtered.map((x) => (
                  <button
                    className="signal-card"
                    key={x.id}
                    onClick={() => {
                      setSelectedSignal(x);
                      setAnnotation(annotations[x.id] || "");
                    }}
                  >
                    <div className="signal-top">
                      <span className="channel-icon">
                        {x.channel === "News" ? (
                          <FileText size={17} />
                        ) : x.channel === "Social" ? (
                          <MessageSquare size={17} />
                        ) : (
                          <Users size={17} />
                        )}
                      </span>
                      <span>
                        {x.source}
                        <small>
                          {x.channel} · {x.time}
                        </small>
                      </span>
                      <Tag>{x.language}</Tag>
                    </div>
                    <h3>{x.title}</h3>
                    <p className="original-snippet">“{x.original}”</p>
                    <div className="signal-bottom">
                      <Tag
                        tone={
                          x.sentiment === "Concerned"
                            ? "amber"
                            : x.sentiment === "Constructive"
                              ? "green"
                              : "neutral"
                        }
                      >
                        {x.sentiment}
                      </Tag>
                      <span>{x.stakeholder}</span>
                      <ArrowUpRight size={15} />
                    </div>
                    <div className="signal-verified">
                      {verified.includes(x.id) ? (
                        <>
                          <CheckCircle2 size={12} /> Human reviewed in demo
                        </>
                      ) : (
                        <>
                          <Clock size={12} />{" "}
                          {x.verified
                            ? "Source record complete · claim not verified"
                            : "Needs source verification"}
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              {!filtered.length && (
                <div className="empty">
                  <Search />
                  <h3>No signals match these filters.</h3>
                  <button
                    className="text-button"
                    onClick={() => {
                      setQuery("");
                      setLang("All languages");
                      setStakeholder("All stakeholders");
                      setDrilldown({});
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}
          {view === "workspace" && (
            <>
              <div className="scenario-switch">
                <span>ACTIVE SCENARIO</span>
                {(Object.keys(scenarios) as ScenarioId[]).map((id) => (
                  <button
                    key={id}
                    className={id === scenario ? "selected" : ""}
                    onClick={() => changeScenario(id)}
                  >
                    {id === "water" ? (
                      <Leaf size={16} />
                    ) : (
                      <FileText size={16} />
                    )}{" "}
                    {scenarios[id].short}
                  </button>
                ))}
                <Tag tone="amber">Synthetic scenario</Tag>
              </div>
              <section className="case-heading panel">
                <div>
                  <div className="eyebrow">
                    {s.category} <span>·</span> {s.region}
                  </div>
                  <h2>{s.title}</h2>
                  <p>{s.summary}</p>
                  <div className="case-meta">
                    <span>
                      <Users size={14} /> {s.owner} · {role}
                    </span>
                    <span>
                      <Clock size={14} /> Next review: {s.due}
                    </span>
                  </div>
                </div>
                <div className="risk-score">
                  <strong>
                    {risk}
                    <span>/100</span>
                  </strong>
                  <Tag tone={risk >= 75 ? "red" : "amber"}>
                    {priority(risk)} priority
                  </Tag>
                  <small>Heuristic score</small>
                </div>
              </section>
              <div className="workspace-tabs" role="tablist">
                {["Analysis", "Recommendations", "Review & decide"].map(
                  (t, i) => (
                    <button
                      key={t}
                      role="tab"
                      aria-selected={tab === t}
                      className={tab === t ? "selected" : ""}
                      onClick={() => setTab(t)}
                    >
                      <span>0{i + 1}</span>
                      {t}
                    </button>
                  ),
                )}
              </div>
              {tab === "Analysis" && (
                <div className="analysis-grid">
                  <div>
                    <section className="panel padded">
                      <div className="panel-heading">
                        <h3>
                          <Sparkles size={17} /> What the signals suggest
                        </h3>
                        <Tag>Scripted agent perspectives</Tag>
                      </div>
                      <p className="case-narrative">
                        {scenario === "water"
                          ? "The issue is a request for transparency with a growing cross-border audience. Early verification and a local point of contact could help the team respond constructively."
                          : "Lin needs a practical answer for next season. Maya must separate the shared headline from the original proposal, verify local applicability, and coordinate a reply with China regulatory and agronomy colleagues."}
                      </p>
                      <div className="uncertainty">
                        <AlertTriangle size={19} />
                        <div>
                          <strong>What we don’t know yet</strong>
                          <p>{s.uncertainty}</p>
                        </div>
                      </div>
                      <h4 className="mini-title">
                        THREE PERSPECTIVES, ONE HUMAN REVIEW
                      </h4>
                      {s.perspectives.map((p, i) => (
                        <div className="agent-row" key={p.name}>
                          <span className="agent-number">0{i + 1}</span>
                          <div>
                            <div className="agent-title">
                              <h4>{p.name}</h4>
                              <Tag>{p.label}</Tag>
                            </div>
                            <p>{p.observation}</p>
                            <small>
                              <Info size={12} />
                              {p.limit}
                            </small>
                          </div>
                        </div>
                      ))}
                      <div className="inline-note">
                        These perspectives are authored for the demo.
                        Independent agent execution is a pilot extension.
                      </div>
                    </section>
                    <section className="panel padded evidence-list">
                      <div className="panel-heading">
                        <h3>Trace it back to the signal</h3>
                        <span className="muted">
                          {currentSignals.length} sources
                        </span>
                      </div>
                      {currentSignals.slice(0, 3).map((x) => (
                        <button
                          key={x.id}
                          onClick={() => {
                            setSelectedSignal(x);
                            setAnnotation(annotations[x.id] || "");
                          }}
                        >
                          <span className="language-box">{x.language}</span>
                          <div>
                            <strong>{x.title}</strong>
                            <small>{x.source}</small>
                          </div>
                          <ArrowUpRight size={16} />
                        </button>
                      ))}
                      <button
                        className="text-button"
                        onClick={() => openView("signals")}
                      >
                        View all signals <ArrowRight size={14} />
                      </button>
                    </section>
                  </div>
                  <aside>
                    <section className="panel padded">
                      <div className="panel-heading">
                        <h3>
                          <SlidersHorizontal size={17} /> Your risk priorities
                        </h3>
                      </div>
                      <p className="help-text">
                        Adjust what matters. The score updates transparently.
                      </p>
                      {(Object.keys(weights) as (keyof RiskWeights)[]).map(
                        (k) => (
                          <label className="slider-label" key={k}>
                            <span>
                              {k === "relevance"
                                ? "Stakeholder relevance"
                                : k[0].toUpperCase() + k.slice(1)}
                              <b>{weights[k]}%</b>
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              aria-label={`${k} weight`}
                              value={weights[k]}
                              onChange={(e) =>
                                setWeights({ ...weights, [k]: +e.target.value })
                              }
                            />
                            <small>Scenario rating: {factors[k]} / 5</small>
                          </label>
                        ),
                      )}
                      <div className="formula">
                        Score = Σ (rating ÷ 5 × weight) ÷ Σ weights × 100
                        <br />
                        High ≥ 75 · Medium ≥ 50 · Low &lt; 50
                      </div>
                      {Object.values(weights).every((v) => v === 0) && (
                        <p className="error">
                          Set at least one weight above zero.
                        </p>
                      )}
                      <button
                        className="text-button"
                        onClick={() => setWeights(defaultWeights)}
                      >
                        <RotateCcw size={13} /> Restore defaults
                      </button>
                    </section>
                    <section className="human-note">
                      <ShieldCheck size={24} />
                      <h3>Make room for judgment.</h3>
                      <p>
                        Negative sentiment isn’t proof of harm. A quiet
                        community may still face a serious impact. Verify both
                        before deciding.
                      </p>
                    </section>
                    <button
                      className="button primary full"
                      onClick={() => setTab("Recommendations")}
                    >
                      Explore possible actions <ArrowRight size={16} />
                    </button>
                  </aside>
                </div>
              )}
              {tab === "Recommendations" && (
                <div className="analysis-grid">
                  <div>
                    <div className="section-label">
                      OPTIONS FOR HUMAN CONSIDERATION{" "}
                      <span>
                        Scores reflect your preferences, not outcome
                        probabilities.
                      </span>
                    </div>
                    {ranked.map((a, i) => (
                      <section
                        className={`recommendation panel ${i === 0 ? "top-choice" : ""}`}
                        key={a.id}
                      >
                        <div className="recommendation-top">
                          <span className="rank">0{i + 1}</span>
                          <div>
                            <h3>{a.title}</h3>
                            <p>{a.description}</p>
                          </div>
                          <div className="fit-score">
                            {actionScore(a, prefs)}
                            <small>preference fit</small>
                          </div>
                        </div>
                        <div className="tradeoff">
                          <Scale size={16} />
                          <span>
                            <strong>Tradeoff</strong> {a.tradeoff}
                          </span>
                        </div>
                        <div className="action-criteria">
                          Evidence {a.criteria.evidence}/5{" "}
                          <span>Trust {a.criteria.trust}/5</span>Speed{" "}
                          {a.criteria.speed}/5
                        </div>
                        <div className="citations">
                          {a.citations.map((id) => (
                            <button key={id} onClick={() => openSource(id)}>
                              <BookOpen size={12} />
                              {id}{" "}
                              {knowledge.find((d) => d.id === id)?.domain !==
                                role &&
                              knowledge.find((d) => d.id === id)?.domain !==
                                "Shared" ? (
                                <Lock size={11} />
                              ) : (
                                <ArrowUpRight size={11} />
                              )}
                            </button>
                          ))}
                        </div>
                        <div className="recommendation-footer">
                          <span>
                            <Clock size={13} />
                            {a.time}
                          </span>
                          <button
                            className={`button ${i === 0 ? "primary" : "secondary"}`}
                            onClick={() => startDecision(a)}
                          >
                            Review this option <ArrowRight size={14} />
                          </button>
                        </div>
                      </section>
                    ))}
                  </div>
                  <aside>
                    <section className="panel padded">
                      <h3>
                        <SlidersHorizontal size={17} /> What matters in this
                        decision?
                      </h3>
                      <p className="help-text">
                        There is no single “best” action. Re-rank the options
                        using your priorities.
                      </p>
                      {(["evidence", "trust", "speed"] as const).map((k) => (
                        <label className="slider-label" key={k}>
                          <span>
                            {k === "evidence"
                              ? "Evidence quality"
                              : k === "trust"
                                ? "Stakeholder trust"
                                : "Speed of response"}
                            <b>{prefs[k]}</b>
                          </span>
                          <input
                            aria-label={`${k} preference`}
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={prefs[k]}
                            onChange={(e) =>
                              setPrefs({ ...prefs, [k]: +e.target.value })
                            }
                          />
                        </label>
                      ))}
                      <div className="formula">
                        Preference fit = weighted average of the three action
                        ratings (1–5), scaled to 100. Ratings are illustrative.
                      </div>
                    </section>
                    <section className="human-note">
                      <MessageSquare size={24} />
                      <h3>Ask why. Challenge the answer.</h3>
                      <p>
                        Your assistant can retrieve role-specific guidance and
                        show the sources behind it.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => {
                          setCopilot(true);
                        }}
                      >
                        Discuss with RepRadar <ArrowRight size={14} />
                      </button>
                    </section>
                  </aside>
                </div>
              )}
              {tab === "Review & decide" && (
                <section className="panel review-intro">
                  <div className="large-shield">
                    <ShieldCheck size={38} />
                  </div>
                  <div>
                    <div className="eyebrow">YOU OWN THE NEXT STEP</div>
                    <h2>Turn a recommendation into an accountable decision.</h2>
                    <p>
                      Select an option to edit the action, approve, reject or
                      defer it. Record your reasoning and a responsible owner.
                      Nothing is published or sent from this demo.
                    </p>
                    <div className="review-options">
                      {ranked.map((a) => (
                        <button key={a.id} onClick={() => startDecision(a)}>
                          <span>{a.title}</span>
                          <ArrowRight size={18} />
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
          {view === "knowledge" && (
            <>
              <div className="knowledge-banner">
                <BookOpen size={32} />
                <div>
                  <h3>Context for {role.toLowerCase()}.</h3>
                  <p>
                    Role-based retrieval over demo playbooks, historical cases,
                    and human-reviewed lessons. No training required.
                  </p>
                </div>
                <Tag tone="green">
                  {accessibleDocs.length} accessible documents
                </Tag>
              </div>
              <div className="filter-bar">
                <div className="search-box">
                  <Search size={17} />
                  <input
                    aria-label="Search knowledge"
                    placeholder="Search your knowledge collection…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <select
                  aria-label="Knowledge scenario"
                  value={scenario}
                  onChange={(e) => changeScenario(e.target.value as ScenarioId)}
                >
                  {Object.entries(scenarios).map(([id, x]) => (
                    <option value={id} key={id}>
                      {x.short}
                    </option>
                  ))}
                </select>
              </div>
              <div className="knowledge-grid">
                {docs.map((d) => (
                  <button
                    key={d.id}
                    className="panel knowledge-card"
                    onClick={() => setSelectedDoc(d)}
                  >
                    <div className="knowledge-card-top">
                      <span className="doc-icon">
                        <FileText size={23} />
                      </span>
                      <Tag tone={d.domain === "Shared" ? "neutral" : "green"}>
                        {d.domain === "Shared" ? "Shared guidance" : d.domain}
                      </Tag>
                    </div>
                    <small>{d.type.toUpperCase()}</small>
                    <h3>{d.title}</h3>
                    <p>{d.text.slice(0, 145)}…</p>
                    <div className="knowledge-card-bottom">
                      <span>
                        {d.id} · v{d.version.split(" · ")[0]}
                      </span>
                      <ArrowUpRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
              {!docs.length && (
                <div className="empty">
                  <BookOpen />
                  <h3>No documents match your search.</h3>
                </div>
              )}
              <div className="info-line">
                <Lock size={15} /> Role switching demonstrates domain relevance.
                Production access needs SSO and server-side document
                permissions. All included playbooks are synthetic.
              </div>
            </>
          )}
          {view === "decisions" && (
            <>
              <div className="decision-summary">
                <div>
                  <CheckCheck size={22} />
                  <span>
                    <strong>{decisions.length}</strong> recorded decisions
                  </span>
                </div>
                <div>
                  <GitBranch size={22} />
                  <span>
                    <strong>
                      {decisions.filter((d) => d.promoted).length}
                    </strong>{" "}
                    reviewed lessons in retrieval
                  </span>
                </div>
                <button
                  className="button secondary"
                  disabled={!decisions.length}
                  onClick={() =>
                    exportFile(
                      { prototype: true, synthetic: true, decisions },
                      "RepRadar-decision-log.json",
                    )
                  }
                >
                  <Download size={15} /> Export log
                </button>
              </div>
              {!decisions.length ? (
                <div className="panel empty tall">
                  <ClipboardCheck size={42} />
                  <h2>Your judgment belongs in the record.</h2>
                  <p>
                    Review a recommendation to record your decision, reasoning,
                    and next owner.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => {
                      openView("workspace");
                      setTab("Recommendations");
                    }}
                  >
                    Review an action <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <div className="decision-list">
                  {decisions.map((d) => (
                    <section className="panel decision-card" key={d.id}>
                      <div className="decision-card-heading">
                        <Tag
                          tone={
                            d.outcome === "Approved"
                              ? "green"
                              : d.outcome === "Rejected"
                                ? "red"
                                : "amber"
                          }
                        >
                          {d.outcome}
                        </Tag>
                        <span>
                          {new Date(d.createdAt).toLocaleString("en-GB", {
                            timeZone: "Europe/Zurich",
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}{" "}
                          · Zurich
                        </span>
                        <span className="decision-id">#{d.id}</span>
                      </div>
                      <h3>{d.action}</h3>
                      <div className="decision-context">
                        {scenarios[d.scenario].short} · {d.owner} · {d.role}
                      </div>
                      <blockquote>{d.rationale}</blockquote>
                      {d.lesson && (
                        <div className="saved-lesson">
                          <GitBranch size={16} />
                          <p>
                            <strong>
                              {d.promoted
                                ? "Approved for future retrieval"
                                : "Lesson awaiting curator review"}
                            </strong>
                            {d.lesson}
                          </p>
                        </div>
                      )}
                      <div className="decision-card-footer"><button className="button secondary" onClick={()=>{changeScenario(d.scenario);openView("handoff");}}><Mail size={15}/> Prepare team handoff</button>
                        <span>
                          <ShieldCheck size={14} /> Evidence limitations
                          acknowledged
                        </span>
                        {!d.lesson ? (
                          <button
                            className="button secondary"
                            onClick={() => {
                              setLessonTarget(d);
                              setLesson("");
                            }}
                          >
                            Record a lesson <Plus size={14} />
                          </button>
                        ) : !d.promoted ? (
                          <button
                            className="button secondary"
                            onClick={() => {
                              setDecisions((ds) =>
                                ds.map((x) =>
                                  x.id === d.id ? { ...x, promoted: true } : x,
                                ),
                              );
                              notify(
                                "Curator review recorded. Lesson now available in offline role-specific retrieval.",
                              );
                            }}
                          >
                            <CheckCircle2 size={14} /> Approve lesson for
                            retrieval
                          </button>
                        ) : (
                          <Tag tone="green">In knowledge collection</Tag>
                        )}
                      </div>
                    </section>
                  ))}
                </div>
              )}
              <section className="learning-explainer">
                <GitBranch size={22} />
                <div>
                  <h3>Learning with oversight</h3>
                  <p>
                    Decision → outcome reflection → curator review → knowledge
                    update. Approved lessons enrich offline retrieval for the
                    same role and scenario. No automatic retraining.
                    Browser-local history is a demo record, not a secure
                    enterprise audit log.
                  </p>
                </div>
              </section>
            </>
          )}
          <footer className="main-footer">
            <span>
              <Leaf size={13} /> RepRadar · Listen closely. Decide confidently.
            </span>
            <button onClick={() => setAbout(true)}>
              Synthetic data · Human review required <ArrowUpRight size={12} />
            </button>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
      {copilot && (
        <div className="drawer-backdrop" onMouseDown={() => setCopilot(false)}>
          <section
            className="copilot drawer"
            role="dialog"
            aria-modal="true"
            aria-label="RepRadar knowledge assistant"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div className="copilot-title">
                <span className="copilot-icon">
                  <Sparkles size={22} />
                </span>
                <div>
                  <h2>Ask RepRadar</h2>
                  <p>Your context. A clearer next step.</p>
                </div>
              </div>
              <button
                className="icon-button"
                aria-label="Close assistant"
                onClick={() => setCopilot(false)}
              >
                <X size={21} />
              </button>
            </div>
            <div className="copilot-context">
              <Tag tone="green">{role}</Tag>
              <span>{s.short}</span>
            </div>
            <div className="assistant-mode">
              <span className="live-dot" />
              {live
                ? `${health.model || "Connected model"} · ready`
                : "Knowledge search · model offline"}
              <button className="text-button" aria-label="Refresh model connection" disabled={checkingModel} onClick={checkConnection}><RotateCcw size={13} className={checkingModel?"spin":""}/></button>
              <button className="text-button" disabled={!messages.length || sending} onClick={() => {setMessages([]);notify("Conversation cleared.");}}>
                Clear
              </button>
            </div>
            <div className="chat-messages" aria-live="polite">
              {!messages.length && (
                <div className="chat-welcome">
                  <div className="large-shield">
                    <BookOpen size={30} />
                  </div>
                  <h3>
                    What would help you right now?
                  </h3>
                  <p>
                    {live
                      ? "Ask in your own words. I can explain this case, compare actions or help you write a draft. English and Chinese are welcome."
                      : "I can search your role’s knowledge. The model is not ready yet; check the connection in Team handoff."}
                  </p>
                  <div className="suggested-prompts">
                    {[
                      "Summarize this case in plain English",
                      "What should we do next?",
                      "Draft an internal email to the local team",
                      "请用中文解释这个案例和下一步建议",
                    ].map((q) => (
                      <button key={q} onClick={() => ask(q)}>
                        {q}
                        <ArrowUpRight size={14} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`chat-message ${m.role}`}>
                  <span className="message-label">
                    {m.role === "user"
                      ? "YOU"
                      : m.mode === "llm"
                        ? "REPRADAR · LLM DRAFT"
                        : m.mode === "help" ? "REPRADAR" : "REPRADAR · SOURCE GUIDANCE"}
                  </span>
                  <div className="message-text">{m.text}</div>{m.suggestions&&<div className="suggested-prompts compact-prompts">{m.suggestions.map(q=><button key={q} disabled={sending} onClick={()=>ask(q)}>{q}<ArrowUpRight size={13}/></button>)}</div>}
                  {m.notice && <div className="inline-note">{m.notice}</div>}
                  {m.mode === "llm" && m.sources && m.sources.length > 0 && (
                    <div className="inline-note evidence-boundary">
                      <strong>What still needs verification</strong>
                      <p>{s.uncertainty}</p>
                    </div>
                  )}
                  {m.sources && m.sources.length > 0 && (
                    <div className="chat-sources">
                      <strong>Sources you can inspect</strong>
                      {m.sources.map((d) => (
                        <button key={d.id} onClick={() => setSelectedDoc(d)}>
                          <FileText size={13} />
                          <span>
                            {d.id} · {d.title}
                          </span>
                          <ArrowUpRight size={13} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {sending && (
                <div className="thinking">
                  <span />
                  <span />
                  <span />
                  Checking your context and preparing an answer…
                </div>
              )}
              <div ref={chatEnd} />
            </div>
            <form
              className="chat-composer"
              onSubmit={(e) => {
                e.preventDefault();
                ask();
              }}
            >
              <div>
                <textarea
                  aria-label="Ask a question"
                  placeholder="Ask about evidence, options, or next steps…"
                  value={question}
                  maxLength={2000}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask();
                    }
                  }}
                />
                <button
                  className="send-button"
                  aria-label="Send question"
                  disabled={sending || !question.trim()}
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
              <small>
                <ShieldCheck size={12} /> Guidance supports your judgment.
                Review before use.
              </small>
            </form>
          </section>
        </div>
      )}
      {selectedSignal && (
        <Modal title="Signal detail" close={() => setSelectedSignal(null)}>
          <div className="modal-tags">
            <Tag>{selectedSignal.id}</Tag>
            <Tag>{selectedSignal.language}</Tag>
            <Tag tone="amber">Synthetic source</Tag>
          </div>
          <h2>{selectedSignal.title}</h2>
          <p className="muted">
            {selectedSignal.source} · {selectedSignal.channel} ·{" "}
            {selectedSignal.region} · {selectedSignal.time}
          </p>
          <div className="text-block">
            <span>ORIGINAL TEXT</span>
            <p lang={selectedSignal.language.toLowerCase()}>
              {selectedSignal.original}
            </p>
          </div>
          <div className="text-block translation">
            <span>ENGLISH WORKING TRANSLATION</span>
            <p>{selectedSignal.translation}</p>
          </div>
          <div className="uncertainty">
            <Info size={18} />
            <p>
              Translations and sentiment labels are authored demo annotations. A
              local reviewer should check meaning and tone. Source completeness
              does not verify the underlying claim.
            </p>
          </div>
          <label className="field-label">
            Your context or correction
            <textarea
              value={annotation}
              onChange={(e) => setAnnotation(e.target.value)}
              placeholder="Capture missing context, a translation correction, or a question for the local team."
            />
          </label>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => {
                setAnnotations((a) => ({
                  ...a,
                  [selectedSignal.id]: annotation,
                }));
                notify("Your context note is saved.");
              }}
            >
              Save context note
            </button>
            <button
              className="button primary"
              onClick={() => {
                if (!annotation.trim()) {
                  notify(
                    "Add a review note explaining what you checked first.",
                  );
                  return;
                }
                setVerified((v) => [...new Set([...v, selectedSignal.id])]);
                setAnnotations((a) => ({
                  ...a,
                  [selectedSignal.id]: annotation,
                }));
                notify(
                  "Human review and note recorded. The underlying claim remains unverified.",
                );
                setSelectedSignal(null);
              }}
            >
              <Check size={16} /> Mark reviewed
            </button>
          </div>
        </Modal>
      )}
      {selectedDoc && (
        <Modal title="Knowledge source" close={() => setSelectedDoc(null)}>
          <div className="modal-tags">
            <Tag tone="green">{selectedDoc.domain}</Tag>
            <Tag>{selectedDoc.id}</Tag>
            <Tag tone="amber">{selectedDoc.type}</Tag>
          </div>
          <h2>{selectedDoc.title}</h2>
          <p className="muted">
            {selectedDoc.owner} · Version {selectedDoc.version}
          </p>
          <div className="document-body">{selectedDoc.text}</div>
          <div className="info-line">
            <Info size={16} /> This is authored demo guidance, not an official
            Syngenta policy or legal source.
          </div>
          <button
            className="button secondary"
            onClick={() => {
              setSelectedDoc(null);
              setCopilot(true);
              setQuestion(`Explain the guidance in ${selectedDoc.title}`);
            }}
          >
            Discuss this context <MessageSquare size={15} />
          </button>
        </Modal>
      )}
      {decisionAction && (
        <Modal
          title="Human review & decision"
          close={() => setDecisionAction(null)}
        >
          <Tag tone="green">
            {role} · {s.short}
          </Tag>
          <h2>You decide what happens next.</h2>
          <label className="field-label">
            Edit the proposed action
            <textarea
              aria-label="Proposed action"
              value={decisionAction.title}
              onChange={(e) =>
                setDecisionAction({ ...decisionAction, title: e.target.value })
              }
            />
          </label>
          <div className="decision-buttons">
            {(["Approved", "Rejected", "Deferred"] as const).map((o) => (
              <button
                key={o}
                className={outcome === o ? "selected" : ""}
                onClick={() => setOutcome(o)}
              >
                {o === "Approved" ? (
                  <Check size={16} />
                ) : o === "Rejected" ? (
                  <X size={16} />
                ) : (
                  <Clock size={16} />
                )}{" "}
                {o === "Approved"
                  ? "Approve"
                  : o === "Rejected"
                    ? "Reject"
                    : "Defer"}
              </button>
            ))}
          </div>
          <label className="field-label">
            Accountable owner
            <input
              aria-label="Accountable owner"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            />
          </label>
          <label className="field-label">
            Your rationale <span className="required">Required</span>
            <textarea
              aria-label="Decision rationale"
              value={rationale}
              onChange={(e) => {
                setRationale(e.target.value);
                setFormError("");
              }}
              placeholder="Why this action? What did you change? What evidence or stakeholder perspective influenced you?"
            />
          </label>
          <label className="acknowledge">
            <input
              type="checkbox"
              checked={ack}
              onChange={(e) => {
                setAck(e.target.checked);
                setFormError("");
              }}
            />
            <span>
              I reviewed the evidence limitations. This records my decision in
              the demo; it does not publish or send a response.
            </span>
          </label>
          {formError && (
            <p role="alert" className="error">
              {formError}
            </p>
          )}
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() => setDecisionAction(null)}
            >
              Keep reviewing
            </button>
            <button
              className="button primary"
              disabled={!decisionAction.title.trim()}
              onClick={saveDecision}
            >
              <ShieldCheck size={16} /> Record decision
            </button>
          </div>
        </Modal>
      )}
      {lessonTarget && (
        <Modal title="Outcome reflection" close={() => setLessonTarget(null)}>
          <Tag>{scenarios[lessonTarget.scenario].short}</Tag>
          <h2>What should the next team know?</h2>
          <p className="muted">
            Record an observed outcome or a useful correction. Mark hypotheses
            clearly. A separate curator review is required before future
            retrieval.
          </p>
          <label className="field-label">
            Lesson from this decision
            <textarea
              aria-label="Decision lesson"
              placeholder="For this synthetic case, we learned…"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
            />
          </label>
          <div className="modal-actions">
            <button
              className="button primary"
              disabled={!lesson.trim()}
              onClick={() => {
                setDecisions((ds) =>
                  ds.map((d) =>
                    d.id === lessonTarget.id
                      ? { ...d, lesson: lesson.trim(), promoted: false }
                      : d,
                  ),
                );
                setLessonTarget(null);
                notify("Lesson saved. Awaiting explicit curator review.");
              }}
            >
              Save for curator review <ArrowRight size={15} />
            </button>
          </div>
        </Modal>
      )}
      {guide && (
        <Modal title="Your two-minute live demo" close={() => setGuide(false)}>
          <div className="eyebrow">MEET MAYA · CORPORATE AFFAIRS</div>
          <h2>One farmer’s question. One accountable next step.</h2>
          <p className="muted">
            At 08:12, Maya sees a question from Lin, a fictional farmer in
            China. A European policy headline has left him unsure about next
            season. Follow the question through to a locally reviewed response
            plan.
          </p>
          <div className="demo-steps">
            {[
              {
                title: "Listen to the original voices",
                text: "Open Chinese signal SIG-012. Read Lin’s original question and translation. Capture the need for practical local guidance.",
                view: "signals" as View,
              },
              {
                title: "Interpret the risk transparently",
                text: "Check the headline against the proposal. Keep China product and crop applicability unresolved until local experts review it.",
                view: "workspace" as View,
              },
              {
                title: "Choose with your own priorities",
                text: "Compare response options. Ask role-specific sources what Maya and the local regulatory team need to verify.",
                view: "workspace" as View,
              },
              {
                title: "Decide, then learn responsibly",
                text: "Record a China response owner, a reason and an update time. Only add a lesson after reflecting on the outcome and reviewing it.",
                view: "decisions" as View,
              },
            ].map((st, i) => (
              <button
                key={st.title}
                onClick={() => {
                  changeScenario("residue");
                  openView(st.view);
                  if (st.view === "workspace")
                    setTab(i === 2 ? "Recommendations" : "Analysis");
                  setGuide(false);
                }}
              >
                <span>0{i + 1}</span>
                <div>
                  <strong>{st.title}</strong>
                  <p>{st.text}</p>
                </div>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
          <div className="modal-actions">
            <button
              className="button primary"
              onClick={() => {
                changeScenario("residue");
                openView("signals");
                setLang("ZH");
                setGuide(false);
              }}
            >
              Start with the signals <Play size={15} />
            </button>
          </div>
        </Modal>
      )}
      {about && (
        <Modal title="About this prototype" close={() => setAbout(false)}>
          <Brand />
          <h2>Human-centered by design.</h2>
          <p>
            RepRadar is a hackathon concept for the Syngenta Corporate Affairs
            challenge. It is not an official Syngenta product. All incidents,
            sources, role playbooks and scoring values in the demo are
            synthetic.
          </p>
          <div className="about-points">
            <div>
              <ShieldCheck />
              <strong>People retain agency</strong>
              <p>
                Inspect sources, amend actions, reject suggestions, and record
                your reasoning.
              </p>
            </div>
            <div>
              <Globe2 />
              <strong>Context over stereotypes</strong>
              <p>
                Original language stays visible. Local review and missing voices
                matter.
              </p>
            </div>
            <div>
              <Lock />
              <strong>Privacy with clear boundaries</strong>
              <p>
                Browser-local demo data. No SSO or production access control.
                Enabling a cloud LLM sends your question and synthetic context
                to the configured provider.
              </p>
            </div>
            <div>
              <GitBranch />
              <strong>Controlled improvement</strong>
              <p>
                Lessons enter offline retrieval only after explicit review.
                Production needs independent curation, evaluation and retention
                controls.
              </p>
            </div>
          </div>
          <div className="modal-actions">
            <button
              className="button secondary"
              onClick={() =>
                exportFile(
                  { decisions, annotations, verified },
                  "RepRadar-backup.json",
                )
              }
            >
              <Download size={14} /> Back up demo history
            </button>
            <button className="button danger" onClick={reset}>
              <RotateCcw size={14} /> Reset demo history
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Modal({
  title,
  close,
  children,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab") {
        const els = ref.current?.querySelectorAll<HTMLElement>(
          'button, input, textarea, select, [tabindex="0"]',
        );
        if (!els?.length) return;
        const first = els[0],
          last = els[els.length - 1];
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      previous?.focus();
    };
  }, []);
  return (
    <div className="modal-backdrop" onMouseDown={close}>
      <div
        className="modal"
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <span>{title}</span>
          <button
            className="icon-button"
            aria-label={`Close ${title}`}
            onClick={close}
          >
            <X size={21} />
          </button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
