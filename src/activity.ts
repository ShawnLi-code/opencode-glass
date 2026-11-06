export type ActivityState = 'preparing' | 'running' | 'thinking' | 'completed' | 'error' | 'interrupted'
export interface ActivityPart {
  id: string
  type: 'tool' | 'reasoning'
  name: string
  state: ActivityState
  start: number
  end?: number
}
const record = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}
const time = (value: unknown): number => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Read only status/time/identity. Never copy prompts, command input or tool output. */
export function indexActivity(messages: readonly unknown[]): Map<string, ActivityPart> {
  const index = new Map<string, ActivityPart>()
  for (const raw of messages) {
    const message = record(raw)
    if (message.type !== 'assistant' || !Array.isArray(message.content)) continue
    let reasoning = 0
    for (const rawPart of message.content) {
      const p = record(rawPart), t = record(p.time), state = record(p.state)
      if (p.type !== 'tool' && p.type !== 'reasoning') continue
      const id = p.type === 'tool' ? String(p.id ?? '') : `${message.id}:reasoning:${reasoning++}`
      if (!id) continue
      const end = time(t.completed) || undefined
      const status: ActivityState = p.type === 'reasoning' ? end ? 'completed' : 'thinking'
        : state.status === 'error' ? /abort|interrupt|cancel/i.test(String(record(state.error).type)) ? 'interrupted' : 'error'
        : state.status === 'completed' ? 'completed' : state.status === 'running' ? 'running' : 'preparing'
      index.set(id, { id, type: p.type, name: String(p.name ?? '工具'), state: status,
        start: time(t.ran) || time(t.created), end })
    }
  }
  return index
}

export function summarizeActivity(parts: readonly ActivityPart[], now: number) {
  const unique = [...new Map(parts.map((p) => [p.id, p])).values()]
  const tools = unique.filter((p) => p.type === 'tool')
  const elapsed = (p: ActivityPart) => p.start ? Math.max(0, (p.end ?? now) - p.start) : 0
  const state: ActivityState = tools.some((p) => p.state === 'error') ? 'error'
    : tools.some((p) => p.state === 'running') ? 'running'
    : tools.some((p) => p.state === 'preparing') ? 'preparing'
    : unique.some((p) => p.state === 'thinking') ? 'thinking'
    : tools.some((p) => p.state === 'interrupted') ? 'interrupted' : 'completed'
  const names = [...new Set(tools.map((p) => p.name))]
  return { count: tools.length, names, state,
    busy: unique.some((p) => ['running', 'preparing', 'thinking'].includes(p.state)),
    running: tools.filter((p) => ['running', 'preparing'].includes(p.state)).length,
    toolMs: tools.reduce((n, p) => n + elapsed(p), 0),
    thinkingMs: unique.filter((p) => p.type === 'reasoning').reduce((n, p) => n + elapsed(p), 0),
    timed: tools.some((p) => p.start > 0) }
}

export const activityLabels: Record<ActivityState, string> = {
  preparing: '准备中', running: '运行中', thinking: '思考中', completed: '已完成', error: '失败', interrupted: '已中断',
}
export function formatActivityTime(ms: number): string {
  return ms < 60000 ? `${(ms / 1000).toFixed(1)}秒` : `${Math.floor(ms / 60000)}分${Math.floor(ms % 60000 / 1000)}秒`
}

/** Text/file/unknown rows are hard boundaries; never hide an unrecognized row. */
export function partitionActivity<T>(rows: readonly { item: T; ids: string[] }[], index: Map<string, ActivityPart>) {
  const result: { items: T[]; parts: ActivityPart[] }[] = []
  let items: T[] = [], parts: ActivityPart[] = []
  const flush = () => {
    if (parts.some((p) => p.type === 'tool')) result.push({ items, parts })
    items = []; parts = []
  }
  for (const row of rows) {
    const found = row.ids.map((id) => index.get(id))
    if (!row.ids.length || found.some((p) => !p)) { flush(); continue }
    items.push(row.item); parts.push(...found as ActivityPart[])
  }
  flush()
  return result
}
