const base=process.env.REPRADAR_TEST_URL||'http://localhost:3001';
import fs from 'node:fs/promises';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ready=false;
for(let i=0;i<120;i++){
 const s=await fetch(base+'/api/status').then(r=>r.json()).catch(()=>({live:false}));
 if(s.live){ready=true;console.log(`Ready: ${s.model}`);break;}
 if(i%6===0)console.log('Waiting for the local model download…');
 await sleep(5000);
}
if(!ready)throw new Error('Model download did not finish within ten minutes.');
const questions=[{question:'How should we respond to the farmer in China about the residue proposal?',role:'Communications',scenario:'residue'},{question:'请用中文解释这个案例和下一步建议。',role:'Communications',scenario:'residue'},{question:'What local product applicability checks does the farmer in China need?',role:'Regulatory Affairs',scenario:'residue'}];
const results=[];
for(const q of questions){const start=Date.now();const r=await fetch(base+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(q)});const d=await r.json();results.push({...q,elapsedSeconds:(Date.now()-start)/1000,...d});console.log(JSON.stringify({question:q.question,mode:d.mode,seconds:(Date.now()-start)/1000,answer:d.answer,notice:d.notice}));}
await fs.writeFile('.build/model-test.json',JSON.stringify(results,null,2));
if(results.some(d=>d.mode!=='llm'))throw new Error('At least one grounded model answer fell back; inspect the results.');
console.log('PASS: real local model answered English, Chinese and regulatory questions.');
