"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const r=require("solid-js/web"),G=require("@opencode/plugin/gui"),B=require("effect"),O=require("solid-js"),ut=["blue","graphite","jade","violet","ice","amber"],it=[{id:"blue",base:"#05070e",accent:[77,107,254],second:[112,192,255],ink:"#a5b7ff",lightInk:"#3c53ab",colors:[[77,107,254],[112,192,255],[140,110,255],[40,200,190]]},{id:"graphite",base:"#101318",accent:[150,167,188],second:[117,138,158],ink:"#c4cfdc",lightInk:"#47576b",colors:[[150,167,188],[117,138,158],[138,148,164],[113,138,145]]},{id:"jade",base:"#071310",accent:[55,141,115],second:[84,143,139],ink:"#9acfb9",lightInk:"#28694f",colors:[[55,141,115],[84,143,139],[73,123,99],[69,141,127]]},{id:"violet",base:"#100d18",accent:[130,97,176],second:[108,122,170],ink:"#c5aedf",lightInk:"#6a438d",colors:[[130,97,176],[108,122,170],[153,113,161],[115,107,152]]},{id:"ice",base:"#071216",accent:[62,139,160],second:[92,133,164],ink:"#9ecbd6",lightInk:"#2c6376",colors:[[62,139,160],[92,133,164],[76,142,150],[100,151,168]]},{id:"amber",base:"#16110d",accent:[155,111,67],second:[135,124,103],ink:"#d7bb94",lightInk:"#805524",colors:[[155,111,67],[135,124,103],[159,128,84],[143,115,95]]}];function H(n){return it.find(i=>i.id===n)??it[0]}const ct=n=>String(n).replace(/^0\./,"."),st=(n,i)=>`rgba(${n.join(",")},${ct(i)})`;function pt(n,i){const t=parseInt(n.slice(1),16);return`rgba(${t>>16},${t>>8&255},${t&255},${ct(i)})`}const mt=B.Schema.Struct({enabled:B.Schema.Boolean,intensity:B.Schema.Number,parallax:B.Schema.Boolean,shimmer:B.Schema.Boolean,background:B.Schema.Boolean,grain:B.Schema.Boolean,motion:B.Schema.Boolean,styleRevision:B.Schema.Number,palette:B.Schema.optional(B.Schema.Literals(ut))}),bt={enabled:!0,intensity:62,parallax:!0,shimmer:!1,background:!0,grain:!0,motion:!0,styleRevision:0,palette:"blue"},ht=G.Plugin.define({stores:{prefs:G.Store.global(mt,bt)},i18n:{en:{title:"Glass","settings.palette":"Glass palette","settings.palette.description":"Switch the background, navigation, titlebars and accents together. Does not change the native app theme.","palette.blue":"Deep blue","palette.graphite":"Smoked graphite","palette.jade":"Jade green","palette.violet":"Dusk violet","palette.ice":"Glacier cyan","palette.amber":"Warm amber","settings.motion":"Animation","settings.motion.description":"Pause all motion while keeping the glass background. Reduced motion is respected automatically.","settings.intensity":"Glass intensity","settings.intensity.description":"How much of the background shows through the panels.","settings.intensity.low":"Subtle","settings.intensity.medium":"Balanced","settings.intensity.high":"Full","settings.background":"Animated background","settings.background.description":"An aurora that drifts behind the interface.","settings.parallax":"Pointer parallax","settings.parallax.description":"The aurora follows the pointer.","settings.shimmer":"Light sweep","settings.shimmer.description":"A slow highlight travels across the frosted panels.","settings.grain":"Film grain","settings.grain.description":"Fine noise over the background, to avoid gradient banding.","command.toggle":"Toggle glass","command.toggle.description":"Turn the glassmorphism theme on or off."},zh:{title:"玻璃","settings.palette":"玻璃配色","settings.palette.description":"背景、导航、顶栏和强调色一起切换；不改动原生主题设置。","palette.blue":"深蓝极光","palette.graphite":"石墨烟灰","palette.jade":"翡翠墨绿","palette.violet":"暮色紫","palette.ice":"冰川青","palette.amber":"琥珀暖灰","settings.motion":"动画","settings.motion.description":"关闭后保留静态玻璃背景；系统减少动态效果时自动暂停。","settings.intensity":"玻璃强度","settings.intensity.description":"背景从面板透出的程度。","settings.intensity.low":"克制","settings.intensity.medium":"标准","settings.intensity.high":"通透","settings.background":"动态背景","settings.background.description":"界面背后缓慢流动的极光。","settings.parallax":"鼠标视差","settings.parallax.description":"极光跟随鼠标位置偏移。","settings.shimmer":"流光扫过","settings.shimmer.description":"一道高光缓慢掠过磨砂面板。","settings.grain":"颗粒噪点","settings.grain.description":"背景上的细噪点，避免渐变出现色带。","command.toggle":"开关玻璃","command.toggle.description":"打开或关闭玻璃拟态主题。"}}});function ft(n={}){const i=document.createElement("canvas");i.setAttribute("data-glass-aurora",""),i.setAttribute("aria-hidden","true"),i.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block";const t=i.getContext("2d");if(document.body.appendChild(i),!t)return{setPointer(){},setParallax(){},setMotion(){},refreshTheme(){},destroy(){i.remove()}};let a=0,s=0,c=0,o=0,e=0,b=!1,f=!0,m=n.motion??!0,p=n.light??!1,g=H(n.palette),x=p?"#fafafa":g.base,d=g.colors.slice(0,2);const E={x:0,y:0},v={x:0,y:0},T=window.matchMedia?.("(prefers-reduced-motion: reduce)"),C=()=>!b&&m&&!document.hidden&&(typeof document.hasFocus=="function"?document.hasFocus():!0)&&!T?.matches,M=()=>{const A=getComputedStyle(document.documentElement).getPropertyValue("--v2-background-bg-deep").trim();x=p?A||"#fafafa":g.base,d=g.colors.slice(0,2)},k=(l=!1)=>{if(b)return;l&&(v.x+=(E.x-v.x)*.045,v.y+=(E.y-v.y)*.045);const A=f&&m&&!T?.matches?v.x:0,R=f&&m&&!T?.matches?v.y:0;t.clearRect(0,0,a,s),t.fillStyle=x,t.fillRect(0,0,a,s),t.globalCompositeOperation=p?"multiply":"lighter";for(let w=0;w<d.length;w++){const $=c*[8e-6,6e-6][w],L=([.16,.88][w]+Math.sin($)*.035+A*.04)*a,y=([.05,.92][w]+Math.cos($*1.3)*.035+R*.035)*s,z=[.72,.66][w]*Math.min(a,s)*(.94+Math.sin($*.7)*.06),[N,F,J]=d[w],j=t.createRadialGradient(L,y,0,L,y,z);j.addColorStop(0,`rgba(${N},${F},${J},${p?.13:.26})`),j.addColorStop(.45,`rgba(${N},${F},${J},${p?.035:.07})`),j.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=j,t.beginPath(),t.arc(L,y,z,0,Math.PI*2),t.fill()}t.globalCompositeOperation="source-over"},q=()=>{!o&&C()&&(o=requestAnimationFrame(I))},I=()=>{if(o=0,!C())return;const l=performance.now();(!e||l-e>=33)&&(c+=Math.min(e?l-e:34,64),e=l,k(!0)),q()},S=()=>{cancelAnimationFrame(o),o=0,e=0,!b&&!document.hidden&&(k(),q())},_=()=>{a=i.clientWidth||window.innerWidth,s=i.clientHeight||window.innerHeight;const l=Math.min(window.devicePixelRatio||1,1,1280/Math.max(a,1));i.width=Math.max(1,Math.round(a*l)),i.height=Math.max(1,Math.round(s*l)),t.setTransform(l,0,0,l,0,0),S()},V=()=>{M(),S()},u=typeof MutationObserver>"u"?void 0:new MutationObserver(V);u?.observe(document.head,{childList:!0,subtree:!0,characterData:!0}),window.addEventListener("resize",_),document.addEventListener("visibilitychange",S),T?.addEventListener("change",S);const h=()=>S();return window.addEventListener("focus",h),window.addEventListener("blur",h),M(),_(),{setPointer(l,A){!f||!C()||!Number.isFinite(l)||!Number.isFinite(A)||(E.x=Math.max(-1,Math.min(1,l)),E.y=Math.max(-1,Math.min(1,A)))},setParallax(l){l!==f&&(f=l,l||(E.x=0,E.y=0,v.x=0,v.y=0,k()))},setMotion(l){l!==m&&(m=l,l||(E.x=0,E.y=0,v.x=0,v.y=0),S())},refreshTheme(l,A=g.id){const R=H(A);p===l&&g.id===R.id||(p=l,g=R,V())},destroy(){b||(b=!0,cancelAnimationFrame(o),o=0,window.removeEventListener("resize",_),window.removeEventListener("focus",h),window.removeEventListener("blur",h),document.removeEventListener("visibilitychange",S),T?.removeEventListener("change",S),u?.disconnect(),i.remove())}}}const P=':where([data-component="collapsed-tool-group"] > .tool-collapsible, [data-component="tool-part-wrapper"]:not([data-component="context-tool-group-list"] *) > .tool-collapsible)',tt='[data-component="composer"]',et='[data-slot="session-turn-diff-trigger"]',Z=`:is(${P}, ${tt}, ${et})`;function vt(n){const i=Math.max(0,Math.min(100,Number.isFinite(n.intensity)?n.intensity:62))/100,t="html[data-glass-enabled]",a=!!n.light,s=H(n.palette),c=m=>st(s.accent,m),o=m=>pt(s.base,m),e=m=>a?`color-mix(in srgb, var(--v2-background-bg-base) ${(m*100).toFixed(1)}%, transparent)`:`rgba(255,255,255,${m.toFixed(3)})`,b=a?"var(--v2-text-text-base)":"#c3cbdb",f=a?"var(--v2-text-text-muted)":"#93a0b6";return`
${t} {
  --glass-card: ${e(a?.82:.05-i*.0265)};
  --glass-border: ${a?"rgba(30,40,55,.13)":"rgba(230,237,248,.085)"};
  --glass-accent: ${a?s.lightInk:s.id==="blue"?"#6d8bff":s.ink};
  --glass-ink: ${b}; --glass-muted: ${f};
}
/* Native shell surfaces verified on Desktop 2.2.5. Preserve dimensions, drag
   regions, window controls and native actions; only replace their material. */
