export function modelConfig() {
 const provider=process.env.LLM_PROVIDER==='ollama'?'ollama':'openai-compatible';
 const base=(process.env.LLM_BASE_URL||(provider==='ollama'?'http://127.0.0.1:11434':'')).replace(/\/$/,'').replace(provider==='ollama'?/\/v1$/:/$^/,'');
 const model=process.env.LLM_MODEL||'';
 const configured=process.env.ENABLE_LIVE_LLM==='true'&&!!base&&!!model&&(provider==='ollama'||!!process.env.LLM_API_KEY);
 return {provider,base,model,configured};
}
export async function modelStatus() {
 const c=modelConfig();
 if(!c.configured)return {live:false,configured:false,model:c.model,provider:c.provider,reason:'No model configured. Knowledge search is available.'};
 try {
  const r=await fetch(c.provider==='ollama'?`${c.base}/api/tags`:`${c.base}/models`,{headers:c.provider==='ollama'?{}:{Authorization:`Bearer ${process.env.LLM_API_KEY}`},signal:AbortSignal.timeout(4000),cache:'no-store'});
  if(!r.ok)throw new Error('unavailable');
  const data=await r.json();
  const installed=c.provider==='ollama'?data.models?.some((m:{name:string})=>m.name===c.model):true;
  return {live:!!installed,configured:true,model:c.model,provider:c.provider,reason:installed?'Ready for questions.':'The selected model has not been downloaded.'};
 }catch{return {live:false,configured:true,model:c.model,provider:c.provider,reason:'Model service is not reachable. Start the local model or check the server configuration.'};}
}
export async function generate(messages:{role:string;content:string}[]) {
 const c=modelConfig();
 const local=c.provider==='ollama';
 const r=await fetch(`${c.base}${local?'/api/chat':'/chat/completions'}`,{method:'POST',headers:{'Content-Type':'application/json',...(!local?{Authorization:`Bearer ${process.env.LLM_API_KEY}`}:{})},signal:AbortSignal.timeout(90000),body:JSON.stringify(local?{model:c.model,messages,stream:false,think:false,keep_alive:'10m',options:{temperature:0.2,num_ctx:4096,num_predict:600}}:{model:c.model,messages,temperature:0.2,max_tokens:700})});
 if(!r.ok)throw new Error('provider_unavailable');
 const data=await r.json();
 const answer=local?data.message?.content:data.choices?.[0]?.message?.content;
 if(typeof answer!=='string'||!answer.trim())throw new Error('empty_answer');
 return answer.replace(/<think>[\s\S]*?<\/think>/g,'').trim();
}
