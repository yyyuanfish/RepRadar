import {scenarios,type ScenarioId,type Decision} from './data';
export type Handoff={subject:string;body:string;owner:string;reviewTime:string;decisionId:string;status:string};
export function createHandoff(scenario:ScenarioId,decision?:Decision):Handoff {
 const s=scenarios[scenario];
 return {subject:`[RepRadar demo] Review needed: ${s.short}`,owner:decision?.owner||s.owner,reviewTime:'',decisionId:decision?.id||'',status:decision?.outcome||'Pending review',body:`SYNTHETIC DEMO — internal coordination draft\n\nCase: ${s.title}\n\n${s.summary}\n\nWhat needs checking\n${s.uncertainty}\n\nNext action\n${decision?.action||'Please verify the evidence and confirm the appropriate local response owner.'}\n\nReason\n${decision?.rationale||'Awaiting a reviewed decision in RepRadar.'}\n\nDecision: ${decision?.outcome||'Pending review'}${decision?` (#${decision.id})`:''}\n\nPlease confirm who will review this and when we should expect an update.\n\nThis draft does not establish product safety or local legal applicability.`};
}
export function outlookUrl(to:string,subject:string,body:string){return `https://outlook.office.com/mail/deeplink/compose?${new URLSearchParams({to,subject,body})}`;}
export function erpCsv(h:Handoff){
 const cell=(s:string)=>`"${(/^[\s]*[=+@-]/.test(s)?"'":'')+s.replace(/"/g,'""')}"`;
 return [['external_id','title','description','owner','review_at','status','synthetic'],[h.decisionId||'unreviewed-demo',h.subject,h.body,h.owner,h.reviewTime,h.status,'true']].map(row=>row.map(cell).join(',')).join('\r\n');
}
