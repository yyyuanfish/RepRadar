import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import {execFileSync} from 'node:child_process';
import { Presentation, PresentationFile } from '@oai/artifact-tool';
process.env.RUNTIME_NODE_MODULES ||= path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules');
const ROOT=process.env.REPRADAR_ROOT||process.cwd();
const SKILL=process.env.REPRADAR_PRESENTATION_SKILL||path.join(os.homedir(),'.codex/plugins/cache/openai-primary-runtime/presentations/26.1022.11436/skills/presentations');
const PY=process.env.REPRADAR_PYTHON||path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3');
const out=path.join(ROOT,'outputs/pitch');const tmp=path.join(ROOT,'.build/four-part');
const story=JSON.parse(await fs.readFile(path.join(ROOT,'scripts/story-four-part.json'),'utf8'));
await fs.mkdir(out,{recursive:true});await fs.mkdir(path.join(tmp,'previews'),{recursive:true});
const C={navy:'#17334A',green:'#3F682E',pale:'#EFF4E8',gold:'#D8BC62',text:'#30463B',muted:'#607160',bg:'#F9FAF5',white:'#FFFFFF'};
const p=Presentation.create({slideSize:{width:1280,height:720}});
let n=0;const script=[];
function text(sl,content,x,y,w,h,size=25,color=C.text,bold=false,shapeName){const sh=sl.shapes.add({geometry:'textbox',name:shapeName||`text-${n}-${sl.shapes.items.length}`,position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});sh.text=content;sh.text.style={fontSize:size,typeface:size>=25?'Poppins':'Arial',color,bold,verticalAlignment:'top',insets:0,autoFit:'none',wrap:'square'};return sh;}
async function pic(sl,file,x,y,w,h,fit='contain'){const b=await fs.readFile(path.join(ROOT,file));return sl.images.add({blob:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),contentType:file.endsWith('.jpg')?'image/jpeg':'image/png',alt:path.basename(file),fit,position:{left:x,top:y,width:w,height:h}});}
const criterionLabels={"2": "Problem–solution fit", "3": "Problem–solution fit", "4": "Problem–solution fit · Originality", "5": "Pitch & Q&A · Problem–solution fit", "6": "Feasibility · Originality", "7": "Feasibility · Originality", "8": "Feasibility", "9": "Human-centered & responsible", "10": "Human-centered & responsible", "11": "Human-centered & responsible · Originality", "13": "Feasibility", "14": "Pitch & Q&A", "15": "Pitch & Q&A", "16": "Problem–solution fit · Human-centered & responsible", "17": "Human-centered & responsible · Feasibility", "18": "All five evaluation criteria"};
async function brandHeader(sl,dark=false){await pic(sl,dark?'public/assets/repradar-mark-color-dark.png':'public/assets/repradar-mark-color.png',65,28,36,36);text(sl,'RepRadar',114,27,230,44,27,dark?C.white:C.green,true);await pic(sl,'public/assets/syngenta-group.png',1032,24,180,56);}

async function base(title,section,{dark=false,plain=false}={}){n++;const sl=p.slides.add();sl.background.fill=dark?C.navy:C.bg;if(!plain){await brandHeader(sl,dark);text(sl,section.toUpperCase(),65,107,1100,24,12,dark?'#C1D0B2':C.muted,true);text(sl,title,63,141,1110,112,41,dark?C.white:C.navy,true);if(criterionLabels[n])text(sl,'CRITERIA  /  '+criterionLabels[n],65,694,1100,15,11,dark?'#C1D0B2':'#60755A');}text(sl,String(n).padStart(2,'0'),1180,680,35,20,12,dark?'#ACBCA7':C.muted);return sl;}

