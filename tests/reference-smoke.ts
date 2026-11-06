import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    let stopped = false
    const timers = new Set<number>()
    const delay = () => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, 100)
      timers.add(timer)
    })
    const wait = async (label: string, predicate: () => boolean) => {
      const until = performance.now() + 12000
      while (!stopped && performance.now() < until) {
        if (predicate()) { console.info('GLASS_REFERENCE_TEST PASS', label); return }
        await delay()
      }
      throw new Error(label)
    }
    let trigger: HTMLElement | undefined
    let originalExpanded: string | null = null
    let changed = false
    const restore = () => {
      if (changed && trigger?.isConnected && trigger.getAttribute('aria-expanded') !== originalExpanded) trigger.click()
      changed = false
    }
    void (async () => {
      try {
        await wait('new skin loaded', () => ctx.stores.prefs.value.styleRevision === 1)
        if (ctx.stores.prefs.value.shimmer) throw new Error('Reference default still has optional sweep enabled')
        console.info('GLASS_REFERENCE_TEST PASS sweep default OFF')
        const form = document.querySelector<HTMLElement>('[data-component=composer]')
        if (!form) throw new Error('Native composer not found')
        const formStyle = getComputedStyle(form)
        if (formStyle.borderRadius !== '12px' || !formStyle.backdropFilter.includes('22px')) throw new Error('Composer skin missed real form')
        console.info('GLASS_REFERENCE_TEST PASS native composer glass', formStyle.backgroundColor)
        const active = document.querySelector<HTMLElement>('[data-slot=sidebar-inbox-item][data-state=active]')
        if (active && !getComputedStyle(active).backgroundImage.includes('linear-gradient')) throw new Error('Active sidebar gradient missing')
        console.info('GLASS_REFERENCE_TEST PASS sidebar active gradient')
        await wait('structural enhancement ready', () => !!document.querySelector('[data-glass-activity-header]'))
        const summary = document.querySelector<HTMLElement>('[data-glass-activity-header]')
        const group = summary ?? document.querySelector<HTMLElement>('[data-component=collapsed-tool-group] > .tool-collapsible')
        if (!group) throw new Error('No native grouped activity available in this timeline')
        trigger = summary ?? group.querySelector<HTMLElement>(':scope > [data-slot=collapsible-trigger]') ?? undefined
        if (!trigger) throw new Error('Native collapse trigger missing')
        const groupStyle = getComputedStyle(group), triggerStyle = getComputedStyle(trigger)
        if ((!summary && groupStyle.borderRadius !== '12px') || groupStyle.borderTopWidth !== '1px' || (!summary && triggerStyle.borderTopWidth !== '0px')) {
          throw new Error('Tool card outer/inner border geometry differs from reference')
        }
        console.info('GLASS_REFERENCE_TEST PASS whole activity card glass', JSON.stringify({
          radius: groupStyle.borderRadius, background: groupStyle.backgroundColor,
          blur: groupStyle.backdropFilter, triggerPadding: triggerStyle.padding,
        }))
        for (const line of Array.from((summary?.parentElement ?? group).querySelectorAll<HTMLElement>('[data-slot=basic-tool-tool-subtitle]'))
          .filter((el) => !el.closest('[data-component=reasoning-part]') && el.checkVisibility()).slice(0, 5)) {
          const button = line.closest<HTMLElement>('[data-slot=collapsible-trigger]')
          if (line.clientHeight < 28 || (button && line.getBoundingClientRect().bottom > button.getBoundingClientRect().bottom + 2)) {
            throw new Error('Command preview clipped by compact native trigger height')
          }
        }
        console.info('GLASS_REFERENCE_TEST PASS visible command preview geometry')
        originalExpanded = trigger.getAttribute('aria-expanded')
        trigger.click(); changed = true
        await wait('native activity collapse changes state', () => trigger!.getAttribute('aria-expanded') !== originalExpanded)
        restore()
        await wait('native activity collapse restores state', () => trigger!.getAttribute('aria-expanded') === originalExpanded)
        console.info('GLASS_REFERENCE_TEST COMPLETE')
      } catch (error) {
        if (!stopped) console.error('GLASS_REFERENCE_TEST FAIL', String(error))
      } finally { restore() }
    })()
    return () => { stopped = true; for (const timer of timers) window.clearTimeout(timer); restore(); cleanup?.() }
  },
})
