"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const i=require("solid-js/web"),H=require("@opencode/plugin/gui"),I=require("effect"),O=require("solid-js"),gt=["blue","graphite","jade","violet","ice","amber"],it=[{id:"blue",base:"#05070e",accent:[77,107,254],second:[112,192,255],ink:"#a5b7ff",lightInk:"#3c53ab",colors:[[77,107,254],[112,192,255],[140,110,255],[40,200,190]]},{id:"graphite",base:"#101318",accent:[150,167,188],second:[117,138,158],ink:"#c4cfdc",lightInk:"#47576b",colors:[[150,167,188],[117,138,158],[138,148,164],[113,138,145]]},{id:"jade",base:"#071310",accent:[55,141,115],second:[84,143,139],ink:"#9acfb9",lightInk:"#28694f",colors:[[55,141,115],[84,143,139],[73,123,99],[69,141,127]]},{id:"violet",base:"#100d18",accent:[130,97,176],second:[108,122,170],ink:"#c5aedf",lightInk:"#6a438d",colors:[[130,97,176],[108,122,170],[153,113,161],[115,107,152]]},{id:"ice",base:"#071216",accent:[62,139,160],second:[92,133,164],ink:"#9ecbd6",lightInk:"#2c6376",colors:[[62,139,160],[92,133,164],[76,142,150],[100,151,168]]},{id:"amber",base:"#16110d",accent:[155,111,67],second:[135,124,103],ink:"#d7bb94",lightInk:"#805524",colors:[[155,111,67],[135,124,103],[159,128,84],[143,115,95]]}];function D(e){return it.find(r=>r.id===e)??it[0]}const dt=e=>String(e).replace(/^0\./,"."),rt=(e,r)=>`rgba(${e.join(",")},${dt(r)})`;function ut(e,r){const t=parseInt(e.slice(1),16);return`rgba(${t>>16},${t>>8&255},${t&255},${dt(r)})`}const pt=I.Schema.Struct({enabled:I.Schema.Boolean,intensity:I.Schema.Number,parallax:I.Schema.Boolean,shimmer:I.Schema.Boolean,background:I.Schema.Boolean,grain:I.Schema.Boolean,motion:I.Schema.Boolean,styleRevision:I.Schema.Number,palette:I.Schema.optional(I.Schema.Literals(gt))}),mt={enabled:!0,intensity:62,parallax:!0,shimmer:!1,background:!0,grain:!0,motion:!0,styleRevision:0,palette:"blue"},bt=H.Plugin.define({stores:{prefs:H.Store.global(pt,mt)},i18n:{en:{title:"Glass","settings.palette":"Glass palette","settings.palette.description":"Switch the background, navigation, titlebars and accents together. Does not change the native app theme.","palette.blue":"Deep blue","palette.graphite":"Smoked graphite","palette.jade":"Jade green","palette.violet":"Dusk violet","palette.ice":"Glacier cyan","palette.amber":"Warm amber","settings.motion":"Animation","settings.motion.description":"Pause all motion while keeping the glass background. Reduced motion is respected automatically.","settings.intensity":"Glass intensity","settings.intensity.description":"How much of the background shows through the panels.","settings.intensity.low":"Subtle","settings.intensity.medium":"Balanced","settings.intensity.high":"Full","settings.background":"Animated background","settings.background.description":"An aurora that drifts behind the interface.","settings.parallax":"Pointer parallax","settings.parallax.description":"The aurora follows the pointer.","settings.shimmer":"Light sweep","settings.shimmer.description":"A slow highlight travels across the frosted panels.","settings.grain":"Film grain","settings.grain.description":"Fine noise over the background, to avoid gradient banding.","command.toggle":"Toggle glass","command.toggle.description":"Turn the glassmorphism theme on or off."},zh:{title:"玻璃","settings.palette":"玻璃配色","settings.palette.description":"背景、导航、顶栏和强调色一起切换；不改动原生主题设置。","palette.blue":"深蓝极光","palette.graphite":"石墨烟灰","palette.jade":"翡翠墨绿","palette.violet":"暮色紫","palette.ice":"冰川青","palette.amber":"琥珀暖灰","settings.motion":"动画","settings.motion.description":"关闭后保留静态玻璃背景；系统减少动态效果时自动暂停。","settings.intensity":"玻璃强度","settings.intensity.description":"背景从面板透出的程度。","settings.intensity.low":"克制","settings.intensity.medium":"标准","settings.intensity.high":"通透","settings.background":"动态背景","settings.background.description":"界面背后缓慢流动的极光。","settings.parallax":"鼠标视差","settings.parallax.description":"极光跟随鼠标位置偏移。","settings.shimmer":"流光扫过","settings.shimmer.description":"一道高光缓慢掠过磨砂面板。","settings.grain":"颗粒噪点","settings.grain.description":"背景上的细噪点，避免渐变出现色带。","command.toggle":"开关玻璃","command.toggle.description":"打开或关闭玻璃拟态主题。"}}});function ht(e={}){const r=document.createElement("canvas");r.setAttribute("data-glass-aurora",""),r.setAttribute("aria-hidden","true"),r.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block";const t=r.getContext("2d");if(document.body.appendChild(r),!t)return{setPointer(){},setParallax(){},setMotion(){},refreshTheme(){},destroy(){r.remove()}};let n=0,l=0,u=0,o=0,a=0,b=!1,f=!0,m=e.motion??!0,p=e.light??!1,c=D(e.palette),x=p?"#fafafa":c.base,d=c.colors.slice(0,2);const S={x:0,y:0},v={x:0,y:0},_=window.matchMedia?.("(prefers-reduced-motion: reduce)"),E=()=>!b&&m&&!document.hidden&&!_?.matches,M=()=>{const $=getComputedStyle(document.documentElement).getPropertyValue("--v2-background-bg-deep").trim();x=p?$||"#fafafa":c.base,d=c.colors.slice(0,2)},k=(s=!1)=>{if(b)return;s&&(v.x+=(S.x-v.x)*.045,v.y+=(S.y-v.y)*.045);const $=f&&m&&!_?.matches?v.x:0,B=f&&m&&!_?.matches?v.y:0;t.clearRect(0,0,n,l),t.fillStyle=x,t.fillRect(0,0,n,l),t.globalCompositeOperation=p?"multiply":"lighter";for(let A=0;A<d.length;A++){const w=u*[8e-6,6e-6][A],P=([.16,.88][A]+Math.sin(w)*.035+$*.04)*n,y=([.05,.92][A]+Math.cos(w*1.3)*.035+B*.035)*l,z=[.72,.66][A]*Math.min(n,l)*(.94+Math.sin(w*.7)*.06),[R,F,J]=d[A],G=t.createRadialGradient(P,y,0,P,y,z);G.addColorStop(0,`rgba(${R},${F},${J},${p?.13:.26})`),G.addColorStop(.45,`rgba(${R},${F},${J},${p?.035:.07})`),G.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=G,t.beginPath(),t.arc(P,y,z,0,Math.PI*2),t.fill()}t.globalCompositeOperation="source-over"},L=()=>{!o&&E()&&(o=requestAnimationFrame(N))},N=()=>{if(o=0,!E())return;const s=performance.now();(!a||s-a>=33)&&(u+=Math.min(a?s-a:34,64),a=s,k(!0)),L()},C=()=>{cancelAnimationFrame(o),o=0,a=0,!b&&!document.hidden&&(k(),L())},T=()=>{n=r.clientWidth||window.innerWidth,l=r.clientHeight||window.innerHeight;const s=Math.min(window.devicePixelRatio||1,1,1280/Math.max(n,1));r.width=Math.max(1,Math.round(n*s)),r.height=Math.max(1,Math.round(l*s)),t.setTransform(s,0,0,s,0,0),C()},g=()=>{M(),C()},h=typeof MutationObserver>"u"?void 0:new MutationObserver(g);return h?.observe(document.head,{childList:!0,subtree:!0,characterData:!0}),window.addEventListener("resize",T),document.addEventListener("visibilitychange",C),_?.addEventListener("change",C),M(),T(),{setPointer(s,$){!f||!E()||!Number.isFinite(s)||!Number.isFinite($)||(S.x=Math.max(-1,Math.min(1,s)),S.y=Math.max(-1,Math.min(1,$)))},setParallax(s){s!==f&&(f=s,s||(S.x=0,S.y=0,v.x=0,v.y=0,k()))},setMotion(s){s!==m&&(m=s,s||(S.x=0,S.y=0,v.x=0,v.y=0),C())},refreshTheme(s,$=c.id){const B=D($);p===s&&c.id===B.id||(p=s,c=B,g())},destroy(){b||(b=!0,cancelAnimationFrame(o),o=0,window.removeEventListener("resize",T),document.removeEventListener("visibilitychange",C),_?.removeEventListener("change",C),h?.disconnect(),r.remove())}}}const q=':where([data-component="collapsed-tool-group"] > .tool-collapsible, [data-component="tool-part-wrapper"]:not([data-component="context-tool-group-list"] *) > .tool-collapsible)',Z='[data-component="composer"]',tt='[data-slot="session-turn-diff-trigger"]',Q=`:is(${q}, ${Z}, ${tt})`;function ft(e){const r=Math.max(0,Math.min(100,Number.isFinite(e.intensity)?e.intensity:62))/100,t="html[data-glass-enabled]",n=!!e.light,l=D(e.palette),u=m=>rt(l.accent,m),o=m=>ut(l.base,m),a=m=>n?`color-mix(in srgb, var(--v2-background-bg-base) ${(m*100).toFixed(1)}%, transparent)`:`rgba(255,255,255,${m.toFixed(3)})`,b=n?"var(--v2-text-text-base)":"#c3cbdb",f=n?"var(--v2-text-text-muted)":"#93a0b6";return`
${t} {
  --glass-card: ${a(n?.82:.05-r*.0265)};
  --glass-border: ${n?"rgba(30,40,55,.13)":"rgba(230,237,248,.085)"};
  --glass-accent: ${n?l.lightInk:l.id==="blue"?"#6d8bff":l.ink};
  --glass-ink: ${b}; --glass-muted: ${f};
}
/* Native shell surfaces verified on Desktop 2.2.5. Preserve dimensions, drag
   regions, window controls and native actions; only replace their material. */
