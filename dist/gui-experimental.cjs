"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const r=require("solid-js/web"),X=require("@opencode/plugin/gui"),O=require("effect"),W=require("solid-js"),pt=["blue","graphite","jade","violet","ice","amber"],lt=[{id:"blue",base:"#05070e",accent:[77,107,254],second:[112,192,255],ink:"#a5b7ff",lightInk:"#3c53ab",colors:[[77,107,254],[112,192,255],[140,110,255],[40,200,190]]},{id:"graphite",base:"#101318",accent:[150,167,188],second:[117,138,158],ink:"#c4cfdc",lightInk:"#47576b",colors:[[150,167,188],[117,138,158],[138,148,164],[113,138,145]]},{id:"jade",base:"#071310",accent:[55,141,115],second:[84,143,139],ink:"#9acfb9",lightInk:"#28694f",colors:[[55,141,115],[84,143,139],[73,123,99],[69,141,127]]},{id:"violet",base:"#100d18",accent:[130,97,176],second:[108,122,170],ink:"#c5aedf",lightInk:"#6a438d",colors:[[130,97,176],[108,122,170],[153,113,161],[115,107,152]]},{id:"ice",base:"#071216",accent:[62,139,160],second:[92,133,164],ink:"#9ecbd6",lightInk:"#2c6376",colors:[[62,139,160],[92,133,164],[76,142,150],[100,151,168]]},{id:"amber",base:"#16110d",accent:[155,111,67],second:[135,124,103],ink:"#d7bb94",lightInk:"#805524",colors:[[155,111,67],[135,124,103],[159,128,84],[143,115,95]]}];function J(n){return lt.find(s=>s.id===n)??lt[0]}const ut=n=>String(n).replace(/^0\./,"."),dt=(n,s)=>`rgba(${n.join(",")},${ut(s)})`;function mt(n,s){const t=parseInt(n.slice(1),16);return`rgba(${t>>16},${t>>8&255},${t&255},${ut(s)})`}const bt=O.Schema.Struct({enabled:O.Schema.Boolean,intensity:O.Schema.Number,parallax:O.Schema.Boolean,shimmer:O.Schema.Boolean,background:O.Schema.Boolean,grain:O.Schema.Boolean,motion:O.Schema.Boolean,styleRevision:O.Schema.Number,palette:O.Schema.optional(O.Schema.Literals(pt)),backgroundStyle:O.Schema.optional(O.Schema.Literals(["aurora","tide","glow"]))}),ht={enabled:!0,intensity:62,parallax:!0,shimmer:!1,background:!0,grain:!0,motion:!0,styleRevision:0,palette:"blue",backgroundStyle:"aurora"},ft=X.Plugin.define({stores:{prefs:X.Store.global(bt,ht)},i18n:{en:{title:"Glass","settings.palette":"Glass palette","settings.backgroundStyle":"Background style","settings.backgroundStyle.description":"Choose a light and particle effect for the whole window.","backgroundStyle.aurora":"Aurora ribbons","backgroundStyle.tide":"Tidal particles","backgroundStyle.glow":"Soft glow","settings.palette.description":"Switch the background, navigation, titlebars and accents together. Does not change the native app theme.","palette.blue":"Deep blue","palette.graphite":"Smoked graphite","palette.jade":"Jade green","palette.violet":"Dusk violet","palette.ice":"Glacier cyan","palette.amber":"Warm amber","settings.motion":"Animation","settings.motion.description":"Pause all motion while keeping the glass background. Reduced motion is respected automatically.","settings.intensity":"Glass intensity","settings.intensity.description":"How much of the background shows through the panels.","settings.intensity.low":"Subtle","settings.intensity.medium":"Balanced","settings.intensity.high":"Full","settings.background":"Animated background","settings.background.description":"An aurora that drifts behind the interface.","settings.parallax":"Pointer parallax","settings.parallax.description":"The aurora follows the pointer.","settings.shimmer":"Light sweep","settings.shimmer.description":"A slow highlight travels across the frosted panels.","settings.grain":"Film grain","settings.grain.description":"Fine noise over the background, to avoid gradient banding.","command.toggle":"Toggle glass","command.toggle.description":"Turn the glassmorphism theme on or off."},zh:{title:"玻璃","settings.palette":"玻璃配色","settings.backgroundStyle":"背景效果","settings.backgroundStyle.description":"选择应用于整个窗口的光影与粒子效果。","backgroundStyle.aurora":"极光丝带","backgroundStyle.tide":"潮汐粒子","backgroundStyle.glow":"柔光流动","settings.palette.description":"背景、导航、顶栏和强调色一起切换；不改动原生主题设置。","palette.blue":"深蓝极光","palette.graphite":"石墨烟灰","palette.jade":"翡翠墨绿","palette.violet":"暮色紫","palette.ice":"冰川青","palette.amber":"琥珀暖灰","settings.motion":"动画","settings.motion.description":"关闭后保留静态玻璃背景；系统减少动态效果时自动暂停。","settings.intensity":"玻璃强度","settings.intensity.description":"背景从面板透出的程度。","settings.intensity.low":"克制","settings.intensity.medium":"标准","settings.intensity.high":"通透","settings.background":"动态背景","settings.background.description":"界面背后缓慢流动的极光。","settings.parallax":"鼠标视差","settings.parallax.description":"极光跟随鼠标位置偏移。","settings.shimmer":"流光扫过","settings.shimmer.description":"一道高光缓慢掠过磨砂面板。","settings.grain":"颗粒噪点","settings.grain.description":"背景上的细噪点，避免渐变出现色带。","command.toggle":"开关玻璃","command.toggle.description":"打开或关闭玻璃拟态主题。"}}});function vt(n={}){const s=document.createElement("canvas");s.setAttribute("data-glass-aurora",""),s.setAttribute("aria-hidden","true"),s.style.cssText="position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block";const t=s.getContext("2d");if(document.body.appendChild(s),!t)return{setPointer(){},setParallax(){},setMotion(){},setStyle(){},suspend(){},refreshTheme(){},destroy(){s.remove()}};let a=0,i=0,d=0,o=0,e=0,b=!1,v=!0,m=n.motion??!0,p=n.light??!1,u=!1,w,E,z=J(n.palette),l=n.style??"aurora",B=p?"#fafafa":z.base,q=z.colors.slice(0,2);const F={x:0,y:0},$={x:0,y:0},C=window.matchMedia?.("(prefers-reduced-motion: reduce)"),k=()=>!b&&m&&!u&&!document.hidden&&(typeof document.hasFocus=="function"?document.hasFocus():!0)&&!C?.matches,L=()=>{const y=getComputedStyle(document.documentElement).getPropertyValue("--v2-background-bg-deep").trim();B=p?y||"#fafafa":z.base,q=z.colors.slice(0,2)},_=(h=!1)=>{if(b)return;h&&($.x+=(F.x-$.x)*.045,$.y+=(F.y-$.y)*.045);const y=v&&m&&!C?.matches?$.x:0,I=v&&m&&!C?.matches?$.y:0;t.clearRect(0,0,a,i),t.fillStyle=B,t.fillRect(0,0,a,i),t.globalCompositeOperation=p?"multiply":"lighter";for(let S=0;S<q.length;S++){const A=d*22e-5,V=(.5+(S?-.28:.28)*Math.sin(A)+y*.04)*a,U=([.32,.8][S]+I*.035)*i,K=Math.max(a*.47,i*.65),[Z,Y,at]=q[S],nt=t.createRadialGradient(V,U,0,V,U,K);nt.addColorStop(0,`rgba(${Z},${Y},${at},${p?.1:.38})`),nt.addColorStop(.45,`rgba(${Z},${Y},${at},${p?.035:.12})`),nt.addColorStop(1,"rgba(0,0,0,0)"),t.fillStyle=nt,t.beginPath(),t.arc(V,U,K,0,Math.PI*2),t.fill()}t.globalCompositeOperation="source-over";const[H,D,Q]=q[1],j=d*.001,G=p?.35:1;if(l==="aurora")for(let S=0;S<8;S++){t.beginPath();for(let A=0;A<=a+16;A+=16){const V=i*(.48+S*.022)+Math.sin(A/a*7+j*.35+S*.17)*i*.08+Math.sin(A/a*3-j*.2)*i*.08;A===0?t.moveTo(A,V):t.lineTo(A,V)}t.lineWidth=5,t.strokeStyle=`rgba(${H},${D},${Q},${(.025+S%3*.008)*G})`,t.stroke()}if(l==="tide")for(let S=0;S<9;S++)for(let A=0;A<48;A++){const V=A*a/47,U=i*(.31+S*.046)+Math.sin(A*.19+j*.4+S*.2)*i*.06,K=.5+.5*Math.cos(A*.18-j*.7);t.beginPath(),t.arc(V,U,1+K*.55,0,Math.PI*2),t.fillStyle=`rgba(${H},${D},${Q},${(.09+K*.27)*G})`,t.fill()}else for(let S=0;S<64;S++){const A=(S*137.7+Math.sin(j*.24+S)*30+a)%a,V=(S*71.9+Math.sin(j*.32+S*.9)*14+i)%i;t.beginPath(),t.arc(A,V,S%13?.8:1.5,0,Math.PI*2),t.fillStyle=`rgba(${H},${D},${Q},${(.12+.14*(.5+.5*Math.sin(j*.6+S)))*G})`,t.fill()}},M=()=>{!o&&k()&&(o=requestAnimationFrame(c))},c=()=>{if(o=0,!k())return;const h=performance.now();(!e||h-e>=120)&&(d+=Math.min(e?h-e:121,160),e=h,_(!0)),M()},g=()=>{cancelAnimationFrame(o),o=0,e=0,!b&&!document.hidden&&(_(),M())},f=()=>{a=s.clientWidth||window.innerWidth,i=s.clientHeight||window.innerHeight;const h=Math.min(window.devicePixelRatio||1,1,960/Math.max(a,1));s.width=Math.max(1,Math.round(a*h)),s.height=Math.max(1,Math.round(i*h)),t.setTransform(h,0,0,h,0,0),g()},P=()=>{L(),g()},N=typeof MutationObserver>"u"?void 0:new MutationObserver(P);N?.observe(document.head,{childList:!0,subtree:!0,characterData:!0}),window.addEventListener("resize",f),document.addEventListener("visibilitychange",g);const T=h=>{!(h.target instanceof Element)||!h.target.closest("[data-slot=session-timeline-scroll]")||(u||(u=!0,cancelAnimationFrame(o),o=0,e=0),window.clearTimeout(w),w=window.setTimeout(()=>{u=!1,w=void 0,M()},180))};document.addEventListener("scroll",T,{capture:!0,passive:!0}),C?.addEventListener("change",g);const x=()=>g();return window.addEventListener("focus",x),window.addEventListener("blur",x),L(),f(),{setPointer(h,y){!v||!k()||!Number.isFinite(h)||!Number.isFinite(y)||(F.x=Math.max(-1,Math.min(1,h)),F.y=Math.max(-1,Math.min(1,y)))},setParallax(h){h!==v&&(v=h,h||(F.x=0,F.y=0,$.x=0,$.y=0,_()))},setMotion(h){h!==m&&(m=h,h||(F.x=0,F.y=0,$.x=0,$.y=0),g())},setStyle(h="aurora"){l!==h&&(l=h,g())},suspend(h){b||(u=!0,cancelAnimationFrame(o),o=0,e=0,window.clearTimeout(E),E=window.setTimeout(()=>{u=!1,E=void 0,M()},Math.max(0,h)))},refreshTheme(h,y=z.id){const I=J(y);p===h&&z.id===I.id||(p=h,z=I,P())},destroy(){b||(b=!0,cancelAnimationFrame(o),o=0,window.removeEventListener("resize",f),window.removeEventListener("focus",x),window.removeEventListener("blur",x),document.removeEventListener("visibilitychange",g),document.removeEventListener("scroll",T,!0),window.clearTimeout(w),window.clearTimeout(E),C?.removeEventListener("change",g),N?.disconnect(),s.remove())}}}const R=':where([data-component="collapsed-tool-group"] > .tool-collapsible, [data-component="tool-part-wrapper"]:not([data-component="context-tool-group-list"] *) > .tool-collapsible)',rt='[data-component="composer"]',it='[data-slot="session-turn-diff-trigger"]',ot=`:is(${R}, ${rt}, ${it})`;function yt(n){const s=Math.max(0,Math.min(100,Number.isFinite(n.intensity)?n.intensity:62))/100,t="html[data-glass-enabled]",a=!!n.light,i=J(n.palette),d=m=>dt(i.accent,m),o=m=>mt(i.base,m),e=m=>a?`color-mix(in srgb, var(--v2-background-bg-base) ${(m*100).toFixed(1)}%, transparent)`:`rgba(255,255,255,${m.toFixed(3)})`,b=a?"var(--v2-text-text-base)":"#c3cbdb",v=a?"var(--v2-text-text-muted)":"#93a0b6";return`
${t} {
  --glass-card: ${e(a?.82:.05-s*.0265)};
  --glass-border: ${a?"rgba(30,40,55,.13)":"rgba(230,237,248,.085)"};
  --glass-accent: ${a?i.lightInk:i.id==="blue"?"#6d8bff":i.ink};
  --glass-ink: ${b}; --glass-muted: ${v};
}
/* Native shell surfaces verified on Desktop 2.2.5. Preserve dimensions, drag
   regions, window controls and native actions; only replace their material. */
