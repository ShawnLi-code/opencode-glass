import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'
export default Plugin.define({ ...plugin,
  main(ctx) {
    plugin.main?.(ctx)
    const saved = ctx.windows.list().map((win) => ({ win, throttle: win.webContents.getBackgroundThrottling() }))
    saved.forEach(({ win }) => win.webContents.setBackgroundThrottling(false))
    return () => saved.forEach(({ win, throttle }) => { if (!win.isDestroyed()) win.webContents.setBackgroundThrottling(throttle) })
  },
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    const timer = window.setTimeout(() => {
      const describe = (el: Element) => ({ tag: el.tagName, attrs: Object.fromEntries(Array.from(el.attributes).filter((a) => /^(data-|role$|class$|aria-label$)/.test(a.name)).map((a) => [a.name,a.value])), background: getComputedStyle(el).backgroundColor })
      const buttons = Array.from(document.querySelectorAll('button[data-titlebar-tab-action],[data-slot=session-header-gap]'))
      console.info('GLASS_PALETTE_INSPECT', JSON.stringify({
        nav: buttons.map((el) => { const parents = []; for(let p: Element | null = el, i=0; p && i<5; p=p.parentElement,i++) parents.push(describe(p)); return parents }),
        bars: Array.from(document.querySelectorAll('[data-slot],[data-component],header')).filter((el) => /titlebar|header|sidebar|vertical-tabs/.test(`${el.getAttribute('data-slot')} ${el.getAttribute('data-component')}`) || el.tagName === 'HEADER').slice(0,45).map(describe),
      }))
    }, 700)
    return () => { window.clearTimeout(timer); cleanup?.() }
  },
})
