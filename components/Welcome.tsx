"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, CheckCheck, Globe2, Leaf, MessageCircle, ScanLine, ShieldCheck, Sparkles, Sprout, Users } from 'lucide-react';
import styles from './Welcome.module.css';

const steps = [
  { name: 'Listen', title: 'Every voice starts somewhere.', description: 'Bring stakeholder concerns into view, across languages and regions.', tag: 'A SIGNAL WORTH HEARING', quote: '“What does this mean for my next season?”', detail: 'Lin · a farmer in China', note: 'Keep the original voice', icon: MessageCircle },
  { name: 'Interpret', title: 'A headline is only part of the story.', description: 'Explore the evidence, local context and what still needs checking.', tag: 'CONTEXT BEFORE CONCLUSIONS', quote: 'A European proposal ≠ a local restriction.', detail: 'Check the crop, product and market', note: 'Make uncertainty visible', icon: ScanLine },
  { name: 'Decide', title: 'A thoughtful next step. Yours.', description: 'Compare options, involve the right people and record your decision.', tag: 'HUMAN JUDGMENT AT THE CENTER', quote: 'Verify locally. Assign an owner. Follow up.', detail: 'Maya · Corporate Affairs', note: 'You make the final call', icon: CheckCheck },
];

function RadarGarden() {
  return <svg viewBox="0 0 600 480" className={styles.garden} aria-hidden="true">
    <defs>
      <linearGradient id="welcome-orb" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FCFFF7"/><stop offset="1" stopColor="#DFECCA"/></linearGradient>
      <linearGradient id="welcome-leaf" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#528636"/><stop offset="1" stopColor="#A4CC5C"/></linearGradient>
    </defs>
    <circle cx="300" cy="240" r="200" fill="#EEF3E5"/>
    <circle cx="300" cy="240" r="167" fill="none" stroke="#D6E2C6" strokeWidth="1"/>
    <circle cx="300" cy="240" r="127" fill="none" stroke="#C8D8B4" strokeWidth="1" strokeDasharray="3 8"/>
    <path d="M300 240 L435 93 A200 200 0 0 1 495 284Z" fill="#DCEACB" opacity=".5" className={styles.sweep}/>
    <path d="M52 399 Q172 321 300 399 T550 391" fill="none" stroke="#D1DFC4" strokeWidth="1.5"/>
    <path d="M67 413 Q172 341 300 413 T535 405" fill="none" stroke="#D1DFC4" strokeWidth="1.5"/>
    <path d="M88 427 Q172 361 300 427 T515 419" fill="none" stroke="#D1DFC4" strokeWidth="1.5"/>
    <g className={styles.sprout}>
      <ellipse cx="300" cy="350" rx="76" ry="10" fill="#36592B" opacity=".08"/>
      <path d="M271 324 Q254 346 242 337 M326 324 Q342 345 354 336" fill="none" stroke="#567940" strokeWidth="8" strokeLinecap="round"/>
      <path d="M219 261 Q197 265 196 245 M381 263 Q401 262 407 243" fill="none" stroke="#567940" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="300" cy="257" r="82" fill="url(#welcome-orb)" stroke="#BAD39E" strokeWidth="2"/>
      <path d="M300 177 Q300 143 327 122" fill="none" stroke="#5C873A" strokeWidth="7" strokeLinecap="round"/>
      <path d="M303 164 Q302 111 357 116 Q355 162 303 164Z" fill="url(#welcome-leaf)"/>
      <path d="M300 166 Q261 168 255 131 Q298 129 300 166Z" fill="#31BDA6"/>
      <path d="M311 155 L342 128" stroke="#CDE7AD" strokeWidth="2" strokeLinecap="round"/>
      <ellipse cx="277" cy="251" rx="5" ry="7" fill="#2D4D35"/>
      <ellipse cx="324" cy="251" rx="5" ry="7" fill="#2D4D35"/>
      <path d="M287 273 Q300 284 313 273" fill="none" stroke="#2D4D35" strokeWidth="3.5" strokeLinecap="round"/>
      <ellipse cx="261" cy="270" rx="10" ry="5" fill="#E8BCA6" opacity=".6"/>
      <ellipse cx="340" cy="270" rx="10" ry="5" fill="#E8BCA6" opacity=".6"/>
      <path d="M257 215 A57 57 0 0 1 282 201" fill="none" stroke="#FFF" strokeWidth="5" strokeLinecap="round"/>
    </g>
    <circle cx="156" cy="126" r="9" fill="#30BBA6"/>
    <circle cx="469" cy="305" r="7" fill="#D8AC4C"/>
    <circle cx="387" cy="76" r="5" fill="#C9618D"/>
    <path d="M173 316v14m-7-7h14" stroke="#B0C88D" strokeWidth="2" strokeLinecap="round"/>
    <path d="M429 166v14m-7-7h14" stroke="#B0C88D" strokeWidth="2" strokeLinecap="round"/>
  </svg>;
}