${t} [data-slot=titlebar-v2] {
  background: linear-gradient(105deg,${d(.055)},transparent), ${a?e(.86):o(.66)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
${t} [data-slot=session-chat-panel] .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${d(.1)},${d(.025)}), ${a?e(.96):o(.96)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
/* Unknown timeline structures keep the opaque safety fallback above. */
${t} [data-glass-timeline-clip] { clip-path: inset(var(--glass-header-cut,0px) 0 0); }
${t} [data-slot=session-chat-panel]:has([data-glass-timeline-clip]) .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${d(.045)},transparent), ${a?e(.88):o(.64)} !important;
}
/* The host fade uses neutral #161616, not the palette. Keep its geometry (the
   host counts these 16px in scroll offsets), but do not paint it once the row
   canvas is clipped below the title. Unknown structures keep a tinted fallback. */
${t} [data-slot=session-chat-panel] .session-header-fade {
  background: linear-gradient(to bottom, ${a?e(.96):o(.96)}, transparent) !important;
}
${t} [data-slot=session-chat-panel]:has([data-glass-timeline-clip]) .session-header-fade {
  background: transparent !important;
}
${t} [data-testid=settings-screen] {
  background: ${a?e(.86):o(n.background?.38:.96)} !important;
}
${t} [data-testid=settings-screen] .settings-panel { color: var(--glass-ink); }
${t} [data-testid=settings-screen] [data-glass-control-ink=light] { color: #fff !important; }
${t} [data-testid=settings-screen] [data-glass-control-ink=dark] { color: #000 !important; }
${t} [data-testid=settings-screen] .settings [role=tab][aria-selected=true] {
  background: linear-gradient(110deg,${d(.12)},${a?e(.84):"rgba(255,255,255,.035)"}) !important;
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
/* Host settings CSS makes this semantic class sticky without a .sticky class.
   Keep it in normal flow; relative preserves its absolutely positioned children. */
${t} .settings-screen .settings-tab-header {
  position: relative !important;
  top: auto !important;
  z-index: auto !important;
  background: transparent !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  box-shadow: none !important;
}
${t} .settings-screen .settings-tab-header::before {
  display: none !important;
}
/* Paint the host ROW, not its child button. Remove previous nested glass boxes. */
/* Home group labels paint a solid 12px cap and a 16px fade via pseudo-elements.
   With a transparent shell these read as detached black stripes. Let labels
   scroll normally so transparency cannot expose rows behind a sticky label. */
${t} [data-slot=home-sessions-list] .sticky {
  position: relative !important;
  top: auto !important;
  background: transparent !important;
}
${t} [data-slot=home-panel] .home-session-group-header::before,
${t} [data-slot=home-panel] .home-session-group-header::after {
  display: none !important;
}
${t} [data-slot=home-projects-viewport] {
  background: transparent !important;
  box-shadow: none !important;
}
${t} [data-slot=home-panel] [data-home-row] {
  --home-row-surface: transparent;
  --home-row-background: transparent;
  background: transparent !important;
}
${t} [data-slot=home-panel] [data-home-row]:is(:hover,:focus-within,:has([data-menu=true])) {
  background: ${d(.08)} !important;
}
${t} [data-slot=home-panel] [data-home-row][data-selected] {
  background: ${d(.16)} !important;
  box-shadow: inset 0 0 0 1px ${d(.24)};
}
${t} [data-slot=home-panel] [data-home-row] > button,
${t} [data-slot=home-panel] [data-slot=home-row-actions] {
  background: transparent !important;
  box-shadow: none !important;
  border-color: transparent !important;
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]) {
  background: ${a?`linear-gradient(120deg,${e(.84)},${d(.04)})`:`linear-gradient(120deg,rgba(255,255,255,.047),${d(.026)})`} !important;
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  color: var(--glass-ink) !important;
  transition: background-color .16s ease, border-color .16s ease;
}
${t} [data-action=vertical-tabs-new-session] {
  background: linear-gradient(120deg,${d(.13)},${d(.035)}) !important;
  border-color: var(--glass-border);
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):is(:hover,[data-state=pressed]) {
  background: linear-gradient(120deg,${d(.18)},${d(.055)}) !important;
  border-color: ${d(.32)};
}
${t} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):focus-visible {
  outline: 2px solid var(--glass-accent); outline-offset: 1px;
}
${n.background?`
${t}, ${t} body { background: transparent !important; }
/* Desktop 2.2.5: the opaque shell is #root > div.bg-v2-background-bg-deep.
   Every opaque ancestor of the sidebar has to be punched through, otherwise
   the fixed aurora canvas stays hidden behind a solid #080808 layer. */
${t} :is(#root > .bg-v2-background-bg-deep, #root > .bg-v2-background-bg-base) {
  background: transparent !important;
}
/* Shell fallback must have lower specificity than component materials. Exclude
   independent surfaces AND their children, not just overlay descendants. */
${t} :where(#root) :is(.bg-v2-background-bg-deep, .bg-v2-background-bg-base):not(:where(
  [role=dialog], [role=dialog] *, [role=menu], [role=menu] *,
  [data-slot=dialog-container], [data-slot=dialog-container] *,
  [data-component=menu-v2-content], [data-component=menu-v2-content] *,
  [data-component=popover-content], [data-component=popover-content] *,
  [data-component=toast-v2], [data-component=toast-v2] *,
  [data-slot=titlebar-v2], [data-session-title], [data-session-title] *,
  [data-testid=settings-screen],
  [data-glass-settings-surface], [data-slot=vertical-tabs-mount],
  [data-slot=vertical-tabs], #review-panel)) { background: transparent !important; }
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
  background: linear-gradient(165deg, ${d(.045)}, transparent 62%), ${a?e(.62):i.id==="blue"?"rgba(13,17,30,.46)":o(.46)} !important;
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
  border-inline-end: 1px solid var(--glass-border);
}
/* Review / side pane (Desktop 2.2.5). #review-panel and every layer inside it
   ship bg-v2-background-bg-base, which paints a solid #161616 over the aurora.
   Punch the shell through and give the pane the same frosted material as the
   sidebar. Scoped to #review-panel so the main shell keeps its own surface. */
${t} #review-panel {
  background: linear-gradient(195deg, ${d(.045)}, transparent 58%), ${a?e(.62):i.id==="blue"?"rgba(13,17,30,.46)":o(.46)} !important;
  backdrop-filter: blur(16px) saturate(140%);
  -webkit-backdrop-filter: blur(16px) saturate(140%);
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
  background: ${d(.14)} !important;
  box-shadow: inset 0 0 0 1px ${d(.22)};
}
${t} #review-panel .bg-surface-base {
  background: ${a?e(.84):"rgba(255,255,255,.035)"} !important;
  border-color: var(--glass-border) !important;
}

[data-glass-aurora], [data-glass-veil], [data-glass-grain] {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
}
[data-glass-veil] { background: ${a?`linear-gradient(180deg,${e(.24)},${e(.48)})`:`
  radial-gradient(1200px 700px at 16% 5%, ${d(.09)}, transparent 60%),
  radial-gradient(900px 620px at 88% 92%, ${dt(i.second,.065)}, transparent 62%),
  linear-gradient(180deg, ${o(.55)}, ${o(.82)})`}; }
`:""}
${n.background&&n.grain?`
[data-glass-grain] {
  opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
`:""}
/* Activity card: decorate the WHOLE collapsible, not its trigger alone. */
${t} ${R} {
  border-radius: 12px; overflow: hidden; margin-block: 0 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-card) !important;
  backdrop-filter: blur(14px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${t} ${R} > [data-slot=collapsible-trigger] {
  width: 100%; padding: 9px 13px; min-height: 38px;
  background: transparent !important; border: 0; box-shadow: none;
  border-radius: 0; transition: background-color .16s ease;
}
${t} ${R} > [data-slot=collapsible-trigger]:hover { background: ${d(.045)} !important; }
${t} ${R} [data-component=context-tool-group-trigger] {
  color: var(--glass-ink); font-size: 12.5px; font-weight: 600;
}
${t} [data-slot=basic-tool-tool-subtitle] { color: ${a?v:"#a9b6cd"}; }
${t} ${R} > [data-slot=collapsible-trigger]:focus-visible {
  outline: 2px solid ${d(.5)}; outline-offset: -2px;
}
${t} ${R}[data-expanded] > [data-slot=collapsible-content] { padding: 0 13px 11px; }
${t} ${R} [data-slot=context-tool-group-item] { min-width: 0; }
${t} ${R} [data-slot=context-tool-group-item] [data-slot=collapsible-trigger]:not([data-component=reasoning-part] *) {
  height: auto; min-height: 38px; padding-block: 4px; align-items: flex-start;
}
${t} ${R} [data-slot=context-tool-group-item] [data-component=tool-trigger]:not([data-component=reasoning-part] *) {
  height: auto; content-visibility: visible;
}
${t} ${R} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info]:not([data-component=reasoning-part] *) { flex: 1; width: 100%; }
${t} ${R} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-structured]:not([data-component=reasoning-part] *) { width: 100%; }
${t} ${R} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-main]:not([data-component=reasoning-part] *) {
  flex: 1; min-width: 0; flex-direction: column; align-items: stretch; gap: 5px; text-align: start;
}
${t} ${R} [data-slot=basic-tool-tool-title] { align-self: flex-start; text-align: start; }
${t} ${R} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-subtitle]:not([data-component=reasoning-part] *):not(.subagent-link):not(.webfetch-link) {
  display: block; max-width: 100%; padding: 7px 11px;
  background: ${a?"rgba(30,45,75,.045)":o(.24)};
  border-inline-start: 2px solid ${d(.28)}; border-radius: 0 7px 7px 0;
  font-family: var(--font-family-mono, ui-monospace, Consolas, monospace);
  font-size: 12px; line-height: 1.75;
}
${t} ${R} [data-slot=collapsible-arrow] { color: #66718a; transition: transform .18s ease; }
/* Native status content remains truthful: do not synthesize durations or completion. */
${t} ${R} :is([data-slot=tool-status-suffix], [data-slot=tool-status-tail]) {
  font-size: 11px; font-variant-numeric: tabular-nums; color: var(--glass-muted);
}
${t} ${R} [data-slot=tool-status-active] { color: ${a?"#27864d":"#7fd6a5"}; }
${t} ${R} [data-component=reasoning-part] > .tool-collapsible > [data-slot=collapsible-trigger] {
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
  border: 0; border-inline-start: 2px solid ${d(.28)};
  border-radius: 0 7px 7px 0; padding: 7px 11px;
  font-size: 12px; line-height: 1.75;
}
/* Selected sessions: the reference gradient and thin left-hand indicator. */
${t} [data-slot=sidebar-inbox-item] { border-radius: 8px; transition: background-color .16s ease; }
${t} [data-slot=sidebar-inbox-item][data-state=active] {
  background: linear-gradient(90deg,${d(.22)},${d(.05)}) !important;
  box-shadow: inset 2px 0 0 var(--glass-accent);
}
${t} [data-slot=sidebar-inbox-item][data-state=active] > span { color: ${a?b:"#eaf0ff"}; }
${t} [data-slot=sidebar-inbox-item]:hover:not([data-state=active]) { background: ${d(.055)} !important; }
/* Composer is a real form in 2.2.5; never touch its editable content or controls. */
${t} ${rt} {
  background: ${a?e(.86):"rgba(255,255,255,.045)"} !important;
  backdrop-filter: blur(14px) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}
${t} ${rt}:focus-within {
  border-color: ${d(.46)};
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045) !important;
}
${t} [data-component=composer-scroll] > .pointer-events-none { color: ${a?v:"#7b8699"}; }
/* User message bubble (Desktop 2.2.5). Chain: [data-component=user-message] >
   [data-slot=user-message-body] > [data-slot=user-message-text]. Only the inner
   node paints, and the host fills it with --v2-background-bg-layer-02 (#2e2e2e),
   which reads as a flat grey block over the frost. Keep the host radius,
   padding, max-width and text colour semantics; replace only the material. */
