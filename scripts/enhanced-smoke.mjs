const base=process.env.REPRADAR_TEST_URL||'http://localhost:3001';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||undefined});const p=await browser.newPage({viewport:{width:1440,height:1000}});p.setDefaultTimeout(15000);const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(base+'/dashboard',{waitUntil:'domcontentloaded'});await p.addStyleTag({content:'*{font-family:Arial,sans-serif!important}'});
 assert.equal(await p.getByRole('button',{name:'Simple view',exact:true}).getAttribute('aria-pressed'),'true');
 await p.getByRole('button',{name:'Detailed view',exact:true}).click();await p.locator('.compact-chart').first().waitFor({state:'visible'});
 await p.getByLabel('Chart time range').selectOption('3');assert.equal(await p.locator('.day-buttons button').count(),3);await p.locator('.day-buttons button').last().click();assert.match(await p.locator('.visual-trend .chart-takeaway').innerText(),/22 Oct.*31.*15/);
 await p.getByLabel('Chart time range').selectOption('7');await p.locator('.donut-legend button').filter({hasText:'Policymakers'}).click();assert.equal(await p.locator('.signal-card').count(),2);
 await p.getByRole('button',{name:'Overview',exact:true}).click();await p.locator('.language-buttons button').filter({hasText:'Chinese'}).click();assert.equal(await p.locator('.signal-card').count(),1);
 await p.getByRole('button',{name:'Overview',exact:true}).click();await p.getByRole('button',{name:'Simple view',exact:true}).click();await p.screenshot({path:'outputs/screenshots/overview-simple.png',fullPage:true});
 await p.getByRole('button',{name:'Team handoff',exact:true}).click();assert(await p.getByRole('button',{name:'Open Outlook draft'}).isDisabled());
 await p.getByLabel('Colleague email').fill('reviewer@example.com');await p.getByLabel('Handoff owner').fill('Maya + local Regulatory reviewer');await p.getByLabel('Next update').fill('2026-10-23T14:00');await p.getByRole('checkbox').check();
 await p.evaluate(()=>{window.open=(url)=>{window.__draftUrl=String(url);return null;};});await p.getByRole('button',{name:'Open Outlook draft'}).click();const draft=await p.evaluate(()=>window.__draftUrl);const u=new URL(draft);assert.equal(u.host,'outlook.office.com');assert.equal(u.searchParams.get('to'),'reviewer@example.com');assert.match(u.searchParams.get('body'),/Pending review/);
 const dl=p.waitForEvent('download');await p.getByRole('button',{name:'Export task for ERP'}).click();assert.equal((await dl).suggestedFilename(),'RepRadar-task.csv');
 await p.getByLabel('Handoff message').fill('Updated message');assert(await p.getByRole('button',{name:'Open Outlook draft'}).isDisabled());
 await p.reload({waitUntil:'domcontentloaded'});await p.addStyleTag({content:'*{font-family:Arial,sans-serif!important}'});await p.getByRole('button',{name:'Team handoff',exact:true}).click();await p.screenshot({path:'outputs/screenshots/team-handoff.png',fullPage:true});
 await p.getByRole('button',{name:'Ask RepRadar',exact:true}).click();await p.getByLabel('Ask a question').fill('123');await p.getByRole('button',{name:'Send question'}).click();await p.locator('.chat-message.assistant').waitFor();assert.match(await p.locator('.chat-message.assistant').last().innerText(),/What would you like help/);
 await p.getByLabel('Ask a question').fill("what is today's news");await p.getByRole('button',{name:'Send question'}).click();await p.locator('.chat-message.assistant').nth(1).waitFor();assert.match(await p.locator('.chat-message.assistant').last().innerText(),/live news feed is not connected/);
 await p.getByRole('button',{name:'Close assistant'}).click();await p.getByRole('button',{name:'Overview',exact:true}).click();await p.setViewportSize({width:390,height:844});await p.waitForTimeout(350);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'outputs/screenshots/mobile-updated.png',fullPage:true});
 await p.getByRole('button',{name:'Open navigation'}).click();await p.getByRole('button',{name:'Team handoff',exact:true}).click();assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS: simple/detail toggle, trend range, all-group filters, language filters, Outlook encoded draft, review gate reset, ERP export, helpful chat boundaries, mobile layout.');
}finally{await browser.close();}