export default function Welcome() {
  const [active, setActive] = useState(0);
  const step = steps[active];
  const Icon = step.icon;
  return <div className={styles.page}>
    <a href="#welcome-main" className="skip">Skip to main content</a>
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label="RepRadar home"><img src="/assets/repradar-mark-color.svg" alt="" width="40" height="40"/><span>Rep<span>Radar</span></span></Link>
      <nav aria-label="Welcome navigation" className={styles.nav}><a href="#how-it-works">How it works</a><a href="#our-story">The human story</a></nav>
      <Link href="/dashboard" className={styles.headerCta}>Open workspace <ArrowUpRight size={16}/></Link>
    </header>

    <main id="welcome-main">
      <section className={styles.hero} aria-labelledby="welcome-title">
        <div className={styles.intro}>
          <span className={styles.eyebrow}><span/> A LITTLE CURIOSITY. A CLEARER PERSPECTIVE.</span>
          <h1 id="welcome-title">Small signals.<br/>Better <span>human</span><br/><span>decisions.<svg viewBox="0 0 330 14" aria-hidden="true"><path d="M3 10 Q155 -2 326 7" fill="none" stroke="#D7B557" strokeWidth="5" strokeLinecap="round"/></svg></span></h1>
          <p className={styles.lead}>Welcome to RepRadar. Make sense of stakeholder concerns, find relevant evidence, and choose your next step with confidence.</p>
          <div className={styles.actions}><Link href="/dashboard" className={styles.primary}>Let’s explore <ArrowRight size={19}/></Link><a href="#how-it-works" className={styles.secondary}>Meet the workflow <ArrowDown size={16}/></a></div>
          <div className={styles.promise}><ShieldCheck size={17}/><span>AI brings perspective. <strong>People make the call.</strong></span></div>
        </div>

        <div className={styles.scene}>
          <div className={styles.sceneHeading}><span className={styles.sceneDot}/> A SMALL SIGNAL, A HUMAN STORY <span>0{active+1} / 03</span></div>
          <RadarGarden/>
          <div className={styles.hello}>Hello, curious minds! <span>✦</span></div>
          <div className={styles.signalCard} aria-live="polite" aria-atomic="true">
            <div className={styles.cardTag}><span><Icon size={16}/></span>{step.tag}</div>
            <p>{step.quote}</p><small>{step.detail}</small>
          </div>
          <div className={styles.humanTag}><span><Check size={14}/></span>{step.note}</div>
          <div className={styles.sceneCaption}><Leaf size={14}/> A little attention can make a big difference.</div>
        </div>
      </section>

      <section id="how-it-works" className={styles.workflow} aria-labelledby="workflow-title">
        <div className={styles.workflowHeader}><div><span className={styles.sectionKicker}>YOUR NEXT STEP, MADE CLEARER</span><h2 id="workflow-title">From listening to a thoughtful response.</h2></div><span className={styles.tapHint}><Sparkles size={15}/> Pick a step to explore</span></div>
        <div className={styles.steps}>
          {steps.map((item, index) => {const StepIcon=item.icon;return <button key={item.name} type="button" className={`${styles.step} ${active===index?styles.selected:''}`} onClick={()=>setActive(index)} aria-pressed={active===index} aria-controls="workflow-detail"><span className={styles.stepIcon} data-step={index}><StepIcon size={22}/></span><span><small>0{index+1}</small><strong>{item.name}</strong></span><ArrowUpRight size={18} className={styles.stepArrow}/></button>;})}
        </div>
        <div id="workflow-detail" className={styles.stepDetail} aria-live="polite"><strong>{step.title}</strong><span>{step.description}</span></div>
      </section>

      <section id="our-story" className={styles.story} aria-labelledby="story-title">
        <div className={styles.storyIllustration} aria-hidden="true"><span className={styles.avatarLin}><Sprout size={34}/><small>Lin · China</small></span><span className={styles.storyDots}>····<MessageCircle size={23}/>····</span><span className={styles.avatarMaya}><Users size={32}/><small>Maya · Basel</small></span></div>
        <div className={styles.storyCopy}><span className={styles.sectionKicker}>BEHIND EVERY SIGNAL, SOMEONE CARES.</span><h2 id="story-title">A farmer’s question.<br/>A team’s next decision.</h2><p>A headline leaves Lin unsure about next season. In Basel, Maya needs the right context before she responds. Follow their story through RepRadar.</p><Link href="/dashboard?tour=1" className={styles.storyLink}>Try the 2-minute walkthrough <ArrowRight size={17}/></Link><small>Fictional people. Synthetic scenario. A real workflow to explore.</small></div>
      </section>
      <div className={styles.closing}><span><Globe2 size={16}/> Different perspectives. Shared understanding.</span><Link href="/dashboard">Your workspace is ready <ArrowUpRight size={17}/></Link></div>
    </main>

    <footer className={styles.footer}><div><span>BUILT FOR THE SYNGENTA CHALLENGE</span><img src="/assets/syngenta-group.png" alt="Syngenta Group" width="122" height="38"/></div><p>RepRadar · UZH.ai Hackathon<br/><span>Independent concept · Synthetic data · Human judgment first</span></p><a href="https://github.com/yyyuanfish/RepRadar" target="_blank" rel="noreferrer">Meet the project <ArrowUpRight size={15}/></a></footer>
  </div>;
}
