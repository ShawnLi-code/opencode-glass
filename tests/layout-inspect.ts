import { ComposerPill, Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'
export default Plugin.define({ ...plugin, setup(ctx) {
  const cleanup = plugin.setup?.(ctx)
  const timer = window.setTimeout(() => {
    const form = document.querySelector('[data-component=composer]')
    const attrs = (el: Element) => Object.fromEntries(Array.from(el.attributes).filter((a) => /^(data-|role$|aria-|class$)/.test(a.name)).map((a) => [a.name, a.value.slice(0, 180)]))
    if (form) console.info('GLASS_LAYOUT_INSPECT composer', JSON.stringify(Array.from(form.querySelectorAll('button,[data-slot]')).map((el) => ({
      tag: el.tagName, ...attrs(el), text: el.tagName === 'BUTTON' ? el.textContent?.trim().slice(0, 100) : undefined,
    }))))
    console.info('GLASS_LAYOUT_INSPECT pills', JSON.stringify(Array.from(document.querySelectorAll('[data-component],[data-slot]')).filter((el) => /pill/.test(`${el.getAttribute('data-component')} ${el.getAttribute('data-slot')}`)).slice(0, 18).map(attrs)))
    console.info('GLASS_LAYOUT_INSPECT registry', JSON.stringify(ctx.list(ComposerPill).map((p) => ({ id: p.id, menu: !!p.menu }))))
    const session = ctx.sessions.current()
    const messages = session?.server.data.session.message.list(session.id) ?? []
    const parts = messages.flatMap((m) => m.type === 'assistant' ? m.content.filter((p) => p.type === 'tool' || p.type === 'reasoning').slice(0, 2).map((p) => ({
      keys: Object.keys(p), id: 'id' in p ? p.id : undefined, type: p.type, time: 'time' in p ? p.time : undefined,
      status: 'state' in p ? p.state.status : undefined,
    })) : []).slice(-4)
    console.info('GLASS_LAYOUT_INSPECT parts', JSON.stringify(parts))
  }, 800)
  return () => { window.clearTimeout(timer); cleanup?.() }
} })
