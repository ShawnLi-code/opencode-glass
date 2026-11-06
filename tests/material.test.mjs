import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
const source = await readFile(new URL('../src/material-bridge.ts', import.meta.url), 'utf8')
function load(document = {}, getComputedStyle = () => ({})) {
  const module = { exports: {} }
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { module, exports: module.exports, document: { addEventListener() {}, removeEventListener() {}, ...document }, window: { addEventListener() {}, removeEventListener() {} }, HTMLElement: Object, getComputedStyle })
  return module.exports
}
test('header occlusion clamps overlap and rejects detached/non-finite geometry', () => {
  const { headerOcclusion: cut } = load()
  assert.equal(cut({ top: 46, bottom: 95 }, { top: 46, bottom: 863 }), 49)
  assert.equal(cut({ top: 46, bottom: 95 }, { top: 200, bottom: 863 }), 0)
  assert.equal(cut({ top: 46, bottom: 950 }, { top: 46, bottom: 863 }), 817)
  assert.equal(cut({ top: NaN, bottom: 95 }, { top: 46, bottom: 863 }), 0)
})
test('only opaque neutral surfaces qualify, never transparent or semantic colored cards', () => {
  const { neutralSurface: neutral } = load()
  for (const c of ['rgb(36, 36, 36)', 'rgb(238, 238, 238)']) assert.equal(neutral(c), true)
  for (const c of ['rgba(0, 0, 0, 0)', 'rgba(255, 255, 255, 0.06)', 'rgb(20, 90, 60)', 'oklch(20% 0 0)']) assert.equal(neutral(c), false)
})
test('opaque action contrast is repaired without changing readable or translucent controls', () => {
  const { buttonInk }=load()
  assert.equal(buttonInk('rgb(59, 92, 246)','rgb(22, 22, 22)'),'light')
  assert.equal(buttonInk('rgb(59, 92, 246)','rgb(255, 255, 255)'),undefined)
  assert.equal(buttonInk('rgb(240, 240, 240)','rgb(255, 255, 255)'),'dark')
  assert.equal(buttonInk('rgba(59, 92, 246, 0.2)','rgb(22, 22, 22)'),undefined)
})
test('settings markers restore on withdrawal and disabled actions keep native text', () => {
  const element = (css) => {
    const attrs=new Map()
    return { css, disabled:false, parentElement:null, getAttribute:(k)=>attrs.get(k)??null, setAttribute:(k,v)=>attrs.set(k,v), removeAttribute:(k)=>attrs.delete(k), checkVisibility:()=>true, closest:()=>null, matches(){return this.disabled}, getBoundingClientRect:()=>({width:600,height:100}) }
  }
  const card=element({backgroundColor:'rgb(36, 36, 36)',backgroundImage:'none'})
  const action=element({backgroundColor:'rgb(59, 92, 246)',color:'rgb(22, 22, 22)'})
  let mounted=true
  const screen={checkVisibility:()=>true,contains:()=>mounted,querySelectorAll:(s)=>s.includes('button')?[action]:[card]}
  const bridge=load({querySelectorAll:()=>[],querySelector:()=>mounted?screen:null},(el)=>el.css).createMaterialBridge()
  bridge.sync();assert.equal(card.getAttribute('data-glass-settings-surface'),'card');assert.equal(action.getAttribute('data-glass-control-ink'),'light')
  action.disabled=true;bridge.sync();assert.equal(action.getAttribute('data-glass-control-ink'),null)
  mounted=false;bridge.sync();assert.equal(card.getAttribute('data-glass-settings-surface'),null)
  bridge.destroy()
})
test('clip bridge updates only its paint property and restores existing values on withdrawal', () => {
  const attrs = new Map([['data-glass-timeline-clip', 'original']]), props = new Map([['--glass-header-cut', '3px']])
  let visible = true, bottom = 95, top = 46
  const events = new Map()
  const content = { contains: () => false, style: { position: 'relative', overflowX: 'clip', getPropertyValue: (k) => props.get(k) ?? '', getPropertyPriority: () => 'important', setProperty: (k,v,p) => { props.set(k,v); props.set('priority',p) }, removeProperty: (k) => props.delete(k) }, getAttribute: (k) => attrs.get(k) ?? null, setAttribute: (k,v) => attrs.set(k,v), removeAttribute: (k) => attrs.delete(k), getBoundingClientRect: () => ({ top, bottom: 863 }) }
  const header = { classList: { contains: () => true }, checkVisibility: () => true, closest: () => ({ children: [content] }), getBoundingClientRect: () => ({ top: 46, bottom }) }
  const pane = { checkVisibility: () => visible, querySelectorAll: () => [{ parentElement: { parentElement: header } }] }
  let queries=0
  const bridge = load({ querySelectorAll: () => { queries++;return [pane] }, querySelector: () => { queries++;return null }, addEventListener: (name, fn) => events.set(name,fn), removeEventListener: (name) => events.delete(name) }).createMaterialBridge()
  bridge.sync(); assert.equal(props.get('--glass-header-cut'), '49.00px')
  bottom = 110; bridge.sync(); assert.equal(props.get('--glass-header-cut'), '64.00px')
  const beforeScroll=queries
  top = -400; events.get('scroll')(); assert.equal(props.get('--glass-header-cut'), '510.00px')
  assert.equal(queries,beforeScroll,'scroll never scans document or settings')
  top=-500;events.get('scroll')({type:'scroll',target:{}})
  assert.equal(props.get('--glass-header-cut'),'510.00px','unrelated scroll is ignored')
  visible = false; bridge.sync(); assert.equal(props.get('--glass-header-cut'), '3px'); assert.equal(attrs.get('data-glass-timeline-clip'), 'original')
  visible = true; bridge.sync(); bridge.destroy(); bridge.destroy()
  assert.equal(props.get('--glass-header-cut'), '3px'); assert.equal(props.get('priority'), 'important')
  assert.equal(events.size, 0)
})
