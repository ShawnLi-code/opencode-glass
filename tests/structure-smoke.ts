import { ComposerPill, Ipc, Plugin } from '@opencode/plugin/gui'
import { Schema } from 'effect'
import plugin from '../src/gui'
import { indexActivity, partitionActivity, summarizeActivity, formatActivityTime } from '../src/activity'
const NativeKeys = Ipc.define({ id: 'opencode-glass.structure-key', methods: { escape: { output: Schema.Boolean } } })
export default Plugin.define({ ...plugin, setup(ctx) {
  const nativeFolds = Array.from(document.querySelectorAll<HTMLElement>('[data-component=collapsed-tool-group] > .tool-collapsible > [data-slot=collapsible-trigger]'))
    .map((el) => ({ el, expanded: el.getAttribute('aria-expanded') }))
  const cleanup = plugin.setup?.(ctx)
  const initial = ctx.stores.prefs.value.enabled
  let stopped = false
  const timers = new Set<number>()
  const delay = () => new Promise<void>((resolve) => { const t = window.setTimeout(() => { timers.delete(t); resolve() }, 100); timers.add(t) })
  const wait = async (label: string, check: () => boolean) => {
    const end = performance.now() + 12000
    while (!stopped && performance.now() < end) { if (check()) { console.info('GLASS_STRUCTURE_TEST PASS', label); return }; await delay() }
    throw new Error(label)
  }
  const set = (enabled: boolean) => ctx.stores.prefs.update((p) => { p.enabled = enabled })
  const q = (s: string) => document.querySelector<HTMLElement>(s)
  const escape = () => (document.activeElement ?? document).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }))
  let restoreScroll: (() => void) | undefined
  void (async () => { try {
    Array.from(document.querySelectorAll<HTMLElement>('button')).find((b) => b.checkVisibility() && (b.getAttribute('aria-label') === '返回应用' || b.textContent?.trim() === '返回应用'))?.click()
    set(true)
    await wait('activity, model and statistics mounted', () => !!q('[data-glass-activity-header]') && !!q('[data-glass-model-toggle]') && !!q('[data-glass-vitals]'))
    const session = ctx.sessions.current()!
    const screen = ctx.screen.current()!
    const draftFingerprint = () => {
      const value = screen.composer.text()
      let hash = 2166136261
      for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
      return `${value.length}:${hash >>> 0}`
    }
    const draft = draftFingerprint(), model = JSON.stringify(screen.composer.model())
    let verified = 0
    await wait('live activity count/status/duration converges to API', () => {
    const index = indexActivity(session.server.data.session.message.list(session.id))
    verified = 0
    for (const list of Array.from(document.querySelectorAll<HTMLElement>('[data-component=context-tool-group-list]'))) {
      const rows = Array.from(list.children).filter((el): el is HTMLElement => el instanceof HTMLElement && el.getAttribute('data-slot') === 'context-tool-group-item')
        .map((item) => ({ item, ids: [...new Set(Array.from(item.querySelectorAll('[data-timeline-part-id]')).map((e) => e.getAttribute('data-timeline-part-id')!))] }))
      for (const segment of partitionActivity(rows, index)) {
        const header = segment.items[0].previousElementSibling as HTMLElement
        const sum = summarizeActivity(segment.parts, Date.now())
        if (!header?.hasAttribute('data-glass-activity-header') || Number(header.dataset.toolCount) !== sum.count || header.dataset.status !== sum.state) return false
        if (!sum.busy && sum.timed && header.querySelector('[data-glass-activity-duration]')?.textContent !== `累计 ${formatActivityTime(sum.toolMs)}`) return false
        verified++
      }
    }
    return verified > 0
    })
    console.info('GLASS_STRUCTURE_TEST PASS real API count/status/duration', verified)
    const header = q('[data-glass-activity-header]')!
    const was = header.getAttribute('aria-expanded')
    header.click()
    await wait('summary toggles actual native rows', () => header.getAttribute('aria-expanded') !== was && !!header.nextElementSibling?.hasAttribute('data-glass-activity-hidden') === (was === 'true'))
    header.click()
    await wait('summary restores previous fold', () => header.getAttribute('aria-expanded') === was)
    const toggle = q('[data-glass-model-toggle]')!
    toggle.click()
    await wait('model capsule reveals native buttons', () => toggle.getAttribute('aria-expanded') === 'true' && !!q('[data-action=composer-model]')?.checkVisibility())
    const native = q('[data-action=composer-model]')!
    native.click()
    await wait('native model selection dialog opens', () => !!q('[role=dialog]'))
    escape()
    // The native close control is used if synthetic Escape is not handled by its focus scope.
    const dialog = q('[role=dialog]')
    if (dialog) dialog.querySelector<HTMLElement>('button[aria-label*="关闭"],button[aria-label*="Close"],[data-slot=dialog-close]')?.click()
    await wait('native dialog closes without selecting a model', () => !q('[role=dialog]'))
    escape()
    await wait('Escape folds capsule', () => q('[data-glass-model-toggle]')?.getAttribute('aria-expanded') === 'false')
    const vitals = q('[data-glass-vitals]') as HTMLDetailsElement
    const originalOpen = vitals.open
    vitals.open = true
    await wait('compact statistics exposes all metric buttons', () => !!vitals.querySelector<HTMLElement>('[data-glass-metric-id] button')?.checkVisibility())
    const registered = ctx.list(ComposerPill)
    for (const metric of Array.from(vitals.querySelectorAll<HTMLElement>('[data-glass-metric-id]'))) {
      const item = registered.find((p) => p.id === metric.dataset.glassMetricId)!
      await wait(`header metric equals live source: ${item.id}`, () => {
        const value = item.show({ session, screen })
        return !!value && metric.dataset.glassMetricLabel === value.label
      })
    }
    console.info('GLASS_STRUCTURE_TEST PASS header labels equal original plugin data')
    await wait('migrated bottom metrics are deduplicated', () => document.querySelectorAll('[data-glass-native-metric]').length > 0)
    const goal = registered.find((p) => p.id === 'goal')?.show({ session, screen })
    if (goal) for (const source of Array.from(document.querySelectorAll<HTMLElement>('[data-slot=session-plugin-pill]'))) {
      if (source.textContent?.trim() === goal.label && source.hasAttribute('data-glass-native-metric')) throw new Error('Goal was hidden')
    }
    const menuButton = vitals.querySelector<HTMLElement>('button[aria-haspopup]')
    if (menuButton) {
      menuButton.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerId: 1, pointerType: 'mouse' }))
      menuButton.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerId: 1, pointerType: 'mouse' }))
      const visibleMenu = () => Array.from(document.querySelectorAll<HTMLElement>('[role=menu]')).find((el) => el.checkVisibility())
      await wait('real statistics menu opens', () => !!visibleMenu())
      // Presence precedes the host's deferred dismiss/focus listeners. Wait
      // for a painted frame before sending a real key to the native menu.
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))
      await delay()
      await ctx.main(NativeKeys).escape()
      console.info('GLASS_STRUCTURE_MENU_DIAGNOSTIC', JSON.stringify({
        active: document.activeElement?.tagName,
        trigger: { expanded: menuButton.getAttribute('aria-expanded'), state: menuButton.getAttribute('data-state') },
        menus: Array.from(document.querySelectorAll<HTMLElement>('[role=menu]')).map((el) => ({
          component: el.getAttribute('data-component'), state: el.getAttribute('data-state'), closed: el.hasAttribute('data-closed'),
          visible: el.checkVisibility(), opacity: getComputedStyle(el).opacity, visibility: getComputedStyle(el).visibility,
          display: getComputedStyle(el).display, pointer: getComputedStyle(el).pointerEvents, text: el.textContent?.slice(0, 180),
        })),
      }))
      await wait('statistics menu dismisses', () => !visibleMenu())
    }
    const hiddenMenu = document.createElement('div')
    hiddenMenu.setAttribute('role', 'menu'); hiddenMenu.style.display = 'none'; document.body.append(hiddenMenu)
    try {
      const liveToggle = q('[data-glass-model-toggle]')!
      if (liveToggle.getAttribute('aria-expanded') !== 'true') liveToggle.click()
      await ctx.main(NativeKeys).escape()
      await wait('hidden cached menus do not block native Escape on model capsule', () => q('[data-glass-model-toggle]')?.getAttribute('aria-expanded') === 'false')
      if (vitals.dataset.compact === 'true') {
        vitals.open = true
        await ctx.main(NativeKeys).escape()
        await wait('native Escape closes compact statistics with hidden menu present', () => !vitals.open)
      }
    } finally { hiddenMenu.remove() }
    vitals.open = originalOpen
    if (draft !== draftFingerprint() || model !== JSON.stringify(screen.composer.model())) throw new Error('Draft/model changed')
    console.info('GLASS_STRUCTURE_TEST PASS input draft and model unchanged')
    set(false)
    await wait('master OFF removes all structural nodes and hiding attributes', () => !q('[data-glass-activity-header],[data-glass-activity-member],[data-glass-activity-host],[data-glass-model-toggle],[data-glass-native-model],[data-glass-native-metric],[data-glass-vitals]'))
    if (!q('[data-action=composer-model]')?.checkVisibility()) throw new Error('Native model not restored')
    for (const { el, expanded } of nativeFolds) if (el.isConnected && el.getAttribute('aria-expanded') !== expanded) throw new Error('Native outer fold not restored')
    console.info('GLASS_STRUCTURE_TEST PASS native outer fold states restored')
    set(true)
    await wait('master ON restores structures once', () => document.querySelectorAll('[data-glass-model-toggle]').length === 1 && !!q('[data-glass-activity-header]'))
    const last = Array.from(document.querySelectorAll<HTMLElement>('[data-glass-activity-header]')).at(-1)!
    const scrolls: { el: HTMLElement; top: number }[] = []
    for (let el = last.parentElement; el; el = el.parentElement) if (el.scrollHeight > el.clientHeight) scrolls.push({ el, top: el.scrollTop })
    restoreScroll = () => scrolls.forEach(({ el, top }) => { el.scrollTop = top })
    last.scrollIntoView({ block: 'center' })
    console.info('GLASS_STRUCTURE_TEST COMPLETE', JSON.stringify({ groups: verified, summary: last.textContent }))
  } catch (error) { if (!stopped) console.error('GLASS_STRUCTURE_TEST FAIL', String(error)) }
  finally { if (!stopped) set(initial) } })()
  return () => { stopped = true; timers.forEach(window.clearTimeout); restoreScroll?.(); set(initial); cleanup?.() }
}, main(ctx) {
  plugin.main?.(ctx)
  // This test does not measure Page Visibility. Prevent covered-window timer
  // throttling from turning a 100ms DOM wait into a false 60-second timeout.
  const saved = ctx.windows.list().map((win) => ({ win, value: win.webContents.getBackgroundThrottling() }))
  saved.forEach(({ win }) => win.webContents.setBackgroundThrottling(false))
  ctx.provide(NativeKeys, { async escape(_, caller) {
    const wc = ctx.windows.get(caller.window)!.webContents
    if (wc.debugger.isAttached()) throw new Error('Another debugger is attached; refusing to replace it')
    wc.debugger.attach('1.3')
    try {
      await wc.debugger.sendCommand('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
      await wc.debugger.sendCommand('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 })
      return true
    } finally { wc.debugger.detach() }
  } })
  return () => saved.forEach(({ win, value }) => { if (!win.isDestroyed()) win.webContents.setBackgroundThrottling(value) })
} })
