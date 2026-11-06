import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup = plugin.setup?.(ctx), original = { ...ctx.stores.prefs.value }
  let stopped = false, phase = 'setup'
  const timers = new Set<number>()
  const data: any = { scope: 'controlled-native-resize-ab', errors: [], phases: [] }
  const error = (e: ErrorEvent) => data.errors.push({ phase, message: e.message, time: Date.now(), width: innerWidth, height: innerHeight })
  window.addEventListener('error', error)
  const call = async (input: object) => JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  const delay = (ms: number) => new Promise<void>((resolve) => { const t = window.setTimeout(() => { timers.delete(t); resolve() }, ms); timers.add(t) })
  const prefs = (value: Partial<typeof original>) => ctx.stores.prefs.update((p) => { Object.assign(p, value) })
  void (async () => { try {
    data.environment = await call({ op: 'info' })
    for (const state of [{ name: 'off-before', enabled: false, motion: true }, { name: 'on-motion', enabled: true, motion: true }, { name: 'on-static', enabled: true, motion: false }, { name: 'off-after', enabled: false, motion: true }]) {
      if (stopped) return
      phase = `${state.name}-settle`; prefs({ enabled: state.enabled, motion: state.motion }); await delay(1200)
      phase = state.name
      const start = Date.now()
      for (let round = 0; round < 3; round++) for (const width of [1280, 800, 1600, 1024, 1600, 800]) { await call({ op: 'resize', width, height: 900 }); await delay(150) }
      await delay(500)
      const result = { name: phase, elapsedMs: Date.now() - start, operations: 18, resizeErrors: data.errors.filter((e: any) => e.phase === phase && /ResizeObserver/.test(e.message)).length }
      data.phases.push(result); console.info('GLASS_RESIZE_AUDIT PHASE', JSON.stringify(result))
    }
    console.info('GLASS_RESIZE_AUDIT COMPLETE')
  } catch (e) { data.failure = String(e); console.error('GLASS_RESIZE_AUDIT FAIL', String(e)) }
  finally { prefs(original); window.removeEventListener('error', error); await call({ op: 'reset' }); await call({ op: 'report', value: data }); console.info('GLASS_RESIZE_AUDIT SAVED') }
  })()
  return () => { stopped = true; timers.forEach(window.clearTimeout); window.removeEventListener('error', error); prefs(original); cleanup?.() }
} })