${t} [data-slot=titlebar-v2] {
  background: linear-gradient(105deg,${c(.055)},transparent), ${a?e(.86):o(.66)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
${t} [data-slot=session-chat-panel] .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${c(.1)},${c(.025)}), ${a?e(.96):o(.96)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
/* Unknown timeline structures keep the opaque safety fallback above. */
${t} [data-glass-timeline-clip] { clip-path: inset(var(--glass-header-cut,0px) 0 0); }
${t} [data-slot=session-chat-panel]:has([data-glass-timeline-clip]) .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${c(.045)},transparent), ${a?e(.88):o(.64)} !important;
}
${t} [data-testid=settings-screen] {
  background: ${a?e(.86):o(n.background?.38:.96)} !important;
}
${t} [data-testid=settings-screen] .settings-panel { color: var(--glass-ink); }
${t} [data-testid=settings-screen] [data-glass-control-ink=light] { color: #fff !important; }
${t} [data-testid=settings-screen] [data-glass-control-ink=dark] { color: #000 !important; }
${t} [data-testid=settings-screen] .settings [role=tab][aria-selected=true] {
  background: linear-gradient(110deg,${c(.12)},${a?e(.84):"rgba(255,255,255,.035)"}) !important;
  box-shadow: inset 1px 0 0 ${a?"rgba(30,40,55,.2)":"rgba(230,237,248,.18)"};
}
${t} [data-testid=settings-screen] [data-slot=tabs-v2-trigger-wrapper]:has([role=tab][aria-selected=true]) {
  background: transparent !important;
}
${t} [data-testid=settings-screen] [data-glass-settings-surface] {
  background: ${a?e(.84):"rgba(255,255,255,.035)"} !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${t} [data-testid=settings-screen] [data-glass-settings-surface=nested] {
  background: ${a?e(.76):"rgba(255,255,255,.022)"} !important;
  box-shadow: none;
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]) {
  background: ${a?`linear-gradient(120deg,${e(.84)},${c(.04)})`:`linear-gradient(120deg,rgba(255,255,255,.047),${c(.026)})`} !important;
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  color: var(--glass-ink) !important;
  transition: background-color .16s ease, border-color .16s ease;
}
${t} [data-action=vertical-tabs-new-session] {
  background: linear-gradient(120deg,${c(.13)},${c(.035)}) !important;
  border-color: var(--glass-border);
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):is(:hover,[data-state=pressed]) {
  background: linear-gradient(120deg,${c(.18)},${c(.055)}) !important;
  border-color: ${c(.32)};
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):focus-visible {
  outline: 2px solid var(--glass-accent); outline-offset: 1px;
}
${n.background?`
${t}, ${t} body { background: transparent !important; }
/* Desktop 2.2.5: the opaque shell is #root > div.bg-v2-background-bg-deep.
   Every opaque ancestor of the sidebar has to be punched through, otherwise
   the fixed aurora canvas stays hidden behind a solid #080808 layer. */
${t} :is(#root > .bg-v2-background-bg-deep, #root > .bg-v2-background-bg-base,
  #root > .bg-v2-background-bg-deep > .relative) { background: transparent !important; }
${t} [data-slot=session-chat-panel] > .bg-v2-background-bg-base,
${t} [data-component=new-session] {
  background: ${a?e(.64):o(.04)} !important;
  backdrop-filter: none;
  box-shadow: none;
  border: .5px solid var(--glass-border);
}
/* Sidebar shell (Desktop 2.2.5). Wrapper is <aside id="vertical-tabs-sidebar">
   with [data-slot=vertical-tabs-panel]/[data-slot=vertical-tabs-mount] inside.
   All of them ship bg-v2-background-bg-deep, so every layer needs the glass
   material and the rows inside must stop painting their own solid surface. */
${t} :is(#vertical-tabs-sidebar, [data-slot=vertical-tabs-sidebar]) {
  background: transparent !important;
  border-inline-end: 1px solid var(--glass-border) !important;
}
${t} :is([data-slot=vertical-tabs-panel], [data-slot=vertical-tabs-peek-surface]) {
  background: transparent !important;
}
${t} :is([data-slot=vertical-tabs-mount], [data-slot=vertical-tabs]) {
  background: linear-gradient(165deg, ${c(.045)}, transparent 62%), ${a?e(.62):s.id==="blue"?"rgba(13,17,30,.46)":o(.46)} !important;
  backdrop-filter: blur(26px) saturate(140%);
  -webkit-backdrop-filter: blur(26px) saturate(140%);
  border-inline-end: 1px solid var(--glass-border);
}
/* Review / side pane (Desktop 2.2.5). #review-panel and every layer inside it
   ship bg-v2-background-bg-base, which paints a solid #161616 over the aurora.
   Punch the shell through and give the pane the same frosted material as the
   sidebar. Scoped to #review-panel so the main shell keeps its own surface. */
${t} #review-panel {
  background: linear-gradient(195deg, ${c(.045)}, transparent 58%), ${a?e(.62):s.id==="blue"?"rgba(13,17,30,.46)":o(.46)} !important;
  backdrop-filter: blur(26px) saturate(140%);
  -webkit-backdrop-filter: blur(26px) saturate(140%);
}
${t} #review-panel :is(.bg-v2-background-bg-base,
  [data-slot=session-review-content] > div,
  [data-slot=session-side-pane],
  [data-component=tabs],
  [data-slot=tabs-list]) {
  background: transparent !important;
}
/* Sticky bars and section headers inside the pane get a flat tint instead of
   their own backdrop layer: 60+ accordion headers must stay cheap to scroll. */
${t} #review-panel :is(.session-review-v2-tabs-bar, [data-slot=session-side-panel-actions]) {
  background: ${a?e(.9):o(.7)} !important;
  border-bottom: 1px solid var(--glass-border);
}
${t} #review-panel :is([data-slot=accordion-header], [data-slot=accordion-trigger]) {
  background: ${a?e(.92):o(.86)} !important;
}
${t} #review-panel [data-slot=tabs-trigger-wrapper] {
  background: ${c(.14)} !important;
  box-shadow: inset 0 0 0 1px ${c(.22)};
}
${t} #review-panel .bg-surface-base {
  background: ${a?e(.84):"rgba(255,255,255,.035)"} !important;
  border-color: var(--glass-border) !important;
}

[data-glass-aurora], [data-glass-veil], [data-glass-grain] {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
}
[data-glass-veil] { background: ${a?`linear-gradient(180deg,${e(.24)},${e(.48)})`:`
  radial-gradient(1200px 700px at 16% 5%, ${c(.09)}, transparent 60%),
  radial-gradient(900px 620px at 88% 92%, ${st(s.second,.065)}, transparent 62%),
  linear-gradient(180deg, ${o(.55)}, ${o(.82)})`}; }
`:""}
${n.background&&n.grain?`
[data-glass-grain] {
  opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
`:""}
/* Activity card: decorate the WHOLE collapsible, not its trigger alone. */
${t} ${P} {
  border-radius: 12px; overflow: hidden; margin-block: 0 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-card) !important;
  backdrop-filter: blur(14px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${t} ${P} > [data-slot=collapsible-trigger] {
  width: 100%; padding: 9px 13px; min-height: 38px;
  background: transparent !important; border: 0; box-shadow: none;
  border-radius: 0; transition: background-color .16s ease;
}
${t} ${P} > [data-slot=collapsible-trigger]:hover { background: ${c(.045)} !important; }
${t} ${P} [data-component=context-tool-group-trigger] {
  color: var(--glass-ink); font-size: 12.5px; font-weight: 600;
}
${t} [data-slot=basic-tool-tool-subtitle] { color: ${a?f:"#a9b6cd"}; }
${t} ${P} > [data-slot=collapsible-trigger]:focus-visible {
  outline: 2px solid ${c(.5)}; outline-offset: -2px;
}
${t} ${P}[data-expanded] > [data-slot=collapsible-content] { padding: 0 13px 11px; }
${t} ${P} [data-slot=context-tool-group-item] { min-width: 0; }
${t} ${P} [data-slot=context-tool-group-item] [data-slot=collapsible-trigger]:not([data-component=reasoning-part] *) {
  height: auto; min-height: 38px; padding-block: 4px; align-items: flex-start;
}
${t} ${P} [data-slot=context-tool-group-item] [data-component=tool-trigger]:not([data-component=reasoning-part] *) {
  height: auto; content-visibility: visible;
}
${t} ${P} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info]:not([data-component=reasoning-part] *) { flex: 1; width: 100%; }
${t} ${P} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-structured]:not([data-component=reasoning-part] *) { width: 100%; }
${t} ${P} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-main]:not([data-component=reasoning-part] *) {
  flex: 1; min-width: 0; flex-direction: column; align-items: stretch; gap: 5px; text-align: start;
}
${t} ${P} [data-slot=basic-tool-tool-title] { align-self: flex-start; text-align: start; }
${t} ${P} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-subtitle]:not([data-component=reasoning-part] *):not(.subagent-link):not(.webfetch-link) {
  display: block; max-width: 100%; padding: 7px 11px;
  background: ${a?"rgba(30,45,75,.045)":o(.24)};
  border-inline-start: 2px solid ${c(.28)}; border-radius: 0 7px 7px 0;
  font-family: var(--font-family-mono, ui-monospace, Consolas, monospace);
  font-size: 12px; line-height: 1.75;
}
${t} ${P} [data-slot=collapsible-arrow] { color: #66718a; transition: transform .18s ease; }
/* Native status content remains truthful: do not synthesize durations or completion. */
${t} ${P} :is([data-slot=tool-status-suffix], [data-slot=tool-status-tail]) {
  font-size: 11px; font-variant-numeric: tabular-nums; color: var(--glass-muted);
}
${t} ${P} [data-slot=tool-status-active] { color: ${a?"#27864d":"#7fd6a5"}; }
${t} ${P} [data-component=reasoning-part] > .tool-collapsible > [data-slot=collapsible-trigger] {
  color: ${a?"#7056a4":"#b9a6e8"};
}
${t} [data-component=reasoning-part] [data-slot=basic-tool-tool-title] {
  color: ${a?"#7056a4":"#b9a6e8"}; font-size: 11px;
}
${t} [data-component=reasoning-part]:not([data-component=context-tool-group-list] *) > .tool-collapsible > [data-slot=collapsible-trigger] {
  inline-size: fit-content; padding: 2px 8px; border-radius: 6px;
  background: rgba(185,166,232,.08); border: 1px solid rgba(185,166,232,.22);
  color: ${a?"#7056a4":"#b9a6e8"}; font-size: 11px;
}
${t} :is([data-slot=bash-command], [data-component=bash-output]) {
  background: ${a?"rgba(30,45,75,.045)":o(.24)} !important;
  border: 0; border-inline-start: 2px solid ${c(.28)};
  border-radius: 0 7px 7px 0; padding: 7px 11px;
  font-size: 12px; line-height: 1.75;
}
/* Selected sessions: the reference gradient and thin left-hand indicator. */
${t} [data-slot=sidebar-inbox-item] { border-radius: 8px; transition: background-color .16s ease; }
${t} [data-slot=sidebar-inbox-item][data-state=active] {
  background: linear-gradient(90deg,${c(.22)},${c(.05)}) !important;
  box-shadow: inset 2px 0 0 var(--glass-accent);
}
${t} [data-slot=sidebar-inbox-item][data-state=active] > span { color: ${a?b:"#eaf0ff"}; }
${t} [data-slot=sidebar-inbox-item]:hover:not([data-state=active]) { background: ${c(.055)} !important; }
/* Composer is a real form in 2.2.5; never touch its editable content or controls. */
${t} ${tt} {
  background: ${a?e(.86):"rgba(255,255,255,.045)"} !important;
  backdrop-filter: blur(22px) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}
${t} ${tt}:focus-within {
  border-color: ${c(.46)};
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045) !important;
}
${t} [data-component=composer-scroll] > .pointer-events-none { color: ${a?f:"#7b8699"}; }
/* User message bubble (Desktop 2.2.5). Chain: [data-component=user-message] >
   [data-slot=user-message-body] > [data-slot=user-message-text]. Only the inner
   node paints, and the host fills it with --v2-background-bg-layer-02 (#2e2e2e),
   which reads as a flat grey block over the frost. Keep the host radius,
   padding, max-width and text colour semantics; replace only the material. */
