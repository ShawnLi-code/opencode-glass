import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup = plugin.setup?.(ctx)
  let stopped = false
  const timers = new Set<number>()
  const delay = () => new Promise<void>((resolve) => { const t = window.setTimeout(() => { timers.delete(t); resolve() }, 100); timers.add(t) })
  const describe = (el: Element) => {
    const css = getComputedStyle(el), r = el.getBoundingClientRect()
    return { tag: el.tagName, attrs: Object.fromEntries(Array.from(el.attributes).filter((a) => /^(data-|role$|class$)/.test(a.name)).map((a) => [a.name,a.value])),
      background: css.backgroundColor, image: css.backgroundImage, blur: css.backdropFilter, position: css.position, z: css.zIndex, overflow: css.overflow, filter: css.filter,
      box: { x:r.x,y:r.y,w:r.width,h:r.height } }
  }
  const parents = (el: Element | null) => { const rows = []; for (let i=0;el && i<10;el=el.parentElement,i++) rows.push(describe(el)); return rows }
  const call = async (input: object) => JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  void (async () => { try {
    await call({ op: 'info' })
    const tab = document.querySelector('[role=tab][aria-selected=true]')?.id.match(/-trigger-(.+)$/)?.[1]
    ctx.layout.settings('glass')
    let until=performance.now()+10000
    while(!stopped && performance.now()<until && !document.querySelector<HTMLElement>('[data-glass-settings]')?.checkVisibility()) await delay()
    const other = Array.from(document.querySelectorAll('[role=tab]')).find((el) => el.textContent?.trim() === 'Antigravity')?.id.match(/-trigger-(.+)$/)?.[1]
    if (other) {
      ctx.layout.settings(other); until=performance.now()+10000
      while(!stopped && performance.now()<until && !Array.from(document.querySelectorAll('[role=tab][aria-selected=true]')).some((el) => el.id.endsWith(`-trigger-${other}`))) await delay()
    }
    const panels = Array.from(document.querySelectorAll('[role=tabpanel]')).filter((el) => el.checkVisibility())
    console.info('GLASS_MATERIAL_INSPECT SETTINGS', JSON.stringify({ tab, path: ctx.router.path(), panels: panels.map(parents),
      surfaces: panels.flatMap((panel) => Array.from(panel.querySelectorAll('*')).filter((el) => { const r=el.getBoundingClientRect();return r.width*r.height>6000 && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)' }).slice(0,25).map(describe)) }))
    await call({ op: 'capture', name: 'material-before-settings' })
    Array.from(document.querySelectorAll<HTMLElement>('button')).find((b) => b.checkVisibility() && (b.getAttribute('aria-label')==='返回应用' || b.textContent?.trim()==='返回应用'))?.click()
    const end=performance.now()+10000
    while(!stopped && performance.now()<end && !document.querySelector('[data-glass-model-toggle]')) await delay()
    console.info('GLASS_MATERIAL_INSPECT CHAT', JSON.stringify({
      header: parents(document.querySelector('.session-header-layout')),
      timeline: parents(document.querySelector('[data-component=context-tool-group-list]')),
      code: parents(document.querySelector('[data-slot=basic-tool-tool-subtitle]')),
      scrolls: Array.from(document.querySelectorAll('[data-slot]')).filter((el) => /scroll|timeline/.test(el.getAttribute('data-slot') ?? '')).slice(-20).map(describe),
    }))
    await call({ op: 'capture', name: 'material-before-chat' })
    if (tab) ctx.layout.settings(tab)
  } catch(e) { console.error('GLASS_MATERIAL_INSPECT FAIL',String(e)) }
  finally { await call({ op: 'reset' }) } })()
  return () => { stopped=true;timers.forEach(window.clearTimeout);cleanup?.() }
} })
