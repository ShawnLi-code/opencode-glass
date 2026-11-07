import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'

// Opt-in host regression: real settings markup, computed styles and scrolling.
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    let disposed = false
    const timers = new Set<number>()
    const delay = (ms: number) => new Promise<void>((resolve) => {
      const id = window.setTimeout(() => { timers.delete(id); resolve() }, ms)
      timers.add(id)
    })
    void (async () => {
      try {
        ctx.layout.settings('general')
        for (let attempt = 0; attempt < 60 && !disposed; attempt++) {
          const header = document.querySelector<HTMLElement>('.settings-screen .settings-tab-header')
          if (!header || !header.getBoundingClientRect().width) { await delay(100); continue }
          let scroll = header.parentElement
          while (scroll && !(scroll.scrollHeight > scroll.clientHeight && /auto|scroll/.test(getComputedStyle(scroll).overflowY))) scroll = scroll.parentElement
          if (!scroll) throw new Error('No scrollable settings ancestor')
          const style = getComputedStyle(header)
          const before = header.getBoundingClientRect().top
          const original = scroll.scrollTop
          scroll.scrollTop = original + 240
          await delay(250)
          if (disposed) return
          const after = header.getBoundingClientRect().top
          const distance = scroll.scrollTop - original
          const evidence = { position: style.position, background: style.backgroundColor, fade: getComputedStyle(header, '::before').display, before, after, distance }
          if (style.position !== 'relative' || distance < 50 || Math.abs(before - after - distance) > 2) throw new Error(JSON.stringify(evidence))
          console.info('GLASS_SURFACES PASS', JSON.stringify(evidence))
          return
        }
        if (!disposed) throw new Error('Settings header not mounted')
      } catch (error) { console.error('GLASS_SURFACES FAIL', String(error)) }
    })()
    return () => { disposed = true; for (const id of timers) window.clearTimeout(id); cleanup?.() }
  },
})