${t} [data-slot=user-message-body] { background: transparent !important; }
${t} [data-slot=user-message-text] {
  background: linear-gradient(135deg,${c(.17)},${c(.055)}), ${a?e(.88):"rgba(255,255,255,.03)"} !important;
  backdrop-filter: blur(14px) saturate(135%);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045), 0 1px 3px rgba(0,0,0,.14);
  color: ${a?b:"#e8edf7"};
}
${t} [data-slot=user-message-text] :is(a, code) { color: ${a?s.lightInk:"#dcd6f5"}; }
/* Existing real diff chips preserve filename, navigation and +/- contents. */
${t} ${et} {
  width: fit-content; max-width: 100%; display: inline-flex; align-items: center; gap: 9px;
  border-radius: 9px; padding: 6px 11px; border: 1px solid var(--glass-border);
  background: ${a?e(.82):"rgba(255,255,255,.045)"} !important;
  font-size: 12px; font-variant-numeric: tabular-nums;
  transition: background-color .16s ease;
}
${t} [data-slot=session-turn-diffs] { background: transparent; }
/* Markdown tables inside the timeline: the native container paints #242424 and
   the tbody #161616, which punch a solid hole in the frost. Keep the 1px grid,
   drop the fills, let the card behind show through. */
${t} [data-component=markdown-table] {
  background: ${a?e(.72):"rgba(255,255,255,.028)"} !important;
  border: 1px solid var(--glass-border);
  border-radius: 10px;
  backdrop-filter: none;
}
${t} [data-component=markdown-table] :is(tbody, tr, td) { background: transparent !important; }
${t} [data-component=markdown-table] thead th {
  background: transparent !important;
  border-bottom: 1px solid var(--glass-border);
}

