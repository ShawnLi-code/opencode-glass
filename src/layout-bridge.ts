import { activityLabels, formatActivityTime, indexActivity, partitionActivity, summarizeActivity, type ActivityPart } from './activity'
import { createMaterialBridge } from './material-bridge'

interface Group {
  first: HTMLElement
  members: HTMLElement[]
  header: HTMLButtonElement
  title: HTMLElement
  thinking: HTMLElement
  status: HTMLElement
  duration: HTMLElement
  ids: string[]
  manual?: boolean
}
interface ModelControl { form: HTMLElement; controls: HTMLElement; toggle: HTMLButtonElement; buttons: HTMLButtonElement[] }
const text = (el: HTMLElement, value: string) => { if (el.textContent !== value) el.textContent = value }
const names: Record<string, string> = { shell: 'Shell', execute: '执行', read: '读取', patch: '写入', edit: '编辑', write: '写入', grep: '搜索', glob: '查找' }

/** Reversible DOM enhancement: never move, clone or delete host-owned content. */
export function createLayoutBridge(readMessages: () => readonly unknown[]) {
  let disposed = false, queued: number | undefined
  const groups = new Map<HTMLElement, Group>()
  const hosts = new Map<HTMLElement, { trigger: HTMLButtonElement; expanded: string | null }>()
  const inspectedHosts = new WeakSet<HTMLElement>()
  const mountingHosts = new Map<HTMLElement, number>()
  const models = new Map<HTMLElement, ModelControl>()
  const metricSources = new Set<HTMLElement>()
  const materials = createMaterialBridge()

  const clearMembers = (members: HTMLElement[]) => members.forEach((el) => {
    el.removeAttribute('data-glass-activity-member'); el.removeAttribute('data-glass-activity-hidden'); el.removeAttribute('data-glass-activity-last')
  })
  const removeGroup = (g: Group, keep = new Set<HTMLElement>()) => { clearMembers(g.members.filter((el) => !keep.has(el))); g.header.remove(); groups.delete(g.first) }
  const restoreHost = (el: HTMLElement, state: { trigger: HTMLButtonElement; expanded: string | null }) => {
    el.removeAttribute('data-glass-activity-host')
    if (state.trigger.isConnected && state.trigger.getAttribute('aria-expanded') !== state.expanded) state.trigger.click()
    hosts.delete(el)
  }
  const removeModel = (m: ModelControl) => {
    m.buttons.forEach((b) => b.removeAttribute('data-glass-native-model'))
    m.form.removeAttribute('data-glass-model-collapsed'); m.controls.removeAttribute('data-glass-model-controls')
    m.toggle.remove(); models.delete(m.form)
  }
  const setModelOpen = (m: ModelControl, open: boolean) => {
    if (!open && m.buttons.some((b) => b.contains(document.activeElement))) m.toggle.focus({ preventScroll: true })
    m.form.toggleAttribute('data-glass-model-collapsed', !open)
    m.toggle.setAttribute('aria-expanded', String(open))
    text(m.toggle, open ? '收起 ▴' : `${m.toggle.title} ▾`)
  }

  const syncModel = (form: HTMLElement) => {
    const controls = form.querySelector<HTMLElement>('[data-slot=composer-controls]')
    if (!controls?.querySelector('[data-action=composer-model]')) return
    const buttons = Array.from(controls.querySelectorAll<HTMLButtonElement>('button:not([data-glass-model-toggle])'))
    if (!buttons.length || buttons.length > 8) return
    let m = models.get(form)
    if (m && m.controls !== controls) { removeModel(m); m = undefined }
    if (!m) {
      const toggle = document.createElement('button')
      toggle.type = 'button'; toggle.setAttribute('data-glass-model-toggle', ''); toggle.setAttribute('data-glass-layout-owned', '')
      toggle.setAttribute('aria-label', '展开或收起模式、模型和推理选项')
      m = { form, controls, toggle, buttons: [] }; models.set(form, m)
      const control = m
      toggle.addEventListener('click', () => setModelOpen(control, control.form.hasAttribute('data-glass-model-collapsed')))
      controls.prepend(toggle); controls.setAttribute('data-glass-model-controls', '')
      setModelOpen(m, false)
    }
    for (const old of m.buttons) if (!buttons.includes(old)) old.removeAttribute('data-glass-native-model')
    m.buttons = buttons
    buttons.forEach((b) => b.setAttribute('data-glass-native-model', ''))
    if (!m.toggle.isConnected) controls.prepend(m.toggle)
    const label = buttons.map((b) => b.textContent?.trim()).filter(Boolean).join(' / ')
    text(m.toggle, form.hasAttribute('data-glass-model-collapsed') ? `${label} ▾` : '收起 ▴')
    m.toggle.title = label
  }

  const syncMetrics = () => {
    const headers = Array.from(document.querySelectorAll<HTMLElement>('[data-glass-vitals]')).filter((el) => el.checkVisibility())
    const live = new Set<HTMLElement>()
    for (const header of headers) {
      const pane = header.closest('[data-slot=session-chat-panel]') ?? header.closest('main')
      if (!pane) continue
      const metrics = Array.from(header.querySelectorAll<HTMLElement>('[data-glass-metric-id]'))
      for (const source of Array.from(pane.querySelectorAll<HTMLElement>('[data-slot=session-plugin-pill]'))) {
        const oldId = source.getAttribute('data-glass-native-metric')
        const match = metrics.find((m) => m.dataset.glassMetricId === oldId) ?? metrics.find((m) =>
          (source.textContent?.trim() === m.dataset.glassMetricLabel) ||
          (!!m.dataset.glassMetricTitle && source.getAttribute('aria-label') === m.dataset.glassMetricTitle))
        if (match) { source.setAttribute('data-glass-native-metric', match.dataset.glassMetricId!); live.add(source); metricSources.add(source) }
      }
    }
    for (const old of metricSources) if (!live.has(old)) { old.removeAttribute('data-glass-native-metric'); metricSources.delete(old) }
  }

  const syncActivities = (panes: HTMLElement[]) => {
    const index = indexActivity(readMessages()), wanted = new Set<HTMLElement>(), wantedHosts = new Set<HTMLElement>()
    // Native collapsed groups lazy-mount their rows. Open once to discover real
    // identities, preserving the previous fold for disable/unload or fallback.
    for (const pane of panes) for (const host of Array.from(pane.querySelectorAll<HTMLElement>('[data-component=collapsed-tool-group] > .tool-collapsible'))) {
      const trigger = host.querySelector<HTMLButtonElement>(':scope > [data-slot=collapsible-trigger]')
      if (!trigger || inspectedHosts.has(host)) continue
      inspectedHosts.add(host)
      if (trigger.getAttribute('aria-expanded') !== 'false' || host.querySelector('[data-component=context-tool-group-list]')) continue
      hosts.set(host, { trigger, expanded: 'false' })
      mountingHosts.set(host, Date.now() + 1000)
      trigger.click()
    }
    const bind = (members: HTMLElement[], parts: ActivityPart[]) => {
      const summary = summarizeActivity(parts, Date.now())
      if (!summary.count || !members.length) return
      const first = members[0]; wanted.add(first)
      let g = groups.get(first)
      if (!g) {
        const header = document.createElement('button')
        header.type = 'button'; header.setAttribute('data-glass-activity-header', ''); header.setAttribute('data-glass-layout-owned', '')
        const arrow = document.createElement('span'); arrow.setAttribute('data-glass-activity-arrow', ''); arrow.textContent = '▸'; arrow.setAttribute('aria-hidden', 'true')
        const title = document.createElement('span'), thinking = document.createElement('span'), status = document.createElement('span'), duration = document.createElement('span')
        title.setAttribute('data-glass-activity-title', ''); thinking.setAttribute('data-glass-activity-thinking', '')
        status.setAttribute('data-glass-activity-status', ''); duration.setAttribute('data-glass-activity-duration', '')
        duration.title = '各工具执行时长累计；并行调用的时长可能重叠'
        header.append(arrow, title, thinking, status, duration)
        g = { first, members: [], ids: [], header, title, thinking, status, duration }; groups.set(first, g)
        const binding = g
        header.addEventListener('click', () => { binding.manual = header.getAttribute('aria-expanded') !== 'true'; schedule() })
      }
      const current = g
      clearMembers(current.members.filter((el) => !members.includes(el)))
      current.members = members; current.ids = [...new Set(parts.map((p) => p.id))]
      if (first.previousElementSibling !== current.header) first.before(current.header)
      const busy = summary.busy
      const open = current.manual ?? busy
      current.header.setAttribute('aria-expanded', String(open))
      current.header.setAttribute('data-status', summary.state)
      current.header.toggleAttribute('data-busy', busy)
      current.header.setAttribute('data-tool-count', String(summary.count))
      text(current.title, `${summary.count} 个${summary.names.length === 1 ? ` ${names[summary.names[0]] ?? summary.names[0]} ` : '工具'}调用`)
      text(current.thinking, summary.thinkingMs > 0 ? `思考 ${formatActivityTime(summary.thinkingMs)}` : '')
      current.thinking.hidden = summary.thinkingMs <= 0
      text(current.status, `${activityLabels[summary.state]}${summary.state === 'error' && summary.running ? ` · ${summary.running}运行中` : ''}`)
      text(current.duration, summary.timed ? `累计 ${formatActivityTime(summary.toolMs)}` : '')
      members.forEach((el, i) => {
        el.setAttribute('data-glass-activity-member', ''); el.toggleAttribute('data-glass-activity-hidden', !open)
        el.toggleAttribute('data-glass-activity-last', i === members.length - 1)
      })
      const host = first.closest<HTMLElement>('[data-component=collapsed-tool-group] > .tool-collapsible')
      const trigger = host?.querySelector<HTMLButtonElement>(':scope > [data-slot=collapsible-trigger]')
      if (host && trigger) {
        wantedHosts.add(host)
        if (!hosts.has(host)) hosts.set(host, { trigger, expanded: trigger.getAttribute('aria-expanded') })
        if (trigger.getAttribute('aria-expanded') === 'false') trigger.click()
        host.setAttribute('data-glass-activity-host', '')
      }
    }
    for (const pane of panes) for (const list of Array.from(pane.querySelectorAll<HTMLElement>('[data-component=context-tool-group-list]'))) {
      const rows = Array.from(list.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el.getAttribute('data-slot') === 'context-tool-group-item')
        .map((item) => ({ item, ids: [...new Set(Array.from(item.querySelectorAll('[data-timeline-part-id]')).map((el) => el.getAttribute('data-timeline-part-id')!))] }))
      for (const segment of partitionActivity(rows, index)) bind(segment.items, segment.parts)
    }
    const keep = new Set([...groups.values()].filter((g) => wanted.has(g.first)).flatMap((g) => g.members))
    for (const g of [...groups.values()]) if (!wanted.has(g.first) || !g.first.isConnected) removeGroup(g, keep)
    for (const [host, saved] of [...hosts]) {
      if (wantedHosts.has(host)) mountingHosts.delete(host)
      else if ((mountingHosts.get(host) ?? 0) <= Date.now()) { mountingHosts.delete(host); restoreHost(host, saved) }
    }
  }

  let scrollUntil = 0
  const scrolling = (event: Event) => {
    if (event.target instanceof Element && event.target.closest('[data-slot=session-timeline-scroll]')) scrollUntil = Date.now() + 120
  }
  const sync = () => {
    queued = undefined
    if (disposed || document.hidden) return
    const remaining = scrollUntil - Date.now()
    if (remaining > 0) { queued = window.setTimeout(sync, remaining); return }
    const panes = Array.from(document.querySelectorAll<HTMLElement>('[data-slot=session-chat-panel]')).filter((el) => el.checkVisibility())
    panes.forEach((pane) => pane.querySelectorAll<HTMLElement>('[data-component=composer]').forEach(syncModel))
    document.querySelectorAll<HTMLElement>('[data-component=new-session] [data-component=composer]').forEach((form) => { if (form.checkVisibility()) syncModel(form) })
    for (const m of [...models.values()]) if (!m.form.isConnected) removeModel(m)
    syncActivities(panes); syncMetrics(); materials.sync()
  }
  const schedule = () => { if (!disposed && queued === undefined) queued = window.setTimeout(sync, 40) }
  const observer = new MutationObserver((records) => {
    if (records.some((r) => !(r.target instanceof Element ? r.target : r.target.parentElement)?.closest('[data-glass-layout-owned]'))) schedule()
  })
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-expanded', 'data-state'] })
  const tick = window.setInterval(schedule, 500)
  const escape = (event: KeyboardEvent) => {
    if (event.key !== 'Escape') return
    const overlayOpen = Array.from(document.querySelectorAll<HTMLElement>('[role=dialog],[role=menu]')).some((el) => el.checkVisibility())
    if (!overlayOpen) for (const m of models.values()) setModelOpen(m, false)
  }
  document.addEventListener('visibilitychange', schedule); window.addEventListener('keydown', escape, true)
  document.addEventListener('scroll', scrolling, { capture: true, passive: true })
  schedule()
  return {
    destroy() {
      disposed = true; observer.disconnect(); window.clearInterval(tick); window.clearTimeout(queued)
      document.removeEventListener('visibilitychange', schedule); window.removeEventListener('keydown', escape, true)
      document.removeEventListener('scroll', scrolling, true)
      materials.destroy()
      for (const g of [...groups.values()]) removeGroup(g)
      for (const [host, saved] of [...hosts]) restoreHost(host, saved)
      mountingHosts.clear()
      for (const m of [...models.values()]) removeModel(m)
      metricSources.forEach((el) => el.removeAttribute('data-glass-native-metric')); metricSources.clear()
    },
  }
}
