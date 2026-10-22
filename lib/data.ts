export const roles = [
  "Communications",
  "Regulatory Affairs",
  "Sustainability",
  "Leadership",
] as const;
export type Role = (typeof roles)[number];
export type ScenarioId = "water" | "residue";
export type Signal = {
  id: string;
  scenario: ScenarioId;
  title: string;
  original: string;
  translation: string;
  language: string;
  region: string;
  source: string;
  stakeholder: string;
  sentiment: "Concerned" | "Neutral" | "Constructive";
  time: string;
  verified: boolean;
  channel: string;
  weight: number;
};
export type KnowledgeDoc = {
  id: string;
  title: string;
  domain: Role | "Shared";
  scenario: ScenarioId | "all";
  text: string;
  owner: string;
  version: string;
  type: string;
  tags: string[];
  synthetic: boolean;
};
export type RiskWeights = {
  impact: number;
  urgency: number;
  momentum: number;
  relevance: number;
};
export const defaultWeights: RiskWeights = {
  impact: 35,
  urgency: 25,
  momentum: 20,
  relevance: 20,
};
export const scenarios = {
  water: {
    id: "water" as const,
    title: "Water stewardship concerns",
    short: "Water stewardship",
    region: "Switzerland · DACH",
    headline: "A local water concern is crossing borders.",
    summary:
      "A fictional community group asks for water monitoring data. News coverage and discussion in German and Italian create a growing need for a clear, locally reviewed response.",
    category: "Environment & community trust",
    owner: "Maya Keller",
    role: "Communications lead",
    due: "Today, 14:00",
    factors: { impact: 4, urgency: 5, momentum: 4, relevance: 4 },
    uncertainty:
      "No independent test results establish a product link. Repeated posts may reflect the same original claim.",
    perspectives: [
      {
        name: "Media & reputation",
        label: "EN / DE",
        observation:
          "Requests for transparency are spreading across channels. Prepare a holding statement that acknowledges the questions without asserting causation.",
        limit: "Media volume does not establish environmental harm.",
      },
      {
        name: "Regulatory context",
        label: "CH / EU",
        observation:
          "Confirm the location, substance and applicable authority before interpreting any threshold or obligation.",
        limit:
          "No verified test report or applicable legal threshold is in the demo evidence.",
      },
      {
        name: "Community & language",
        label: "DE / IT",
        observation:
          "The German signal asks for measurements. The Italian signal asks for a dialogue. Preserve those different requests in the response.",
        limit: "These observations concern these texts, not entire cultures.",
      },
    ],
  },
  residue: {
    id: "residue" as const,
    title: "Proposed residue standard review",
    short: "Residue consultation",
    region: "Europe · China",
    headline: "A farmer’s question needs a locally checked answer.",
    summary:
      "Lin, a fictional farmer in China, sees a headline about a European residue proposal and asks about next season. Maya must check the source and local applicability with regulatory and agronomy colleagues before approving a reply.",
    category: "Policy & market access",
    owner: "Maya Keller",
    role: "Communications lead",
    due: "Today, 14:00 · Zurich",
    factors: { impact: 5, urgency: 3, momentum: 3, relevance: 4 },
    uncertainty:
      "The proposal, headline and farmer are fictional. A European proposal does not establish a restriction in China. Product, crop, market and local applicability remain unverified.",
    perspectives: [
      {
        name: "Media & reputation",
        label: "EN / ES",
        observation:
          "Some posts collapse a proposed consultation into an immediate prohibition. Explain the stage and avoid amplifying an unverified ban claim.",
        limit: "The reach and trend are synthetic demo assumptions.",
      },
      {
        name: "Regulatory context",
        label: "EU / CN",
        observation:
          "Verify the authority, draft status, crop, product and market. Route Lin’s question to China Regulatory Affairs and agronomy colleagues; do not infer local restrictions from a European headline.",
        limit: "Product applicability has not been established.",
      },
      {
        name: "Grower & language",
        label: "ES / ZH",
        observation:
          "Lin’s Chinese message asks for practical planning help, not just a translation of the headline. A local colleague must clarify his crop and product context before offering guidance.",
        limit:
          "A small sample cannot represent all growers or a language community.",
      },
    ],
  },
};
export const signals: Signal[] = [
  {
    id: "SIG-001",
    scenario: "water",
    title: "Community group asks for river monitoring data",
    original:
      "Wir wünschen uns transparente Messdaten zur Wasserqualität und eine unabhängige Prüfung.",
    translation:
      "We would like transparent water quality measurements and an independent review.",
    language: "DE",
    region: "Switzerland",
    source: "Riverwatch Forum (fictional)",
    stakeholder: "NGOs",
    sentiment: "Concerned",
    time: "08:12",
    verified: false,
    channel: "Community forum",
    weight: 24,
  },
  {
    id: "SIG-002",
    scenario: "water",
    title: "Local coverage picks up community questions",
    original:
      "Residents ask an agricultural supplier to clarify how local water quality is monitored.",
    translation:
      "Residents ask an agricultural supplier to clarify how local water quality is monitored.",
    language: "EN",
    region: "Switzerland",
    source: "Agri Newsroom (fictional)",
    stakeholder: "Media",
    sentiment: "Neutral",
    time: "08:28",
    verified: false,
    channel: "News",
    weight: 19,
  },
  {
    id: "SIG-003",
    scenario: "water",
    title: "Residents request a dialogue, not a generic statement",
    original:
      "Vorremmo un incontro con gli esperti e dati comprensibili sulla qualità dell’acqua.",
    translation:
      "We would like a meeting with experts and understandable data on water quality.",
    language: "IT",
    region: "Switzerland",
    source: "Community Circle (fictional)",
    stakeholder: "Communities",
    sentiment: "Constructive",
    time: "08:41",
    verified: false,
    channel: "Community forum",
    weight: 16,
  },
  {
    id: "SIG-004",
    scenario: "water",
    title: "Staff need a consistent source of environmental facts",
    original:
      "Which environmental data can our team use when answering questions from the public?",
    translation:
      "Which environmental data can our team use when answering questions from the public?",
    language: "EN",
    region: "Switzerland",
    source: "Aggregated employee pulse (fictional)",
    stakeholder: "Employees",
    sentiment: "Neutral",
    time: "08:53",
    verified: true,
    channel: "Aggregated feedback",
    weight: 8,
  },
  {
    id: "SIG-005",
    scenario: "water",
    title: "Growers ask how to respond to customer questions",
    original:
      "Wie können wir Kundenfragen beantworten, ohne unbestätigte Aussagen zu wiederholen?",
    translation:
      "How can we answer customer questions without repeating unverified claims?",
    language: "DE",
    region: "Germany",
    source: "Grower Exchange (fictional)",
    stakeholder: "Customers",
    sentiment: "Concerned",
    time: "09:04",
    verified: false,
    channel: "Social",
    weight: 12,
  },
  {
    id: "SIG-006",
    scenario: "water",
    title: "Policy observer asks for evidence behind claims",
    original:
      "A discussion of monitoring methods is needed before drawing conclusions about any product.",
    translation:
      "A discussion of monitoring methods is needed before drawing conclusions about any product.",
    language: "EN",
    region: "Europe",
    source: "Policy Observer (fictional)",
    stakeholder: "Policymakers",
    sentiment: "Neutral",
    time: "09:18",
    verified: false,
    channel: "Policy bulletin",
    weight: 7,
  },
  {
    id: "SIG-007",
    scenario: "water",
    title: "Analyst flags a possible transparency gap",
    original:
      "The conversation could affect trust if the company cannot explain its evidence and next steps.",
    translation:
      "The conversation could affect trust if the company cannot explain its evidence and next steps.",
    language: "EN",
    region: "Europe",
    source: "Agri Outlook (fictional)",
    stakeholder: "Analysts",
    sentiment: "Concerned",
    time: "09:32",
    verified: false,
    channel: "Industry report",
    weight: 5,
  },
  {
    id: "SIG-008",
    scenario: "water",
    title: "Regional news repeats the original claim",
    original:
      "Eine lokale Initiative fordert mehr Informationen zur Wasserqualität.",
    translation:
      "A local initiative is asking for more information about water quality.",
    language: "DE",
    region: "Germany",
    source: "Regional Digest (fictional)",
    stakeholder: "Media",
    sentiment: "Neutral",
    time: "09:47",
    verified: false,
    channel: "News",
    weight: 9,
  },
  {
    id: "SIG-009",
    scenario: "residue",
    title: "Draft consultation prompts questions on residue limits",
    original:
      "A draft consultation invites feedback on proposed crop residue limits. The proposal is not a final rule.",
    translation:
      "A draft consultation invites feedback on proposed crop residue limits. The proposal is not a final rule.",
    language: "EN",
    region: "Europe",
    source: "Policy Bulletin (fictional)",
    stakeholder: "Policymakers",
    sentiment: "Neutral",
    time: "08:06",
    verified: false,
    channel: "Policy bulletin",
    weight: 20,
  },
  {
    id: "SIG-010",
    scenario: "residue",
    title: "Growers seek clarity for next season",
    original:
      "¿La propuesta cambia lo que podemos usar la próxima temporada? Necesitamos una explicación clara.",
    translation:
      "Does the proposal change what we can use next season? We need a clear explanation.",
    language: "ES",
    region: "Spain",
    source: "Grower Network (fictional)",
    stakeholder: "Customers",
    sentiment: "Concerned",
    time: "08:31",
    verified: false,
    channel: "Social",
    weight: 16,
  },
  {
    id: "SIG-011",
    scenario: "residue",
    title: "Reposted headline implies an immediate ban",
    original:
      "New limits mean products are banned now, says a widely shared but unverified post.",
    translation:
      "New limits mean products are banned now, says a widely shared but unverified post.",
    language: "EN",
    region: "Europe",
    source: "Social Monitor (fictional)",
    stakeholder: "Media",
    sentiment: "Concerned",
    time: "07:50",
    verified: false,
    channel: "Social",
    weight: 23,
  },
  {
    id: "SIG-012",
    scenario: "residue",
    title: "Farmer in China asks what the headline means for next season",
    original:
      "我看到一条关于欧洲农残新规的消息，说有些产品已经禁用了。我在中国种植，下个种植季需要改变现在的方案吗？能请当地的技术人员帮我确认吗？",
    translation:
      "I saw a headline about European residue rules saying some products are already banned. I grow crops in China. Do I need to change my plans for next season? Could a local technical adviser help me check?",
    language: "ZH",
    region: "China",
    source: "Grower Question Forum (fictional)",
    stakeholder: "Customers",
    sentiment: "Concerned",
    time: "08:12",
    verified: false,
    channel: "Public grower forum",
    weight: 12,
  },
  {
    id: "SIG-013",
    scenario: "residue",
    title: "Internal team requests a product applicability check",
    original:
      "A grower in China is asking about next season. Please check the original proposal and local product applicability before we promise an answer.",
    translation:
      "A grower in China is asking about next season. Please check the original proposal and local product applicability before we promise an answer.",
    language: "EN",
    region: "Europe",
    source: "Aggregated team notes (fictional)",
    stakeholder: "Employees",
    sentiment: "Constructive",
    time: "09:20",
    verified: true,
    channel: "Aggregated feedback",
    weight: 8,
  },
  {
    id: "SIG-014",
    scenario: "residue",
    title: "NGO asks for a transparent consultation response",
    original:
      "Pedimos que se publiquen las fuentes científicas y se escuche a las comunidades afectadas.",
    translation:
      "We ask that scientific sources be published and affected communities be heard.",
    language: "ES",
    region: "Spain",
    source: "Food Futures Forum (fictional)",
    stakeholder: "NGOs",
    sentiment: "Constructive",
    time: "09:36",
    verified: false,
    channel: "NGO briefing",
    weight: 11,
  },
];
export const incomingSignal: Signal = {
  id: "SIG-015",
  scenario: "water",
  title: "New cross-border coverage increases urgency",
  original:
    "Anwohner in zwei Regionen bitten um eine gemeinsame Informationsveranstaltung.",
  translation:
    "Residents in two regions are asking for a joint information meeting.",
  language: "DE",
  region: "Germany",
  source: "Regional Wire (fictional)",
  stakeholder: "Communities",
  sentiment: "Concerned",
  time: "10:02",
  verified: false,
  channel: "News",
  weight: 10,
};
export const knowledge: KnowledgeDoc[] = [
  {
    id: "KB-01",
    title: "Holding statement & evidence checklist",
    domain: "Communications",
    scenario: "water",
    owner: "Corporate Communications",
    version: "1.2 · 20 Oct 2026",
    type: "Demo playbook",
    synthetic: true,
    tags: ["water", "statement", "response", "media", "draft"],
    text: "Acknowledge the community’s questions about water quality. State what is known and what remains unverified. Do not imply causation or product safety without reviewed evidence. Ask the environmental and regulatory teams to verify the cited measurements. Offer a named contact and a specific next update. A local communications lead and a technical expert must review any external statement.",
  },
  {
    id: "KB-02",
    title: "Consultation communication guide",
    domain: "Communications",
    scenario: "residue",
    owner: "Corporate Communications",
    version: "1.0 · 18 Oct 2026",
    type: "Demo playbook",
    synthetic: true,
    tags: ["residue", "proposal", "ban", "statement", "grower"],
    text: "The fictional European residue consultation is at the proposal stage. China's applicable legal status is unknown in these materials: do not claim either that a restriction applies or that none applies. Confirm the original source before correcting a headline. Ask Regulatory Affairs to check product and local market applicability. For Lin’s fictional question from China, assign a China colleague and a callback time. Route agronomic guidance to a qualified local adviser. Prepare a plain-language FAQ that answers growers’ seasonal planning questions without making unsupported legal assurances. Obtain human approval before publishing.",
  },
  {
    id: "KB-03",
    title: "Water evidence verification protocol",
    domain: "Regulatory Affairs",
    scenario: "water",
    owner: "Product Safety & Regulatory",
    version: "2.0 · 19 Oct 2026",
    type: "Demo protocol",
    synthetic: true,
    tags: ["water", "evidence", "laboratory", "threshold", "verify"],
    text: "Request the original laboratory report, sampling location, date, method, detection limits and chain of custody. Confirm the substance and product link. Separate a detected substance from a demonstrated exposure or causal claim. A qualified local expert must identify the applicable authority and legal framework. No legal threshold is supplied in this demo.",
  },
  {
    id: "KB-04",
    title: "Residue consultation triage",
    domain: "Regulatory Affairs",
    scenario: "residue",
    owner: "Regional Regulatory Affairs",
    version: "1.1 · 20 Oct 2026",
    type: "Demo protocol",
    synthetic: true,
    tags: ["residue", "policy", "consultation", "deadline", "product", "ban"],
    text: "Verify the authority, draft text, consultation deadline and legal status. Map the proposed residue change to crops, markets and product labels. Do not infer restrictions in China from a European proposal. Confirm Lin’s crop, product and local context with China Regulatory Affairs and qualified agronomy colleagues. Prepare an impact register and route questions to regional regulatory specialists. Track the consultation separately from any adopted rule. This synthetic protocol contains no real legal advice or current residue limits.",
  },
  {
    id: "KB-05",
    title: "Community dialogue & water stewardship",
    domain: "Sustainability",
    scenario: "water",
    owner: "Sustainability & Community Relations",
    version: "1.3 · 19 Oct 2026",
    type: "Demo playbook",
    synthetic: true,
    tags: ["water", "community", "dialogue", "environment", "listening"],
    text: "Invite affected residents to explain their questions and preferred format for updates. Include independent expertise where feasible. Discuss the limitations of available monitoring data openly. Offer a locally reviewed explanation and record unanswered questions. Low social reach must never remove a potentially affected community from the review.",
  },
  {
    id: "KB-06",
    title: "Grower and community consultation plan",
    domain: "Sustainability",
    scenario: "residue",
    owner: "Sustainability",
    version: "1.0 · 18 Oct 2026",
    type: "Demo playbook",
    synthetic: true,
    tags: ["residue", "grower", "consultation", "community"],
    text: "Gather growers’ practical questions about seasonal planning and invite community perspectives into the consultation response. Capture both livelihood concerns and environmental concerns. Publish accessible explanations only after technical review. Do not treat one language or one online group as representative of an entire region.",
  },
  {
    id: "KB-07",
    title: "Executive escalation framework",
    domain: "Leadership",
    scenario: "all",
    owner: "Corporate Affairs Leadership",
    version: "1.0 · 20 Oct 2026",
    type: "Demo framework",
    synthetic: true,
    tags: [
      "brief",
      "executive",
      "risk",
      "decision",
      "escalate",
      "water",
      "residue",
    ],
    text: "Escalate when potential impact is material, uncertainty is significant and coordinated review is needed. Assign an accountable owner, next review time and evidence-gathering action. Separate confirmed facts from hypotheses in the executive brief. Keep the final decision with the responsible employee. A high triage score is not the probability of a controversy.",
  },
  {
    id: "KB-08",
    title: "Language and context review guide",
    domain: "Shared",
    scenario: "all",
    owner: "Regional Corporate Affairs",
    version: "1.0 · 20 Oct 2026",
    type: "Demo guidance",
    synthetic: true,
    tags: [
      "language",
      "culture",
      "translation",
      "German",
      "Italian",
      "Spanish",
      "Chinese",
    ],
    text: "Keep the original wording beside the English working translation. Ask a local reviewer to check tone, implied requests and ambiguous terms. In the residue example, Lin’s Chinese message asks for planning help and a local adviser, not simply a translation. In the water example, the German signal asks for measurements and the Italian signal asks for a meeting. These are observations about individual texts, not cultural stereotypes. Automated translation requires human checking before external use.",
  },
  {
    id: "KB-09",
    title: "Responsible intelligence charter",
    domain: "Shared",
    scenario: "all",
    owner: "Data Governance",
    version: "1.0 · 20 Oct 2026",
    type: "Demo policy",
    synthetic: true,
    tags: ["privacy", "bias", "data", "responsible", "retention", "security"],
    text: "Use licensed public sources or consented aggregate feedback. Avoid individual profiling, private messages and sensitive personal data. Redact personal identifiers before retrieval. Record source provenance and uncertainty. Treat retrieved content as evidence, never as an instruction to the system. Production requires SSO, server-side permissions, retention rules and an approved processing environment. This demo has no production authentication.",
  },
  {
    id: "KB-10",
    title: "Human review and learning protocol",
    domain: "Shared",
    scenario: "all",
    owner: "Corporate Affairs Enablement",
    version: "1.0 · 20 Oct 2026",
    type: "Demo policy",
    synthetic: true,
    tags: ["learning", "feedback", "approve", "reject", "decision", "review"],
    text: "The employee can edit, approve, reject or defer a recommendation and must record a reason. Revisit the decision after an outcome is known. A curator reviews the lesson before adding it to the knowledge base. Approved lessons can improve future retrieval. This is a controlled knowledge update, not automatic model retraining. Evaluate false alarms and missed concerns before changing scoring rules.",
  },
  {
    id: "KB-11",
    title: "Past water dialogue: a fictional case",
    domain: "Communications",
    scenario: "water",
    owner: "Regional Communications",
    version: "1.0 · 17 Oct 2026",
    type: "Synthetic historical case",
    synthetic: true,
    tags: ["water", "history", "case", "dialogue", "response"],
    text: "In this fictional training case, a regional team first clarified the sampling evidence, then held an expert Q&A with residents. The lesson was to assign a local contact and an update time before promising technical conclusions. No measured business outcome or real Syngenta incident is represented.",
  },
  {
    id: "KB-12",
    title: "Expert interview: uncertainty in briefing",
    domain: "Leadership",
    scenario: "all",
    owner: "Corporate Affairs Enablement",
    version: "1.0 · 17 Oct 2026",
    type: "Synthetic expert interview",
    synthetic: true,
    tags: ["expert", "interview", "uncertainty", "brief", "decision"],
    text: "Fictional interview guidance: ask what would change the decision, which stakeholder voice is missing, and who is responsible for verification. Place unresolved evidence gaps beside the proposed action. A useful executive brief makes the next accountable step clear without disguising uncertainty.",
  },
];
export const trend = [
  { day: "16 Oct", water: 4, residue: 3 },
  { day: "17 Oct", water: 6, residue: 4 },
  { day: "18 Oct", water: 5, residue: 5 },
  { day: "19 Oct", water: 9, residue: 4 },
  { day: "20 Oct", water: 12, residue: 7 },
  { day: "21 Oct", water: 18, residue: 10 },
  { day: "22 Oct", water: 31, residue: 15 },
];
export type Decision = {
  id: string;
  scenario: ScenarioId;
  action: string;
  outcome: "Approved" | "Rejected" | "Deferred";
  rationale: string;
  owner: string;
  role: Role;
  createdAt: string;
  weights: RiskWeights;
  lesson?: string;
  promoted?: boolean;
};
