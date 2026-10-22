import test from 'node:test';
import assert from 'node:assert/strict';
import {scoreRisk, retrieve, extractiveAnswer, actionScore, recommendations, lessonDocs} from '../lib/engine';
import {defaultWeights,scenarios,type Decision} from '../lib/data';
test('priority is normalized and does not depend on weight sum being 100',()=>{
 assert.equal(scoreRisk(scenarios.water.factors),85);
 assert.equal(scoreRisk(scenarios.residue.factors),78);
 assert.equal(scoreRisk(scenarios.water.factors,{impact:70,urgency:50,momentum:40,relevance:40}),85);
 assert.equal(scoreRisk(scenarios.water.factors,{impact:0,urgency:0,momentum:0,relevance:0}),0);
});
test('retrieval restricts sources to role and scenario before ranking',()=>{
 const comms=retrieve('water evidence laboratory protocol statement','Communications','water');
 assert(comms.length>0);assert(comms.every(d=>d.domain==='Communications'||d.domain==='Shared'));assert(!comms.some(d=>d.id==='KB-03'));
 const reg=retrieve('water evidence laboratory verification','Regulatory Affairs','water');
 assert.equal(reg[0].id,'KB-03');assert(!reg.some(d=>d.id==='KB-04'));
});
test('no matching evidence produces an honest abstention',()=>{
 assert.equal(retrieve('quantum cheesecake astronomy','Communications','water').length,0);
 assert.match(extractiveAnswer('quantum cheesecake astronomy','Communications','water').answer,/could not find supporting material/);
});
test('human preferences materially change recommendation ranking',()=>{
 const a=recommendations('water');
 assert(actionScore(a[0],{evidence:45,trust:35,speed:20})>actionScore(a[2],{evidence:45,trust:35,speed:20}));
 assert(actionScore(a[2],{evidence:0,trust:0,speed:100})>actionScore(a[0],{evidence:0,trust:0,speed:100}));
});
test('lessons enter retrieval only after explicit approval and retain role boundaries',()=>{
 const decision:Decision={id:'demo',scenario:'water',action:'Verify',outcome:'Approved',rationale:'Check first',owner:'Maya',role:'Communications',createdAt:'2026-10-22T08:00:00Z',weights:defaultWeights,lesson:'Water response needs a local callback time.'};
 assert.equal(lessonDocs([decision]).length,0);
 const extra=lessonDocs([{...decision,promoted:true}]);assert.equal(extra.length,1);
 assert(retrieve('callback time','Communications','water',extra).some(d=>d.id==='LEARN-demo'));
 assert(!retrieve('callback time','Regulatory Affairs','water',extra).some(d=>d.id==='LEARN-demo'));
});
import { POST } from '../app/api/chat/route';
test('chat endpoint rejects malformed roles, prototype keys and oversized questions',async()=>{
 for(const body of [{question:'water',role:'Admin',scenario:'water'},{question:'water',role:'Communications',scenario:'__proto__'},{question:'x'.repeat(2001),role:'Communications',scenario:'water'}]){
 const response=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify(body)}));assert.equal(response.status,400);
 }
});
test('offline API returns only sources from the selected domain',async()=>{
 const previous=process.env.ENABLE_LIVE_LLM;process.env.ENABLE_LIVE_LLM='false';
 try{const response=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({question:'water evidence verification',role:'Regulatory Affairs',scenario:'water'})}));const data=await response.json();assert.equal(data.mode,'extractive');assert(data.sources.some((s:{id:string})=>s.id==='KB-03'));assert(data.sources.every((s:{domain:string})=>s.domain==='Regulatory Affairs'||s.domain==='Shared'));}finally{process.env.ENABLE_LIVE_LLM=previous;}
});
import {assistantIntent,assistantSources,intentReply} from '../lib/assistant';
import {createHandoff,outlookUrl,erpCsv} from '../lib/handoff';
test('assistant handles greetings, numeric input and missing live news clearly',()=>{
 assert.equal(assistantIntent('123'),'unclear');
 assert.equal(assistantIntent("what is today's news"),'news');
 assert.equal(assistantIntent('今天有什么新闻？'),'news');
 assert.equal(assistantIntent('hello'),'greeting');
 assert.match(intentReply("what is today's news",'water')!.answer,/live news feed is not connected/);
});
test('plain-language and Chinese questions get scoped context',()=>{
 const comms=assistantSources('请用中文解释这个案例和下一步建议','Communications','residue');
 assert(comms.length);assert(comms.some(d=>d.id==='KB-02'));assert(comms.every(d=>d.domain==='Communications'||d.domain==='Shared'));
 const reg=assistantSources('Summarize this case in plain English','Regulatory Affairs','residue');assert(reg.some(d=>d.id==='KB-04'));assert(!reg.some(d=>d.id==='KB-02'));
});
test('handoff preserves review state and encodes an editable Outlook compose URL',()=>{
 const draft=createHandoff('residue');assert.equal(draft.status,'Pending review');assert.match(draft.body,/SYNTHETIC/);
 const u=new URL(outlookUrl('a@example.com','A & B','Line one\nLine two'));
 assert.equal(u.host,'outlook.office.com');assert.equal(u.searchParams.get('subject'),'A & B');assert.equal(u.searchParams.get('body'),'Line one\nLine two');
 assert(!u.pathname.includes('send'));
 const csv=erpCsv({...draft,owner:'=HYPERLINK("x")'});assert(csv.includes('"\'=HYPERLINK(""x"")"'));
});
test('chat recovers gracefully when the configured model service is unreachable',async()=>{
 const keys=['ENABLE_LIVE_LLM','LLM_PROVIDER','LLM_BASE_URL','LLM_MODEL'] as const;const saved=keys.map(k=>process.env[k]);
 Object.assign(process.env,{ENABLE_LIVE_LLM:'true',LLM_PROVIDER:'ollama',LLM_BASE_URL:'http://127.0.0.1:1',LLM_MODEL:'test'});
 try{const r=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({question:'water evidence verification',role:'Regulatory Affairs',scenario:'water'})}));const d=await r.json();assert.equal(r.status,200);assert.equal(d.mode,'extractive');assert.match(d.notice,/could not respond/);}finally{keys.forEach((k,i)=>{if(saved[i]===undefined)delete process.env[k];else process.env[k]=saved[i];});}
});
test('next-step questions include the current employee playbook',()=>{
 assert(assistantSources('What should we do next?','Communications','residue').some(d=>d.id==='KB-02'));
});
test('fabricated model references fall back to role-scoped guidance',async()=>{
 const keys=['ENABLE_LIVE_LLM','LLM_PROVIDER','LLM_BASE_URL','LLM_MODEL'] as const,saved=keys.map(k=>process.env[k]),oldFetch=globalThis.fetch;
 Object.assign(process.env,{ENABLE_LIVE_LLM:'true',LLM_PROVIDER:'ollama',LLM_BASE_URL:'http://127.0.0.1:11434',LLM_MODEL:'test'});
 globalThis.fetch=async()=>new Response(JSON.stringify({message:{content:'This is certainly safe [KB-99].'}}),{status:200});
 try{const r=await POST(new Request('http://localhost/api/chat',{method:'POST',body:JSON.stringify({question:'Summarize this case','Communications':'unused',role:'Communications',scenario:'residue'})}));const d=await r.json();assert.equal(d.mode,'extractive');assert.doesNotMatch(d.answer,/certainly safe|KB-99/);assert(d.sources.some((s:{id:string})=>s.id==='KB-02'));}finally{globalThis.fetch=oldFetch;keys.forEach((k,i)=>{if(saved[i]===undefined)delete process.env[k];else process.env[k]=saved[i];});}
});
