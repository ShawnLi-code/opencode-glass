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
