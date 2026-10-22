import {knowledge,scenarios,type Role,type ScenarioId} from './data';
import {retrieve} from './engine';
export function assistantIntent(question:string) {
 if(/(?:today|latest|current|breaking|最新|今天|今日|heute).{0,25}(?:news|新闻|nachricht)|(?:news|新闻).{0,20}(?:today|latest|今天|最新)/i.test(question))return 'news';
 if(/^\s*(hi|hello|hey|你好|您好|hallo)[!.。！\s]*$/i.test(question))return 'greeting';
 if(!/[\p{L}]/u.test(question)||question.trim().length<2)return 'unclear';
 return 'question';
}
export function assistantSources(question:string,role:Role,scenario:ScenarioId) {
 const found=retrieve(question,role,scenario);

 // Broad scenario questions still receive role-specific context. Unrelated questions do not.
 if(/summari[sz]e|brief|next step|what should (we|i) do|draft an internal email|what happened|this (case|issue|risk)|帮|建议|解释|怎么办|总结|怎么|如何|农户|farmer|中文|explain.*simple|shorter/i.test(question))return knowledge.filter(d=>(d.domain===role||d.domain==='Shared')&&(d.scenario===scenario||d.scenario==='all')).sort((a,b)=>Number(b.domain===role)-Number(a.domain===role)).slice(0,3);
 return found;
}
export function intentReply(question:string,scenario:ScenarioId) {
 const intent=assistantIntent(question),zh=/[\u3400-\u9fff]/.test(question);
 const suggestions=zh?['请总结这个案例','我们下一步应该做什么？','帮我草拟给当地同事的邮件']:['Summarize this case in plain English','What should we do next?','Draft an internal email to the local team'];
 if(intent==='question')return null;
 const answer=intent==='news'?(zh?'目前还没有接入实时新闻源，所以我不能可靠地报告今天的新闻。这里的案例和信号都是演示数据。你可以粘贴一篇新闻的内容让我分析，或让我总结当前案例。':'A live news feed is not connected, so I cannot reliably report today’s news. The dashboard contains synthetic demo signals. Paste an article’s text for analysis, or ask me to summarize the current case.'):
 intent==='unclear'?(zh?'你想了解哪个问题？可以问我案例摘要、风险原因，或下一步如何回应。':'What would you like help with? I can explain the case, compare response options, or draft a note for a colleague.'):
 (zh?`你好！我们正在查看“${scenarios[scenario].short}”。我可以解释风险、查找岗位知识，并帮你准备回应草稿。`:`Hi! We’re looking at ${scenarios[scenario].short}. I can explain the concern, find guidance for your role, or help draft a response.`);
 return {answer,sources:[],mode:'help',suggestions};
}
