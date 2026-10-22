import {
  defaultWeights,
  knowledge,
  scenarios,
  type Decision,
  type KnowledgeDoc,
  type RiskWeights,
  type Role,
  type ScenarioId,
} from "./data";
export function scoreRisk(factors: RiskWeights, weights = defaultWeights) {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (!total) return 0;
  return Math.round(
    ((Object.keys(weights) as (keyof RiskWeights)[]).reduce(
      (s, k) => s + (factors[k] / 5) * weights[k],
      0,
    ) /
      total) *
      100,
  );
}
export function priority(score: number) {
  return score >= 75 ? "High" : score >= 50 ? "Medium" : "Low";
}
const stop = new Set([
  "the",
  "and",
  "for",
  "with",
  "what",
  "this",
  "that",
  "how",
  "can",
  "are",
  "our",
  "should",
  "about",
  "from",
  "into",
  "would",
  "please",
  "explain",
  "does",
  "have",
]);
export function tokens(q: string) {
  return (
    q
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu)
      ?.filter((t) => t.length > 2 && !stop.has(t)) ?? []
  );
}
export function lessonDocs(decisions: Decision[]): KnowledgeDoc[] {
  return decisions
    .filter((d) => d.promoted && d.lesson)
    .map((d) => ({
      id: `LEARN-${d.id}`,
      title: `Reviewed lesson: ${scenarios[d.scenario].short}`,
      domain: d.role,
      scenario: d.scenario,
      text: d.lesson!,
      owner: d.owner,
      version: d.createdAt,
      type: "Human-reviewed demo lesson",
      tags: [d.scenario, "lesson", "review", "case"],
      synthetic: true,
    }));
}
export function retrieve(
  query: string,
  role: Role,
  scenario: ScenarioId,
  extras: KnowledgeDoc[] = [],
): (KnowledgeDoc & { relevance: number })[] {
  const terms = tokens(query);
  if (!terms.length) return [];
  const synonyms: Record<string, string[]> = {
    water: ["river", "wasser", "acqua", "水"],
    residue: ["residuo", "residuos", "残留"],
    privacy: ["privacidad", "隐私", "datenschutz"],
    learning: ["learn", "feedback", "lernen", "学习"],
    statement: ["draft", "response", "reply", "声明"],
    language: ["culture", "cultural", "translation", "translate", "语言"],
  };
  const expanded = [...terms];
  for (const [key, vals] of Object.entries(synonyms))
    if ([key, ...vals].some((t) => query.toLowerCase().includes(t)))
      expanded.push(key, ...vals);
  return [...knowledge, ...extras]
    .filter(
      (d) =>
        (d.domain === role || d.domain === "Shared") &&
        (d.scenario === scenario || d.scenario === "all"),
    )
    .map((d) => {
      const hay = tokens(`${d.title} ${d.text} ${d.tags.join(" ")}`);
      const matches = new Set(
        expanded.filter((t) => hay.some((h) => h === t || h.startsWith(t))),
      ).size;
      return {
        ...d,
        relevance: matches
          ? matches * 3 +
            (d.domain === role ? 2 : 0) +
            (d.scenario === scenario ? 1 : 0)
          : 0,
      };
    })
    .filter((d) => d.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 3);
}
export function extractiveAnswer(
  query: string,
  role: Role,
  scenario: ScenarioId,
  extras: KnowledgeDoc[] = [],
) {
  const sources = retrieve(query, role, scenario, extras);
  if (!sources.length)
    return {
      answer:
        "I could not find supporting material in your role’s demo knowledge collection for that question. Try asking about this scenario, evidence verification, privacy or the review workflow. A domain expert should review questions outside this collection.",
      sources,
      mode: "extractive" as const,
    };
  const text = sources.map((d) => `[${d.id}] ${d.text}`).join("\n\n");
  return {
    answer: `Here is the relevant guidance for ${role}. These are retrieved excerpts from the demo collection, not a newly generated LLM answer.\n\n${text}\n\nFor “${scenarios[scenario].short}”: ${scenarios[scenario].uncertainty} Keep any external response in human review.`,
    sources,
    mode: "extractive" as const,
  };
}
export type Recommendation = {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
  owner: string;
  time: string;
  criteria: { evidence: number; trust: number; speed: number };
  citations: string[];
};
export function recommendations(scenario: ScenarioId): Recommendation[] {
  return scenario === "water"
    ? [
        {
          id: "verify",
          title: "Verify the evidence, then brief the local team",
          description:
            "Request the original measurements. Prepare a factual holding note with a named contact and a next update.",
          tradeoff: "Stronger factual basis; the full response takes longer.",
          owner: "Product Safety + Communications",
          time: "Within 4 hours",
          criteria: { evidence: 5, trust: 4, speed: 3 },
          citations: ["KB-01", "KB-03"],
        },
        {
          id: "dialogue",
          title: "Open a community dialogue",
          description:
            "Invite residents and a qualified local expert to a listening session. Collect questions before making commitments.",
          tradeoff:
            "Gives quieter voices a route in; needs local coordination.",
          owner: "Community Relations",
          time: "Within 24 hours",
          criteria: { evidence: 3, trust: 5, speed: 2 },
          citations: ["KB-05", "KB-08"],
        },
        {
          id: "monitor",
          title: "Monitor with a clear escalation trigger",
          description:
            "Track new independent evidence and cross-border coverage. Reassess at 14:00 with an accountable owner.",
          tradeoff: "Fast and low effort; delayed engagement may weaken trust.",
          owner: "Corporate Affairs",
          time: "Review in 2 hours",
          criteria: { evidence: 2, trust: 2, speed: 5 },
          citations: ["KB-07", "KB-10"],
        },
      ]
    : [
        {
          id: "verify",
          title: "Verify the proposal and assign a local response owner",
          description:
            "Check the original proposal and Lin’s crop, product and market with China Regulatory Affairs and agronomy colleagues. Prepare a locally reviewed reply and a callback time.",
          tradeoff: "More accurate advice; requires regional expertise.",
          owner: "China Regulatory + local agronomy adviser",
          time: "Review today at 14:00",
          criteria: { evidence: 5, trust: 4, speed: 3 },
          citations: ["KB-02", "KB-04"],
        },
        {
          id: "dialogue",
          title: "Hold a grower question session",
          description:
            "Collect seasonal planning questions and prepare locally reviewed answers about the consultation stage.",
          tradeoff:
            "Addresses practical concerns; product answers need verification.",
          owner: "Regional Affairs",
          time: "Within 48 hours",
          criteria: { evidence: 3, trust: 5, speed: 2 },
          citations: ["KB-06", "KB-08"],
        },
        {
          id: "monitor",
          title: "Monitor the consultation and clarify the timeline",
          description:
            "Track the original authority and create an internal update. Escalate on a verified change in legal status.",
          tradeoff:
            "Quick coordination; may leave public misunderstanding unresolved.",
          owner: "Corporate Affairs",
          time: "Review tomorrow",
          criteria: { evidence: 2, trust: 2, speed: 5 },
          citations: ["KB-07", "KB-10"],
        },
      ];
}
export function actionScore(
  action: Recommendation,
  prefs: { evidence: number; trust: number; speed: number },
) {
  const sum = Object.values(prefs).reduce((a, b) => a + b, 0);
  return sum
    ? Math.round(
        ((action.criteria.evidence * prefs.evidence +
          action.criteria.trust * prefs.trust +
          action.criteria.speed * prefs.speed) /
          sum) *
          20,
      )
    : 0;
}