/* Fenced code blocks: the renderer writes the fill as an inline style
   (background-color: var(--color-background-stronger) = #151515), so only an
   !important stylesheet declaration can win over it. Keep the host radius,
   padding, mono font and token colours inside <code>. */
${t} [data-component=markdown-code] pre.highlights {
  background: ${a?e(.8):"rgba(255,255,255,.032)"} !important;
  backdrop-filter: blur(12px) saturate(125%);
  -webkit-backdrop-filter: blur(12px) saturate(125%);
  border: 1px solid var(--glass-border) !important;
}
${t} [data-component=markdown-code] pre.highlights code {
  background: transparent !important;
}
${t} [data-component=markdown-code] :is([data-slot=markdown-copy-button], [data-component=icon-button-v2]) {
  background: transparent !important;
}
/* Empty side-pane placeholder ("CTRL ALT K"): bg-v2-background-bg-base fill. */
${t} .otb-cap {
  background: transparent !important;
  color: var(--glass-muted);
}
${t} ${et}:hover { background: ${a?e(.94):"rgba(255,255,255,.07)"} !important; }
${t} [data-slot=session-turn-diff-filename] { color: ${a?b:"#c9d2e0"}; }
${t} ${et} [data-component=file-icon] { color: var(--glass-accent); }
${t} :is([data-component=menu-v2-content], [data-component=popover-content], [data-slot=dialog-container]) {
  background: ${a?e(.96):o(.94)} !important;
  border: 1px solid var(--glass-border); backdrop-filter: blur(22px);
}
/* Optional extra, not part of the reference; the new skin defaults it OFF. */
${n.shimmer?`
${t} ${Z} {
  background-image: linear-gradient(105deg,transparent 36%,rgba(255,255,255,.035) 50%,transparent 64%);
  background-size: 260% 100%; background-repeat: no-repeat;
  animation: glass-shimmer 20s ease-in-out infinite;
}
@keyframes glass-shimmer { 0%,70% { background-position: 180% 0; } 95%,100% { background-position: -80% 0; } }
`:""}
html[data-glass-paused] ${Z} { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  ${t} ${Z} { animation: none !important; transition: none !important; }
  ${t} [data-slot=collapsible-arrow] { transition: none !important; }
}
@supports not (backdrop-filter: blur(1px)) {
  ${t} ${P}, ${t} ${tt} { background: ${a?e(.96):"rgba(10,13,22,.96)"} !important; }
  ${t} [data-slot=user-message-text] { background: ${a?e(.98):"rgba(24,20,34,.94)"} !important; }
  ${t} [data-component=markdown-code] pre.highlights { background: ${a?e(.96):"rgba(14,12,20,.94)"} !important; }
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
${t} [data-glass-activity-thinking] { color: ${a?"#7056a4":"#b9a6e8"}; background: rgba(185,166,232,.08); }
${t} [data-glass-activity-header][data-status=error] { border-color: rgba(232,117,127,.38); }
${t} [data-glass-activity-header][data-status=error] [data-glass-activity-status] { color: ${a?"#b82c40":"#e8757f"}; }
${t} [data-glass-activity-header][data-status=interrupted] [data-glass-activity-status] { color: ${a?"#946116":"#e0b062"}; }
${t} [data-glass-activity-header][data-busy]:not([data-status=error]) [data-glass-activity-status] {
  color: ${a?"#27864d":"#7fd6a5"}; animation: glass-activity-busy 1.6s ease-in-out infinite;
}
${t} [data-glass-activity-member] {
  padding: 0 13px 7px; margin: 0 !important;
  border-inline: 1px solid var(--glass-border); background: var(--glass-card);
  animation: glass-activity-enter .18s ease-out;
}
${t} [data-glass-activity-last] { border-bottom: 1px solid var(--glass-border); border-radius: 0 0 12px 12px; margin-bottom: 12px !important; }
${t} [data-glass-activity-hidden] { display: none !important; }
${t} [data-glass-activity-header]:focus-visible { outline: 2px solid ${c(.65)}; outline-offset: 2px; }
@keyframes glass-activity-busy { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
@keyframes glass-activity-enter { from { opacity: .3; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
${t} [data-glass-model-controls] { display: flex; align-items: center; gap: 6px; overflow-x: auto; }
${t} [data-glass-model-controls] > div { display: contents; }
${t} [data-glass-model-collapsed] [data-glass-native-model] { display: none !important; }
${t} [data-glass-model-toggle] {
  flex: 0 1 auto; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  padding: 4px 10px; min-height: 27px; border-radius: 99px; border: 1px solid var(--glass-border);
  background: ${c(.07)}; color: var(--glass-ink); font: inherit; font-size: 12px; cursor: pointer;
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
${t} [data-glass-vital][data-tone=warning] button { color: ${a?"#946116":"#e0b062"}; border-color: rgba(224,176,98,.28); }
${t} [data-glass-vitals][data-compact=true] > summary { display: block; padding: 4px 9px; border: 1px solid var(--glass-border); border-radius: 99px; }
${t} [data-glass-vitals][data-compact=true][open] [data-glass-vital-list] {
  position: absolute; inset-inline-end: 0; top: 32px; z-index: 80;
  width: min(480px,80vw); padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border);
  background: ${a?e(.98):o(.97)}; box-shadow: 0 12px 40px rgba(0,0,0,.3);
}
${t} [data-glass-native-metric] { display: none !important; }
html[data-glass-paused] :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
html[data-glass-paused] :is(${Z},[data-slot=collapsible-arrow]) { transition: none !important; }
html[data-glass-paused] [data-action^="vertical-tabs-"] { transition: none !important; }
@media (prefers-reduced-motion: reduce) {
  ${t} :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
  ${t} [data-action^="vertical-tabs-"] { transition: none !important; }
}
@media (max-width: 900px) {
  ${t} [data-glass-activity-header] { flex-wrap: wrap; gap: 6px; }
  ${t} [data-glass-activity-duration] { margin-inline-start: auto; }
}

/* Sticky Tool Group Header Defend (防滚动内容叠字穿透) */
${t} [data-component="collapsed-tool-group"] > [data-component="collapsible"].tool-collapsible > [data-slot="collapsible-trigger"][aria-expanded="true"] {
  background: ${a?e(.96):o(.94)} !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 25 !important;
  box-shadow: 0 1px 0 var(--glass-border), 0 4px 12px rgba(0, 0, 0, 0.25) !important;
}

/* 思考标签统一基线与字号对齐 (11px / line-height: 1.5) */
${t} [data-component="reasoning-part"] {
  font-size: 11px !important;
  line-height: 1.5 !important;
  display: flex !important;
  align-items: center !important;
  gap: 6px !important;
}
/* 滚动时关闭大面积 backdrop-filter 提高帧率 */
html[data-glass-scrolling="true"] [data-component="collapsed-tool-group"],
html[data-glass-scrolling="true"] .scroll-container,
html[data-glass-scrolling="true"] #review-panel,
html[data-glass-scrolling="true"] [data-slot="user-message-text"],
html[data-glass-scrolling="true"] [data-component="markdown-code"] pre.highlights {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}
`}var yt=r.template("<span data-glass-vital>"),xt=r.template("<button type=button>"),$t=r.template("<details data-glass-vitals data-glass-layout-owned><summary aria-label=会话统计>统计 ▾</summary><div data-glass-vital-list>");const kt=new Set(["speed","ttft","context","turn","chatgpt-quota"]);function wt(n){const i=t=>{const a=O.createMemo(()=>{try{return t.item.show(t.input)}catch{return}});return r.createComponent(O.Show,{get when(){return a()},children:s=>(()=>{var c=yt();return r.insert(c,r.createComponent(n.ui.Tooltip,{get value(){return s().title??s().label},get children(){return r.createComponent(O.Show,{get when(){return s().rows?.length},get fallback(){return(()=>{var o=xt();return o.$$click=()=>s().run?.(),r.insert(o,()=>s().label),r.effect(()=>o.disabled=!s().run),o})()},get children(){return r.createComponent(n.ui.Menu,{trigger:"button",get label(){return s().label},placement:"bottom-end",get items(){return(s().rows??[]).map(o=>({label:o.detail?`${o.label} · ${o.detail}`:o.label,icon:o.icon,onSelect:()=>o.run?.()}))}})}})}})),r.effect(o=>{var e=t.item.id,b=s().label,f=s().title??"",m=s().tone;return e!==o.e&&r.setAttribute(c,"data-glass-metric-id",o.e=e),b!==o.t&&r.setAttribute(c,"data-glass-metric-label",o.t=b),f!==o.a&&r.setAttribute(c,"data-glass-metric-title",o.a=f),m!==o.o&&r.setAttribute(c,"data-tone",o.o=m),o},{e:void 0,t:void 0,a:void 0,o:void 0}),c})()})};return n.add(G.Slot,{at:"session.header",order:80,render:t=>{let a;const s=e=>{e.target instanceof Element&&e.target.closest("[role=menu],[role=menuitem],[data-component=tooltip]")||t.compact&&a&&e.target instanceof Node&&!a.contains(e.target)&&(a.open=!1)},c=e=>{if(e.key!=="Escape"||!t.compact||!a?.open)return;Array.from(document.querySelectorAll("[role=menu],[role=dialog]")).some(f=>f.checkVisibility())||(a.open=!1,a.querySelector("summary")?.focus({preventScroll:!0}))};document.addEventListener("pointerdown",s),document.addEventListener("keydown",c,!0),O.onCleanup(()=>{document.removeEventListener("pointerdown",s),document.removeEventListener("keydown",c,!0)});const o=()=>n.list(G.ComposerPill).filter(e=>kt.has(e.id)&&!e.menu);return r.createComponent(O.Show,{get when(){return r.memo(()=>!!(t.active&&n.stores.prefs.value.enabled))()&&o().length>0},get children(){var e=$t(),b=e.firstChild,f=b.nextSibling,m=a;return typeof m=="function"?r.use(m,e):a=e,r.insert(f,r.createComponent(O.For,{get each(){return o()},children:p=>r.createComponent(i,{item:p,input:t})})),r.effect(p=>{var g=t.compact,x=!t.compact;return g!==p.e&&r.setAttribute(e,"data-compact",p.e=g),x!==p.t&&(e.open=p.t=x),p},{e:void 0,t:void 0}),e}})}})}r.delegateEvents(["click"]);const Y=n=>n&&typeof n=="object"?n:{},rt=n=>{const i=Number(n);return Number.isFinite(i)&&i>0?i:0};function At(n){const i=new Map;for(const t of n){const a=Y(t);if(a.type!=="assistant"||!Array.isArray(a.content))continue;let s=0;for(const c of a.content){const o=Y(c),e=Y(o.time),b=Y(o.state);if(o.type!=="tool"&&o.type!=="reasoning")continue;const f=o.type==="tool"?String(o.id??""):`${a.id}:reasoning:${s++}`;if(!f)continue;const m=rt(e.completed)||void 0,p=o.type==="reasoning"?m?"completed":"thinking":b.status==="error"?/abort|interrupt|cancel/i.test(String(Y(b.error).type))?"interrupted":"error":b.status==="completed"?"completed":b.status==="running"?"running":"preparing";i.set(f,{id:f,type:o.type,name:String(o.name??"工具"),state:p,start:rt(e.ran)||rt(e.created),end:m})}}return i}function St(n,i){const t=[...new Map(n.map(e=>[e.id,e])).values()],a=t.filter(e=>e.type==="tool"),s=e=>e.start?Math.max(0,(e.end??i)-e.start):0,c=a.some(e=>e.state==="error")?"error":a.some(e=>e.state==="running")?"running":a.some(e=>e.state==="preparing")?"preparing":t.some(e=>e.state==="thinking")?"thinking":a.some(e=>e.state==="interrupted")?"interrupted":"completed",o=[...new Set(a.map(e=>e.name))];return{count:a.length,names:o,state:c,busy:t.some(e=>["running","preparing","thinking"].includes(e.state)),running:a.filter(e=>["running","preparing"].includes(e.state)).length,toolMs:a.reduce((e,b)=>e+s(b),0),thinkingMs:t.filter(e=>e.type==="reasoning").reduce((e,b)=>e+s(b),0),timed:a.some(e=>e.start>0)}}const Et={preparing:"准备中",running:"运行中",thinking:"思考中",completed:"已完成",error:"失败",interrupted:"已中断"};function lt(n){return n<6e4?`${(n/1e3).toFixed(1)}秒`:`${Math.floor(n/6e4)}分${Math.floor(n%6e4/1e3)}秒`}function Ct(n,i){const t=[];let a=[],s=[];const c=()=>{s.some(o=>o.type==="tool")&&t.push({items:a,parts:s}),a=[],s=[]};for(const o of n){const e=o.ids.map(b=>i.get(b));if(!o.ids.length||e.some(b=>!b)){c();continue}a.push(o.item),s.push(...e)}return c(),t}function Mt(n){const i=n.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!i)return!1;const t=i.slice(1,4).map(Number);return Number(i[4]??1)>=.9&&Math.max(...t)-Math.min(...t)<=5}function Lt(n,i,t=!1){const a=e=>{const b=e.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!b||Number(b[4]??1)<1)return;const f=b.slice(1,4).map(m=>{const p=Number(m)/255;return p<=.04045?p/12.92:((p+.055)/1.055)**2.4});return f[0]*.2126+f[1]*.7152+f[2]*.0722},s=a(n),c=a(i);if(s===void 0||c===void 0)return;const o=(e,b)=>(Math.max(e,b)+.05)/(Math.min(e,b)+.05);if(!(!t&&o(s,c)>=4.5))return o(s,1)>o(s,0)?"light":"dark"}function dt(n,i){return![n.top,n.bottom,i.top,i.bottom].every(Number.isFinite)||n.top>=i.bottom||n.bottom<=i.top?0:Math.max(0,Math.min(n.bottom-i.top,i.bottom-i.top))}function Pt(){const n=new Map,i=new Map,t=new Map,a=new Map,s=(m,p)=>{p===null?m.removeAttribute("data-glass-control-ink"):m.setAttribute("data-glass-control-ink",p),a.delete(m)},c=(m,p)=>{p===null?m.removeAttribute("data-glass-settings-surface"):m.setAttribute("data-glass-settings-surface",p),t.delete(m)},o=(m,p)=>{p.value?m.style.setProperty("--glass-header-cut",p.value,p.priority):m.style.removeProperty("--glass-header-cut"),p.attribute===null?m.removeAttribute("data-glass-timeline-clip"):m.setAttribute("data-glass-timeline-clip",p.attribute),n.delete(m),i.delete(m)},e={sync(){const m=new Set;for(const g of Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")))if(g.checkVisibility())for(const x of Array.from(g.querySelectorAll(".session-header-layout"))){const d=x.parentElement?.parentElement,E=d?.closest(".scroll-view__viewport"),v=Array.from(E?.children??[]).find(k=>k instanceof HTMLElement&&k.style.position==="relative"&&k.style.overflowX==="clip");if(!d?.classList.contains("pointer-events-auto")||!v||v.contains(d)||!d.checkVisibility())continue;const T=d.parentElement?.hasAttribute("data-session-title")?d.parentElement:d;if(!E)continue;const C=dt(T.getBoundingClientRect(),v.getBoundingClientRect());if(!C)continue;i.set(v,{shield:T,viewport:E}),n.has(v)||n.set(v,{value:v.style.getPropertyValue("--glass-header-cut"),priority:v.style.getPropertyPriority("--glass-header-cut"),attribute:v.getAttribute("data-glass-timeline-clip")});const M=`${C.toFixed(2)}px`;v.style.getPropertyValue("--glass-header-cut")!==M&&v.style.setProperty("--glass-header-cut",M),v.getAttribute("data-glass-timeline-clip")===null&&v.setAttribute("data-glass-timeline-clip",""),m.add(v)}for(const[g,x]of n)m.has(g)||o(g,x);const p=document.querySelector("[data-testid=settings-screen]");for(const[g,x]of a)p?.contains(g)||s(g,x);if(p?.checkVisibility())for(const g of Array.from(p.querySelectorAll(".settings-panel button"))){if(g.matches(":disabled,[aria-disabled=true]")){a.has(g)&&s(g,a.get(g));continue}const x=getComputedStyle(g),d=Lt(x.backgroundColor,x.color,a.has(g));if(!d){a.has(g)&&s(g,a.get(g));continue}a.has(g)||a.set(g,g.getAttribute("data-glass-control-ink")),g.getAttribute("data-glass-control-ink")!==d&&g.setAttribute("data-glass-control-ink",d)}for(const[g,x]of t)p?.contains(g)||c(g,x);if(p?.checkVisibility())for(const g of Array.from(p.querySelectorAll(".settings-panel :is(div,input:not([type]),input[type=text],input[type=number])"))){if(t.has(g)||!g.checkVisibility()||g.closest("button,[role=button],[role=switch],[role=alert],pre,code,[data-glass-palette-options]"))continue;const x=getComputedStyle(g),d=g.getBoundingClientRect();d.width<120||d.height<28||x.backgroundImage!=="none"||!Mt(x.backgroundColor)||(t.set(g,g.getAttribute("data-glass-settings-surface")),g.setAttribute("data-glass-settings-surface",g.parentElement?.closest("[data-glass-settings-surface]")?"nested":"card"))}},destroy(){document.removeEventListener("scroll",b,!0),window.removeEventListener("resize",f);for(const[m,p]of n)o(m,p);for(const[m,p]of t)c(m,p);for(const[m,p]of a)s(m,p)}},b=m=>{const p=[];for(const[g,{shield:x,viewport:d}]of i){if(m?.type==="scroll"&&m.target!==d)continue;const E=dt(x.getBoundingClientRect(),g.getBoundingClientRect());p.push({content:g,value:`${E.toFixed(2)}px`})}for(const{content:g,value:x}of p)g.style.getPropertyValue("--glass-header-cut")!==x&&g.style.setProperty("--glass-header-cut",x)},f=()=>e.sync();return document.addEventListener("scroll",b,{capture:!0,passive:!0}),window.addEventListener("resize",f,{passive:!0}),e}const K=(n,i)=>{n.textContent!==i&&(n.textContent=i)},qt={shell:"Shell",execute:"执行",read:"读取",patch:"写入",edit:"编辑",write:"写入",grep:"搜索",glob:"查找"};function zt(n){let i=!1,t;const a=new Map,s=new Map,c=new WeakSet,o=new Map,e=new Map,b=new Set,f=Pt(),m=u=>u.forEach(h=>{h.removeAttribute("data-glass-activity-member"),h.removeAttribute("data-glass-activity-hidden"),h.removeAttribute("data-glass-activity-last")}),p=(u,h=new Set)=>{m(u.members.filter(l=>!h.has(l))),u.header.remove(),a.delete(u.first)},g=(u,h)=>{u.removeAttribute("data-glass-activity-host"),h.trigger.isConnected&&h.trigger.getAttribute("aria-expanded")!==h.expanded&&h.trigger.click(),s.delete(u)},x=u=>{u.buttons.forEach(h=>h.removeAttribute("data-glass-native-model")),u.form.removeAttribute("data-glass-model-collapsed"),u.controls.removeAttribute("data-glass-model-controls"),u.toggle.remove(),e.delete(u.form)},d=(u,h)=>{!h&&u.buttons.some(l=>l.contains(document.activeElement))&&u.toggle.focus({preventScroll:!0}),u.form.toggleAttribute("data-glass-model-collapsed",!h),u.toggle.setAttribute("aria-expanded",String(h)),K(u.toggle,h?"收起 ▴":`${u.toggle.title} ▾`)},E=u=>{const h=u.querySelector("[data-slot=composer-controls]");if(!h?.querySelector("[data-action=composer-model]"))return;const l=Array.from(h.querySelectorAll("button:not([data-glass-model-toggle])"));if(!l.length||l.length>8)return;let A=e.get(u);if(A&&A.controls!==h&&(x(A),A=void 0),!A){const w=document.createElement("button");w.type="button",w.setAttribute("data-glass-model-toggle",""),w.setAttribute("data-glass-layout-owned",""),w.setAttribute("aria-label","展开或收起模式、模型和推理选项"),A={form:u,controls:h,toggle:w,buttons:[]},e.set(u,A);const $=A;w.addEventListener("click",()=>d($,$.form.hasAttribute("data-glass-model-collapsed"))),h.prepend(w),h.setAttribute("data-glass-model-controls",""),d(A,!1)}for(const w of A.buttons)l.includes(w)||w.removeAttribute("data-glass-native-model");A.buttons=l,l.forEach(w=>w.setAttribute("data-glass-native-model","")),A.toggle.isConnected||h.prepend(A.toggle);const R=l.map(w=>w.textContent?.trim()).filter(Boolean).join(" / ");K(A.toggle,u.hasAttribute("data-glass-model-collapsed")?`${R} ▾`:"收起 ▴"),A.toggle.title=R},v=()=>{const u=Array.from(document.querySelectorAll("[data-glass-vitals]")).filter(l=>l.checkVisibility()),h=new Set;for(const l of u){const A=l.closest("[data-slot=session-chat-panel]")??l.closest("main");if(!A)continue;const R=Array.from(l.querySelectorAll("[data-glass-metric-id]"));for(const w of Array.from(A.querySelectorAll("[data-slot=session-plugin-pill]"))){const $=w.getAttribute("data-glass-native-metric"),L=R.find(y=>y.dataset.glassMetricId===$)??R.find(y=>w.textContent?.trim()===y.dataset.glassMetricLabel||!!y.dataset.glassMetricTitle&&w.getAttribute("aria-label")===y.dataset.glassMetricTitle);L&&(w.setAttribute("data-glass-native-metric",L.dataset.glassMetricId),h.add(w),b.add(w))}}for(const l of b)h.has(l)||(l.removeAttribute("data-glass-native-metric"),b.delete(l))},T=u=>{const h=At(n()),l=new Set,A=new Set;for(const $ of u)for(const L of Array.from($.querySelectorAll("[data-component=collapsed-tool-group] > .tool-collapsible"))){const y=L.querySelector(":scope > [data-slot=collapsible-trigger]");!y||c.has(L)||(c.add(L),!(y.getAttribute("aria-expanded")!=="false"||L.querySelector("[data-component=context-tool-group-list]"))&&(s.set(L,{trigger:y,expanded:"false"}),o.set(L,Date.now()+1e3),y.click()))}const R=($,L)=>{const y=St(L,Date.now());if(!y.count||!$.length)return;const z=$[0];l.add(z);let N=a.get(z);if(!N){const D=document.createElement("button");D.type="button",D.setAttribute("data-glass-activity-header",""),D.setAttribute("data-glass-layout-owned","");const W=document.createElement("span");W.setAttribute("data-glass-activity-arrow",""),W.textContent="▸",W.setAttribute("aria-hidden","true");const at=document.createElement("span"),nt=document.createElement("span"),ot=document.createElement("span"),Q=document.createElement("span");at.setAttribute("data-glass-activity-title",""),nt.setAttribute("data-glass-activity-thinking",""),ot.setAttribute("data-glass-activity-status",""),Q.setAttribute("data-glass-activity-duration",""),Q.title="各工具执行时长累计；并行调用的时长可能重叠",D.append(W,at,nt,ot,Q),N={first:z,members:[],ids:[],header:D,title:at,thinking:nt,status:ot,duration:Q},a.set(z,N);const gt=N;D.addEventListener("click",()=>{gt.manual=D.getAttribute("aria-expanded")!=="true",I()})}const F=N;m(F.members.filter(D=>!$.includes(D))),F.members=$,F.ids=[...new Set(L.map(D=>D.id))],z.previousElementSibling!==F.header&&z.before(F.header);const J=y.busy,j=F.manual??J;F.header.setAttribute("aria-expanded",String(j)),F.header.setAttribute("data-status",y.state),F.header.toggleAttribute("data-busy",J),F.header.setAttribute("data-tool-count",String(y.count)),K(F.title,`${y.count} 个${y.names.length===1?` ${qt[y.names[0]]??y.names[0]} `:"工具"}调用`),K(F.thinking,y.thinkingMs>0?`思考 ${lt(y.thinkingMs)}`:""),F.thinking.hidden=y.thinkingMs<=0,K(F.status,`${Et[y.state]}${y.state==="error"&&y.running?` · ${y.running}运行中`:""}`),K(F.duration,y.timed?`累计 ${lt(y.toolMs)}`:""),$.forEach((D,W)=>{D.setAttribute("data-glass-activity-member",""),D.toggleAttribute("data-glass-activity-hidden",!j),D.toggleAttribute("data-glass-activity-last",W===$.length-1)});const U=z.closest("[data-component=collapsed-tool-group] > .tool-collapsible"),X=U?.querySelector(":scope > [data-slot=collapsible-trigger]");U&&X&&(A.add(U),s.has(U)||s.set(U,{trigger:X,expanded:X.getAttribute("aria-expanded")}),X.getAttribute("aria-expanded")==="false"&&X.click(),U.setAttribute("data-glass-activity-host",""))};for(const $ of u)for(const L of Array.from($.querySelectorAll("[data-component=context-tool-group-list]"))){const y=Array.from(L.children).filter(z=>z instanceof HTMLElement&&z.getAttribute("data-slot")==="context-tool-group-item").map(z=>({item:z,ids:[...new Set(Array.from(z.querySelectorAll("[data-timeline-part-id]")).map(N=>N.getAttribute("data-timeline-part-id")))]}));for(const z of Ct(y,h))R(z.items,z.parts)}const w=new Set([...a.values()].filter($=>l.has($.first)).flatMap($=>$.members));for(const $ of[...a.values()])(!l.has($.first)||!$.first.isConnected)&&p($,w);for(const[$,L]of[...s])A.has($)?o.delete($):(o.get($)??0)<=Date.now()&&(o.delete($),g($,L))};let C=0,M;const k=u=>{u.target instanceof Element&&u.target.closest("[data-slot=session-timeline-scroll]")&&(C=Date.now()+120,document.documentElement.hasAttribute("data-glass-scrolling")||document.documentElement.setAttribute("data-glass-scrolling","true"),M&&window.clearTimeout(M),M=window.setTimeout(()=>{document.documentElement.removeAttribute("data-glass-scrolling")},150))},q=()=>{if(t=void 0,i||document.hidden)return;const u=C-Date.now();if(u>0){t=window.setTimeout(q,u);return}const h=Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")).filter(l=>l.checkVisibility());h.forEach(l=>l.querySelectorAll("[data-component=composer]").forEach(E)),document.querySelectorAll("[data-component=new-session] [data-component=composer]").forEach(l=>{l.checkVisibility()&&E(l)});for(const l of[...e.values()])l.form.isConnected||x(l);T(h),v(),f.sync()},I=()=>{!i&&t===void 0&&(t=window.setTimeout(q,40))},S=new MutationObserver(u=>{u.some(h=>!(h.target instanceof Element?h.target:h.target.parentElement)?.closest("[data-glass-layout-owned]"))&&I()});S.observe(document.body,{childList:!0,subtree:!0,characterData:!1,attributes:!0,attributeFilter:["aria-expanded","data-state"]});const _=window.setInterval(I,1e3),V=u=>{if(u.key!=="Escape")return;if(!Array.from(document.querySelectorAll("[role=dialog],[role=menu]")).some(l=>l.checkVisibility()))for(const l of e.values())d(l,!1)};return document.addEventListener("visibilitychange",I),window.addEventListener("keydown",V,!0),document.addEventListener("scroll",k,{capture:!0,passive:!0}),I(),{destroy(){i=!0,S.disconnect(),window.clearInterval(_),window.clearTimeout(t),document.removeEventListener("visibilitychange",I),window.removeEventListener("keydown",V,!0),document.removeEventListener("scroll",k,!0),f.destroy();for(const u of[...a.values()])p(u);for(const[u,h]of[...s])g(u,h);o.clear();for(const u of[...e.values()])x(u);b.forEach(u=>u.removeAttribute("data-glass-native-metric")),b.clear()}}}var Ft=r.template('<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:0.5px solid var(--v2-border-border-muted)"><div style=flex:1;min-width:0><div style=font-size:13px;color:var(--v2-text-text-base)></div><div style=font-size:12px;color:var(--v2-text-text-muted);margin-top:2px></div></div><div style=flex:none>'),Tt=r.template("<div role=group data-glass-palette-options style=display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;width:min(280px,42vw)>"),_t=r.template("<div style=display:flex;align-items:center;gap:10px><input type=range min=0 max=100 step=1 style=width:140px><span style=font-size:12px;color:var(--v2-text-text-muted);min-width:30px;text-align:right;font-variant-numeric:tabular-nums>"),Dt=r.template('<div data-glass-settings style="padding:4px 0 24px">'),It=r.template('<button type=button style="display:flex;align-items:center;gap:7px;padding:7px 9px;border-radius:8px;color:var(--v2-text-text-base);cursor:pointer;font-size:12px;text-align:start"><span aria-hidden=true style=width:9px;height:9px;border-radius:50%;flex-shrink:0>');const Rt=G.Plugin.define({...ht,main(n){n.log.write("info","GLASS_FULL_V1 main loaded")},setup(n){console.info("GLASS_FULL_V1 setup started");const i=n.stores.prefs,t=wt(n);let a;O.createEffect(()=>{i.value.enabled?a??=zt(()=>{try{const d=n.sessions.current();return d?.server.data.session.message.list(d.id)??[]}catch{return[]}}):(a?.destroy(),a=void 0)}),i.value.styleRevision<1&&i.update(d=>{d.shimmer=!1,d.styleRevision=1});const s=document.documentElement,c=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>s.toggleAttribute("data-glass-paused",!i.value.motion||document.hidden||c.matches);document.addEventListener("visibilitychange",o),c.addEventListener("change",o);let e,b,f;const m=()=>{e||(e=ft({motion:i.value.motion,light:n.appearance.mode()==="light",palette:i.value.palette})),b||(b=document.createElement("div"),b.setAttribute("data-glass-veil",""),b.setAttribute("aria-hidden","true"),document.body.appendChild(b)),!f&&i.value.grain&&(f=document.createElement("div"),f.setAttribute("data-glass-grain",""),f.setAttribute("aria-hidden","true"),document.body.appendChild(f))},p=()=>{e?.destroy(),e=void 0,b?.remove(),b=void 0,f?.remove(),f=void 0};n.add(G.Style,()=>{const d=i.value;if(s.toggleAttribute("data-glass-enabled",d.enabled),s.toggleAttribute("data-glass-background",d.enabled&&d.background),d.enabled?s.setAttribute("data-glass-palette",H(d.palette).id):s.removeAttribute("data-glass-palette"),o(),!d.enabled){p();return}return d.background?(m(),e?.setParallax(d.parallax),e?.setMotion(d.motion),e?.refreshTheme(n.appearance.mode()==="light",H(d.palette).id),d.grain||(f?.remove(),f=void 0)):p(),vt({intensity:d.intensity,background:d.background,shimmer:d.shimmer,parallax:d.parallax,grain:d.grain,light:n.appearance.mode()==="light",palette:d.palette})});const g=d=>{if(!e)return;const E=window.innerWidth,v=window.innerHeight;!E||!v||e.setPointer((d.clientX/E-.5)*2,(d.clientY/v-.5)*2)};window.addEventListener("pointermove",g,{passive:!0});const x=()=>e?.setPointer(0,0);return document.documentElement.addEventListener("pointerleave",x),window.addEventListener("blur",x),n.add(G.Command,()=>({id:"toggle",title:n.t("command.toggle"),description:n.t("command.toggle.description"),keywords:"glass glassmorphism theme aurora",run:()=>{i.update(d=>{d.enabled=!d.enabled})}})),n.add(G.SettingsPage,{id:"glass",icon:"appearance",get title(){return n.t("title")},get entries(){return[{id:"palette",title:n.t("settings.palette"),keywords:"palette color blue graphite jade violet ice amber 配色 颜色"},{id:"intensity",title:n.t("settings.intensity"),keywords:"glass blur transparency"},{id:"background",title:n.t("settings.background"),keywords:"aurora animated background"},{id:"parallax",title:n.t("settings.parallax"),keywords:"mouse pointer parallax"},{id:"shimmer",title:n.t("settings.shimmer"),keywords:"sweep shine light"},{id:"grain",title:n.t("settings.grain"),keywords:"noise grain banding"},{id:"motion",title:n.t("settings.motion"),keywords:"pause animation motion"}]},render:()=>{const d=()=>i.value,E=n.ui,v=C=>(()=>{var M=Ft(),k=M.firstChild,q=k.firstChild,I=q.nextSibling,S=k.nextSibling;return r.insert(q,()=>C.title),r.insert(I,()=>C.description),r.insert(S,()=>C.children),r.effect(_=>{var V=C.id,u=`glass-setting-${C.id}`;return V!==_.e&&r.setAttribute(M,"data-glass-setting",_.e=V),u!==_.t&&r.setAttribute(M,"id",_.t=u),_},{e:void 0,t:void 0}),M})(),T=C=>M=>i.update(k=>{k[C]=M});return(()=>{var C=Dt();return r.insert(C,r.createComponent(v,{id:"enabled",get title(){return n.t("title")},get description(){return n.t("command.toggle.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("title")},get checked(){return d().enabled},onChange:M=>i.update(k=>{k.enabled=M})})}}),null),r.insert(C,r.createComponent(v,{id:"palette",get title(){return n.t("settings.palette")},get description(){return n.t("settings.palette.description")},get children(){var M=Tt();return r.insert(M,r.createComponent(O.For,{each:it,children:k=>(()=>{var q=It(),I=q.firstChild;return q.$$click=()=>i.update(S=>{S.palette=k.id}),r.insert(q,()=>n.t(`palette.${k.id}`),null),r.effect(S=>{var _=k.id,V=H(d().palette).id===k.id,u=H(d().palette).id===k.id?`1px solid ${k.ink}`:"1px solid var(--v2-border-border-muted)",h=H(d().palette).id===k.id?"var(--v2-background-bg-layer-02)":"transparent",l=k.ink;return _!==S.e&&r.setAttribute(q,"data-glass-palette-option",S.e=_),V!==S.t&&r.setAttribute(q,"aria-pressed",S.t=V),u!==S.a&&r.setStyleProperty(q,"border",S.a=u),h!==S.o&&r.setStyleProperty(q,"background",S.o=h),l!==S.i&&r.setStyleProperty(I,"background",S.i=l),S},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),q})()})),r.effect(()=>r.setAttribute(M,"aria-label",n.t("settings.palette"))),M}}),null),r.insert(C,r.createComponent(v,{id:"intensity",get title(){return n.t("settings.intensity")},get description(){return n.t("settings.intensity.description")},get children(){var M=_t(),k=M.firstChild,q=k.nextSibling;return k.$$input=I=>{const S=Number(I.target.value);i.update(_=>{_.intensity=S})},r.insert(q,()=>d().intensity),r.effect(()=>r.setAttribute(k,"aria-label",n.t("settings.intensity"))),r.effect(()=>k.value=d().intensity),M}}),null),r.insert(C,r.createComponent(v,{id:"background",get title(){return n.t("settings.background")},get description(){return n.t("settings.background.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("settings.background")},get checked(){return d().background},get onChange(){return T("background")}})}}),null),r.insert(C,r.createComponent(v,{id:"parallax",get title(){return n.t("settings.parallax")},get description(){return n.t("settings.parallax.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("settings.parallax")},get checked(){return d().parallax},get onChange(){return T("parallax")}})}}),null),r.insert(C,r.createComponent(v,{id:"shimmer",get title(){return n.t("settings.shimmer")},get description(){return n.t("settings.shimmer.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("settings.shimmer")},get checked(){return d().shimmer},get onChange(){return T("shimmer")}})}}),null),r.insert(C,r.createComponent(v,{id:"motion",get title(){return n.t("settings.motion")},get description(){return n.t("settings.motion.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("settings.motion")},get checked(){return d().motion},get onChange(){return T("motion")}})}}),null),r.insert(C,r.createComponent(v,{id:"grain",get title(){return n.t("settings.grain")},get description(){return n.t("settings.grain.description")},get children(){return r.createComponent(E.Switch,{get label(){return n.t("settings.grain")},get checked(){return d().grain},get onChange(){return T("grain")}})}}),null),C})()}}),console.info("GLASS_FULL_V1 setup completed"),()=>{a?.destroy(),t(),window.removeEventListener("pointermove",g),document.documentElement.removeEventListener("pointerleave",x),window.removeEventListener("blur",x),document.removeEventListener("visibilitychange",o),c.removeEventListener("change",o),s.removeAttribute("data-glass-enabled"),s.removeAttribute("data-glass-background"),s.removeAttribute("data-glass-palette"),s.removeAttribute("data-glass-paused"),p()}}});r.delegateEvents(["input","click"]);exports.default=Rt;