function notes(sl,title,seconds,owner,copy,sources=''){const revised=story[String(n)];if(revised){title=revised.title;copy=revised.copy;sources=[sources,revised.sources].filter(Boolean).join('\n');}const note=`${seconds} seconds. Presenter ${owner}.\n\n${copy}\n\n${sources?`Sources and assumptions:\n${sources}`:''}`;sl.speakerNotes.text=note;script.push({slide:n,title,seconds,owner,copy,sources});}
function row(sl,y,num,title,body,{x=65,w=1110,dark=false}={}){text(sl,num,x,y,55,42,27,dark?C.gold:C.green,true);text(sl,title,x+75,y,370,42,26,dark?C.white:C.navy,true);text(sl,body,x+470,y+1,w-470,78,23,dark?'#C6D3BF':C.muted);}
// 01 (source slide 1)
{
 const s=await base('','',{plain:true});s.background.fill=C.green;await pic(s,'public/assets/fields-cover-soft.png',740,0,540,720,'contain');await pic(s,'public/assets/syngenta-group.png',1032,24,180,56);
 text(s,'UZH.ai Hackathon',65,125,590,28,17,'#D8E4CC');await pic(s,'public/assets/repradar-mark-color-dark.png',65,208,62,62);text(s,'RepRadar',143,184,585,100,76,C.white,true);text(s,'Listen closely.\nDecide confidently.',65,310,645,135,46,C.white,false);text(s,'A farmer’s question.\nA team’s next decision.',68,505,560,72,26,'#D8E4CC');text(s,'Syngenta challenge concept · Synthetic-data demonstration',68,649,650,27,14,'#C5D6B9');
 notes(s,'RepRadar',15,7,'We are RepRadar. We help Corporate Affairs teams turn fragmented stakeholder signals into a better-informed next decision. Our principle is simple: listen closely, decide confidently. Today we will show the full workflow through Maya, a communications lead, using a clearly fictional scenario.','Challenge brief supplied by the team. Logo supplied by user. RepRadar mark is the project’s editable SVG radar-and-leaf symbol, created for this prototype. Green, turquoise, gold and magenta connect the website and deck. Headings use Poppins, which appears in the Syngenta Group website CSS; font licensed under SIL OFL from https://github.com/google/fonts/tree/main/ofl/poppins . Styling reference: https://www.syngentagroup.com/ accessed 23 October 2026. Field image: Ivan Bandura, Unsplash, https://unsplash.com/photos/aerial-photography-of-green-farm-field-hdD1ZP1PzqI . Illustrative background, not a Syngenta site.');
}
// 02 (source slide 2)
{
 const s=await base('08:12 in Basel. A question arrives from China.','01 PROBLEM / WHY IT MATTERS');
 text(s,'“A headline says some products\nare already banned. Do I need\nto change my plans for\nnext season?”',65,272,790,215,36,C.green,true);
 text(s,'LIN',930,285,250,55,39,C.gold,true);text(s,'Farmer in China\nNeeds practical clarity',930,349,270,86,22,C.muted);
 text(s,'MAYA',930,459,250,55,39,C.gold,true);text(s,'Corporate Affairs, Basel\nNeeds a checked response',930,522,280,85,22,C.muted);
 text(s,'The missing link: what applies to Lin’s crop, product and location?',65,586,800,62,25,C.navy,true);
 text(s,'Fictional personas and policy scenario. A European proposal does not establish a restriction in China.',65,658,1120,25,14,C.muted);
 notes(s,'Story hook',40,3,'','Synthetic scenario inspired by the user’s proposed farmer-to-employee storytelling.');
}
// 03 (source slide 3)
{
 const s=await base('Maya has the signals. She still needs the context.','01 PROBLEM / CORPORATE AFFAIRS NEEDS');
 text(s,'Syngenta works in crop protection and seeds.\nCorporate Affairs connects the business with people, public debate and policy.',65,263,1100,80,25,C.text);
 row(s,378,'01','Three disconnected fragments','A European proposal, an English ban headline and a Chinese planning question.');row(s,471,'02','One missing local answer','Which crop, product and market? A translation cannot establish applicability.');row(s,564,'03','A time-sensitive handoff','Maya must find the right local expert and coordinate a responsible reply.');
 notes(s,'Corporate Affairs problem',40,1,'Syngenta develops crop protection and seed solutions. The challenge is for Corporate Affairs, the function connecting the organization with stakeholders, including media, policymakers, communities and employees. The issue is fragmented information and the burden of interpreting it across languages. In the team’s discussion, the intended users are Corporate Affairs colleagues, with roughly 25 users as a design assumption. We do not claim a verified headcount for the company’s global function. Existing alerts still leave Maya to reconstruct the evidence and decide who needs to act.','Company context: https://www.syngenta.ch/ accessed 22 October 2026. Corporate Affairs remit: supplied challenge photo. Problem statements and approximate target-user assumption: team whiteboard and coach feedback, not formal user-research findings.');
}
// 04 (source slide 5)
{
 const s=await base('One question, carried through the whole workflow','02 SOLUTION / WHAT REPRADAR DOES');
 const cols=[['01','Listen','Read Lin’s words\nand the headline.'],['02','Interpret','Check the proposal\nand missing local scope.'],['03','Decide','Use role-specific sources\nto compare next steps.'],['04','Review','Assign the local owner.\nRecord why and when.']];
 cols.forEach((a,i)=>{let x=65+i*294;text(s,a[0],x,285,250,70,55,C.gold,true);text(s,a[1],x,376,250,50,31,C.green,true);text(s,a[2],x,442,245,100,24,C.muted);});
 text(s,'Maya’s decision: verify locally, assign the response owner, and set the next update.',65,591,1125,65,27,C.navy,true);
 notes(s,'RepRadar overview',35,2,'Maya sees one shared workspace. First she listens to the original signals, including the working translation. Then she interprets the concern with evidence gaps and several regional or domain perspectives. Next she compares actions using guidance relevant to her role. Finally she edits, approves, rejects or defers a recommendation and records why. The product helps her prepare a response, but never publishes it. Afterward, the team can review the outcome and retain a useful lesson.','Working prototype: components/RepRadar.tsx. Role-scoped knowledge: lib/data.ts and lib/engine.ts.');
}
// 05 (source slide 6)
{
 const s=await base('Live demo: help Maya answer Lin','02 SOLUTION / LIVE DEMO');
 await pic(s,'outputs/screenshots/dashboard-first-screen.png',65,265,830,410,'contain');
 const demoButton=text(s,'Open live demo',930,275,280,56,25,C.white,true,'live-demo-button');demoButton.fill=C.green;demoButton.text.style={fontSize:25,typeface:'Arial',color:C.white,bold:true,insets:{left:18,right:12,top:12,bottom:10}};
 const demoAddress=text(s,new URL(process.env.REPRADAR_DEMO_URL||'http://localhost:3001').host,930,344,280,28,17,C.green,true,'live-demo-address');
 text(s,'1  Read the dashboard\n    Open Lin’s original question',930,402,280,72,21,C.navy,true);
 text(s,'2  Check the evidence\n    Ask the role-specific assistant',930,496,280,72,21,C.navy,true);
 text(s,'3  Record a human decision\n    Prepare the team handoff',930,590,280,72,21,C.navy,true);
 notes(s,'Live demo',120,4,'Switch to the browser. 0:00–0:20: open Signal inbox, inspect the German or Italian source and its translation. 0:20–0:40: open Risk workspace, point out the evidence gap and explain the heuristic score. 0:40–1:00: open Recommendations, change speed to show a different ranking. 1:00–1:25: open Ask RepRadar, ask about water evidence, show source IDs, then switch to Regulatory Affairs if time permits. 1:25–1:50: review an option, edit the action, enter a reason and owner, acknowledge limitations, and record the decision. 1:50–2:00: point to the decision log and reviewed-lesson pathway. If the live page fails, use the appendix screenshots. Say clearly: offline mode retrieves source excerpts; it is not a live LLM.','Screenshot from the delivered prototype, synthetic data. Full demo script is in docs/PITCH_SCRIPT.md.');
}
// 06 (source slide 7)
{
 const s=await base('Role-specific RAG and a human review boundary','03 ARCHITECTURE / SYSTEM OVERVIEW');
 const vals=[['Stage','Working prototype','Pilot extension'],['Signals','Multilingual synthetic records','Licensed feeds, redaction, deduplication'],['Interpretation','Authored agent perspectives','Media, regulatory and local-language agents'],['Knowledge','Role-filtered retrieval (RAG context)','Permission-filtered hybrid / vector retrieval'],['Recommendations','Ranking; optional local Qwen3','Evaluated generation with source tracing'],['Decision','Human review + Outlook / CSV','SSO, mailbox and ERP connectors']];
 nativeTable(s,vals,65,275,1150,310,[220,430,500]);
 text(s,'Context: reviewed policies, agricultural knowledge, historical cases and expert interviews.',65,609,1120,50,22,C.green,true);
 notes(s,'Technical architecture',50,4,'The prototype is deliberately transparent about what runs. It has working retrieval, risk scoring, action ranking and a server-side adapter for an approved model. Sentiment labels and the three agent perspectives are authored demo annotations. In the pilot, specialized media, regulatory and local-language agents would propose interpretations. The retrieval layer would use approved policies, agricultural knowledge, company and competitor case history, and expert interviews. Those are context documents, not extra model training. An approved local open-source model or private hosted model can keep sensitive context inside an approved environment. The Vercel demo is not an on-prem deployment.','Implementation: lib/engine.ts, app/api/chat/route.ts. Historical and expert documents in this demo are fictional. The laptop runs local Qwen3 through Ollama. Enterprise model hosting, vector search, agent orchestration and permissions are proposed pilot work.');
}
// 07 (source slide 0)
{
 const s=await base('How evidence becomes a recommendation','03 ARCHITECTURE / TECHNICAL LOGIC');
 row(s,270,'01','Retrieve the right context','Role + scenario filter → lexical search. Show sources before drawing conclusions.');
 row(s,380,'02','Make priorities explicit','Impact, urgency, momentum and relevance. Editable weights, not probabilities.');
 row(s,490,'03','Explain with evidence','Source excerpts online; optional Qwen3 via Ollama. A person checks the citations.');
 text(s,'Risk priority = weighted average of four 1–5 ratings, scaled to 100.',65,616,1120,34,23,C.green,true);
 text(s,'Action ranking uses separate evidence / trust / speed preferences. No model retraining is required.',65,657,1120,23,15,C.muted);
 notes(s,'Retrieval, risk and generation',55,4,'');
}
// 08 (source slide 10)
{
 const s=await base('A six-week pilot with ten Corporate Affairs colleagues','03 ARCHITECTURE / IMPLEMENTATION & PILOT');
 row(s,275,'1–2','Co-design the workflow','Two regions, two topics. Interview employees and establish the current baseline.');row(s,380,'3–4','Run in shadow mode','Compare alerts with expert review. No autonomous publication.');row(s,485,'5–6','Evaluate and decide','Review usability, missed concerns and citation quality before wider adoption.');
 text(s,'Illustrative operating budget: about CHF 3.4k/month, plus integration and setup.',65,613,1120,35,24,C.green,true);text(s,'Planning assumptions, not a vendor quote. Human review and data access dominate this example.',65,657,1110,23,14,C.muted);
 notes(s,'Pilot feasibility',50,7,'We propose ten colleagues in two regions over six weeks. Weeks one and two establish the current workflow and co-design one useful briefing task. Weeks three and four run in shadow mode alongside normal decisions. Weeks five and six compare against the baseline and decide whether to proceed. Proposed gates are: no unauthorized publication, every decision has an accountable owner, at least 95 percent of sampled citations support their claim, and a 30 percent reduction in median briefing time without worse missed-concern performance. These are targets, not results. The illustrative monthly operating model is about CHF 3.4k plus setup, mainly human review and data access. A local model deployment would need separate infrastructure costing.','Pilot scope, gates and costs are planning assumptions, not measured outcomes or supplier quotes. Detailed arithmetic is in appendix slide 13.');
}
// 09 (source slide 4)
{
 const s=await base('Lin needs clarity. Maya needs control.','04 HUMAN ASPECT / PEOPLE FIRST');
 row(s,275,'01','Hear the actual need','Preserve the request for practical help, even when a post has low reach.');row(s,386,'02','Check before responding','Separate the shared headline from verified scope and local context.');row(s,497,'03','Keep a human owner','Maya chooses the next step. Local specialists review technical guidance.');
 text(s,'Design goal: help people respond calmly, with clearer information and control.',65,634,1105,30,20,C.green,true);
 notes(s,'Our principles',35,6,'We start from the employee’s work, rather than from the model. Maya needs an explanation she can challenge, a small set of options, and an obvious way to retain control. She can change the priorities and reject an action. Uncertainty stays visible. The prototype follows the existing listen, interpret and decide workflow. In the pilot we would co-design with employees, introduce one region and one topic first, and test whether it reduces burden without increasing automation bias.','Principles derived from challenge criteria, coach feedback and team whiteboard. Reduced burden is a hypothesis to test, not a measured result.');
}
// 10 (source slide 8)
{
 const s=await base('Maya can disagree. Lin’s context stays visible.','04 HUMAN ASPECT / HUMAN IN THE LOOP');
 row(s,272,'01','Agency','Maya can edit, reject or defer. Every decision needs a reason and owner.');row(s,377,'02','Cultural meaning','Read Lin’s actual question. A local colleague checks meaning and technical scope.');row(s,482,'03','Privacy and fairness','Use licensed or consented sources. Avoid profiling people. Include quieter voices.');
 text(s,'Pilot safeguards: SSO, document permissions, retention rules and an approved model environment.',65,619,1120,55,21,C.green,true);
 notes(s,'Human-centered and responsible AI',50,6,'Human-centered means observable control, not just a reminder at the bottom of the screen. The reviewer can change the action and reject the system’s suggestion. Original text stays available, because language and culture can change the meaning of a request. We do not infer the attitudes of entire cultures from a few posts. Privacy means using permitted data and aggregate feedback, minimizing identifiers and avoiding personal profiling. Production needs access control and retention rules. We would evaluate inclusion of quieter stakeholders, correction rates by language and whether employees understand the evidence.','Concrete controls exist in the prototype. Authentication, secure audit, private hosting and independent fairness evaluation remain pilot requirements. No legal compliance certification is claimed.');
}
// 11 (source slide 9)
{
 const s=await base('The story continues after the decision','04 HUMAN ASPECT / REVIEWED LEARNING');
 const stages=[['Decision','Maya assigns a China\nowner and review time.'],['Outcome','The local team checks\nwhether the reply helped.'],['Curator review','A curator checks\nthe observed lesson.'],['Knowledge update','The next team retrieves\nthe approved lesson.']];
 stages.forEach((a,i)=>{let x=65+i*294;text(s,String(i+1).padStart(2,'0'),x,284,245,65,50,C.gold,true);text(s,a[0],x,376,245,70,29,C.green,true);text(s,a[1],x,463,245,105,23,C.muted);});
 text(s,'Outcome follow-up is a proposed workflow. The demo records decisions and reviewed lessons locally.',65,616,1120,55,21,C.navy,true);
 notes(s,'Reviewed learning loop',45,5,'The learning mechanism is explicit. A decision is not automatically a success, so we wait for an outcome. A reviewer writes the lesson and a curator approves it before it becomes reusable knowledge. The working demo adds approved lessons to local retrieval for that role and scenario. It does not silently retrain a model or reward every approved action. In a pilot, a separate curator would check evidence and retention. We would use false alarms, missed concerns and local corrections to decide whether a scoring or model change is justified.','Implementation: Decision log, lessonDocs() and role/scenario filtering. Browser-local learning is excluded from connected server-side LLM context until a trusted repository exists.');
}
// 12 (source slide 12)
{
 const s=await base('','',{plain:true});s.background.fill=C.navy;await pic(s,'public/assets/fields-close-soft.png',810,0,470,720,'contain');await brandHeader(s,true);
 text(s,'Back to Lin.\nA clear next step.',65,204,740,145,52,C.white,true);
 text(s,'A plan to verify. A local owner.\nA scheduled update, with human review.',68,364,700,78,27,'#DAE4D2');text(s,'Our ask',68,477,600,40,25,C.gold,true);text(s,'One sponsor. Ten colleagues.\nTwo regions. Six weeks.',68,529,700,86,28,'#DAE4D2');text(s,'Listen closely. Decide confidently.',68,650,720,30,18,'#BCCDB0');
 notes(s,'The ask',65,7,'RepRadar gives Maya a better starting point: the original voices, the evidence, the tradeoffs and a decision she can stand behind. Our ask is one Corporate Affairs sponsor, ten colleagues in two regions, and six weeks to test the workflow with approved sources. The next milestone is evidence that it helps employees work, while preserving their judgment. Listen closely. Decide confidently. Thank you.','Pilot scope is a proposal. Background photo attribution as slide 1.');
}
// 13 (source slide 13)
{
 const s=await base('Pilot economics: assumptions you can change','APPENDIX / COST MODEL');
 const vals=[['Monthly item','Assumption','CHF / month'],['Model inference','2,200 requests × 8k input / 1k output tokens','79.20'],['Application hosting','Illustrative allowance','300.00'],['Data access','Illustrative licensed-source allowance','1,000.00'],['Human review','20 hours × CHF 100/hour','2,000.00'],['Operating total','Excludes setup, legal work and local-model hardware','3,379.20']];
 nativeTable(s,vals,65,268,1150,340,[260,650,240]);
 text(s,'Token rate assumptions: CHF 3/M input and CHF 12/M output. These are hypothetical rates.',65,629,1125,45,19,C.muted);
 notes(s,'Cost assumptions',0,7,'Arithmetic: 10 users × 10 requests/day × 22 working days = 2,200 requests/month. Input tokens: 2,200 × 8,000 = 17.6 million at assumed CHF 3 per million = CHF 52.80. Output tokens: 2,200 × 1,000 = 2.2 million at assumed CHF 12 per million = CHF 26.40. Total inference CHF 79.20. Add hosting 300, data 1,000 and human review 2,000 = CHF 3,379.20. This is a planning model, not current provider pricing, and excludes integration, legal review, taxes and local-model infrastructure. Actual costs depend on source licenses and workload.','All figures are explicit assumptions. No external vendor price is represented.');
}
// 14 (source slide 14)
{
 const s=await base('Demo backup: Maya’s response plan for Lin','APPENDIX / OFFLINE FALLBACK');
 await pic(s,'outputs/screenshots/story-workspace.png',65,266,707,384,'contain');await pic(s,'outputs/screenshots/story-review.png',810,266,398,384,'contain');
 notes(s,'Demo fallback',0,4,'If the live demonstration is interrupted, use these real screenshots. On the left, explain the uncertainty and adjustable scoring. On the right, show the edited action, accountable owner, rationale and acknowledgment. Use the PDF backup if PowerPoint or network access fails.','Screenshots captured from this delivered prototype with synthetic data.');
}
// 15 (source slide 15)
{
 const s=await base('Questions we expect','APPENDIX / Q&A');
 row(s,274,'Q','Does it predict controversy?','It prioritizes early signals. Validated probability forecasts need labelled history.');row(s,383,'Q','Why not use a generic chatbot?','Role-filtered sources, original language and a recorded decision give the work structure.');row(s,492,'Q','Is it ready for internal data?','The demo uses synthetic data. Identity, permissions and approved hosting come first.');
 text(s,'Next validation: local users, source coverage, false alarms, missed concerns and employee trust.',65,625,1120,53,21,C.green,true);
 notes(s,'Q&A',0,7,'Additional answers. Self-learning means approved knowledge updates, not uncontrolled reinforcement learning. Agent diversity is a proposed architecture with local review, not evidence that multiple agents automatically remove bias. We cannot promise complete public coverage. Social volume can underrepresent communities. The demo has no production authentication. Costs are scenario assumptions. The company’s exact Corporate Affairs headcount remains unverified. The distinctive contribution is the complete decision workflow, not a claim to have invented RAG or sentiment analysis.','Primary context: https://www.syngenta.ch/ . Challenge criteria and whiteboard supplied by user. Implementation limitations documented in README.md.');
}
// 16 (source slide 16)
{
 const s=await base('Demo coverage: understand the concern','APPENDIX / FUNCTIONALITY & CRITERIA');
 const vals=[['What the employee can do','Why it matters','Evaluation criterion'],['Scan the dashboard','Overview plus sentiment, languages, risk drivers and source / review charts','Fit · Human-centered'],['Filter and inspect signals','Search, group / language filters, original text, translation and review notes','Fit · Human-centered'],['Inspect risk and uncertainty','Visible factors, editable weights, evidence gaps and a simulated new signal','Originality · Human-centered'],['Inspect role-specific knowledge','Document IDs, versions, owners and role / scenario filtering','Fit · Feasibility'],['Ask RepRadar in EN / ZH','Source excerpts online; local Qwen3 option, chat context and source links','Originality · Feasibility']];
 nativeTable(s,vals,65,266,1150,368,[295,570,285]);
 text(s,'Sentiment, translations and agent perspectives are authored demo examples; live ingestion is a pilot step.',65,649,1130,35,16,C.muted);
 notes(s,'Feature coverage: listen and interpret',0,4,'This appendix maps every discovery and analysis capability to the judges’ criteria. The main dashboard has a simple default and an immediately visible detailed view with sentiment, language coverage, risk drivers, source counts and human-review progress. The header stays visible while scrolling. Sentiment, channel, review status, stakeholder and language charts open filtered inbox records. Risk driver charts open the corresponding risk workspace. The trend is a separate synthetic aggregate, not a claim that the 14 examples are a complete live stream. Source details preserve the original, translation and employee annotations. A simulated new signal changes the overview and water momentum. Risk scores are normalized heuristics and editable weights reveal priorities. Role and scenario filtering controls relevance; it is not production authorization. The knowledge library displays synthetic documents with owners and versions. Qwen3 generates answers locally from retrieved evidence, with source links, conversation context and an excerpt fallback. It has no live news feed. The media, regional language and regulatory perspective cards are authored examples.','Criteria use the five exact categories from the supplied evaluation photo. Fit abbreviates Problem–solution fit; Human-centered abbreviates Human-centered & responsible. Implementation: components/DashboardCharts.tsx, components/DetailedInsights.tsx, components/RepRadar.tsx, lib/engine.ts, app/api/chat/route.ts.');
}
// 17 (source slide 17)
{
 const s=await base('Demo coverage: decide, coordinate and learn','APPENDIX / FUNCTIONALITY & CRITERIA');
 const vals=[['What the employee can do','Why it matters','Evaluation criterion'],['Compare three next steps','Change evidence, trust and speed preferences; inspect the ranking','Originality · Human-centered'],['Edit, approve, reject or defer','Own the action, record a rationale and acknowledge evidence limits','Fit · Human-centered'],['Prepare a team handoff','Editable Outlook compose link, copied brief or reviewed ERP CSV','Fit · Feasibility'],['Keep an accountable record','Decision log, export and browser-local persistence','Feasibility · Human-centered'],['Review outcomes and lessons','Capture feedback; curator approval before role-specific reuse','Originality · Human-centered'],['Rehearse and recover','Guided walkthrough, reset, source fallback and deck screenshots','Feasibility · Pitch & Q&A']];
 nativeTable(s,vals,65,266,1150,382,[295,570,285]);
 text(s,'Outlook: human sends. ERP: CSV export. Learning: curated retrieval, not model retraining.',65,670,1100,20,15,C.muted);
 notes(s,'Feature coverage: decide, coordinate and learn',0,6,'These controls make the team’s handwritten workflow tangible: continuous monitoring, alert, human decision, response preparation and reviewed learning. Employees compare three actions by explicit preference weights. A decision requires a responsible owner and rationale. Approval records a plan, not publication. Team handoff carries uncertainty and the latest decision into an editable Microsoft 365 compose link, copyable brief or CSV export for later mapping to an ERP. No enterprise permissions are needed for the compose link; there is no mailbox reading or live ERP synchronization. A review checkbox resets when the handoff is edited. History is browser-local, with export and reset controls. A lesson is usable only after explicit curator approval, within its role and scenario; it remains local retrieval context rather than automatic LLM retraining. Model status, guided walkthrough and fallback screenshots support the pitch.','Criteria from the supplied evaluation photo; workflow from the supplied whiteboard. Implementation: components/TeamHandoff.tsx, lib/handoff.ts, lessonDocs() and local storage in components/RepRadar.tsx.');
}
// 18 (source slide 11)
{
 const s=await base('One complete story demonstrates the five criteria','APPENDIX / EVALUATION CRITERIA');
 const vals=[['Criterion','Evidence in the proposal'],['Problem–solution fit','Dashboard → scoped evidence → response plan → Outlook handoff'],['Feasibility','Local Qwen3, editable draft / CSV, six-week regional pilot'],['Originality','Local context + role-specific RAG + preferences + reviewed lessons'],['Human-centered & responsible','Simple view, quieter voices, visible uncertainty, edit / reject / review'],['Pitch & Q&A','The same farmer, employee and question from opening to closing']];
 nativeTable(s,vals,65,270,1150,337,[365,785]);
 text(s,'Value to test: less briefing effort and better-supported decisions, with human control intact.',65,629,1125,46,21,C.green,true);
 notes(s,'Criteria scorecard',0,7,'This is how the proposal maps to the five criteria in the challenge photo. The workflow addresses the actual Corporate Affairs need. Feasibility rests on a working prototype and a small pilot. Originality is the combination of language context, role-specific evidence, user preference ranking and a reviewed learning loop, rather than a claim that individual components are new. Human control is visible in the interface. The pitch uses one concrete employee and a live decision. We make no claim to have achieved business impact yet; the pilot is designed to test it.','Five exact judging categories from the user-supplied evaluation photo. This is evidence mapping, not self-awarded numeric scores.');
}
function nativeTable(sl,values,x,y,w,h,widths){const t=sl.tables.add({rows:values.length,columns:values[0].length,left:x,top:y,width:w,height:h,columnWidths:widths,values});t.borders.assign({fill:'#DFE7D7',width:.6,style:'solid'});for(let r=0;r<values.length;r++){t.rows[r].height=h/values.length;for(let c=0;c<values[0].length;c++){const cell=t.getCell(r,c);cell.fill=r===0?C.green:r%2?C.white:'#F1F5EB';cell.text.style={fontSize:values[0][0]==='What the employee can do'?17:20,typeface:'Arial',color:r===0?C.white:c===0?C.navy:C.muted,bold:r===0||c===0,insets:{top:values[0][0]==='What the employee can do'?7:11,bottom:values[0][0]==='What the employee can do'?5:8,left:14,right:12},verticalAlignment:'middle'};}}return t;}
await fs.writeFile(path.join(tmp,'script.json'),JSON.stringify(script,null,2));
// Warm the renderer before saving previews on the presenting laptop.
await p.export({slide:p.slides.items[0],format:'png',scale:1});
for(let i=0;i<p.slides.items.length;i++){if(process.env.RENDER_CHANGED&&!process.env.RENDER_CHANGED.split(',').includes(String(i+1)))continue;const sl=p.slides.items[i];const png=await p.export({slide:sl,format:'png',scale:1});await fs.writeFile(path.join(tmp,'previews',`slide-${String(i+1).padStart(2,'0')}.png`),new Uint8Array(await png.arrayBuffer()));console.log(`Rendered ${i+1}`);}
// PDF backup is assembled from inspected slide renders because the bundled PDF exporter cannot resolve its standard-font alias.
const rawDraft=path.join(tmp,'raw-four-part.pptx');await(await PresentationFile.exportPptx(p)).save(rawDraft);
const draft=path.join(tmp,'candidate-four-part.pptx');execFileSync(PY,[path.join(ROOT,'scripts/link-deck-demo.py'),rawDraft,draft,process.env.REPRADAR_DEMO_URL||'https://repradar-phi.vercel.app/dashboard','5']);
const {finalizePresentation}=await import(pathToFileURL(path.join(SKILL,'container_tools/artifact_tool_utils.mjs')).href);
const result=await finalizePresentation({workspaceDir:ROOT,candidatePath:draft,finalPath:path.join(out,'RepRadar-Pitch-Four-Part.pptx'),pythonExecutable:PY,integrityValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(SKILL,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-bullet-geometry','--validate-heading-fit','--require-native-table-slide','6','--require-native-table-slide','18','--require-native-table-slide','13','--require-native-table-slide','16','--require-native-table-slide','17'],requiredNativeTableOwnerSlides:[6,13,16,17,18],fontPolicy:{basis:'design',families:['Arial','Poppins']},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-four-part.json')});
console.log(JSON.stringify(result));
