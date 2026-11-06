import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import ts from 'typescript'
const module = { exports: {} }
const source = await readFile(new URL('../src/activity.ts', import.meta.url), 'utf8')
vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText,
  { module, exports: module.exports })
const { indexActivity, summarizeActivity, partitionActivity } = module.exports
const tools = (parts) => [{ id: 'm', type: 'assistant', content: parts }]
const tool = (id, status = 'completed', created = 1000, completed = 2000) => ({ type: 'tool', id, name: 'shell', state: { status }, time: { created, completed } })

test('real tool count and parallel cumulative durations are deduplicated', () => {
  const index = indexActivity(tools([tool('a'), tool('b')]))
  const summary = summarizeActivity([index.get('a'), index.get('a'), index.get('b')], 3000)
  assert.equal(summary.count, 2); assert.equal(summary.toolMs, 2000)
  assert.equal(summary.state, 'completed'); assert.equal(summary.busy, false)
})
test('failure does not hide still-running work; interrupted is not success', () => {
  const index = indexActivity(tools([tool('bad', 'error'), tool('live', 'running', 1000, undefined)]))
  let value = summarizeActivity([...index.values()], 3000)
  assert.equal(value.state, 'error'); assert.equal(value.busy, true); assert.equal(value.running, 1)
  value = summarizeActivity([...indexActivity(tools([{ ...tool('stop', 'error'), state: { status: 'error', error: { type: 'InterruptedError' } } }])).values()], 3000)
  assert.equal(value.state, 'interrupted'); assert.equal(value.busy, false)
})
test('reasoning time is separate; private payload is not copied; invalid time is absent', () => {
  const index = indexActivity(tools([{ type: 'reasoning', text: 'private', time: { created: 1000, completed: 1500 } },
    { ...tool('a'), time: { created: 'bad' }, state: { status: 'completed', input: { secret: 'private' } } }]))
  const value = summarizeActivity([...index.values()], 3000)
  assert.equal(value.count, 1); assert.equal(value.thinkingMs, 500); assert.equal(value.timed, false)
  assert.ok(index.has('m:reasoning:0')); assert.equal(JSON.stringify([...index.values()]).includes('private'), false)
})
test('text/unknown boundaries are preserved; reasoning-only blocks are not hidden', () => {
  const index = indexActivity(tools([tool('a'), tool('b'), { type: 'reasoning', time: { created: 1000, completed: 1500 } }]))
  const segments = partitionActivity([
    { item: 1, ids: ['a'] }, { item: 2, ids: [] }, { item: 3, ids: ['b'] },
    { item: 4, ids: ['unknown'] }, { item: 5, ids: ['m:reasoning:0'] },
  ], index)
  assert.equal(segments.length, 2)
  assert.equal(segments[0].items.join(','), '1'); assert.equal(segments[1].items.join(','), '3')
})