${t} [data-slot=user-message-body] { background: transparent !important; }
${t} [data-slot=user-message-text] {
  background: linear-gradient(135deg,${d(.17)},${d(.055)}), ${a?e(.88):"rgba(255,255,255,.03)"} !important;
  backdrop-filter: blur(14px) saturate(135%);
  -webkit-backdrop-filter: blur(14px) saturate(135%);
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045), 0 1px 3px rgba(0,0,0,.14);
  color: ${a?b:"#e8edf7"};
}
${t} [data-slot=user-message-text] :is(a, code) { color: ${a?i.lightInk:"#dcd6f5"}; }
/* Existing real diff chips preserve filename, navigation and +/- contents. */
${t} ${it} {
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
${t} ${it}:hover { background: ${a?e(.94):"rgba(255,255,255,.07)"} !important; }
${t} [data-slot=session-turn-diff-filename] { color: ${a?b:"#c9d2e0"}; }
${t} ${it} [data-component=file-icon] { color: var(--glass-accent); }
${t} :is([data-component=menu-v2-content], [data-component=popover-content], [data-slot=dialog-container]) {
  background: ${a?e(.96):o(.94)} !important;
  border: 1px solid var(--glass-border); backdrop-filter: blur(14px);
}
/* Optional extra, not part of the reference; the new skin defaults it OFF. */
${n.shimmer?`
${t} ${ot} {
  background-image: linear-gradient(105deg,transparent 36%,rgba(255,255,255,.035) 50%,transparent 64%);
  background-size: 260% 100%; background-repeat: no-repeat;
  animation: glass-shimmer 20s ease-in-out infinite;
}
@keyframes glass-shimmer { 0%,70% { background-position: 180% 0; } 95%,100% { background-position: -80% 0; } }
`:""}
html[data-glass-paused] ${ot} { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  ${t} ${ot} { animation: none !important; transition: none !important; }
  ${t} [data-slot=collapsible-arrow] { transition: none !important; }
}
@supports not (backdrop-filter: blur(1px)) {
  ${t} ${R}, ${t} ${rt} { background: ${a?e(.96):"rgba(10,13,22,.96)"} !important; }
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
${t} [data-glass-activity-header]:focus-visible { outline: 2px solid ${d(.65)}; outline-offset: 2px; }
@keyframes glass-activity-busy { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
@keyframes glass-activity-enter { from { opacity: .3; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
${t} [data-glass-model-controls] { display: flex; align-items: center; gap: 6px; overflow-x: auto; }
${t} [data-glass-model-controls] > div { display: contents; }
${t} [data-glass-model-collapsed] [data-glass-native-model] { display: none !important; }
${t} [data-glass-model-toggle] {
  flex: 0 1 auto; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  padding: 4px 10px; min-height: 27px; border-radius: 99px; border: 1px solid var(--glass-border);
  background: ${d(.07)}; color: var(--glass-ink); font: inherit; font-size: 12px; cursor: pointer;
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
html[data-glass-paused] :is(${ot},[data-slot=collapsible-arrow]) { transition: none !important; }
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
`}var kt=r.template("<span data-glass-vital>"),$t=r.template("<button type=button>"),wt=r.template("<details data-glass-vitals data-glass-layout-owned><summary aria-label=会话统计>统计 ▾</summary><div data-glass-vital-list>");const xt=new Set(["speed","ttft","context","turn","chatgpt-quota"]);function At(n){const s=t=>{const a=W.createMemo(()=>{try{return t.item.show(t.input)}catch{return}});return r.createComponent(W.Show,{get when(){return a()},children:i=>(()=>{var d=kt();return r.insert(d,r.createComponent(n.ui.Tooltip,{get value(){return i().title??i().label},get children(){return r.createComponent(W.Show,{get when(){return i().rows?.length},get fallback(){return(()=>{var o=$t();return o.$$click=()=>i().run?.(),r.insert(o,()=>i().label),r.effect(()=>o.disabled=!i().run),o})()},get children(){return r.createComponent(n.ui.Menu,{trigger:"button",get label(){return i().label},placement:"bottom-end",get items(){return(i().rows??[]).map(o=>({label:o.detail?`${o.label} · ${o.detail}`:o.label,icon:o.icon,onSelect:()=>o.run?.()}))}})}})}})),r.effect(o=>{var e=t.item.id,b=i().label,v=i().title??"",m=i().tone;return e!==o.e&&r.setAttribute(d,"data-glass-metric-id",o.e=e),b!==o.t&&r.setAttribute(d,"data-glass-metric-label",o.t=b),v!==o.a&&r.setAttribute(d,"data-glass-metric-title",o.a=v),m!==o.o&&r.setAttribute(d,"data-tone",o.o=m),o},{e:void 0,t:void 0,a:void 0,o:void 0}),d})()})};return n.add(X.Slot,{at:"session.header",order:80,render:t=>{let a;const i=e=>{e.target instanceof Element&&e.target.closest("[role=menu],[role=menuitem],[data-component=tooltip]")||t.compact&&a&&e.target instanceof Node&&!a.contains(e.target)&&(a.open=!1)},d=e=>{if(e.key!=="Escape"||!t.compact||!a?.open)return;Array.from(document.querySelectorAll("[role=menu],[role=dialog]")).some(v=>v.checkVisibility())||(a.open=!1,a.querySelector("summary")?.focus({preventScroll:!0}))};document.addEventListener("pointerdown",i),document.addEventListener("keydown",d,!0),W.onCleanup(()=>{document.removeEventListener("pointerdown",i),document.removeEventListener("keydown",d,!0)});const o=()=>n.list(X.ComposerPill).filter(e=>xt.has(e.id)&&!e.menu);return r.createComponent(W.Show,{get when(){return r.memo(()=>!!(t.active&&n.stores.prefs.value.enabled))()&&o().length>0},get children(){var e=wt(),b=e.firstChild,v=b.nextSibling,m=a;return typeof m=="function"?r.use(m,e):a=e,r.insert(v,r.createComponent(W.For,{get each(){return o()},children:p=>r.createComponent(s,{item:p,input:t})})),r.effect(p=>{var u=t.compact,w=!t.compact;return u!==p.e&&r.setAttribute(e,"data-compact",p.e=u),w!==p.t&&(e.open=p.t=w),p},{e:void 0,t:void 0}),e}})}})}r.delegateEvents(["click"]);const et=n=>n&&typeof n=="object"?n:{},st=n=>{const s=Number(n);return Number.isFinite(s)&&s>0?s:0};function St(n){const s=new Map;for(const t of n){const a=et(t);if(a.type!=="assistant"||!Array.isArray(a.content))continue;let i=0;for(const d of a.content){const o=et(d),e=et(o.time),b=et(o.state);if(o.type!=="tool"&&o.type!=="reasoning")continue;const v=o.type==="tool"?String(o.id??""):`${a.id}:reasoning:${i++}`;if(!v)continue;const m=st(e.completed)||void 0,p=o.type==="reasoning"?m?"completed":"thinking":b.status==="error"?/abort|interrupt|cancel/i.test(String(et(b.error).type))?"interrupted":"error":b.status==="completed"?"completed":b.status==="running"?"running":"preparing";s.set(v,{id:v,type:o.type,name:String(o.name??"工具"),state:p,start:st(e.ran)||st(e.created),end:m})}}return s}function Et(n,s){const t=[...new Map(n.map(e=>[e.id,e])).values()],a=t.filter(e=>e.type==="tool"),i=e=>e.start?Math.max(0,(e.end??s)-e.start):0,d=a.some(e=>e.state==="error")?"error":a.some(e=>e.state==="running")?"running":a.some(e=>e.state==="preparing")?"preparing":t.some(e=>e.state==="thinking")?"thinking":a.some(e=>e.state==="interrupted")?"interrupted":"completed",o=[...new Set(a.map(e=>e.name))];return{count:a.length,names:o,state:d,busy:t.some(e=>["running","preparing","thinking"].includes(e.state)),running:a.filter(e=>["running","preparing"].includes(e.state)).length,toolMs:a.reduce((e,b)=>e+i(b),0),thinkingMs:t.filter(e=>e.type==="reasoning").reduce((e,b)=>e+i(b),0),timed:a.some(e=>e.start>0)}}const Ct={preparing:"准备中",running:"运行中",thinking:"思考中",completed:"已完成",error:"失败",interrupted:"已中断"};function ct(n){return n<6e4?`${(n/1e3).toFixed(1)}秒`:`${Math.floor(n/6e4)}分${Math.floor(n%6e4/1e3)}秒`}function Mt(n,s){const t=[];let a=[],i=[];const d=()=>{i.some(o=>o.type==="tool")&&t.push({items:a,parts:i}),a=[],i=[]};for(const o of n){const e=o.ids.map(b=>s.get(b));if(!o.ids.length||e.some(b=>!b)){d();continue}a.push(o.item),i.push(...e)}return d(),t}function Lt(n){const s=n.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!s)return!1;const t=s.slice(1,4).map(Number);return Number(s[4]??1)>=.9&&Math.max(...t)-Math.min(...t)<=5}function Pt(n,s,t=!1){const a=e=>{const b=e.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/);if(!b||Number(b[4]??1)<1)return;const v=b.slice(1,4).map(m=>{const p=Number(m)/255;return p<=.04045?p/12.92:((p+.055)/1.055)**2.4});return v[0]*.2126+v[1]*.7152+v[2]*.0722},i=a(n),d=a(s);if(i===void 0||d===void 0)return;const o=(e,b)=>(Math.max(e,b)+.05)/(Math.min(e,b)+.05);if(!(!t&&o(i,d)>=4.5))return o(i,1)>o(i,0)?"light":"dark"}function gt(n,s){return![n.top,n.bottom,s.top,s.bottom].every(Number.isFinite)||n.top>=s.bottom||n.bottom<=s.top?0:Math.max(0,Math.min(n.bottom-s.top,s.bottom-s.top))}function Tt(){const n=new Map,s=new Map,t=new Map,a=new Map,i=(m,p)=>{p===null?m.removeAttribute("data-glass-control-ink"):m.setAttribute("data-glass-control-ink",p),a.delete(m)},d=(m,p)=>{p===null?m.removeAttribute("data-glass-settings-surface"):m.setAttribute("data-glass-settings-surface",p),t.delete(m)},o=(m,p)=>{p.value?m.style.setProperty("--glass-header-cut",p.value,p.priority):m.style.removeProperty("--glass-header-cut"),p.attribute===null?m.removeAttribute("data-glass-timeline-clip"):m.setAttribute("data-glass-timeline-clip",p.attribute),n.delete(m),s.delete(m)},e={sync(){const m=new Set;for(const u of Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")))if(u.checkVisibility())for(const w of Array.from(u.querySelectorAll(".session-header-layout"))){const E=w.parentElement?.parentElement,z=E?.closest(".scroll-view__viewport"),l=Array.from(z?.children??[]).find($=>$ instanceof HTMLElement&&$.style.position==="relative"&&$.style.overflowX==="clip");if(!E?.classList.contains("pointer-events-auto")||!l||l.contains(E)||!E.checkVisibility())continue;const B=E.parentElement?.hasAttribute("data-session-title")?E.parentElement:E;if(!z)continue;const q=gt(B.getBoundingClientRect(),l.getBoundingClientRect());if(!q)continue;s.set(l,{shield:B,viewport:z}),n.has(l)||n.set(l,{value:l.style.getPropertyValue("--glass-header-cut"),priority:l.style.getPropertyPriority("--glass-header-cut"),attribute:l.getAttribute("data-glass-timeline-clip")});const F=`${q.toFixed(2)}px`;l.style.getPropertyValue("--glass-header-cut")!==F&&l.style.setProperty("--glass-header-cut",F),l.getAttribute("data-glass-timeline-clip")===null&&l.setAttribute("data-glass-timeline-clip",""),m.add(l)}for(const[u,w]of n)m.has(u)||o(u,w);const p=document.querySelector("[data-testid=settings-screen]");for(const[u,w]of a)p?.contains(u)||i(u,w);if(p?.checkVisibility())for(const u of Array.from(p.querySelectorAll(".settings-panel button"))){if(u.matches(":disabled,[aria-disabled=true]")){a.has(u)&&i(u,a.get(u));continue}const w=getComputedStyle(u),E=Pt(w.backgroundColor,w.color,a.has(u));if(!E){a.has(u)&&i(u,a.get(u));continue}a.has(u)||a.set(u,u.getAttribute("data-glass-control-ink")),u.getAttribute("data-glass-control-ink")!==E&&u.setAttribute("data-glass-control-ink",E)}for(const[u,w]of t)p?.contains(u)||d(u,w);if(p?.checkVisibility())for(const u of Array.from(p.querySelectorAll(".settings-panel :is(div,input:not([type]),input[type=text],input[type=number])"))){if(t.has(u)||!u.checkVisibility()||u.closest("button,[role=button],[role=switch],[role=alert],pre,code,[data-glass-palette-options]"))continue;const w=getComputedStyle(u),E=u.getBoundingClientRect();E.width<120||E.height<28||w.backgroundImage!=="none"||!Lt(w.backgroundColor)||(t.set(u,u.getAttribute("data-glass-settings-surface")),u.setAttribute("data-glass-settings-surface",u.parentElement?.closest("[data-glass-settings-surface]")?"nested":"card"))}},destroy(){document.removeEventListener("scroll",b,!0),window.removeEventListener("resize",v);for(const[m,p]of n)o(m,p);for(const[m,p]of t)d(m,p);for(const[m,p]of a)i(m,p)}},b=m=>{const p=[];for(const[u,{shield:w,viewport:E}]of s){if(m?.type==="scroll"&&m.target!==E)continue;const z=gt(w.getBoundingClientRect(),u.getBoundingClientRect());p.push({content:u,value:`${z.toFixed(2)}px`})}for(const{content:u,value:w}of p)u.style.getPropertyValue("--glass-header-cut")!==w&&u.style.setProperty("--glass-header-cut",w)},v=()=>e.sync();return document.addEventListener("scroll",b,{capture:!0,passive:!0}),window.addEventListener("resize",v,{passive:!0}),e}const tt=(n,s)=>{n.textContent!==s&&(n.textContent=s)},qt={shell:"Shell",execute:"执行",read:"读取",patch:"写入",edit:"编辑",write:"写入",grep:"搜索",glob:"查找"};function zt(n){let s=!1,t;const a=new Map,i=new Map,d=new WeakSet,o=new Map,e=new Map,b=new Set,v=Tt(),m=c=>c.forEach(g=>{g.removeAttribute("data-glass-activity-member"),g.removeAttribute("data-glass-activity-hidden"),g.removeAttribute("data-glass-activity-last")}),p=(c,g=new Set)=>{m(c.members.filter(f=>!g.has(f))),c.header.remove(),a.delete(c.first)},u=(c,g)=>{c.removeAttribute("data-glass-activity-host"),g.trigger.isConnected&&g.trigger.getAttribute("aria-expanded")!==g.expanded&&g.trigger.click(),i.delete(c)},w=c=>{c.buttons.forEach(g=>g.removeAttribute("data-glass-native-model")),c.form.removeAttribute("data-glass-model-collapsed"),c.controls.removeAttribute("data-glass-model-controls"),c.toggle.remove(),e.delete(c.form)},E=(c,g)=>{!g&&c.buttons.some(f=>f.contains(document.activeElement))&&c.toggle.focus({preventScroll:!0}),c.form.toggleAttribute("data-glass-model-collapsed",!g),c.toggle.setAttribute("aria-expanded",String(g)),tt(c.toggle,g?"收起 ▴":`${c.toggle.title} ▾`)},z=c=>{const g=c.querySelector("[data-slot=composer-controls]");if(!g?.querySelector("[data-action=composer-model]"))return;const f=Array.from(g.querySelectorAll("button:not([data-glass-model-toggle])"));if(!f.length||f.length>8)return;let P=e.get(c);if(P&&P.controls!==g&&(w(P),P=void 0),!P){const T=document.createElement("button");T.type="button",T.setAttribute("data-glass-model-toggle",""),T.setAttribute("data-glass-layout-owned",""),T.setAttribute("aria-label","展开或收起模式、模型和推理选项"),P={form:c,controls:g,toggle:T,buttons:[]},e.set(c,P);const x=P;T.addEventListener("click",()=>E(x,x.form.hasAttribute("data-glass-model-collapsed"))),g.prepend(T),g.setAttribute("data-glass-model-controls",""),E(P,!1)}for(const T of P.buttons)f.includes(T)||T.removeAttribute("data-glass-native-model");P.buttons=f,f.forEach(T=>T.setAttribute("data-glass-native-model","")),P.toggle.isConnected||g.prepend(P.toggle);const N=f.map(T=>T.textContent?.trim()).filter(Boolean).join(" / ");tt(P.toggle,c.hasAttribute("data-glass-model-collapsed")?`${N} ▾`:"收起 ▴"),P.toggle.title=N},l=()=>{const c=Array.from(document.querySelectorAll("[data-glass-vitals]")).filter(f=>f.checkVisibility()),g=new Set;for(const f of c){const P=f.closest("[data-slot=session-chat-panel]")??f.closest("main");if(!P)continue;const N=Array.from(f.querySelectorAll("[data-glass-metric-id]"));for(const T of Array.from(P.querySelectorAll("[data-slot=session-plugin-pill]"))){const x=T.getAttribute("data-glass-native-metric"),h=N.find(y=>y.dataset.glassMetricId===x)??N.find(y=>T.textContent?.trim()===y.dataset.glassMetricLabel||!!y.dataset.glassMetricTitle&&T.getAttribute("aria-label")===y.dataset.glassMetricTitle);h&&(T.setAttribute("data-glass-native-metric",h.dataset.glassMetricId),g.add(T),b.add(T))}}for(const f of b)g.has(f)||(f.removeAttribute("data-glass-native-metric"),b.delete(f))},B=c=>{const g=St(n()),f=new Set,P=new Set;for(const x of c)for(const h of Array.from(x.querySelectorAll("[data-component=collapsed-tool-group] > .tool-collapsible"))){const y=h.querySelector(":scope > [data-slot=collapsible-trigger]");!y||d.has(h)||(d.add(h),!(y.getAttribute("aria-expanded")!=="false"||h.querySelector("[data-component=context-tool-group-list]"))&&(i.set(h,{trigger:y,expanded:"false"}),o.set(h,Date.now()+1e3),y.click()))}const N=(x,h)=>{const y=Et(h,Date.now());if(!y.count||!x.length)return;const I=x[0];f.add(I);let H=a.get(I);if(!H){const A=document.createElement("button");A.type="button",A.setAttribute("data-glass-activity-header",""),A.setAttribute("data-glass-layout-owned","");const V=document.createElement("span");V.setAttribute("data-glass-activity-arrow",""),V.textContent="▸",V.setAttribute("aria-hidden","true");const U=document.createElement("span"),K=document.createElement("span"),Z=document.createElement("span"),Y=document.createElement("span");U.setAttribute("data-glass-activity-title",""),K.setAttribute("data-glass-activity-thinking",""),Z.setAttribute("data-glass-activity-status",""),Y.setAttribute("data-glass-activity-duration",""),Y.title="各工具执行时长累计；并行调用的时长可能重叠",A.append(V,U,K,Z,Y),H={first:I,members:[],ids:[],header:A,title:U,thinking:K,status:Z,duration:Y},a.set(I,H);const at=H;A.addEventListener("click",()=>{at.manual=A.getAttribute("aria-expanded")!=="true",k()})}const D=H;m(D.members.filter(A=>!x.includes(A))),D.members=x,D.ids=[...new Set(h.map(A=>A.id))],I.previousElementSibling!==D.header&&I.before(D.header);const Q=y.busy,j=D.manual??Q;D.header.setAttribute("aria-expanded",String(j)),D.header.setAttribute("data-status",y.state),D.header.toggleAttribute("data-busy",Q),D.header.setAttribute("data-tool-count",String(y.count)),tt(D.title,`${y.count} 个${y.names.length===1?` ${qt[y.names[0]]??y.names[0]} `:"工具"}调用`),tt(D.thinking,y.thinkingMs>0?`思考 ${ct(y.thinkingMs)}`:""),D.thinking.hidden=y.thinkingMs<=0,tt(D.status,`${Ct[y.state]}${y.state==="error"&&y.running?` · ${y.running}运行中`:""}`),tt(D.duration,y.timed?`累计 ${ct(y.toolMs)}`:""),x.forEach((A,V)=>{A.setAttribute("data-glass-activity-member",""),A.toggleAttribute("data-glass-activity-hidden",!j),A.toggleAttribute("data-glass-activity-last",V===x.length-1)});const G=I.closest("[data-component=collapsed-tool-group] > .tool-collapsible"),S=G?.querySelector(":scope > [data-slot=collapsible-trigger]");G&&S&&(P.add(G),i.has(G)||i.set(G,{trigger:S,expanded:S.getAttribute("aria-expanded")}),S.getAttribute("aria-expanded")==="false"&&S.click(),G.setAttribute("data-glass-activity-host",""))};for(const x of c)for(const h of Array.from(x.querySelectorAll("[data-component=context-tool-group-list]"))){const y=Array.from(h.children).filter(I=>I instanceof HTMLElement&&I.getAttribute("data-slot")==="context-tool-group-item").map(I=>({item:I,ids:[...new Set(Array.from(I.querySelectorAll("[data-timeline-part-id]")).map(H=>H.getAttribute("data-timeline-part-id")))]}));for(const I of Mt(y,g))N(I.items,I.parts)}const T=new Set([...a.values()].filter(x=>f.has(x.first)).flatMap(x=>x.members));for(const x of[...a.values()])(!f.has(x.first)||!x.first.isConnected)&&p(x,T);for(const[x,h]of[...i])P.has(x)?o.delete(x):(o.get(x)??0)<=Date.now()&&(o.delete(x),u(x,h))};let q=0,F;const $=c=>{c.target instanceof Element&&c.target.closest("[data-slot=session-timeline-scroll]")&&(q=Date.now()+120,document.documentElement.hasAttribute("data-glass-scrolling")||document.documentElement.setAttribute("data-glass-scrolling","true"),F&&window.clearTimeout(F),F=window.setTimeout(()=>{document.documentElement.removeAttribute("data-glass-scrolling")},150))},C=()=>{if(t=void 0,s||document.hidden)return;const c=q-Date.now();if(c>0){t=window.setTimeout(C,c);return}const g=Array.from(document.querySelectorAll("[data-slot=session-chat-panel]")).filter(f=>f.checkVisibility());g.forEach(f=>f.querySelectorAll("[data-component=composer]").forEach(z)),document.querySelectorAll("[data-component=new-session] [data-component=composer]").forEach(f=>{f.checkVisibility()&&z(f)});for(const f of[...e.values()])f.form.isConnected||w(f);B(g),l(),v.sync()},k=()=>{!s&&t===void 0&&(t=window.setTimeout(C,40))},L=new MutationObserver(c=>{c.some(g=>!(g.target instanceof Element?g.target:g.target.parentElement)?.closest("[data-glass-layout-owned]"))&&k()});L.observe(document.body,{childList:!0,subtree:!0,characterData:!1,attributes:!0,attributeFilter:["aria-expanded","data-state"]});const _=window.setInterval(k,2500),M=c=>{if(c.key!=="Escape")return;if(!Array.from(document.querySelectorAll("[role=dialog],[role=menu]")).some(f=>f.checkVisibility()))for(const f of e.values())E(f,!1)};return document.addEventListener("visibilitychange",k),window.addEventListener("keydown",M,!0),document.addEventListener("scroll",$,{capture:!0,passive:!0}),k(),{destroy(){s=!0,L.disconnect(),window.clearInterval(_),window.clearTimeout(t),document.removeEventListener("visibilitychange",k),window.removeEventListener("keydown",M,!0),document.removeEventListener("scroll",$,!0),v.destroy();for(const c of[...a.values()])p(c);for(const[c,g]of[...i])u(c,g);o.clear();for(const c of[...e.values()])w(c);b.forEach(c=>c.removeAttribute("data-glass-native-metric")),b.clear()}}}var Ft=r.template('<div style="display:flex;align-items:center;gap:16px;padding:12px 0;border-bottom:0.5px solid var(--v2-border-border-muted)"><div style=flex:1;min-width:0><div style=font-size:13px;color:var(--v2-text-text-base)></div><div style=font-size:12px;color:var(--v2-text-text-muted);margin-top:2px></div></div><div style=flex:none>'),_t=r.template("<div role=group data-glass-palette-options style=display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;width:min(280px,42vw)>"),It=r.template("<div role=group style=display:flex;flex-wrap:wrap;gap:6px;width:min(280px,42vw)>"),Rt=r.template("<div style=display:flex;align-items:center;gap:10px><input type=range min=0 max=100 step=1 style=width:140px><span style=font-size:12px;color:var(--v2-text-text-muted);min-width:30px;text-align:right;font-variant-numeric:tabular-nums>"),Dt=r.template('<div data-glass-settings style="padding:4px 0 24px">'),Bt=r.template('<button type=button style="display:flex;align-items:center;gap:7px;padding:7px 9px;border-radius:8px;color:var(--v2-text-text-base);cursor:pointer;font-size:12px;text-align:start"><span aria-hidden=true style=width:9px;height:9px;border-radius:50%;flex-shrink:0>'),Vt=r.template('<button type=button style="padding:7px 9px;border-radius:8px;color:var(--v2-text-text-base);cursor:pointer;font-size:12px">');const Nt=X.Plugin.define({...ft,main(n){n.log.write("info","GLASS_FULL_V1 main loaded")},setup(n){console.info("GLASS_FULL_V1 setup started");const s=n.stores.prefs,t=At(n);let a;W.createEffect(()=>{s.value.enabled?a??=zt(()=>{try{const l=n.sessions.current();return l?.server.data.session.message.list(l.id)??[]}catch{return[]}}):(a?.destroy(),a=void 0)}),s.value.styleRevision<1&&s.update(l=>{l.shimmer=!1,l.styleRevision=1});const i=document.documentElement,d=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>i.toggleAttribute("data-glass-paused",!s.value.motion||document.hidden||d.matches);document.addEventListener("visibilitychange",o),d.addEventListener("change",o);let e,b,v;const m=()=>{e||(e=vt({motion:s.value.motion,light:n.appearance.mode()==="light",palette:s.value.palette,style:s.value.backgroundStyle})),b||(b=document.createElement("div"),b.setAttribute("data-glass-veil",""),b.setAttribute("aria-hidden","true"),document.body.appendChild(b)),!v&&s.value.grain&&(v=document.createElement("div"),v.setAttribute("data-glass-grain",""),v.setAttribute("aria-hidden","true"),document.body.appendChild(v))},p=()=>{e?.destroy(),e=void 0,b?.remove(),b=void 0,v?.remove(),v=void 0};let u,w;W.createEffect(()=>{const l=n.sessions.current()?.id;l!==u&&(u=l,!(!s.value.enabled||!s.value.background)&&(e?.suspend(400),i.setAttribute("data-glass-scrolling","true"),window.clearTimeout(w),w=window.setTimeout(()=>i.removeAttribute("data-glass-scrolling"),400)))}),n.add(X.Style,()=>{const l=s.value;if(i.toggleAttribute("data-glass-enabled",l.enabled),i.toggleAttribute("data-glass-background",l.enabled&&l.background),l.enabled?i.setAttribute("data-glass-palette",J(l.palette).id):i.removeAttribute("data-glass-palette"),o(),!l.enabled){p();return}return l.background?(m(),e?.setParallax(l.parallax),e?.setMotion(l.motion),e?.setStyle(l.backgroundStyle),e?.refreshTheme(n.appearance.mode()==="light",J(l.palette).id),l.grain||(v?.remove(),v=void 0)):p(),yt({intensity:l.intensity,background:l.background,shimmer:l.shimmer,parallax:l.parallax,grain:l.grain,light:n.appearance.mode()==="light",palette:l.palette})});const E=l=>{if(!e)return;const B=window.innerWidth,q=window.innerHeight;!B||!q||e.setPointer((l.clientX/B-.5)*2,(l.clientY/q-.5)*2)};window.addEventListener("pointermove",E,{passive:!0});const z=()=>e?.setPointer(0,0);return document.documentElement.addEventListener("pointerleave",z),window.addEventListener("blur",z),n.add(X.Command,()=>({id:"toggle",title:n.t("command.toggle"),description:n.t("command.toggle.description"),keywords:"glass glassmorphism theme aurora",run:()=>{s.update(l=>{l.enabled=!l.enabled})}})),n.add(X.SettingsPage,{id:"glass",icon:"appearance",get title(){return n.t("title")},get entries(){return[{id:"palette",title:n.t("settings.palette"),keywords:"palette color blue graphite jade violet ice amber 配色 颜色"},{id:"backgroundStyle",title:n.t("settings.backgroundStyle"),keywords:"aurora tide glow wave particle 光波 粒子 背景 效果"},{id:"intensity",title:n.t("settings.intensity"),keywords:"glass blur transparency"},{id:"background",title:n.t("settings.background"),keywords:"aurora animated background"},{id:"parallax",title:n.t("settings.parallax"),keywords:"mouse pointer parallax"},{id:"shimmer",title:n.t("settings.shimmer"),keywords:"sweep shine light"},{id:"grain",title:n.t("settings.grain"),keywords:"noise grain banding"},{id:"motion",title:n.t("settings.motion"),keywords:"pause animation motion"}]},render:()=>{const l=()=>s.value,B=n.ui,q=$=>(()=>{var C=Ft(),k=C.firstChild,L=k.firstChild,_=L.nextSibling,M=k.nextSibling;return r.insert(L,()=>$.title),r.insert(_,()=>$.description),r.insert(M,()=>$.children),r.effect(c=>{var g=$.id,f=`glass-setting-${$.id}`;return g!==c.e&&r.setAttribute(C,"data-glass-setting",c.e=g),f!==c.t&&r.setAttribute(C,"id",c.t=f),c},{e:void 0,t:void 0}),C})(),F=$=>C=>s.update(k=>{k[$]=C});return(()=>{var $=Dt();return r.insert($,r.createComponent(q,{id:"enabled",get title(){return n.t("title")},get description(){return n.t("command.toggle.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("title")},get checked(){return l().enabled},onChange:C=>s.update(k=>{k.enabled=C})})}}),null),r.insert($,r.createComponent(q,{id:"palette",get title(){return n.t("settings.palette")},get description(){return n.t("settings.palette.description")},get children(){var C=_t();return r.insert(C,r.createComponent(W.For,{each:lt,children:k=>(()=>{var L=Bt(),_=L.firstChild;return L.$$click=()=>s.update(M=>{M.palette=k.id}),r.insert(L,()=>n.t(`palette.${k.id}`),null),r.effect(M=>{var c=k.id,g=J(l().palette).id===k.id,f=J(l().palette).id===k.id?`1px solid ${k.ink}`:"1px solid var(--v2-border-border-muted)",P=J(l().palette).id===k.id?"var(--v2-background-bg-layer-02)":"transparent",N=k.ink;return c!==M.e&&r.setAttribute(L,"data-glass-palette-option",M.e=c),g!==M.t&&r.setAttribute(L,"aria-pressed",M.t=g),f!==M.a&&r.setStyleProperty(L,"border",M.a=f),P!==M.o&&r.setStyleProperty(L,"background",M.o=P),N!==M.i&&r.setStyleProperty(_,"background",M.i=N),M},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),L})()})),r.effect(()=>r.setAttribute(C,"aria-label",n.t("settings.palette"))),C}}),null),r.insert($,r.createComponent(q,{id:"backgroundStyle",get title(){return n.t("settings.backgroundStyle")},get description(){return n.t("settings.backgroundStyle.description")},get children(){var C=It();return r.insert(C,r.createComponent(W.For,{each:["aurora","tide","glow"],children:k=>(()=>{var L=Vt();return L.$$click=()=>s.update(_=>{_.backgroundStyle=k}),r.setAttribute(L,"data-glass-background-style",k),r.insert(L,()=>n.t(`backgroundStyle.${k}`)),r.effect(_=>{var M=(l().backgroundStyle??"aurora")===k,c=(l().backgroundStyle??"aurora")===k?`1px solid ${J(l().palette).ink}`:"1px solid var(--v2-border-border-muted)",g=(l().backgroundStyle??"aurora")===k?"var(--v2-background-bg-layer-02)":"transparent";return M!==_.e&&r.setAttribute(L,"aria-pressed",_.e=M),c!==_.t&&r.setStyleProperty(L,"border",_.t=c),g!==_.a&&r.setStyleProperty(L,"background",_.a=g),_},{e:void 0,t:void 0,a:void 0}),L})()})),r.effect(()=>r.setAttribute(C,"aria-label",n.t("settings.backgroundStyle"))),C}}),null),r.insert($,r.createComponent(q,{id:"intensity",get title(){return n.t("settings.intensity")},get description(){return n.t("settings.intensity.description")},get children(){var C=Rt(),k=C.firstChild,L=k.nextSibling;return k.$$input=_=>{const M=Number(_.target.value);s.update(c=>{c.intensity=M})},r.insert(L,()=>l().intensity),r.effect(()=>r.setAttribute(k,"aria-label",n.t("settings.intensity"))),r.effect(()=>k.value=l().intensity),C}}),null),r.insert($,r.createComponent(q,{id:"background",get title(){return n.t("settings.background")},get description(){return n.t("settings.background.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("settings.background")},get checked(){return l().background},get onChange(){return F("background")}})}}),null),r.insert($,r.createComponent(q,{id:"parallax",get title(){return n.t("settings.parallax")},get description(){return n.t("settings.parallax.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("settings.parallax")},get checked(){return l().parallax},get onChange(){return F("parallax")}})}}),null),r.insert($,r.createComponent(q,{id:"shimmer",get title(){return n.t("settings.shimmer")},get description(){return n.t("settings.shimmer.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("settings.shimmer")},get checked(){return l().shimmer},get onChange(){return F("shimmer")}})}}),null),r.insert($,r.createComponent(q,{id:"motion",get title(){return n.t("settings.motion")},get description(){return n.t("settings.motion.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("settings.motion")},get checked(){return l().motion},get onChange(){return F("motion")}})}}),null),r.insert($,r.createComponent(q,{id:"grain",get title(){return n.t("settings.grain")},get description(){return n.t("settings.grain.description")},get children(){return r.createComponent(B.Switch,{get label(){return n.t("settings.grain")},get checked(){return l().grain},get onChange(){return F("grain")}})}}),null),$})()}}),console.info("GLASS_FULL_V1 setup completed"),()=>{a?.destroy(),t(),window.clearTimeout(w),window.removeEventListener("pointermove",E),document.documentElement.removeEventListener("pointerleave",z),window.removeEventListener("blur",z),document.removeEventListener("visibilitychange",o),d.removeEventListener("change",o),i.removeAttribute("data-glass-enabled"),i.removeAttribute("data-glass-background"),i.removeAttribute("data-glass-palette"),i.removeAttribute("data-glass-paused"),p()}}});r.delegateEvents(["input","click"]);exports.default=Nt;