${t} [data-slot=titlebar-v2] {
  background: linear-gradient(105deg,${u(.055)},transparent), ${n?a(.86):o(.66)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
${t} [data-slot=session-chat-panel] .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${u(.1)},${u(.025)}), ${n?a(.96):o(.96)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
/* Unknown timeline structures keep the opaque safety fallback above. */
${t} [data-glass-timeline-clip] { clip-path: inset(var(--glass-header-cut,0px) 0 0); }
${t} [data-slot=session-chat-panel]:has([data-glass-timeline-clip]) .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${u(.045)},transparent), ${n?a(.88):o(.64)} !important;
}
${t} [data-testid=settings-screen] {
  background: ${n?a(.86):o(e.background?.38:.96)} !important;
}
${t} [data-testid=settings-screen] .settings-panel { color: var(--glass-ink); }
${t} [data-testid=settings-screen] [data-glass-control-ink=light] { color: #fff !important; }
${t} [data-testid=settings-screen] [data-glass-control-ink=dark] { color: #000 !important; }
${t} [data-testid=settings-screen] .settings [role=tab][aria-selected=true] {
  background: linear-gradient(110deg,${u(.12)},${n?a(.84):"rgba(255,255,255,.035)"}) !important;
  box-shadow: inset 1px 0 0 ${n?"rgba(30,40,55,.2)":"rgba(230,237,248,.18)"};
}
${t} [data-testid=settings-screen] [data-slot=tabs-v2-trigger-wrapper]:has([role=tab][aria-selected=true]) {
  background: transparent !important;
}
${t} [data-testid=settings-screen] [data-glass-settings-surface] {
  background: ${n?a(.84):"rgba(255,255,255,.035)"} !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${t} [data-testid=settings-screen] [data-glass-settings-surface=nested] {
  background: ${n?a(.76):"rgba(255,255,255,.022)"} !important;
  box-shadow: none;
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]) {
  background: ${n?`linear-gradient(120deg,${a(.84)},${u(.04)})`:`linear-gradient(120deg,rgba(255,255,255,.047),${u(.026)})`} !important;
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  color: var(--glass-ink) !important;
  transition: background-color .16s ease, border-color .16s ease;
}
${t} [data-action=vertical-tabs-new-session] {
  background: linear-gradient(120deg,${u(.13)},${u(.035)}) !important;
  border-color: var(--glass-border);
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):is(:hover,[data-state=pressed]) {
  background: linear-gradient(120deg,${u(.18)},${u(.055)}) !important;
  border-color: ${u(.32)};
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):focus-visible {
  outline: 2px solid var(--glass-accent); outline-offset: 1px;
}
${e.background?`
${t}, ${t} body { background: transparent !important; }
${t} #root > .bg-v2-background-bg-deep { background: transparent !important; }
${t} [data-slot=session-chat-panel] > .bg-v2-background-bg-base,
${t} [data-component=new-session] {
  background: ${n?a(.64):o(.04)} !important;
  backdrop-filter: none;
  box-shadow: none;
  border: .5px solid var(--glass-border);
}
${t} :is([data-slot=vertical-tabs-mount], [data-slot=vertical-tabs-peek-surface]) {
  background: ${n?a(.72):l.id==="blue"?"rgba(10,13,22,.42)":o(.42)} !important;
  backdrop-filter: blur(26px) saturate(140%);
  border-inline-end: 1px solid var(--glass-border);
}
[data-glass-aurora], [data-glass-veil], [data-glass-grain] {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
}
[data-glass-veil] { background: ${n?`linear-gradient(180deg,${a(.24)},${a(.48)})`:`
  radial-gradient(1200px 700px at 16% 5%, ${u(.09)}, transparent 60%),
  radial-gradient(900px 620px at 88% 92%, ${rt(l.second,.065)}, transparent 62%),
  linear-gradient(180deg, ${o(.55)}, ${o(.82)})`}; }
`:""}
${e.background&&e.grain?`
[data-glass-grain] {
  opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
`:""}
/* Activity card: decorate the WHOLE collapsible, not its trigger alone. */
${t} ${q} {
  border-radius: 12px; overflow: hidden; margin-block: 0 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-card) !important;
  backdrop-filter: blur(14px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${t} ${q} > [data-slot=collapsible-trigger] {
  width: 100%; padding: 9px 13px; min-height: 38px;
  background: transparent !important; border: 0; box-shadow: none;
  border-radius: 0; transition: background-color .16s ease;
}
${t} ${q} > [data-slot=collapsible-trigger]:hover { background: ${u(.045)} !important; }
${t} ${q} [data-component=context-tool-group-trigger] {
  color: var(--glass-ink); font-size: 12.5px; font-weight: 600;
}
${t} [data-slot=basic-tool-tool-subtitle] { color: ${n?f:"#a9b6cd"}; }
${t} ${q} > [data-slot=collapsible-trigger]:focus-visible {
  outline: 2px solid ${u(.5)}; outline-offset: -2px;
}
${t} ${q}[data-expanded] > [data-slot=collapsible-content] { padding: 0 13px 11px; }
${t} ${q} [data-slot=context-tool-group-item] { min-width: 0; }
${t} ${q} [data-slot=context-tool-group-item] [data-slot=collapsible-trigger]:not([data-component=reasoning-part] *) {
  height: auto; min-height: 38px; padding-block: 4px; align-items: flex-start;
}
${t} ${q} [data-slot=context-tool-group-item] [data-component=tool-trigger]:not([data-component=reasoning-part] *) {
  height: auto; content-visibility: visible;
}
${t} ${q} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info]:not([data-component=reasoning-part] *) { flex: 1; width: 100%; }
${t} ${q} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-structured]:not([data-component=reasoning-part] *) { width: 100%; }
${t} ${q} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-main]:not([data-component=reasoning-part] *) {
  flex: 1; min-width: 0; flex-direction: column; align-items: stretch; gap: 5px; text-align: start;
}
${t} ${q} [data-slot=basic-tool-tool-title] { align-self: flex-start; text-align: start; }
${t} ${q} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-subtitle]:not([data-component=reasoning-part] *):not(.subagent-link):not(.webfetch-link) {
  display: block; max-width: 100%; padding: 7px 11px;
  background: ${n?"rgba(30,45,75,.045)":o(.24)};
  border-inline-start: 2px solid ${u(.28)}; border-radius: 0 7px 7px 0;
  font-family: var(--font-family-mono, ui-monospace, Consolas, monospace);
  font-size: 12px; line-height: 1.75;
}
${t} ${q} [data-slot=collapsible-arrow] { color: #66718a; transition: transform .18s ease; }
/* Native status content remains truthful: do not synthesize durations or completion. */
${t} ${q} :is([data-slot=tool-status-suffix], [data-slot=tool-status-tail]) {
  font-size: 11px; font-variant-numeric: tabular-nums; color: var(--glass-muted);
}
${t} ${q} [data-slot=tool-status-active] { color: ${n?"#27864d":"#7fd6a5"}; }
${t} ${q} [data-component=reasoning-part] > .tool-collapsible > [data-slot=collapsible-trigger] {
  color: ${n?"#7056a4":"#b9a6e8"};
}
${t} [data-component=reasoning-part] [data-slot=basic-tool-tool-title] {
  color: ${n?"#7056a4":"#b9a6e8"}; font-size: 11px;
}
${t} [data-component=reasoning-part]:not([data-component=context-tool-group-list] *) > .tool-collapsible > [data-slot=collapsible-trigger] {
  inline-size: fit-content; padding: 2px 8px; border-radius: 6px;
  background: rgba(185,166,232,.08); border: 1px solid rgba(185,166,232,.22);
  color: ${n?"#7056a4":"#b9a6e8"}; font-size: 11px;
}
${t} :is([data-slot=bash-command], [data-component=bash-output]) {
  background: ${n?"rgba(30,45,75,.045)":o(.24)} !important;
  border: 0; border-inline-start: 2px solid ${u(.28)};
  border-radius: 0 7px 7px 0; padding: 7px 11px;
  font-size: 12px; line-height: 1.75;
}
/* Selected sessions: the reference gradient and thin left-hand indicator. */
${t} [data-slot=sidebar-inbox-item] { border-radius: 8px; transition: background-color .16s ease; }
${t} [data-slot=sidebar-inbox-item][data-state=active] {
  background: linear-gradient(90deg,${u(.22)},${u(.05)}) !important;
  box-shadow: inset 2px 0 0 var(--glass-accent);
}
${t} [data-slot=sidebar-inbox-item][data-state=active] > span { color: ${n?b:"#eaf0ff"}; }
${t} [data-slot=sidebar-inbox-item]:hover:not([data-state=active]) { background: ${u(.055)} !important; }
/* Composer is a real form in 2.2.5; never touch its editable content or controls. */
${t} ${Z} {
  background: ${n?a(.86):"rgba(255,255,255,.045)"} !important;
  backdrop-filter: blur(22px) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}
${t} ${Z}:focus-within {
  border-color: ${u(.46)};
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045) !important;
}
${t} [data-component=composer-scroll] > .pointer-events-none { color: ${n?f:"#7b8699"}; }
/* Existing real diff chips preserve filename, navigation and +/- contents. */
${t} ${tt} {
  width: fit-content; max-width: 100%; display: inline-flex; align-items: center; gap: 9px;
  border-radius: 9px; padding: 6px 11px; border: 1px solid var(--glass-border);
  background: ${n?a(.82):"rgba(255,255,255,.045)"} !important;
  font-size: 12px; font-variant-numeric: tabular-nums;
  transition: background-color .16s ease;
}
${t} [data-slot=session-turn-diffs] { background: transparent; }
${t} ${tt}:hover { background: ${n?a(.94):"rgba(255,255,255,.07)"} !important; }
${t} [data-slot=session-turn-diff-filename] { color: ${n?b:"#c9d2e0"}; }
${t} ${tt} [data-component=file-icon] { color: var(--glass-accent); }
${t} :is([data-component=menu-v2-content], [data-component=popover-content], [data-slot=dialog-container]) {
  background: ${n?a(.96):o(.94)} !important;
  border: 1px solid var(--glass-border); backdrop-filter: blur(22px);
}
/* Optional extra, not part of the reference; the new skin defaults it OFF. */
${e.shimmer?`
${t} ${Q} {
  background-image: linear-gradient(105deg,transparent 36%,rgba(255,255,255,.035) 50%,transparent 64%);
  background-size: 260% 100%; background-repeat: no-repeat;
  animation: glass-shimmer 20s ease-in-out infinite;
}
@keyframes glass-shimmer { 0%,70% { background-position: 180% 0; } 95%,100% { background-position: -80% 0; } }
`:""}
html[data-glass-paused] ${Q} { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  ${t} ${Q} { animation: none !important; transition: none !important; }
  ${t} [data-slot=collapsible-arrow] { transition: none !important; }
}
@supports not (backdrop-filter: blur(1px)) {
  ${t} ${q}, ${t} ${Z} { background: ${n?a(.96):"rgba(10,13,22,.96)"} !important; }
}
/* Structural enhancement. Host-owned rows and controls remain in place. */
${t} [data-glass-activity-host] {
  border: 0 !important; background: transparent !important; backdrop-filter: none !important;
  box-shadow: none !important; overflow: visible !important; margin: 0 !important; transition: none !important;
}
${t} [data-glass-activity-host] > [data-slot=collapsible-trigger] { display: none !important; }
${t} [data-glass-activity-host] > [data-slot=collapsible-content] { padding: 0 !important; }
${t} [data-glass-activity-host] [data-component=context-tool-group-list] { gap: 0; }
${t} [data-glass-activity-header] {
  display: flex; align-items: center; gap: 9px; width: 100%; min-width: 0;
  min-height: 40px; margin: 0 0 12px; padding: 9px 13px; text-align: start;
  border: 1px solid var(--glass-border); border-radius: 12px;
  background: var(--glass-card); color: var(--glass-ink);
  cursor: pointer; font: inherit; font-size: 12px;
}
${t} [data-glass-activity-header][aria-expanded=true] { border-radius: 12px 12px 0 0; border-bottom: 0; margin-bottom: 0; }
${t} [data-glass-activity-arrow] { color: #66718a; transition: transform .18s ease; flex: none; }
${t} [data-glass-activity-header][aria-expanded=true] [data-glass-activity-arrow] { transform: rotate(90deg); }
${t} [data-glass-activity-title] { font-weight: 600; margin-inline-end: auto; }
${t} :is([data-glass-activity-status],[data-glass-activity-duration],[data-glass-activity-thinking]) {
  padding: 2px 7px; border-radius: 6px; font-size: 11px; font-variant-numeric: tabular-nums;
  white-space: nowrap; background: rgba(255,255,255,.04); color: var(--glass-muted);
  border: 1px solid var(--glass-border);
}
${t} [data-glass-activity-thinking] { color: ${n?"#7056a4":"#b9a6e8"}; background: rgba(185,166,232,.08); }
${t} [data-glass-activity-header][data-status=error] { border-color: rgba(232,117,127,.38); }
${t} [data-glass-activity-header][data-status=error] [data-glass-activity-status] { color: ${n?"#b82c40":"#e8757f"}; }
${t} [data-glass-activity-header][data-status=interrupted] [data-glass-activity-status] { color: ${n?"#946116":"#e0b062"}; }
${t} [data-glass-activity-header][data-busy]:not([data-status=error]) [data-glass-activity-status] {
  color: ${n?"#27864d":"#7fd6a5"}; animation: glass-activity-busy 1.6s ease-in-out infinite;
}
${t} [data-glass-activity-member] {
  padding: 0 13px 7px; margin: 0 !important;
  border-inline: 1px solid var(--glass-border); background: var(--glass-card);
  animation: glass-activity-enter .18s ease-out;
}
${t} [data-glass-activity-last] { border-bottom: 1px solid var(--glass-border); border-radius: 0 0 12px 12px; margin-bottom: 12px !important; }
${t} [data-glass-activity-hidden] { display: none !important; }
${t} [data-glass-activity-header]:focus-visible { outline: 2px solid ${u(.65)}; outline-offset: 2px; }
@keyframes glass-activity-busy { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
@keyframes glass-activity-enter { from { opacity: .3; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
${t} [data-glass-model-controls] { display: flex; align-items: center; gap: 6px; overflow-x: auto; }
${t} [data-glass-model-controls] > div { display: contents; }
${t} [data-glass-model-collapsed] [data-glass-native-model] { display: none !important; }
${t} [data-glass-model-toggle] {
  flex: 0 1 auto; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  padding: 4px 10px; min-height: 27px; border-radius: 99px; border: 1px solid var(--glass-border);
  background: ${u(.07)}; color: var(--glass-ink); font: inherit; font-size: 12px; cursor: pointer;
}
${t} [data-glass-vitals] { position: relative; flex: 0 1 auto; min-width: 0; max-width: 58vw; }
${t} [data-glass-model-toggle][aria-expanded=true] { flex: none; }
${t} [data-glass-vitals] > summary { display: none; cursor: pointer; list-style: none; font-size: 12px; }
${t} [data-glass-vital-list] { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
${t} [data-glass-vital] :is(button,[data-component=button-v2]) {
  min-height: 24px; height: auto; padding: 3px 9px; border-radius: 99px;
  border: 1px solid var(--glass-border); background: rgba(255,255,255,.045);
  color: var(--glass-muted); font-size: 11.5px; font-variant-numeric: tabular-nums;
}
${t} [data-glass-vital][data-tone=warning] button { color: ${n?"#946116":"#e0b062"}; border-color: rgba(224,176,98,.28); }
${t} [data-glass-vitals][data-compact=true] > summary { display: block; padding: 4px 9px; border: 1px solid var(--glass-border); border-radius: 99px; }
${t} [data-glass-vitals][data-compact=true][open] [data-glass-vital-list] {
  position: absolute; inset-inline-end: 0; top: 32px; z-index: 80;
  width: min(480px,80vw); padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border);
  background: ${n?a(.98):o(.97)}; box-shadow: 0 12px 40px rgba(0,0,0,.3);
}
${t} [data-glass-native-metric] { display: none !important; }
html[data-glass-paused] :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
html[data-glass-paused] :is(${Q},[data-slot=collapsible-arrow]) { transition: none !important; }
html[data-glass-paused] [data-action^="vertical-tabs-"] { transition: none !important; }
@media (prefers-reduced-motion: reduce) {
  ${t} :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
  ${t} [data-action^="vertical-tabs-"] { transition: none !important; }
}
@media (max-width: 900px) {
  ${t} [data-glass-activity-header] { flex-wrap: wrap; gap: 6px; }
  ${t} [data-glass-activity-duration] { margin-inline-start: auto; }
}
`}var vt=i.template("<span data-glass-vital>"),yt=i.template("<button type=button>"),xt=i.template("<details data-glass-vitals data-glass-layout-owned><summary aria-label=会话统计>统计 ▾</summary><div data-glass-vital-list>");const $t=new Set(["speed","ttft","context","turn","chatgpt-quota"]);function wt(e){const r=t=>{const n=O.createMemo(()=>{try{return t.item.show(t.input)}catch{return}});return i.createComponent(O.Show,{get when(){return n()},children:l=>(()=>{var u=vt();return i.insert(u,i.createComponent(e.ui.Tooltip,{get value(){return l().title??l().label},get children(){return i.createComponent(O.Show,{get when(){return l().rows?.length},get fallback(){return(()=>{var o=yt();return o.$$click=()=>l().run?.(),i.insert(o,()=>l().label),i.effect(()=>o.disabled=!l().run),o})()},get children(){return i.createComponent(e.ui.Menu,{trigger:"button",get label(){return l().label},placement:"bottom-end",get items(){return(l().rows??[]).map(o=>({label:o.detail?`${o.label} · ${o.detail}`:o.label,icon:o.icon,onSelect:()=>o.run?.()}))}})}})}})),i.effect(o=>{var a=t.item.id,b=l().label,f=l().title??"",m=l().tone;return a!==o.e&&i.setAttribute(u,"data-glass-metric-id",o.e=a),b!==o.t&&i.setAttribute(u,"data-glass-metric-label",o.t=b),f!==o.a&&i.setAttribute(u,"data-glass-metric-title",o.a=f),m!==o.o&&i.setAttribute(u,"data-tone",o.o=m),o},{e:void 0,t:void 0,a:void 0,o:void 0}),u})()})};return e.add(H.Slot,{at:"session.header",order:80,render:t=>{let n;const l=a=>{a.target instanceof Element&&a.target.closest("[role=menu],[role=menuitem],[data-component=tooltip]")||t.compact&&n&&a.target instanceof Node&&!n.contains(a.target)&&(n.open=!1)},u=a=>{if(a.key!=="Escape"||!t.compact||!n?.open)return;Array.from(document.querySelectorAll("[role=menu],[role=dialog]")).some(f=>f.checkVisibility())||(n.open=!1,n.querySelector("summary")?.focus({preventScroll:!0}))};document.addEventListener("pointerdown",l),document.addEventListener("keydown",u,!0),O.onCleanup(()=>{document.removeEventListener("pointerdown",l),document.removeEventListener("keydown",u,!0)});const o=()=>e.list(H.ComposerPill).filter(a=>$t.has(a.id)&&!a.menu);return i.createComponent(O.Show,{get when(){return i.memo(()=>!!(t.active&&e.stores.prefs.value.enabled))()&&o().length>0},get children(){var a=xt(),b=a.firstChild,f=b.nextSibling,m=n;return typeof m=="function"?i.use(m,a):n=a,i.insert(f,i.createComponent(O.For,{get each(){return o()},children:p=>i.createComponent(r,{item:p,input:t})})),i.effect(p=>{var c=t.compact,x=!t.compact;return c!==p.e&&i.setAttribute(a,"data-compact",p.e=c),x!==p.t&&(a.open=p.t=x),p},{e:void 0,t:void 0}),a}})}})}i.delegateEvents(["click"]);const Y=e=>e&&typeof e=="object"?e:{},ot=e=>{const r=Number(e);return Number.isFinite(r)&&r>0?r:0};function kt(e){const r=new Map;for(const t of e){const n=Y(t);if(n.type!=="assistant"||!Array.isArray(n.content))continue;let l=0;for(const u of n.content){const o=Y(u),a=Y(o.time),b=Y(o.state);if(o.type!=="tool"&&o.type!=="reasoning")continue;const f=o.type==="tool"?String(o.id??""):`${n.id}:reasoning:${l++}`;if(!f)continue;const m=ot(a.completed)||void 0,p=o.type==="reasoning"?m?"completed":"thinking":b.status==="error"?/abort|interrupt|cancel/i.test(String(Y(b.error).type))?"interrupted":"error":b.status==="completed"?"completed":b.status==="running"?"running":"preparing";r.set(f,{id:f,type:o.type,name:String(o.name??"工具"),state:p,start:ot(a.ran)||ot(a.created),end:m})}}return r}function At(e,r){const t=[...new Map(e.map(a=>[a.id,a])).values()],n=t.filter(a=>a.type==="tool"),l=a=>a.start?Math.max(0,(a.end??r)-a.start):0,u=n.some(a=>a.state==="error")?"error":n.some(a=>a.state==="running")?"running":n.some(a=>a.state==="preparing")?"preparing":t.some(a=>a.state==="thinking")?"thinking":n.some(a=>a.state==="interrupted")?"interrupted":"completed",o=[...new Set(n.map(a=>a.name))];return{count:n.length,names:o,state:u,busy:t.some(a=>["running","preparing","thinking"].includes(a.state)),running:n.filter(a=>["running","preparing"].includes(a.state)).length,toolMs:n.reduce((a,b)=>a+l(b),0),thinkingMs:t.filter(a=>a.type==="reasoning").reduce((a,b)=>a+l(b),0),timed:n.some(a=>a.start>0)}}const St={preparing:"准备中",running:"运行中",thinking:"思考中",completed:"已完成",error:"失败",interrupted:"已中断"};function st(e){return e<6e4?`${(e/1e3).toFixed(1)}秒`:`${Math.floor(e/6e4)}分${Math.floor(e%6e4/1e3)}秒`}function Et(e,r){const t=[];let n=[],l=[];const u=()=>{l.some(o=>o.type==="tool")&&t.push({items:n,parts:l}),n=[],l=[]};for(const o of e){const a=o.ids.map(b=>r.get(b));if(!o.ids.length||a.some(b=>!b)){u();continue}n.push(o.item),l.push(...a)}return u(),t}function Ct(e){const r=e.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!r)return!1;const t=r.slice(1,4).map(Number);return Number(r[4]??1)>=.9&&Math.max(...t)-Math.min(...t)<=5}function Mt(e,r,t=!1){const n=a=>{const b=a.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!b||Number(b[4]??1)<1)return;const f=b.slice(1,4).map(m=>{const p=Number(m)/255;return p<=.04045?p/12.92:((p+.055)/1.055)**2.4});return f[0]*.2126+f[1]*.7152+f[2]*.0722},l=n(e),u=n(r);if(l===void 0||u===void 0)return;const o=(a,b)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(!(!t&&o(l,u)>=4.5))return o(l,1)>o(l,0)?"light":"dark"}function lt(e,r){return![e.top,e.bottom,r.top,r.bottom].every(Number.isFinite)||e.top>=r.bottom||e.bottom<=r.top?0:Math.max(0,Math.min(e.bottom-r.top,r.bottom-r.top))}function Lt(){const e=new Map,r=new Map,t=new Map,n=new Map,l=(m,p)=>{p===null?m.removeAttribute("data-glass-control-ink"):m.setAttribute("data-glass-control-ink",p),n.delete(m)},u=(m,p)=>{p===null?m.removeAttribute("data-glass-settings-surface"):m.setAttribute("data-glass-settings-surface",p),t.delete(m)},o=(m,p)=>{p.value?m.style.setProperty("--glass-header-cut",p.value,p.priority):m.style.removeProperty("--glass-header-cut"),p.attribute===null?m.removeAttribute("data-glass-timeline-clip"):m.setAttribute("data-glass-timeline-clip",p.attribute),e.delete(m),r.delete(m)},a={sync(){const m=new Set;for(const c of Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")))if(c.checkVisibility())for(const x of Array.from(c.querySelectorAll(".session-header-layout"))){const d=x.parentElement?.parentElement,S=d?.closest(".scroll-view__viewport"),v=Array.from(S?.children??[]).find(k=>k instanceof HTMLElement&&k.style.position==="relative"&&k.style.overflowX==="clip");if(!d?.classList.contains("pointer-events-auto")||!v||v.contains(d)||!d.checkVisibility())continue;const _=d.parentElement?.hasAttribute("data-session-title")?d.parentElement:d;if(!S)continue;const E=lt(_.getBoundingClientRect(),v.getBoundingClientRect());if(!E)continue;r.set(v,{shield:_,viewport:S}),e.has(v)||e.set(v,{value:v.style.getPropertyValue("--glass-header-cut"),priority:v.style.getPropertyPriority("--glass-header-cut"),attribute:v.getAttribute("data-glass-timeline-clip")});const M=`${E.toFixed(2)}px`;v.style.getPropertyValue("--glass-header-cut")!==M&&v.style.setProperty("--glass-header-cut",M),v.getAttribute("data-glass-timeline-clip")===null&&v.setAttribute("data-glass-timeline-clip",""),m.add(v)}for(const[c,x]of e)m.has(c)||o(c,x);const p=document.querySelector("[data-testid=settings-screen]");for(const[c,x]of n)p?.contains(c)||l(c,x);if(p?.checkVisibility())for(const c of Array.from(p.querySelectorAll(".settings-panel button"))){if(c.matches(":disabled,[aria-disabled=true]")){n.has(c)&&l(c,n.get(c));continue}const x=getComputedStyle(c),d=Mt(x.backgroundColor,x.color,n.has(c));if(!d){n.has(c)&&l(c,n.get(c));continue}n.has(c)||n.set(c,c.getAttribute("data-glass-control-ink")),c.getAttribute("data-glass-control-ink")!==d&&c.setAttribute("data-glass-control-ink",d)}for(const[c,x]of t)p?.contains(c)||u(c,x);if(p?.checkVisibility())for(const c of Array.from(p.querySelectorAll(".settings-panel :is(div,input:not([type]),input[type=text],input[type=number])"))){if(t.has(c)||!c.checkVisibility()||c.closest("button,[role=button],[role=switch],[role=alert],pre,code,[data-glass-palette-options]"))continue;const x=getComputedStyle(c),d=c.getBoundingClientRect();d.width<120||d.height<28||x.backgroundImage!=="none"||!Ct(x.backgroundColor)||(t.set(c,c.getAttribute("data-glass-settings-surface")),c.setAttribute("data-glass-settings-surface",c.parentElement?.closest("[data-glass-settings-surface]")?"nested":"card"))}},destroy(){document.removeEventListener("scroll",b,!0),window.removeEventListener("resize",f);for(const[m,p]of e)o(m,p);for(const[m,p]of t)u(m,p);for(const[m,p]of n)l(m,p)}},b=m=>{const p=[];for(const[c,{shield:x,viewport:d}]of r){if(m?.type==="scroll"&&m.target!==d)continue;const S=lt(x.getBoundingClientRect(),c.getBoundingClientRect());p.push({content:c,value:`${S.toFixed(2)}px`})}for(const{content:c,value:x}of p)c.style.getPropertyValue("--glass-header-cut")!==x&&c.style.setProperty("--glass-header-cut",x)},f=()=>a.sync();return document.addEventListener("scroll",b,{capture:!0,passive:!0}),window.addEventListener("resize",f,{passive:!0}),a}const W=(e,r)=>{e.textContent!==r&&(e.textContent=r)},Pt={shell:"Shell",execute:"执行",read:"读取",patch:"写入",edit:"编辑",write:"写入",grep:"搜索",glob:"查找"};function qt(e){let r=!1,t;const n=new Map,l=new Map,u=new WeakSet,o=new Map,a=new Map,b=new Set,f=Lt(),m=g=>g.forEach(h=>{h.removeAttribute("data-glass-activity-member"),h.removeAttribute("data-glass-activity-hidden"),h.removeAttribute("data-glass-activity-last")}),p=(g,h=new Set)=>{m(g.members.filter(s=>!h.has(s))),g.header.remove(),n.delete(g.first)},c=(g,h)=>{g.removeAttribute("data-glass-activity-host"),h.trigger.isConnected&&h.trigger.getAttribute("aria-expanded")!==h.expanded&&h.trigger.click(),l.delete(g)},x=g=>{g.buttons.forEach(h=>h.removeAttribute("data-glass-native-model")),g.form.removeAttribute("data-glass-model-collapsed"),g.controls.removeAttribute("data-glass-model-controls"),g.toggle.remove(),a.delete(g.form)},d=(g,h)=>{!h&&g.buttons.some(s=>s.contains(document.activeElement))&&g.toggle.focus({preventScroll:!0}),g.form.toggleAttribute("data-glass-model-collapsed",!h),g.toggle.setAttribute("aria-expanded",String(h)),W(g.toggle,h?"收起 ▴":`${g.toggle.title} ▾`)},S=g=>{const h=g.querySelector("[data-slot=composer-controls]");if(!h?.querySelector("[data-action=composer-model]"))return;const s=Array.from(h.querySelectorAll("button:not([data-glass-model-toggle])"));if(!s.length||s.length>8)return;let $=a.get(g);if($&&$.controls!==h&&(x($),$=void 0),!$){const A=document.createElement("button");A.type="button",A.setAttribute("data-glass-model-toggle",""),A.setAttribute("data-glass-layout-owned",""),A.setAttribute("aria-label","展开或收起模式、模型和推理选项"),$={form:g,controls:h,toggle:A,buttons:[]},a.set(g,$);const w=$;A.addEventListener("click",()=>d(w,w.form.hasAttribute("data-glass-model-collapsed"))),h.prepend(A),h.setAttribute("data-glass-model-controls",""),d($,!1)}for(const A of $.buttons)s.includes(A)||A.removeAttribute("data-glass-native-model");$.buttons=s,s.forEach(A=>A.setAttribute("data-glass-native-model","")),$.toggle.isConnected||h.prepend($.toggle);const B=s.map(A=>A.textContent?.trim()).filter(Boolean).join(" / ");W($.toggle,g.hasAttribute("data-glass-model-collapsed")?`${B} ▾`:"收起 ▴"),$.toggle.title=B},v=()=>{const g=Array.from(document.querySelectorAll("[data-glass-vitals]")).filter(s=>s.checkVisibility()),h=new Set;for(const s of g){const $=s.closest("[data-slot=session-chat-panel]")??s.closest("main");if(!$)continue;const B=Array.from(s.querySelectorAll("[data-glass-metric-id]"));for(const A of Array.from($.querySelectorAll("[data-slot=session-plugin-pill]"))){const w=A.getAttribute("data-glass-native-metric"),P=B.find(y=>y.dataset.glassMetricId===w)??B.find(y=>A.textContent?.trim()===y.dataset.glassMetricLabel||!!y.dataset.glassMetricTitle&&A.getAttribute("aria-label")===y.dataset.glassMetricTitle);P&&(A.setAttribute("data-glass-native-metric",P.dataset.glassMetricId),h.add(A),b.add(A))}}for(const s of b)h.has(s)||(s.removeAttribute("data-glass-native-metric"),b.delete(s))},_=g=>{const h=kt(e()),s=new Set,$=new Set;for(const w of g)for(const P of Array.from(w.querySelectorAll("[data-component=collapsed-tool-group] > .tool-collapsible"))){const y=P.querySelector(":scope > [data-slot=collapsible-trigger]");!y||u.has(P)||(u.add(P),!(y.getAttribute("aria-expanded")!=="false"||P.querySelector("[data-component=context-tool-group-list]"))&&(l.set(P,{trigger:y,expanded:"false"}),o.set(P,Date.now()+1e3),y.click()))}const B=(w,P)=>{const y=At(P,Date.now());if(!y.count||!w.length)return;const z=w[0];s.add(z);let R=n.get(z);if(!R){const V=document.createElement("button");V.type="button",V.setAttribute("data-glass-activity-header",""),V.setAttribute("data-glass-layout-owned","");const U=document.createElement("span");U.setAttribute("data-glass-activity-arrow",""),U.textContent="▸",U.setAttribute("aria-hidden","true");const et=document.createElement("span"),at=document.createElement("span"),nt=document.createElement("span"),K=document.createElement("span");et.setAttribute("data-glass-activity-title",""),at.setAttribute("data-glass-activity-thinking",""),nt.setAttribute("data-glass-activity-status",""),K.setAttribute("data-glass-activity-duration",""),K.title="各工具执行时长累计；并行调用的时长可能重叠",V.append(U,et,at,nt,K),R={first:z,members:[],ids:[],header:V,title:et,thinking:at,status:nt,duration:K},n.set(z,R);const ct=R;V.addEventListener("click",()=>{ct.manual=V.getAttribute("aria-expanded")!=="true",L()})}const F=R;m(F.members.filter(V=>!w.includes(V))),F.members=w,F.ids=[...new Set(P.map(V=>V.id))],z.previousElementSibling!==F.header&&z.before(F.header);const J=y.busy,G=F.manual??J;F.header.setAttribute("aria-expanded",String(G)),F.header.setAttribute("data-status",y.state),F.header.toggleAttribute("data-busy",J),F.header.setAttribute("data-tool-count",String(y.count)),W(F.title,`${y.count} 个${y.names.length===1?` ${Pt[y.names[0]]??y.names[0]} `:"工具"}调用`),W(F.thinking,y.thinkingMs>0?`思考 ${st(y.thinkingMs)}`:""),F.thinking.hidden=y.thinkingMs<=0,W(F.status,`${St[y.state]}${y.state==="error"&&y.running?` · ${y.running}运行中`:""}`),W(F.duration,y.timed?`累计 ${st(y.toolMs)}`:""),w.forEach((V,U)=>{V.setAttribute("data-glass-activity-member",""),V.toggleAttribute("data-glass-activity-hidden",!G),V.toggleAttribute("data-glass-activity-last",U===w.length-1)});const j=z.closest("[data-component=collapsed-tool-group] > .tool-collapsible"),X=j?.querySelector(":scope > [data-slot=collapsible-trigger]");j&&X&&($.add(j),l.has(j)||l.set(j,{trigger:X,expanded:X.getAttribute("aria-expanded")}),X.getAttribute("aria-expanded")==="false"&&X.click(),j.setAttribute("data-glass-activity-host",""))};for(const w of g)for(const P of Array.from(w.querySelectorAll("[data-component=context-tool-group-list]"))){const y=Array.from(P.children).filter(z=>z instanceof HTMLElement&&z.getAttribute("data-slot")==="context-tool-group-item").map(z=>({item:z,ids:[...new Set(Array.from(z.querySelectorAll("[data-timeline-part-id]")).map(R=>R.getAttribute("data-timeline-part-id")))]}));for(const z of Et(y,h))B(z.items,z.parts)}const A=new Set([...n.values()].filter(w=>s.has(w.first)).flatMap(w=>w.members));for(const w of[...n.values()])(!s.has(w.first)||!w.first.isConnected)&&p(w,A);for(const[w,P]of[...l])$.has(w)?o.delete(w):(o.get(w)??0)<=Date.now()&&(o.delete(w),c(w,P))};let E=0;const M=g=>{g.target instanceof Element&&g.target.closest("[data-slot=session-timeline-scroll]")&&(E=Date.now()+120)},k=()=>{if(t=void 0,r||document.hidden)return;const g=E-Date.now();if(g>0){t=window.setTimeout(k,g);return}const h=Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")).filter(s=>s.checkVisibility());h.forEach(s=>s.querySelectorAll("[data-component=composer]").forEach(S)),document.querySelectorAll("[data-component=new-session] [data-component=composer]").forEach(s=>{s.checkVisibility()&&S(s)});for(const s of[...a.values()])s.form.isConnected||x(s);_(h),v(),f.sync()},L=()=>{!r&&t===void 0&&(t=window.setTimeout(k,40))},N=new MutationObserver(g=>{g.some(h=>!(h.target instanceof Element?h.target:h.target.parentElement)?.closest("[data-glass-layout-owned]"))&&L()});N.observe(document.body,{childList:!0,subtree:!0,characterData:!0,attributes:!0,attributeFilter:["aria-expanded","data-state"]});const C=window.setInterval(L,500),T=g=>{if(g.key!=="Escape")return;if(!Array.from(document.querySelectorAll("[role=dialog],[role=menu]")).some(s=>s.checkVisibility()))for(const s of a.values())d(s,!1)};return document.addEventListener("visibilitychange",L),window.addEventListener("keydown",T,!0),document.addEventListener("scroll",M,{capture:!0,passive:!0}),L(),{destroy(){r=!0,N.disconnect(),window.clearInterval(C),window.clearTimeout(t),document.removeEventListener("visibilitychange",L),window.removeEventListener("keydown",T,!0),document.removeEventListener("scroll",M,!0),f.destroy();for(const g of[...n.values()])p(g);for(const[g,h]of[...l])c(g,h);o.clear();for(const g of[...a.values()])x(g);b.forEach(g=>g.removeAttribute("data-glass-native-metric")),b.clear()}}}var zt=i.template('<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:0.5px solid var(--v2-border-border-muted)"><div style=flex:1;min-width:0><div style=font-size:13px;color:var(--v2-text-text-base)></div><div style=font-size:12px;color:var(--v2-text-text-muted);margin-top:2px></div></div><div style=flex:none>'),Ft=i.template("<div role=group data-glass-palette-options style=display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;width:min(280px,42vw)>"),Tt=i.template("<div style=display:flex;align-items:center;gap:10px><input type=range min=0 max=100 step=1 style=width:140px><span style=font-size:12px;color:var(--v2-text-text-muted);min-width:30px;text-align:right;font-variant-numeric:tabular-nums>"),_t=i.template('<div data-glass-settings style="padding:4px 0 24px">'),Vt=i.template('<button type=button style="display:flex;align-items:center;gap:7px;padding:7px 9px;border-radius:8px;color:var(--v2-text-text-base);cursor:pointer;font-size:12px;text-align:start"><span aria-hidden=true style=width:9px;height:9px;border-radius:50%;flex-shrink:0>');const Bt=H.Plugin.define({...bt,main(e){e.log.write("info","GLASS_FULL_V1 main loaded")},setup(e){console.info("GLASS_FULL_V1 setup started");const r=e.stores.prefs,t=wt(e);let n;O.createEffect(()=>{r.value.enabled?n??=qt(()=>{try{const d=e.sessions.current();return d?.server.data.session.message.list(d.id)??[]}catch{return[]}}):(n?.destroy(),n=void 0)}),r.value.styleRevision<1&&r.update(d=>{d.shimmer=!1,d.styleRevision=1});const l=document.documentElement,u=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>l.toggleAttribute("data-glass-paused",!r.value.motion||document.hidden||u.matches);document.addEventListener("visibilitychange",o),u.addEventListener("change",o);let a,b,f;const m=()=>{a||(a=ht({motion:r.value.motion,light:e.appearance.mode()==="light",palette:r.value.palette})),b||(b=document.createElement("div"),b.setAttribute("data-glass-veil",""),b.setAttribute("aria-hidden","true"),document.body.appendChild(b)),!f&&r.value.grain&&(f=document.createElement("div"),f.setAttribute("data-glass-grain",""),f.setAttribute("aria-hidden","true"),document.body.appendChild(f))},p=()=>{a?.destroy(),a=void 0,b?.remove(),b=void 0,f?.remove(),f=void 0};e.add(H.Style,()=>{const d=r.value;if(l.toggleAttribute("data-glass-enabled",d.enabled),l.toggleAttribute("data-glass-background",d.enabled&&d.background),d.enabled?l.setAttribute("data-glass-palette",D(d.palette).id):l.removeAttribute("data-glass-palette"),o(),!d.enabled){p();return}return d.background?(m(),a?.setParallax(d.parallax),a?.setMotion(d.motion),a?.refreshTheme(e.appearance.mode()==="light",D(d.palette).id),d.grain||(f?.remove(),f=void 0)):p(),ft({intensity:d.intensity,background:d.background,shimmer:d.shimmer,parallax:d.parallax,grain:d.grain,light:e.appearance.mode()==="light",palette:d.palette})});const c=d=>{if(!a)return;const S=window.innerWidth,v=window.innerHeight;!S||!v||a.setPointer((d.clientX/S-.5)*2,(d.clientY/v-.5)*2)};window.addEventListener("pointermove",c,{passive:!0});const x=()=>a?.setPointer(0,0);return document.documentElement.addEventListener("pointerleave",x),window.addEventListener("blur",x),e.add(H.Command,()=>({id:"toggle",title:e.t("command.toggle"),description:e.t("command.toggle.description"),keywords:"glass glassmorphism theme aurora",run:()=>{r.update(d=>{d.enabled=!d.enabled})}})),e.add(H.SettingsPage,{id:"glass",icon:"appearance",get title(){return e.t("title")},get entries(){return[{id:"palette",title:e.t("settings.palette"),keywords:"palette color blue graphite jade violet ice amber 配色 颜色"},{id:"intensity",title:e.t("settings.intensity"),keywords:"glass blur transparency"},{id:"background",title:e.t("settings.background"),keywords:"aurora animated background"},{id:"parallax",title:e.t("settings.parallax"),keywords:"mouse pointer parallax"},{id:"shimmer",title:e.t("settings.shimmer"),keywords:"sweep shine light"},{id:"grain",title:e.t("settings.grain"),keywords:"noise grain banding"},{id:"motion",title:e.t("settings.motion"),keywords:"pause animation motion"}]},render:()=>{const d=()=>r.value,S=e.ui,v=E=>(()=>{var M=zt(),k=M.firstChild,L=k.firstChild,N=L.nextSibling,C=k.nextSibling;return i.insert(L,()=>E.title),i.insert(N,()=>E.description),i.insert(C,()=>E.children),i.effect(T=>{var g=E.id,h=`glass-setting-${E.id}`;return g!==T.e&&i.setAttribute(M,"data-glass-setting",T.e=g),h!==T.t&&i.setAttribute(M,"id",T.t=h),T},{e:void 0,t:void 0}),M})(),_=E=>M=>r.update(k=>{k[E]=M});return(()=>{var E=_t();return i.insert(E,i.createComponent(v,{id:"enabled",get title(){return e.t("title")},get description(){return e.t("command.toggle.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("title")},get checked(){return d().enabled},onChange:M=>r.update(k=>{k.enabled=M})})}}),null),i.insert(E,i.createComponent(v,{id:"palette",get title(){return e.t("settings.palette")},get description(){return e.t("settings.palette.description")},get children(){var M=Ft();return i.insert(M,i.createComponent(O.For,{each:it,children:k=>(()=>{var L=Vt(),N=L.firstChild;return L.$$click=()=>r.update(C=>{C.palette=k.id}),i.insert(L,()=>e.t(`palette.${k.id}`),null),i.effect(C=>{var T=k.id,g=D(d().palette).id===k.id,h=D(d().palette).id===k.id?`1px solid ${k.ink}`:"1px solid var(--v2-border-border-muted)",s=D(d().palette).id===k.id?"var(--v2-background-bg-layer-02)":"transparent",$=k.ink;return T!==C.e&&i.setAttribute(L,"data-glass-palette-option",C.e=T),g!==C.t&&i.setAttribute(L,"aria-pressed",C.t=g),h!==C.a&&i.setStyleProperty(L,"border",C.a=h),s!==C.o&&i.setStyleProperty(L,"background",C.o=s),$!==C.i&&i.setStyleProperty(N,"background",C.i=$),C},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),L})()})),i.effect(()=>i.setAttribute(M,"aria-label",e.t("settings.palette"))),M}}),null),i.insert(E,i.createComponent(v,{id:"intensity",get title(){return e.t("settings.intensity")},get description(){return e.t("settings.intensity.description")},get children(){var M=Tt(),k=M.firstChild,L=k.nextSibling;return k.$$input=N=>{const C=Number(N.target.value);r.update(T=>{T.intensity=C})},i.insert(L,()=>d().intensity),i.effect(()=>i.setAttribute(k,"aria-label",e.t("settings.intensity"))),i.effect(()=>k.value=d().intensity),M}}),null),i.insert(E,i.createComponent(v,{id:"background",get title(){return e.t("settings.background")},get description(){return e.t("settings.background.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("settings.background")},get checked(){return d().background},get onChange(){return _("background")}})}}),null),i.insert(E,i.createComponent(v,{id:"parallax",get title(){return e.t("settings.parallax")},get description(){return e.t("settings.parallax.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("settings.parallax")},get checked(){return d().parallax},get onChange(){return _("parallax")}})}}),null),i.insert(E,i.createComponent(v,{id:"shimmer",get title(){return e.t("settings.shimmer")},get description(){return e.t("settings.shimmer.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("settings.shimmer")},get checked(){return d().shimmer},get onChange(){return _("shimmer")}})}}),null),i.insert(E,i.createComponent(v,{id:"motion",get title(){return e.t("settings.motion")},get description(){return e.t("settings.motion.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("settings.motion")},get checked(){return d().motion},get onChange(){return _("motion")}})}}),null),i.insert(E,i.createComponent(v,{id:"grain",get title(){return e.t("settings.grain")},get description(){return e.t("settings.grain.description")},get children(){return i.createComponent(S.Switch,{get label(){return e.t("settings.grain")},get checked(){return d().grain},get onChange(){return _("grain")}})}}),null),E})()}}),console.info("GLASS_FULL_V1 setup completed"),()=>{n?.destroy(),t(),window.removeEventListener("pointermove",c),document.documentElement.removeEventListener("pointerleave",x),window.removeEventListener("blur",x),document.removeEventListener("visibilitychange",o),u.removeEventListener("change",o),l.removeAttribute("data-glass-enabled"),l.removeAttribute("data-glass-background"),l.removeAttribute("data-glass-palette"),l.removeAttribute("data-glass-paused"),p()}}});i.delegateEvents(["input","click"]);exports.default=Bt;
