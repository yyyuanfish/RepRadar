const base=process.env.REPRADAR_TEST_URL||'http://localhost:3001';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const b=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||undefined,headless:true});
try{
 const p=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 p.setDefaultTimeout(120000);
 const connected=(await (await fetch(base+'/api/status')).json()).live;
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base,{waitUntil:'domcontentloaded'});
 await p.addStyleTag({content:'* { font-family: Arial, sans-serif !important; }'});
 assert.match(await p.locator('.hero').innerText(),/farmer’s question/);
 await p.getByRole('button',{name:'Run demo',exact:true}).click();assert.match(await p.locator('.modal').innerText(),/Lin/);
 await p.getByRole('button',{name:'Start with the signals'}).click();assert.equal(await p.locator('.signal-card').count(),1);
 await p.locator('.signal-card').click();assert.match(await p.locator('.modal').innerText(),/我在中国种植/);
 await p.locator('.modal').screenshot({path:'outputs/screenshots/story-signal.png'});
 await p.getByRole('button',{name:'Close Signal detail'}).click();
 await p.getByRole('button',{name:'Risk workspace',exact:true}).click();assert.match(await p.locator('.case-heading').innerText(),/Lin/);
 assert.match(await p.locator('.uncertainty').first().innerText(),/does not establish a restriction in China/);
 await p.screenshot({path:'outputs/screenshots/story-workspace.png'});
 await p.getByRole('button',{name:'Ask RepRadar',exact:true}).click();await p.getByLabel('Ask a question').fill('How should we respond to the farmer in China about the residue proposal?');await p.getByRole('button',{name:'Send question'}).click();await p.locator('.chat-message.assistant').waitFor();assert.match(await p.locator('.chat-message.assistant').innerText(),/KB-02/);
 if(connected){assert.match(await p.locator('.chat-message.assistant .message-label').innerText(),/LLM DRAFT/);assert(await p.locator('.evidence-boundary').isVisible());}
 await p.locator('.chat-messages').evaluate(el=>{el.scrollTop=0});await p.locator('.copilot').screenshot({path:'outputs/screenshots/assistant-live.png'});
 await p.getByRole('button',{name:'Close assistant'}).click();await p.getByLabel('Employee role').selectOption('Regulatory Affairs');
 await p.getByRole('button',{name:'Ask RepRadar',exact:true}).click();await p.getByLabel('Ask a question').fill('What local product applicability checks does the farmer in China need for the residue proposal?');await p.getByRole('button',{name:'Send question'}).click();await p.locator('.chat-message.assistant').waitFor();assert.match(await p.locator('.chat-message.assistant').innerText(),/KB-04/);if(connected)assert.match(await p.locator('.chat-message.assistant .message-label').innerText(),/LLM DRAFT/);
 await p.getByRole('button',{name:'Close assistant'}).click();await p.getByLabel('Employee role').selectOption('Communications');
 await p.getByRole('tab',{name:'Recommendations'}).click();await p.getByRole('button',{name:'Review this option'}).first().click();
 await p.getByLabel('Proposed action').fill('Verify the proposal and local applicability; prepare a locally reviewed reply to Lin with a 14:00 Zurich update.');
 await p.getByLabel('Accountable owner').fill('Maya Keller + China Regulatory / local agronomy adviser');
 await p.getByLabel('Decision rationale').fill('Lin needs practical planning help. The European headline does not establish a restriction in China. We need the original source, crop and product context before giving guidance.');
 await p.getByRole('checkbox').check();await p.locator('.modal').screenshot({path:'outputs/screenshots/story-review.png'});
 await p.getByRole('button',{name:'Record decision'}).click();assert.match(await p.locator('.decision-card').innerText(),/locally reviewed reply to Lin/);
 assert.deepEqual(errors,[]);console.log('PASS: Lin-to-Maya story, original Chinese, applicability uncertainty, two role-specific KBs, named local owner and recorded response plan.');
}finally{await b.close();}
