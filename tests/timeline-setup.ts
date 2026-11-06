import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    ctx.layout.settings('general')
    const timer = window.setTimeout(() => {
      const label = ctx.t('settings.timeline.detail')
      const matches = Array.from(document.querySelectorAll('span,label,h3,h4,p,div'))
        .filter((el) => el.textContent?.trim() === label && el.children.length === 0 && el.checkVisibility())
      for (const el of matches.slice(0, 1)) {
        let container = el.parentElement
        for (let i = 0; container && i < 3; i++, container = container.parentElement) {
          console.info('GLASS_TIMELINE_SETUP', JSON.stringify({ label, level: i,
            controls: Array.from(container.querySelectorAll('button,[role=combobox],select')).map((b) => ({
              tag: b.tagName, role: b.getAttribute('role'), label: b.getAttribute('aria-label'),
              text: b.textContent?.trim().slice(0, 80),
            })),
          }))
        }
      }
      if (!matches.length) console.info('GLASS_TIMELINE_SETUP no visible setting found', label)
    }, 1000)
    return () => { window.clearTimeout(timer); cleanup?.() }
  },
})
