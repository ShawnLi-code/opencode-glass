import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"
import vm from "node:vm"
import ts from "typescript"

const source = await readFile(new URL("../src/aurora.ts", import.meta.url), "utf8")
const code = ts.transpileModule(source, { compilerOptions: {
  target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS,
} }).outputText
const paletteModule = { exports: {} }
vm.runInNewContext(ts.transpileModule(await readFile(new URL('../src/palettes.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
  { module: paletteModule, exports: paletteModule.exports })

function rig() {
  const callbacks = new Map()
  const listeners = new Map()
  const docListeners = new Map()
  const mediaListeners = new Map()
  const timers = new Map()
  class Element { closest(selector) { return selector === '[data-slot=session-timeline-scroll]' ? this : null } }
  const document = { hidden: false, createElement: () => canvas, documentElement: {},
    body: { appendChild() { attached = true } },
    addEventListener: (key, fn) => docListeners.set(key, fn), removeEventListener: (key) => docListeners.delete(key) }
  const media = { matches: false, addEventListener: (key, fn) => mediaListeners.set(key, fn),
    removeEventListener: (key) => mediaListeners.delete(key) }
  const centres = []
  const stops = [], bases = []
  let now = 0, sequence = 0, attached = false
  const context = {
    setTransform() {}, clearRect() {}, fillRect() { bases.push(this.fillStyle) }, beginPath() {}, arc() {}, fill() {}, moveTo() {}, lineTo() {}, stroke() {},
    createRadialGradient(x, y) { centres.push([x, y]); return { addColorStop(_, color) { stops.push(color) } } },
  }
  const canvas = { style: {}, clientWidth: 1000, clientHeight: 700,
    setAttribute() {}, getContext: () => context, remove() { attached = false } }
  const module = { exports: {} }
  vm.runInNewContext(code, {
    module, exports: module.exports,
    require: (id) => { assert.equal(id, './palettes'); return paletteModule.exports },
    document, Element,
    getComputedStyle: () => ({ getPropertyValue: () => "" }),
    window: { innerWidth: 1000, innerHeight: 700, devicePixelRatio: 1, matchMedia: () => media,
      addEventListener: (key, fn) => listeners.set(key, fn), removeEventListener: (key) => listeners.delete(key),
      setTimeout: (fn) => { timers.set(++sequence, fn); return sequence }, clearTimeout: (id) => timers.delete(id) },
    performance: { now: () => now },
    requestAnimationFrame: (fn) => { callbacks.set(++sequence, fn); return sequence },
    cancelAnimationFrame: (id) => callbacks.delete(id),
  })
  const handle = module.exports.createAurora()
  return { handle, callbacks, listeners, docListeners, mediaListeners, stops, bases, attached: () => attached,
    hidden(value) { document.hidden = value; docListeners.get("visibilitychange")?.() },
    reduced(value) { media.matches = value; mediaListeners.get("change")?.() },
    scroll() { docListeners.get('scroll')?.({ target: new Element() }) },
    finishScroll() { for (const [id, fn] of timers) { timers.delete(id); fn() } },
    frame() {
      now += 34
      const [id, fn] = callbacks.entries().next().value
      callbacks.delete(id)
      centres.length = 0
      fn(now)
      return centres.map((point) => [...point])
    },
  }
}

test("pointer shifts gradients without moving the canvas or text", () => {
  const still = rig(), moving = rig()
  moving.handle.setPointer(1, 1)
  const a = still.frame(), b = moving.frame()
  assert.equal(a.length, 2, 'only two restrained edge lights are painted')
  assert.ok(b[0][0] > a[0][0])
  assert.ok(b[0][1] > a[0][1])
  still.handle.destroy(); moving.handle.destroy()
})

test("parallax off ignores pointer and clears stale easing on re-enable", () => {
  const still = rig(), moving = rig()
  moving.handle.setPointer(1, -1)
  moving.frame(); still.frame()
  moving.handle.setParallax(false)
  moving.handle.setPointer(-1, 1)
  assert.deepEqual(moving.frame(), still.frame())
  moving.handle.setParallax(true)
  assert.deepEqual(moving.frame(), still.frame())
  still.handle.destroy(); moving.handle.destroy()
})

test("invalid input is ignored and normalized input is bounded", () => {
  const a = rig(), b = rig()
  a.handle.setPointer(NaN, Infinity)
  assert.deepEqual(a.frame(), b.frame())
  a.handle.setPointer(999, -999); b.handle.setPointer(1, -1)
  assert.deepEqual(a.frame(), b.frame())
  a.handle.destroy(); b.handle.destroy()
})

test("destroy removes canvas, scheduled frame and resize subscription", () => {
  const a = rig()
  assert.equal(a.attached(), true)
  assert.equal(a.callbacks.size, 1)
  a.handle.destroy()
  assert.equal(a.attached(), false)
  assert.equal(a.callbacks.size, 0)
  assert.equal(a.listeners.size, 0)
  assert.equal(a.docListeners.size, 0)
  assert.equal(a.mediaListeners.size, 0)
})
test('palette hot-switch reuses canvas, recolors a paused frame and never starts a second loop', () => {
  const a = rig()
  a.handle.setMotion(false)
  for (const palette of paletteModule.exports.PALETTES) {
    a.handle.refreshTheme(false, palette.id)
    assert.equal(a.bases.at(-1), palette.base)
    assert.ok(a.stops.includes(`rgba(${palette.accent.join(',')},0.38)`))
    assert.equal(a.callbacks.size, 0)
    assert.equal(a.attached(), true)
  }
  a.handle.setMotion(true)
  assert.equal(a.callbacks.size, 1)
  a.handle.refreshTheme(false, 'amber')
  assert.equal(a.callbacks.size, 1)
  a.handle.destroy()
})

test('all background styles switch on the same canvas and honor pause', () => {
  const a = rig()
  for (const style of ['aurora', 'tide', 'glow']) {
    a.handle.setStyle(style)
    assert.equal(a.attached(), true)
    assert.equal(a.callbacks.size, 1)
    a.frame()
  }
  a.handle.setMotion(false)
  a.handle.setStyle('tide')
  assert.equal(a.callbacks.size, 0)
  a.handle.destroy()
})

test('a short suspend stops painting and resumes afterwards', () => {
  const a = rig()
  assert.equal(a.callbacks.size, 1)
  a.handle.suspend(400)
  assert.equal(a.callbacks.size, 0)
  a.finishScroll()
  assert.equal(a.callbacks.size, 1)
  a.handle.destroy()
})

test('scroll pauses animation and resumes once without overriding manual pause', () => {
  const a = rig()
  a.scroll(); assert.equal(a.callbacks.size, 0)
  a.scroll(); assert.equal(a.callbacks.size, 0)
  a.finishScroll(); assert.equal(a.callbacks.size, 1)
  a.scroll(); a.handle.setMotion(false); a.finishScroll()
  assert.equal(a.callbacks.size, 0)
  a.handle.destroy()
})

test("pause, hidden window and reduced motion cancel the loop; resume has one frame", () => {
  const a = rig()
  a.handle.setMotion(false); assert.equal(a.callbacks.size, 0)
  a.handle.setMotion(true); assert.equal(a.callbacks.size, 1)
  a.hidden(true); assert.equal(a.callbacks.size, 0)
  a.hidden(false); assert.equal(a.callbacks.size, 1)
  a.reduced(true); assert.equal(a.callbacks.size, 0)
  a.reduced(false); assert.equal(a.callbacks.size, 1)
  a.handle.setMotion(true); assert.equal(a.callbacks.size, 1)
  a.handle.destroy(); a.handle.destroy()
  assert.equal(a.callbacks.size, 0)
})
