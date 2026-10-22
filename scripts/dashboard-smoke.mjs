const base=process.env.REPRADAR_TEST_URL||'http://localhost:3001';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const b=await chromium.launch({headless:true,channel:process.env.PLAYWRIGHT_CHANNEL||undefined});const p=await b.newPage({viewport:{width:1440,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(base+'/dashboard',{waitUntil:'domcontentloaded'});await p.addStyleTag({content:'*{font-family:Arial,sans-serif!important}'});
 await p.locator('.visual-grid').waitFor();
 const boxes=await p.evaluate(()=>Object.fromEntries(['.metrics-grid','.visual-grid','.priority-panel','.hero','.sidebar .brand'].map(s=>{const r=document.querySelector(s).getBoundingClientRect();return[s,{top:r.top,bottom:r.bottom,width:r.width}]})));console.log(JSON.stringify(boxes));
 assert(boxes['.metrics-grid'].top<200);assert(boxes['.visual-grid'].bottom<650);assert(boxes['.priority-panel'].bottom<900);assert(boxes['.sidebar .brand'].top<50);assert(boxes['.hero'].top>boxes['.priority-panel'].top);
 await p.screenshot({path:'outputs/screenshots/dashboard-first-screen.png'});
 await p.setViewportSize({width:1366,height:768});await p.screenshot({path:'outputs/screenshots/dashboard-laptop.png'});
 const queue=await p.locator('.priority-panel tbody tr').last().boundingBox();assert(queue.y+queue.height<=768,'Both topics must be visible on a laptop');
 await p.locator('.donut-legend button').filter({hasText:'Policymakers'}).click();assert.equal(await p.locator('.signal-card').count(),2);
 await p.getByRole('button',{name:'Overview',exact:true}).click();await p.getByRole('button',{name:'Detailed view',exact:true}).click();assert(await p.locator('.coverage-grid').isVisible());await p.getByRole('button',{name:'Simple view',exact:true}).click();
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'outputs/screenshots/dashboard-mobile.png',fullPage:true});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 assert.deepEqual(errors,[]);console.log('PASS: first-screen dashboard, laptop topic visibility, RepRadar-led brand, chart filters, progressive detail and mobile layout.');
}finally{await b.close();}
