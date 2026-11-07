import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"
import vm from "node:vm"
import ts from "typescript"
const source = await readFile(new URL("../src/theme.ts", import.meta.url), "utf8")
const module = { exports: {} }
const paletteModule = { exports: {} }
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../src/palettes.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { module: paletteModule, exports: paletteModule.exports })
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { module, exports: module.exports, require: (id) => { assert.equal(id, './palettes'); return paletteModule.exports } })
const buildCSS = module.exports.buildCSS
const defaults = { intensity: 68, background: true, shimmer: true, grain: true, parallax: true }
test("reference background restores dark veil and thin tool glass without global bg-base overrides", () => {
  const css = buildCSS(defaults)
  assert.match(css, /session-chat-panel\] > \.bg-v2-background-bg-base/)
  assert.match(css, /rgba\(5,7,14,\.55\)/)
  assert.match(css, /rgba\(5,7,14,\.82\)/)
  assert.match(css, /rgba\(255,255,255,0\.032\)/)
  assert.doesNotMatch(css, /:root body \.bg-v2-background-bg-base/)
  assert.doesNotMatch(css, /NaN/)
  assert.doesNotMatch(buildCSS({ ...defaults, intensity: NaN }), /NaN/)
})
test("background, grain and shimmer switches actually remove their CSS", () => {
  const css = buildCSS({ ...defaults, background: false, shimmer: false, grain: false })
  assert.doesNotMatch(css, /data-glass-aurora|data-glass-grain|glass-shimmer|session-chat-panel\] > \.bg-v2-background-bg-base/)
})
test("light and dark surfaces use host tokens; pause and reduced motion target real cards", () => {
  const css = buildCSS({ ...defaults, light: true })
  assert.match(css, /64\.0%, transparent/)
  assert.match(css, /var\(--v2-background-bg-base\)/)
  assert.match(css, /html\[data-glass-paused\] :is\(/)
  assert.match(css, /prefers-reduced-motion/)
})
test("reference skin styles real composer, activity container and native diff chips", () => {
  const css = buildCSS({ ...defaults, shimmer: false })
  assert.match(css, /data-component="composer"/)
  assert.match(css, /data-component="collapsed-tool-group"\] > \.tool-collapsible/)
  assert.match(css, /border-radius: 12px; overflow: hidden/)
  assert.match(css, /data-slot="session-turn-diff-trigger"/)
  assert.match(css, /data-slot=sidebar-inbox-item\]\[data-state=active\]/)
  assert.doesNotMatch(css, /@keyframes glass-shimmer|animation: glass-shimmer/)
  assert.doesNotMatch(css, /content:\s*["']/)
})
test('light status colors remain readable and paused new rows do not freeze half-transparent', () => {
  const light = buildCSS({ ...defaults, light: true })
  assert.match(light, /data-status=error[^}]+#b82c40/)
  assert.match(light, /data-status=interrupted[^}]+#946116/)
  assert.match(light, /data-glass-paused\] :is\(\[data-glass-activity-header\][^}]+animation: none !important; transition: none !important/)
  const luminance = (hex) => {
    const values = hex.match(/\w\w/g).map((c) => parseInt(c, 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4)
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722
  }
  for (const ink of ['b82c40', '946116']) {
    assert.ok((luminance('eeeeee') + .05) / (luminance(ink) + .05) >= 4.5)
  }
})
test('each palette colors background and accents while shell styling stays scoped and semantic colors stay fixed', () => {
  for (const palette of paletteModule.exports.PALETTES) {
    const css = buildCSS({ ...defaults, palette: palette.id })
    assert.ok(css.includes(`rgba(${palette.accent.join(',')},.22)`))
    assert.match(css, /html\[data-glass-enabled\] \[data-slot=titlebar-v2\]/)
    assert.match(css, /data-action=vertical-tabs-home/)
    assert.match(css, /data-status=error[^}]+#e8757f/)
    assert.doesNotMatch(css, /NaN|undefined/)
  }
})
test('material refinement scopes settings, keeps unknown-header fallback and fixes activity specificity', () => {
  const css = buildCSS(defaults)
  assert.match(css, /:where\(\[data-component="collapsed-tool-group"\]/)
  assert.match(css, /data-glass-timeline-clip\] \{ clip-path: inset/)
  assert.match(css, /session-chat-panel\]:has\(\[data-glass-timeline-clip\]\)/)
  assert.match(css, /\[data-testid=settings-screen\] \[data-glass-settings-surface\]/)
  assert.match(css, /rgba\(5,7,14,\.96\)/)
  for (const palette of paletteModule.exports.PALETTES) {
    assert.match(buildCSS({ ...defaults, palette: palette.id }), /--glass-border: rgba\(230,237,248,\.085\)/)
  }
})
test('new session shares the chat surface only while its background is enabled', () => {
  assert.match(buildCSS(defaults), /html\[data-glass-enabled\] \[data-component=new-session\] \{/)
  assert.doesNotMatch(buildCSS({ ...defaults, background:false }), /\[data-component=new-session\]/)
})
test('sidebar and review pane share the frosted material and no dead host selectors remain', () => {
  const css = buildCSS(defaults)
  // Desktop 2.2.5 sidebar layers must all be punched through to the aurora canvas.
  assert.match(css, /:is\(#vertical-tabs-sidebar, \[data-slot=vertical-tabs-sidebar\]\)/)
  assert.match(css, /:is\(\[data-slot=vertical-tabs-panel\], \[data-slot=vertical-tabs-peek-surface\]\)/)
   assert.match(css, /:is\(\[data-slot=vertical-tabs-mount\], \[data-slot=vertical-tabs\]\) \{[^}]*backdrop-filter: blur\(16px\) saturate\(140%\)/)
  // The right-hand review pane was a solid #161616; it must get the same material.
  assert.match(css, /#review-panel \{\s*background: linear-gradient\(195deg/)
  assert.match(css, /#review-panel :is\(\.bg-v2-background-bg-base,/)
  assert.match(css, /data-glass-scrolling="true"\] #review-panel/)
  // Native markdown tables painted #242424/#161616 over the frost.
  assert.match(css, /\[data-component=markdown-table\] :is\(tbody, tr, td\) \{ background: transparent/)
   // Desktop 2.2.6 paints the homepage wrapper, not just its child button.
   assert.match(css, /\[data-slot=home-panel\] \[data-home-row\] \{[^}]*--home-row-surface: transparent;[^}]*background: transparent !important/)
})

test('host settings headings scroll in normal flow without the native fade', async () => {
  for (const light of [false, true]) {
    const css = buildCSS({ ...defaults, light })
    assert.match(css, /\.settings-screen \.settings-tab-header \{[^}]*position: relative !important;[^}]*top: auto !important;[^}]*background: transparent !important/)
    assert.match(css, /\.settings-screen \.settings-tab-header::before \{\s*display: none !important/)
  }
  const gui = await readFile(new URL('../src/gui.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(gui, /markSettings|settingsTimer|GLASS_PROBE/)
})

test('homepage removes nested fills and preserves palette-tinted row states', () => {
  for (const palette of paletteModule.exports.PALETTES) {
    const css = buildCSS({ ...defaults, palette: palette.id })
    assert.match(css, /home-projects-viewport\] \{\s*background: transparent !important/)
    assert.match(css, /\[data-home-row\]\[data-selected\] \{[^}]*background: rgba\([^}]+!important/)
    assert.match(css, /\[data-home-row\] > button,[^}]*home-row-actions\] \{\s*background: transparent !important/)
    assert.doesNotMatch(css, /\[data-slot=home-panel\] \{/)
    assert.doesNotMatch(css, /\[data-component=home-project-row\] \{/)
  }
})

test('home session group caps and fades cannot paint black bands over the background', () => {
  for (const light of [false, true]) {
    const css = buildCSS({ ...defaults, light })
    assert.match(css, /\[data-slot=home-sessions-list\] \.sticky \{[^}]*position: relative !important;[^}]*top: auto !important;[^}]*background: transparent !important/)
    assert.match(css, /\[data-slot=home-panel\] \.home-session-group-header::before,[^}]*\.home-session-group-header::after \{\s*display: none !important/)
  }
})

test('shell fallback cannot override independent surfaces and session fades respect clipping', () => {
  for (const palette of paletteModule.exports.PALETTES) for (const light of [false, true]) {
    const css = buildCSS({ ...defaults, palette: palette.id, light })
    assert.match(css, /:where\(#root\) :is\([^}]+:not\(:where\(/)
    assert.match(css, /\[data-slot=titlebar-v2\], \[data-session-title\], \[data-session-title\] \*/)
    assert.match(css, /\[role=dialog\], \[role=dialog\] \*, \[role=menu\], \[role=menu\] \*/)
    assert.match(css, /session-chat-panel\]:has\(\[data-glass-timeline-clip\]\) \.session-header-fade \{\s*background: transparent !important/)
    assert.match(css, /session-chat-panel\] \.session-header-fade \{\s*background: linear-gradient/)
    assert.doesNotMatch(css, /session-header-fade[^}]*display: none/)
    assert.doesNotMatch(css, /#root > \.bg-v2-background-bg-deep > \.relative/)
  }
})

test('user message bubble is frosted instead of the host #2e2e2e block', () => {
  const css = buildCSS(defaults)
  // The host paints only [data-slot=user-message-text]; its ancestors must not re-fill.
  assert.match(css, /\[data-slot=user-message-body\] \{ background: transparent !important; \}/)
  assert.match(css, /\[data-slot=user-message-text\] \{[^}]*backdrop-filter: blur\(14px\) saturate\(135%\)/)
  assert.match(css, /\[data-slot=user-message-text\] \{[^}]*linear-gradient\(135deg/)
  // Blur layers are dropped while scrolling, like the other large surfaces.
  assert.match(css, /data-glass-scrolling="true"\] \[data-slot="user-message-text"\]/)
  // Without backdrop-filter the bubble still needs an opaque-enough fallback.
  assert.match(css, /@supports not \(backdrop-filter: blur\(1px\)\) \{[^@]*user-message-text[^@]*rgba\(24,20,34,\.94\)/)
  // Host geometry and the literal grey fill must not be reintroduced by us.
  assert.doesNotMatch(css, /user-message-text[^}]*rgb\(46, ?46, ?46\)/)
  assert.doesNotMatch(css, /user-message-text[^}]*border-radius: 0/)
})

test('fenced code blocks beat the host inline #151515 fill', () => {
  const css = buildCSS(defaults)
  // The renderer sets background-color inline from --color-background-stronger,
  // so the stylesheet rule has to be !important to win the cascade.
  assert.match(css, /\[data-component=markdown-code\] pre\.highlights \{[^}]*background:[^}]*!important/)
  assert.match(css, /\[data-component=markdown-code\] pre\.highlights \{[^}]*backdrop-filter: blur\(12px\)/)
  assert.match(css, /pre\.highlights code \{[^}]*background: transparent !important/)
  // Copy button must not re-introduce a chip fill.
  assert.match(css, /markdown-code\] :is\(\[data-slot=markdown-copy-button\]/)
  // Painted through the same scroll downgrade as the other large surfaces.
  assert.match(css, /data-glass-scrolling="true"\] \[data-component="markdown-code"\] pre\.highlights/)
  assert.match(css, /@supports not \(backdrop-filter: blur\(1px\)\) \{[^@]*pre\.highlights[^@]*rgba\(14,12,20,\.94\)/)
})
