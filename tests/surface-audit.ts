import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'

// Opt-in, bounded inspection. Does not navigate or change user preferences.
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    const timers = new Set<number>()
    const inspect = (round: number) => {
      const selectors = ['[data-slot=titlebar-v2]', '[data-session-title]', '[data-session-title] > .pointer-events-auto', '.session-header-fade', '[data-glass-timeline-clip]', '.settings-tab-header', '.home-session-group-header', '[data-slot=home-panel]', '#review-panel']
      const records = selectors.flatMap((selector) => Array.from(document.querySelectorAll<HTMLElement>(selector)).filter((el) => el.checkVisibility()).map((el) => {
        const css = getComputedStyle(el), box = el.getBoundingClientRect()
        return { selector, background: css.background, shadow: css.boxShadow, filter: css.backdropFilter, clip: css.clipPath, rect: [box.x, box.y, box.width, box.height], before: getComputedStyle(el, '::before').background, after: getComputedStyle(el, '::after').background }
      }))
      console.info('GLASS_SURFACE_AUDIT', JSON.stringify(records))
      if (round === 1) {
        const bar = document.querySelector<HTMLElement>('[data-slot=titlebar-v2]')
        const chain = []
        for (let el = bar; el && chain.length < 5; el = el.parentElement) chain.push({ tag: el.tagName, class: el.className, style: el.getAttribute('style') })
        console.info('GLASS_TITLEBAR_CHAIN', JSON.stringify(chain))
      }
      const title = document.querySelector<HTMLElement>('[data-session-title]')
      const viewport = title?.closest('.scroll-view__viewport')
      console.info('GLASS_SURFACE_STRUCTURE', JSON.stringify({ viewport: viewport?.className, children: Array.from(viewport?.children ?? []).map((el) => ({ tag: el.tagName, class: el.className, style: el.getAttribute('style'), attributes: Array.from(el.attributes).filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value]), children: Array.from(el.children).slice(0, 3).map((child) => ({ class: child.className, style: child.getAttribute('style') })) })) }))
      const fixture = document.createElement('div')
      fixture.className = 'bg-v2-background-bg-deep'
      fixture.setAttribute('data-glass-layout-owned', '')
      fixture.setAttribute('aria-hidden', 'true')
      fixture.style.cssText = 'position:fixed;left:-20000px;top:0;width:320px;height:240px;overflow:hidden;pointer-events:none;opacity:0'
      fixture.innerHTML = `
        <header data-slot="titlebar-v2" class="relative bg-v2-background-bg-deep"></header>
        <div data-slot="session-chat-panel">
          <div data-session-title><div class="pointer-events-auto bg-v2-background-bg-base"><div class="min-w-0"><div class="session-header-layout"></div></div></div></div>
          <div class="session-header-fade"></div><div data-glass-timeline-clip></div>
        </div>
        <div data-slot="home-panel"><div data-home-row></div><div data-home-row data-selected></div><div data-slot="home-sessions-list"><div class="home-session-group-header sticky bg-v2-background-bg-base"></div></div></div>
        <div class="settings-screen"><div class="settings-tab-header bg-v2-background-bg-base"></div></div>
        <div data-component="menu-v2-content" class="bg-v2-background-bg-base"><div class="bg-v2-background-bg-base"></div></div>
        <div role="dialog" class="bg-v2-background-bg-base"></div>`
      const checks: string[] = []
      try {
        document.getElementById('root')!.append(fixture)
        const element = (selector: string) => fixture.querySelector<HTMLElement>(selector)!
        const css = (selector: string) => getComputedStyle(element(selector))
        const check = (name: string, valid: boolean) => { if (!valid) throw new Error(name); checks.push(name) }
        check('titlebar material survives shell fallback', css('[data-slot=titlebar-v2]').backgroundImage !== 'none')
        check('session title material survives shell fallback', css('[data-session-title] > div').backgroundImage !== 'none')
        check('clipped session has no painted fade', css('.session-header-fade').backgroundImage === 'none')
        element('[data-glass-timeline-clip]').remove()
        check('unknown timeline keeps fallback fade', css('.session-header-fade').backgroundImage !== 'none')
        check('home unselected row stays transparent', css('[data-home-row]').backgroundColor === 'rgba(0, 0, 0, 0)')
        check('home selected row remains visible', css('[data-home-row][data-selected]').backgroundColor !== 'rgba(0, 0, 0, 0)')
        check('home group title scrolls', css('.home-session-group-header').position === 'relative')
        check('home caps and fade remain absent', ['::before', '::after'].every((pseudo) => getComputedStyle(element('.home-session-group-header'), pseudo).display === 'none'))
        check('settings title scrolls without fill', css('.settings-tab-header').position === 'relative' && css('.settings-tab-header').backgroundColor === 'rgba(0, 0, 0, 0)')
        check('menu root retains material', css('[data-component=menu-v2-content]').backgroundColor !== 'rgba(0, 0, 0, 0)')
        check('menu child retains native fill', css('[data-component=menu-v2-content] > div').backgroundColor !== 'rgba(0, 0, 0, 0)')
        check('dialog root retains native fill', css('[role=dialog]').backgroundColor !== 'rgba(0, 0, 0, 0)')
        const liveBar = document.querySelector<HTMLElement>('[data-slot=titlebar-v2]')
        check('real desktop titlebar retains material', !!liveBar && getComputedStyle(liveBar).backgroundImage !== 'none')
        const livePane = Array.from(document.querySelectorAll<HTMLElement>('[data-slot=session-chat-panel]')).find((pane) => !fixture.contains(pane) && pane.querySelector('[data-glass-timeline-clip]'))
        if (livePane) {
          const fade = livePane.querySelector<HTMLElement>('.session-header-fade')
          const header = livePane.querySelector<HTMLElement>('[data-session-title] > .pointer-events-auto')
          check('real clipped session has no fade or shadow', !!fade && getComputedStyle(fade).backgroundImage === 'none' && getComputedStyle(fade).boxShadow === 'none')
          check('real session title retains material', !!header && getComputedStyle(header).backgroundImage !== 'none')
          const content = livePane.querySelector<HTMLElement>('[data-glass-timeline-clip]')!
          const edge = content.getBoundingClientRect().top + parseFloat(content.style.getPropertyValue('--glass-header-cut'))
          check('real timeline remains clipped below the title', !!header && edge >= header.getBoundingClientRect().bottom - 1)
        }
        console.info('GLASS_CASCADE PASS', JSON.stringify({ round, checks }))
      } catch (error) { console.error('GLASS_CASCADE FAIL', JSON.stringify({ round, checks, error: String(error) })) }
      finally { fixture.remove() }
    }
    for (let round = 1; round <= 3; round++) {
      const timer = window.setTimeout(() => { timers.delete(timer); inspect(round) }, round * 700)
      timers.add(timer)
    }
    return () => { for (const timer of timers) window.clearTimeout(timer); cleanup?.() }
  },
})
