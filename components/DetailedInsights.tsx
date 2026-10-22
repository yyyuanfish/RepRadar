'use client';
import {useState} from 'react';
import {ArrowUpRight, BarChart3, ShieldCheck} from 'lucide-react';
import {scenarios, type Signal, type ScenarioId, type RiskWeights} from '@/lib/data';
import {scoreRisk} from '@/lib/engine';

export type SignalDrilldown = {sentiment?: Signal['sentiment']; channel?: string; review?: 'pending' | 'reviewed'};
export default function DetailedInsights({signals, incoming, verified, weights, onFilter, onLanguage, onTopic}: {
  signals: Signal[]; incoming: boolean; verified: string[]; weights: RiskWeights;
  onFilter: (filter: SignalDrilldown) => void; onLanguage: (language: string) => void; onTopic: (id: ScenarioId) => void;
}) {
  const [comparison,setComparison]=useState('both');
  const sentiments=[{label:'Concerned' as const,color:'#dd6868'},{label:'Neutral' as const,color:'#568cdf'},{label:'Constructive' as const,color:'#20a17b'}];
  const channels=Array.from(new Set(signals.map(s=>s.channel))).map(name=>({name,count:signals.filter(s=>s.channel===name).length}));
  const reviewed=signals.filter(s=>verified.includes(s.id)).length;
  const factors: {key:keyof RiskWeights;label:string;color:string}[]=[{key:'impact',label:'Impact',color:'#4789da'},{key:'urgency',label:'Urgency',color:'#e99838'},{key:'momentum',label:'Momentum',color:'#a16cce'},{key:'relevance',label:'Relevance',color:'#27a686'}];
  return <section id="detailed-insights" className="detailed-insights" aria-labelledby="detail-title" tabIndex={-1}>
    <div className="detail-heading"><span className="detail-icon"><BarChart3 size={22}/></span><div><h2 id="detail-title">Detailed analysis</h2><p>See the drivers behind the overview. Select a chart to inspect the evidence.</p></div><span className="tag green">4 additional views</span></div>
    <div className="coverage-grid">
      <section className="panel compact-chart"><h3>How do people feel?</h3><p>Authored sentiment labels in {signals.length} demo signals</p>
        <div className="sentiment-strip">{sentiments.map(g=>{const n=signals.filter(s=>s.sentiment===g.label).length;return <button key={g.label} style={{flex:n||.01,background:g.color}} aria-label={`Inspect ${g.label.toLowerCase()} signals: ${n}`} onClick={()=>onFilter({sentiment:g.label})}/>;})}</div>
        <div className="sentiment-key">{sentiments.map(g=><button key={g.label} onClick={()=>onFilter({sentiment:g.label})}><i style={{background:g.color}}/>{g.label}<b>{signals.filter(s=>s.sentiment===g.label).length}</b><ArrowUpRight size={11}/></button>)}</div>
        <small>Concern is a reason to listen. It does not establish harm.</small>
      </section>
      <section className="panel compact-chart"><h3>Hear it in the original language</h3><p>Open the original text and working English translation</p><div className="language-buttons">{[{code:'EN',name:'English'},{code:'DE',name:'German'},{code:'IT',name:'Italian'},{code:'ES',name:'Spanish'},{code:'ZH',name:'Chinese'}].map((l,i)=><button key={l.code} onClick={()=>onLanguage(l.code)}><span style={{background:['#e9f1ff','#f2eafd','#e5f5ef','#fff2dc','#fce9ee'][i]}}>{l.code}</span><div>{l.name}<b>{signals.filter(s=>s.language===l.code).length} signals</b></div></button>)}</div><small>Different requests need local context, even within one language.</small></section>
      <section className="panel compact-chart driver-panel"><div className="panel-heading"><div><h3>What drives each priority?</h3><p>Scenario ratings, out of 5</p></div><select aria-label="Compare risk topics" value={comparison} onChange={e=>setComparison(e.target.value)}><option value="both">Both topics</option><option value="water">Water</option><option value="residue">Residue</option></select></div>
        {(Object.keys(scenarios) as ScenarioId[]).filter(id=>comparison==='both'||comparison===id).map(id=>{const ratings={...scenarios[id].factors,momentum:id==='water'&&incoming?5:scenarios[id].factors.momentum};return <button className="driver-topic" key={id} onClick={()=>onTopic(id)}><span className="driver-title"><strong>{scenarios[id].short}</strong><b>{scoreRisk(ratings,weights)}/100 <ArrowUpRight size={13}/></b></span><span className="factor-bars">{factors.map(f=><span className="factor-row" key={f.key}><span>{f.label}</span><span className="bar-track"><i style={{width:`${ratings[f.key]*20}%`,background:f.color}}/></span><b>{ratings[f.key]}</b></span>)}</span></button>;})}<small>Priority uses your current weights. It is not an escalation probability. Open a topic to adjust the weights.</small>
      </section>
      <section className="panel compact-chart source-panel"><h3>Where are signals coming from?</h3><p>Channel counts in this inbox sample</p><div className="source-bars">{channels.map((c,i)=><button key={c.name} onClick={()=>onFilter({channel:c.name})}><span>{c.name}</span><span className="bar-track"><i style={{width:`${c.count/Math.max(signals.length,1)*100}%`,background:['#508ae0','#9269cb','#e8aa36','#25a684','#dd6d8b'][i%5]}}/></span><b>{c.count}</b><ArrowUpRight size={12}/></button>)}</div><div className="review-progress"><span><ShieldCheck size={16}/> Human review</span><strong>{reviewed} / {signals.length}</strong></div><progress aria-label="Signals reviewed by a human" value={reviewed} max={signals.length}/><div className="review-filter"><button onClick={()=>onFilter({review:'pending'})}>{signals.length-reviewed} awaiting review <ArrowUpRight size={12}/></button><button onClick={()=>onFilter({review:'reviewed'})}>{reviewed} reviewed <ArrowUpRight size={12}/></button></div><small>Review records a colleague’s assessment. Claims can remain unverified.</small></section>
    </div>
  </section>;
}
