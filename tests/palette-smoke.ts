import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
import { getPalette, PALETTES } from '../src/palettes'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup = plugin.setup?.(ctx)
  let initial = { ...ctx.stores.prefs.value }
  let stopped = false, preserveForReload = false, restoreCanvas: (() => void) | undefined
  const timers = new Set<number>(), records: unknown[] = []
  const delay = () => new Promise<void>((resolve) => { const t = window.setTimeout(() => { timers.delete(t); resolve() }, 100); timers.add(t) })
  const wait = async (label: string, check: () => boolean) => {
    const end = performance.now() + 12000
    while (!stopped && performance.now() < end) { if (check()) { console.info('GLASS_PALETTE_TEST PASS', label); return }; await delay() }
    throw new Error(label)
  }
  const call = async (input: object) => JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  const update = (value: Partial<typeof initial>) => ctx.stores.prefs.update((p) => { Object.assign(p, value) })
  const restore = () => ctx.stores.prefs.update((p) => { Object.assign(p, initial); p.palette = initial.palette })
  const q = (s: string) => document.querySelector<HTMLElement>(s)
  const back = async () => {
    Array.from(document.querySelectorAll<HTMLElement>('button')).find((b) => b.checkVisibility() && (b.getAttribute('aria-label') === '返回应用' || b.textContent?.trim() === '返回应用'))?.click()
    await wait('native composer visible', () => !!q('[data-component=composer]')?.checkVisibility())
    await wait('session enhancements restored after leaving settings', () => !!q('[data-glass-model-toggle]')?.checkVisibility())
  }
  void (async () => { try {
    await call({ op: 'info' })
    const checkpoint = await call({ op: 'palette-checkpoint' })
    if (checkpoint?.stage === 'awaiting-reload') {
      const observed = ctx.stores.prefs.value.palette
      initial = checkpoint.original
      restore()
      await call({ op: 'palette-checkpoint', value: { ...checkpoint, stage: observed === checkpoint.expected ? 'complete' : 'failed', observed, finished: new Date().toISOString() } })
      if (observed !== checkpoint.expected) throw new Error('Selected palette did not survive real GUI reload')
      console.info('GLASS_PALETTE_TEST PASS selection survives real GUI reload', observed)
      console.info('GLASS_PALETTE_TEST COMPLETE', JSON.stringify({ palettes: checkpoint.records.length, originalPalette: getPalette(initial.palette).id }))
      return
    }
    update({ enabled: false })
    await wait('native shell baseline available', () => !document.documentElement.hasAttribute('data-glass-enabled'))
    const nativeHome = getComputedStyle(q('[data-action=vertical-tabs-home]')!)
    const homeBaseline = { image: nativeHome.backgroundImage, color: nativeHome.backgroundColor, filter: nativeHome.backdropFilter }
    update({ enabled: true, background: true, motion: false })
    ctx.layout.settings('glass')
    await wait('six real palette controls mounted', () => document.querySelectorAll('[data-glass-palette-option]').length === 6)
    if (ctx.stores.prefs.value.intensity !== initial.intensity) throw new Error('Legacy intensity changed')
    await wait('one canvas available', () => document.querySelectorAll('[data-glass-aurora]').length === 1)
    const canvas = document.querySelector<HTMLCanvasElement>('[data-glass-aurora]')!, context = canvas.getContext('2d')!, fill = context.fillRect
    let painted = ''
    context.fillRect = function (...args) { painted = String(this.fillStyle).toLowerCase(); return fill.apply(this, args) }
    restoreCanvas = () => { context.fillRect = fill }
    const headerSelector = '[data-slot=session-chat-panel] .pointer-events-auto:has(> .min-w-0 > .session-header-layout)'
    for (const palette of PALETTES) {
      ctx.layout.settings('glass')
      await wait('palette controls ready', () => !!q(`[data-glass-palette-option=${palette.id}]`))
      q(`[data-glass-palette-option=${palette.id}]`)!.click()
      await wait(`real UI and stored palette = ${palette.id}`, () => ctx.stores.prefs.value.palette === palette.id && q(`[data-glass-palette-option=${palette.id}]`)?.getAttribute('aria-pressed') === 'true' && document.documentElement.dataset.glassPalette === palette.id)
      // Canvas normalizes #05070e to #05070e; no prompt or tool output is sampled.
      await wait(`paused canvas repainted ${palette.id}`, () => painted === palette.base || palette.id === getPalette(initial.palette).id && painted === '')
      if (ctx.stores.prefs.value.intensity !== initial.intensity) throw new Error('Palette reset another preference')
      await back()
      const nav = ['vertical-tabs-home','vertical-tabs-search','vertical-tabs-new-session'].map((action) => {
        const el = q(`[data-action=${action}]`)
        if (!el) throw new Error(`Native action absent: ${action}`)
        const css = getComputedStyle(el)
        if (!css.backgroundImage.includes('linear-gradient')) throw new Error(`Native action remains opaque black: ${action}`)
        return { action, background: css.backgroundImage, height: el.getBoundingClientRect().height }
      })
      const titlebar = q('[data-slot=titlebar-v2]')!, sessionbar = q(headerSelector)
      if (!titlebar.hasAttribute('data-tauri-drag-region')) throw new Error('Native drag region lost')
      if (!sessionbar || !getComputedStyle(sessionbar).backgroundImage.includes('linear-gradient') || !getComputedStyle(titlebar).backdropFilter.includes('18px')) throw new Error('Titlebar material missed actual host')
      if (document.querySelectorAll('[data-glass-aurora]').length !== 1 || document.querySelector('[data-glass-aurora]') !== canvas) throw new Error('Palette created another canvas')
      records.push({ palette: palette.id, nav, bar: getComputedStyle(titlebar).backgroundImage, sessionbar: getComputedStyle(sessionbar).backgroundImage })
      await call({ op: 'capture', name: `palette-${palette.id}` })
      ctx.layout.settings('general'); ctx.layout.settings('glass')
      await wait(`selection survives settings reopening: ${palette.id}`, () => q(`[data-glass-palette-option=${palette.id}]`)?.getAttribute('aria-pressed') === 'true')
    }
    restoreCanvas(); restoreCanvas = undefined
    update({ background: false })
    q('[data-glass-palette-option=jade]')!.click()
    await wait('palette works with background OFF without mounting a canvas', () => document.documentElement.dataset.glassPalette === 'jade' && !q('[data-glass-aurora]'))
    update({ background: true })
    await wait('background ON restores selected palette once', () => document.querySelectorAll('[data-glass-aurora]').length === 1)
    await back()
    update({ enabled: false })
    await wait('OFF withdraws palette flag, shell CSS and all backdrop layers', () => !document.documentElement.hasAttribute('data-glass-palette') && !q('[data-glass-aurora]') && !Array.from(document.querySelectorAll('style[data-plugin]')).some((el) => el.getAttribute('data-plugin') === ctx.id))
    const homeOff = getComputedStyle(q('[data-action=vertical-tabs-home]')!)
    if (homeOff.backgroundImage !== homeBaseline.image || homeOff.backgroundColor !== homeBaseline.color || homeOff.backdropFilter !== homeBaseline.filter) throw new Error('Native home differs from original OFF baseline')
    restore()
    await wait('original preferences and palette restored', () => getPalette(ctx.stores.prefs.value.palette).id === getPalette(initial.palette).id && ctx.stores.prefs.value.motion === initial.motion && ctx.stores.prefs.value.intensity === initial.intensity)
    update({ palette: 'jade' })
    await wait('persist checkpoint selection committed', () => ctx.stores.prefs.value.palette === 'jade')
    await call({ op: 'palette-checkpoint', value: { stage: 'awaiting-reload', expected: 'jade', original: initial, records } })
    preserveForReload = true
    console.info('GLASS_PALETTE_TEST READY_FOR_RELOAD', JSON.stringify({ palettes: records.length }))
  } catch(e) { if (!stopped) console.error('GLASS_PALETTE_TEST FAIL', String(e)) }
  finally { restoreCanvas?.(); if (!stopped) { if (!preserveForReload) restore(); await call({ op: 'reset' }) } } })()
  return () => { stopped = true; timers.forEach(window.clearTimeout); restoreCanvas?.(); if (!preserveForReload) restore(); cleanup?.() }
} })
