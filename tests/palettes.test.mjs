import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'
import { Schema } from 'effect'
import * as sdk from '@opencode/plugin/gui/main'
const load = async (name, require = () => { throw new Error('Unexpected dependency') }) => {
  const module = { exports: {} }
  const source = await readFile(new URL(`../src/${name}.ts`, import.meta.url), 'utf8')
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText, { module, exports: module.exports, require })
  return module.exports
}
const palettes = await load('palettes')
const definition = await load('definition', (id) => {
  if (id === './palettes') return palettes
  if (id === 'effect') return { Schema }
  if (id === '@opencode/plugin/gui') return sdk
  throw new Error(id)
})
test('six approved palettes have safe colors and unknown/missing values resolve to original blue', () => {
  assert.equal(palettes.PALETTES.length, 6)
  assert.equal(new Set(palettes.PALETTES.map((p) => p.id)).size, 6)
  assert.equal(palettes.getPalette().id, 'blue')
  assert.equal(palettes.getPalette('not-css;').id, 'blue')
  for (const p of palettes.PALETTES) {
    assert.match(p.base, /^#[a-f\d]{6}$/)
    assert.equal(p.colors.length, 4)
    for (const rgb of p.colors) assert.ok(rgb.length === 3 && rgb.every((v) => Number.isFinite(v) && v >= 0 && v <= 255))
  }
})
test('legacy preferences decode without a palette and preserve every existing setting', () => {
  const legacy = { enabled: false, intensity: 87, parallax: false, shimmer: true, background: false, grain: false, motion: false, styleRevision: 1 }
  const decoded = Schema.decodeUnknownSync(definition.Prefs)(legacy)
  for (const [key, value] of Object.entries(legacy)) assert.equal(decoded[key], value)
  assert.equal(palettes.getPalette(decoded.palette).id, 'blue')
})
test('all palette selections survive preference schema encode/decode', () => {
  for (const palette of palettes.PALETTE_IDS) {
    const pref = { ...definition.DEFAULT_PREFS, palette, intensity: 87 }
    const encoded = Schema.encodeSync(definition.Prefs)(pref)
    const decoded = Schema.decodeUnknownSync(definition.Prefs)(encoded)
    assert.equal(decoded.palette, palette)
    assert.equal(decoded.intensity, 87)
  }
})
