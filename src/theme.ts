import { baseRGBA, getPalette, rgba } from './palettes'
/** Approved HTML reference skin. Keep host state, content and native collapse intact. */
export interface GlassOptions {
  intensity: number
  background: boolean
  shimmer: boolean
  parallax: boolean
  grain: boolean
  light?: boolean
  palette?: string
}

const group = ':where([data-component="collapsed-tool-group"] > .tool-collapsible, [data-component="tool-part-wrapper"]:not([data-component="context-tool-group-list"] *) > .tool-collapsible)'
const composer = '[data-component="composer"]'
const files = '[data-slot="session-turn-diff-trigger"]'
const animated = `:is(${group}, ${composer}, ${files})`

export function buildCSS(opts: GlassOptions): string {
  const i = Math.max(0, Math.min(100, Number.isFinite(opts.intensity) ? opts.intensity : 62)) / 100
  const s = "html[data-glass-enabled]"
  const light = !!opts.light
  const palette = getPalette(opts.palette)
  const accent = (alpha: number) => rgba(palette.accent, alpha)
  const base = (alpha: number) => baseRGBA(palette.base, alpha)
  const surface = (alpha: number) => light
    ? `color-mix(in srgb, var(--v2-background-bg-base) ${(alpha * 100).toFixed(1)}%, transparent)`
    : `rgba(255,255,255,${alpha.toFixed(3)})`
  const ink = light ? 'var(--v2-text-text-base)' : '#c3cbdb'
  const muted = light ? 'var(--v2-text-text-muted)' : '#93a0b6'
  return `
${s} {
  --glass-card: ${surface(light ? .82 : .05 - i * .0265)};
  --glass-border: ${light ? 'rgba(30,40,55,.13)' : 'rgba(230,237,248,.085)'};
  --glass-accent: ${light ? palette.lightInk : palette.id === 'blue' ? '#6d8bff' : palette.ink};
  --glass-ink: ${ink}; --glass-muted: ${muted};
}
/* Native shell surfaces verified on Desktop 2.2.5. Preserve dimensions, drag
   regions, window controls and native actions; only replace their material. */
${s} [data-slot=titlebar-v2] {
  background: linear-gradient(105deg,${accent(.055)},transparent), ${light ? surface(.86) : base(.66)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
${s} [data-slot=session-chat-panel] .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${accent(.10)},${accent(.025)}), ${light ? surface(.96) : base(.96)} !important;
  backdrop-filter: blur(18px) saturate(125%);
  border-bottom: 1px solid var(--glass-border);
}
/* Unknown timeline structures keep the opaque safety fallback above. */
${s} [data-glass-timeline-clip] { clip-path: inset(var(--glass-header-cut,0px) 0 0); }
${s} [data-slot=session-chat-panel]:has([data-glass-timeline-clip]) .pointer-events-auto:has(> .min-w-0 > .session-header-layout) {
  background: linear-gradient(105deg,${accent(.045)},transparent), ${light ? surface(.88) : base(.64)} !important;
}
${s} [data-testid=settings-screen] {
  background: ${light ? surface(.86) : base(opts.background ? .38 : .96)} !important;
}
${s} [data-testid=settings-screen] .settings-panel { color: var(--glass-ink); }
${s} [data-testid=settings-screen] [data-glass-control-ink=light] { color: #fff !important; }
${s} [data-testid=settings-screen] [data-glass-control-ink=dark] { color: #000 !important; }
${s} [data-testid=settings-screen] .settings [role=tab][aria-selected=true] {
  background: linear-gradient(110deg,${accent(.12)},${light ? surface(.84) : 'rgba(255,255,255,.035)'}) !important;
  box-shadow: inset 1px 0 0 ${light ? 'rgba(30,40,55,.2)' : 'rgba(230,237,248,.18)'};
}
${s} [data-testid=settings-screen] [data-slot=tabs-v2-trigger-wrapper]:has([role=tab][aria-selected=true]) {
  background: transparent !important;
}
${s} [data-testid=settings-screen] [data-glass-settings-surface] {
  background: ${light ? surface(.84) : 'rgba(255,255,255,.035)'} !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${s} [data-testid=settings-screen] [data-glass-settings-surface=nested] {
  background: ${light ? surface(.76) : 'rgba(255,255,255,.022)'} !important;
  box-shadow: none;
}
${s} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]) {
  background: ${light ? `linear-gradient(120deg,${surface(.84)},${accent(.04)})` : `linear-gradient(120deg,rgba(255,255,255,.047),${accent(.026)})`} !important;
  border: 1px solid var(--glass-border);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
  color: var(--glass-ink) !important;
  transition: background-color .16s ease, border-color .16s ease;
}
${s} [data-action=vertical-tabs-new-session] {
  background: linear-gradient(120deg,${accent(.13)},${accent(.035)}) !important;
  border-color: var(--glass-border);
}
${s} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):is(:hover,[data-state=pressed]) {
  background: linear-gradient(120deg,${accent(.18)},${accent(.055)}) !important;
  border-color: ${accent(.32)};
}
${s} :is([data-action=vertical-tabs-home],[data-action=vertical-tabs-search],[data-action=vertical-tabs-new-session]):focus-visible {
  outline: 2px solid var(--glass-accent); outline-offset: 1px;
}
${opts.background ? `
${s}, ${s} body { background: transparent !important; }
${s} #root > .bg-v2-background-bg-deep { background: transparent !important; }
${s} [data-slot=session-chat-panel] > .bg-v2-background-bg-base,
${s} [data-component=new-session] {
  background: ${light ? surface(.64) : base(.04)} !important;
  backdrop-filter: none;
  box-shadow: none;
  border: .5px solid var(--glass-border);
}
${s} :is([data-slot=vertical-tabs-mount], [data-slot=vertical-tabs-peek-surface]) {
  background: ${light ? surface(.72) : palette.id === 'blue' ? 'rgba(10,13,22,.42)' : base(.42)} !important;
  backdrop-filter: blur(26px) saturate(140%);
  border-inline-end: 1px solid var(--glass-border);
}
[data-glass-aurora], [data-glass-veil], [data-glass-grain] {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
}
[data-glass-veil] { background: ${light ? `linear-gradient(180deg,${surface(.24)},${surface(.48)})` : `
  radial-gradient(1200px 700px at 16% 5%, ${accent(.09)}, transparent 60%),
  radial-gradient(900px 620px at 88% 92%, ${rgba(palette.second,.065)}, transparent 62%),
  linear-gradient(180deg, ${base(.55)}, ${base(.82)})`}; }
` : ''}
${opts.background && opts.grain ? `
[data-glass-grain] {
  opacity: .05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
` : ''}
/* Activity card: decorate the WHOLE collapsible, not its trigger alone. */
${s} ${group} {
  border-radius: 12px; overflow: hidden; margin-block: 0 12px;
  border: 1px solid var(--glass-border);
  background: var(--glass-card) !important;
  backdrop-filter: blur(14px);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.025);
}
${s} ${group} > [data-slot=collapsible-trigger] {
  width: 100%; padding: 9px 13px; min-height: 38px;
  background: transparent !important; border: 0; box-shadow: none;
  border-radius: 0; transition: background-color .16s ease;
}
${s} ${group} > [data-slot=collapsible-trigger]:hover { background: ${accent(.045)} !important; }
${s} ${group} [data-component=context-tool-group-trigger] {
  color: var(--glass-ink); font-size: 12.5px; font-weight: 600;
}
${s} [data-slot=basic-tool-tool-subtitle] { color: ${light ? muted : '#a9b6cd'}; }
${s} ${group} > [data-slot=collapsible-trigger]:focus-visible {
  outline: 2px solid ${accent(.5)}; outline-offset: -2px;
}
${s} ${group}[data-expanded] > [data-slot=collapsible-content] { padding: 0 13px 11px; }
${s} ${group} [data-slot=context-tool-group-item] { min-width: 0; }
${s} ${group} [data-slot=context-tool-group-item] [data-slot=collapsible-trigger]:not([data-component=reasoning-part] *) {
  height: auto; min-height: 38px; padding-block: 4px; align-items: flex-start;
}
${s} ${group} [data-slot=context-tool-group-item] [data-component=tool-trigger]:not([data-component=reasoning-part] *) {
  height: auto; content-visibility: visible;
}
${s} ${group} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info]:not([data-component=reasoning-part] *) { flex: 1; width: 100%; }
${s} ${group} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-structured]:not([data-component=reasoning-part] *) { width: 100%; }
${s} ${group} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-info-main]:not([data-component=reasoning-part] *) {
  flex: 1; min-width: 0; flex-direction: column; align-items: stretch; gap: 5px; text-align: start;
}
${s} ${group} [data-slot=basic-tool-tool-title] { align-self: flex-start; text-align: start; }
${s} ${group} [data-slot=context-tool-group-item] [data-slot=basic-tool-tool-subtitle]:not([data-component=reasoning-part] *):not(.subagent-link):not(.webfetch-link) {
  display: block; max-width: 100%; padding: 7px 11px;
  background: ${light ? 'rgba(30,45,75,.045)' : base(.24)};
  border-inline-start: 2px solid ${accent(.28)}; border-radius: 0 7px 7px 0;
  font-family: var(--font-family-mono, ui-monospace, Consolas, monospace);
  font-size: 12px; line-height: 1.75;
}
${s} ${group} [data-slot=collapsible-arrow] { color: #66718a; transition: transform .18s ease; }
/* Native status content remains truthful: do not synthesize durations or completion. */
${s} ${group} :is([data-slot=tool-status-suffix], [data-slot=tool-status-tail]) {
  font-size: 11px; font-variant-numeric: tabular-nums; color: var(--glass-muted);
}
${s} ${group} [data-slot=tool-status-active] { color: ${light ? '#27864d' : '#7fd6a5'}; }
${s} ${group} [data-component=reasoning-part] > .tool-collapsible > [data-slot=collapsible-trigger] {
  color: ${light ? '#7056a4' : '#b9a6e8'};
}
${s} [data-component=reasoning-part] [data-slot=basic-tool-tool-title] {
  color: ${light ? '#7056a4' : '#b9a6e8'}; font-size: 11px;
}
${s} [data-component=reasoning-part]:not([data-component=context-tool-group-list] *) > .tool-collapsible > [data-slot=collapsible-trigger] {
  inline-size: fit-content; padding: 2px 8px; border-radius: 6px;
  background: rgba(185,166,232,.08); border: 1px solid rgba(185,166,232,.22);
  color: ${light ? '#7056a4' : '#b9a6e8'}; font-size: 11px;
}
${s} :is([data-slot=bash-command], [data-component=bash-output]) {
  background: ${light ? 'rgba(30,45,75,.045)' : base(.24)} !important;
  border: 0; border-inline-start: 2px solid ${accent(.28)};
  border-radius: 0 7px 7px 0; padding: 7px 11px;
  font-size: 12px; line-height: 1.75;
}
/* Selected sessions: the reference gradient and thin left-hand indicator. */
${s} [data-slot=sidebar-inbox-item] { border-radius: 8px; transition: background-color .16s ease; }
${s} [data-slot=sidebar-inbox-item][data-state=active] {
  background: linear-gradient(90deg,${accent(.22)},${accent(.05)}) !important;
  box-shadow: inset 2px 0 0 var(--glass-accent);
}
${s} [data-slot=sidebar-inbox-item][data-state=active] > span { color: ${light ? ink : '#eaf0ff'}; }
${s} [data-slot=sidebar-inbox-item]:hover:not([data-state=active]) { background: ${accent(.055)} !important; }
/* Composer is a real form in 2.2.5; never touch its editable content or controls. */
${s} ${composer} {
  background: ${light ? surface(.86) : 'rgba(255,255,255,.045)'} !important;
  backdrop-filter: blur(22px) saturate(150%);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.035) !important;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease;
}
${s} ${composer}:focus-within {
  border-color: ${accent(.46)};
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045) !important;
}
${s} [data-component=composer-scroll] > .pointer-events-none { color: ${light ? muted : '#7b8699'}; }
/* Existing real diff chips preserve filename, navigation and +/- contents. */
${s} ${files} {
  width: fit-content; max-width: 100%; display: inline-flex; align-items: center; gap: 9px;
  border-radius: 9px; padding: 6px 11px; border: 1px solid var(--glass-border);
  background: ${light ? surface(.82) : 'rgba(255,255,255,.045)'} !important;
  font-size: 12px; font-variant-numeric: tabular-nums;
  transition: background-color .16s ease;
}
${s} [data-slot=session-turn-diffs] { background: transparent; }
${s} ${files}:hover { background: ${light ? surface(.94) : 'rgba(255,255,255,.07)'} !important; }
${s} [data-slot=session-turn-diff-filename] { color: ${light ? ink : '#c9d2e0'}; }
${s} ${files} [data-component=file-icon] { color: var(--glass-accent); }
${s} :is([data-component=menu-v2-content], [data-component=popover-content], [data-slot=dialog-container]) {
  background: ${light ? surface(.96) : base(.94)} !important;
  border: 1px solid var(--glass-border); backdrop-filter: blur(22px);
}
/* Optional extra, not part of the reference; the new skin defaults it OFF. */
${opts.shimmer ? `
${s} ${animated} {
  background-image: linear-gradient(105deg,transparent 36%,rgba(255,255,255,.035) 50%,transparent 64%);
  background-size: 260% 100%; background-repeat: no-repeat;
  animation: glass-shimmer 20s ease-in-out infinite;
}
@keyframes glass-shimmer { 0%,70% { background-position: 180% 0; } 95%,100% { background-position: -80% 0; } }
` : ''}
html[data-glass-paused] ${animated} { animation-play-state: paused !important; }
@media (prefers-reduced-motion: reduce) {
  ${s} ${animated} { animation: none !important; transition: none !important; }
  ${s} [data-slot=collapsible-arrow] { transition: none !important; }
}
@supports not (backdrop-filter: blur(1px)) {
  ${s} ${group}, ${s} ${composer} { background: ${light ? surface(.96) : 'rgba(10,13,22,.96)'} !important; }
}
/* Structural enhancement. Host-owned rows and controls remain in place. */
${s} [data-glass-activity-host] {
  border: 0 !important; background: transparent !important; backdrop-filter: none !important;
  box-shadow: none !important; overflow: visible !important; margin: 0 !important; transition: none !important;
}
${s} [data-glass-activity-host] > [data-slot=collapsible-trigger] { display: none !important; }
${s} [data-glass-activity-host] > [data-slot=collapsible-content] { padding: 0 !important; }
${s} [data-glass-activity-host] [data-component=context-tool-group-list] { gap: 0; }
${s} [data-glass-activity-header] {
  display: flex; align-items: center; gap: 9px; width: 100%; min-width: 0;
  min-height: 40px; margin: 0 0 12px; padding: 9px 13px; text-align: start;
  border: 1px solid var(--glass-border); border-radius: 12px;
  background: var(--glass-card); color: var(--glass-ink);
  cursor: pointer; font: inherit; font-size: 12px;
}
${s} [data-glass-activity-header][aria-expanded=true] { border-radius: 12px 12px 0 0; border-bottom: 0; margin-bottom: 0; }
${s} [data-glass-activity-arrow] { color: #66718a; transition: transform .18s ease; flex: none; }
${s} [data-glass-activity-header][aria-expanded=true] [data-glass-activity-arrow] { transform: rotate(90deg); }
${s} [data-glass-activity-title] { font-weight: 600; margin-inline-end: auto; }
${s} :is([data-glass-activity-status],[data-glass-activity-duration],[data-glass-activity-thinking]) {
  padding: 2px 7px; border-radius: 6px; font-size: 11px; font-variant-numeric: tabular-nums;
  white-space: nowrap; background: rgba(255,255,255,.04); color: var(--glass-muted);
  border: 1px solid var(--glass-border);
}
${s} [data-glass-activity-thinking] { color: ${light ? '#7056a4' : '#b9a6e8'}; background: rgba(185,166,232,.08); }
${s} [data-glass-activity-header][data-status=error] { border-color: rgba(232,117,127,.38); }
${s} [data-glass-activity-header][data-status=error] [data-glass-activity-status] { color: ${light ? '#b82c40' : '#e8757f'}; }
${s} [data-glass-activity-header][data-status=interrupted] [data-glass-activity-status] { color: ${light ? '#946116' : '#e0b062'}; }
${s} [data-glass-activity-header][data-busy]:not([data-status=error]) [data-glass-activity-status] {
  color: ${light ? '#27864d' : '#7fd6a5'}; animation: glass-activity-busy 1.6s ease-in-out infinite;
}
${s} [data-glass-activity-member] {
  padding: 0 13px 7px; margin: 0 !important;
  border-inline: 1px solid var(--glass-border); background: var(--glass-card);
  animation: glass-activity-enter .18s ease-out;
}
${s} [data-glass-activity-last] { border-bottom: 1px solid var(--glass-border); border-radius: 0 0 12px 12px; margin-bottom: 12px !important; }
${s} [data-glass-activity-hidden] { display: none !important; }
${s} [data-glass-activity-header]:focus-visible { outline: 2px solid ${accent(.65)}; outline-offset: 2px; }
@keyframes glass-activity-busy { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
@keyframes glass-activity-enter { from { opacity: .3; transform: translateY(-2px); } to { opacity: 1; transform: none; } }
${s} [data-glass-model-controls] { display: flex; align-items: center; gap: 6px; overflow-x: auto; }
${s} [data-glass-model-controls] > div { display: contents; }
${s} [data-glass-model-collapsed] [data-glass-native-model] { display: none !important; }
${s} [data-glass-model-toggle] {
  flex: 0 1 auto; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  padding: 4px 10px; min-height: 27px; border-radius: 99px; border: 1px solid var(--glass-border);
  background: ${accent(.07)}; color: var(--glass-ink); font: inherit; font-size: 12px; cursor: pointer;
}
${s} [data-glass-vitals] { position: relative; flex: 0 1 auto; min-width: 0; max-width: 58vw; }
${s} [data-glass-model-toggle][aria-expanded=true] { flex: none; }
${s} [data-glass-vitals] > summary { display: none; cursor: pointer; list-style: none; font-size: 12px; }
${s} [data-glass-vital-list] { display: flex; align-items: center; flex-wrap: wrap; gap: 5px; }
${s} [data-glass-vital] :is(button,[data-component=button-v2]) {
  min-height: 24px; height: auto; padding: 3px 9px; border-radius: 99px;
  border: 1px solid var(--glass-border); background: rgba(255,255,255,.045);
  color: var(--glass-muted); font-size: 11.5px; font-variant-numeric: tabular-nums;
}
${s} [data-glass-vital][data-tone=warning] button { color: ${light ? '#946116' : '#e0b062'}; border-color: rgba(224,176,98,.28); }
${s} [data-glass-vitals][data-compact=true] > summary { display: block; padding: 4px 9px; border: 1px solid var(--glass-border); border-radius: 99px; }
${s} [data-glass-vitals][data-compact=true][open] [data-glass-vital-list] {
  position: absolute; inset-inline-end: 0; top: 32px; z-index: 80;
  width: min(480px,80vw); padding: 12px; border-radius: 12px; border: 1px solid var(--glass-border);
  background: ${light ? surface(.98) : base(.97)}; box-shadow: 0 12px 40px rgba(0,0,0,.3);
}
${s} [data-glass-native-metric] { display: none !important; }
html[data-glass-paused] :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
html[data-glass-paused] :is(${animated},[data-slot=collapsible-arrow]) { transition: none !important; }
html[data-glass-paused] [data-action^="vertical-tabs-"] { transition: none !important; }
@media (prefers-reduced-motion: reduce) {
  ${s} :is([data-glass-activity-header] *,[data-glass-activity-member]) { animation: none !important; transition: none !important; }
  ${s} [data-action^="vertical-tabs-"] { transition: none !important; }
}
@media (max-width: 900px) {
  ${s} [data-glass-activity-header] { flex-wrap: wrap; gap: 6px; }
  ${s} [data-glass-activity-duration] { margin-inline-start: auto; }
}
`
}
