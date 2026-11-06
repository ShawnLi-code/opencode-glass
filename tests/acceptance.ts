import { Ipc, Plugin } from '@opencode/plugin/gui'
import { Schema } from 'effect'
import plugin from '../src/gui'
declare const __GLASS_AUDIT_EXTENDED__: boolean
declare const __GLASS_AUDIT_PERF__: boolean
export const Audit = Ipc.define({ id: 'opencode-glass.acceptance', methods: {
  control: { input: Schema.String, output: Schema.String },
} })
export default Plugin.define({ ...plugin,
  main(ctx) {
    plugin.main?.(ctx)
    const output = async (name: string) => {
      const fs = await import('node:fs/promises'), { join, dirname } = await import('node:path'), { tmpdir } = await import('node:os')
      const file = join(process.env.GLASS_TEST_OUTPUT_DIR || join(tmpdir(), 'opencode-glass-tests'), name)
      await fs.mkdir(dirname(file), { recursive: true })
      return file
    }
    const saved = new Map<number, { bounds: any; maximized: boolean; zoom: number; throttling: boolean }>()
    const attached = new Set<any>()
    ctx.provide(Audit, { async control(raw, caller) {
      const input = JSON.parse(raw), win = ctx.windows.get(caller.window)!
      const wc = win.webContents
      if (!saved.has(caller.window)) saved.set(caller.window, { bounds: win.getNormalBounds(), maximized: win.isMaximized(), zoom: wc.getZoomFactor(), throttling: wc.getBackgroundThrottling() })
      if (input.op === 'info') { wc.setBackgroundThrottling(false); return JSON.stringify({ window: caller.window, url: wc.getURL(), bounds: win.getBounds(), zoom: wc.getZoomFactor(), originalThrottling: saved.get(caller.window)!.throttling }) }
      if (input.op === 'palette-checkpoint') {
        const fs = await import('node:fs/promises')
        const path = await output('glass-palette-checkpoint.json')
        if ('value' in input) { await fs.writeFile(path, JSON.stringify(input.value, null, 2)); return '{}' }
        try { return await fs.readFile(path, 'utf8') } catch (e: any) { if (e.code === 'ENOENT') return 'null'; throw e }
      }
      if (input.op === 'resize') { if (win.isMaximized()) win.unmaximize(); win.setSize(input.width, input.height); return '{}' }
      if (input.op === 'zoom') { wc.setZoomFactor(input.value); return '{}' }
      if (input.op === 'minimize') { win.minimize(); return '{}' }
      if (input.op === 'restore') { win.restore(); return '{}' }
      if (input.op === 'minimize-cycle') {
        // Disabling Electron background throttling also suppresses its Page
        // Visibility changes, so restore normal host behavior for this check.
        wc.setBackgroundThrottling(true)
        win.minimize()
        const { setTimeout } = await import('node:timers/promises')
        await setTimeout(1800)
        win.restore()
        wc.setBackgroundThrottling(false)
        return '{}'
      }
      if (input.op === 'metrics') {
        // Electron is provided by the actual desktop host; no new test dependency.
        // @ts-expect-error The package supplies Electron at runtime, not local typings.
        const { app } = await import('electron')
        return JSON.stringify({ gpu: app.getGPUFeatureStatus(), processes: app.getAppMetrics().filter((p: any) => p.pid === wc.getOSProcessId() || p.type === 'GPU').map((p: any) => ({ type: p.type, pid: p.pid, cpu: p.cpu, memory: p.memory })) })
      }
      if (input.op === 'report') {
        const fs = await import('node:fs/promises')
        await fs.writeFile(await output('glass-acceptance-results.json'), JSON.stringify(input.value, null, 2))
        return '{}'
      }
      if (input.op === 'capture') {
        const fs = await import('node:fs/promises')
        await fs.writeFile(await output(`oc-ui-shots/acceptance-${String(input.name).replace(/[^a-z0-9-]/g, '')}.png`), (await wc.capturePage()).toPNG())
        return '{}'
      }
      if (input.op === 'cdp') {
        if (!attached.has(wc)) { if (wc.debugger.isAttached()) throw new Error('Debugger already attached; refusing to displace it'); wc.debugger.attach('1.3'); attached.add(wc) }
        return JSON.stringify(await wc.debugger.sendCommand(input.method, input.params ?? {}))
      }
      if (input.op === 'reset') {
        if (attached.has(wc)) {
          await wc.debugger.sendCommand('Emulation.setEmulatedMedia', { features: [] })
          await wc.debugger.sendCommand('Emulation.clearDeviceMetricsOverride')
          wc.debugger.detach(); attached.delete(wc)
        }
        const s = saved.get(caller.window)!
        wc.setBackgroundThrottling(s.throttling); wc.setZoomFactor(s.zoom); win.restore(); win.setBounds(s.bounds); if (s.maximized) win.maximize()
        return '{}'
      }
      throw new Error('Unknown acceptance operation')
    } })
    return () => {
      for (const wc of attached) if (!wc.isDestroyed()) { void wc.debugger.sendCommand('Emulation.setEmulatedMedia', { features: [] }); void wc.debugger.sendCommand('Emulation.clearDeviceMetricsOverride'); wc.debugger.detach() }
      for (const [id, s] of saved) { const win = ctx.windows.get(id); if (!win || win.isDestroyed()) continue; win.webContents.setBackgroundThrottling(s.throttling); win.webContents.setZoomFactor(s.zoom); win.restore(); win.setBounds(s.bounds); if (s.maximized) win.maximize() }
    }
  },
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    const initial = { ...ctx.stores.prefs.value }
    let stopped = false, phase = 'setup', originalTheme = '', originalMode = ''
    const timers = new Set<number>()
    const result: any = { started: new Date().toISOString(), initialPrefs: initial, checks: [], themes: [], layouts: [], performance: [], errors: [] }
    const call = async (input: object) => JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
    const cdp = (method: string, params?: object) => call({ op: 'cdp', method, params })
    const delay = (ms: number) => new Promise<void>((resolve) => { const t = window.setTimeout(() => { timers.delete(t); resolve() }, ms); timers.add(t) })
    const wait = async (label: string, check: () => boolean) => {
      const end = performance.now() + 20000
      while (!stopped && performance.now() < end) { if (check()) return; await delay(100) }
      throw new Error(label)
    }
    const pass = (label: string, data?: unknown) => { result.checks.push({ label, data }); console.info('GLASS_ACCEPTANCE PASS', label, data ? JSON.stringify(data) : '') }
    const error = (event: ErrorEvent) => { result.errors.push({ phase, message: event.message, time: performance.now() }) }
    window.addEventListener('error', error)
    const prefs = (value: Partial<typeof initial>) => ctx.stores.prefs.update((p) => { Object.assign(p, value) })
    const controls = () => Array.from(document.querySelectorAll<HTMLElement>('[role=tabpanel] [id^=select-][id$=-trigger]'))
    const pointer = (el: HTMLElement) => { el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse', pointerId: 1 })); el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse', pointerId: 1 })) }
    const escape = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }))
    const appearance = async () => { ctx.layout.settings('appearance'); await wait('appearance native selectors', () => controls().length >= 4) }
    const back = async () => {
      Array.from(document.querySelectorAll<HTMLElement>('button')).find((b) => b.getAttribute('aria-label') === '返回应用' || b.textContent?.trim() === '返回应用')?.click()
      await wait('session composer visible', () => !!document.querySelector<HTMLElement>('[data-component=composer]')?.checkVisibility())
    }
    const openSelect = async (index: number) => {
      escape()
      const el = controls()[index]
      if (!el) throw new Error(`No native select ${index}`)
      pointer(el)
      await delay(100)
      if (!document.querySelector('[role=option]')) el.click()
      await wait('native select options', () => !!document.querySelector('[role=option]'))
      return Array.from(document.querySelectorAll<HTMLElement>('[role=option]'))
    }
    const choose = async (index: number, label: string) => {
      if (controls()[index]?.textContent?.trim() === label) return
      const options = await openSelect(index), option = options.find((o) => o.textContent?.trim() === label)
      if (!option) throw new Error(`Missing option ${label}`)
      option.click()
      await wait(`selected ${label}`, () => controls()[index]?.textContent?.trim() === label)
      escape()
    }
    const snapshot = () => {
      const list = Array.from(document.querySelectorAll<HTMLElement>('[data-glass-activity-header],[data-glass-model-toggle],[data-glass-vitals],[data-component=composer]')).filter((el) => el.checkVisibility())
      return { width: innerWidth, height: innerHeight, dpr: devicePixelRatio, mode: ctx.appearance.mode(),
        rootOverflow: document.documentElement.scrollWidth - innerWidth,
        elements: list.map((el) => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return { kind: el.hasAttribute('data-glass-activity-header') ? 'activity' : el.hasAttribute('data-glass-model-toggle') ? 'model' : el.hasAttribute('data-glass-vitals') ? 'vitals' : 'composer', x: r.x, y: r.y, w: r.width, h: r.height, overflow: el.scrollWidth - el.clientWidth, color: s.color, background: s.backgroundColor, blur: s.backdropFilter } }) }
    }
    const layoutCheck = (name: string, baselineRootOverflow = 0) => {
      const s = snapshot(); result.layouts.push({ name, ...s })
      const bad = s.elements.filter((e) => e.x < -2 || e.x + e.w > innerWidth + 2 || (e.kind === 'activity' && e.overflow > 2))
      if (s.rootOverflow > Math.max(2, baselineRootOverflow + 2) || bad.length) throw new Error(`Layout overflow ${name}: root=${s.rootOverflow}, baseline=${baselineRootOverflow}, ${JSON.stringify(bad)}`)
      if (baselineRootOverflow > 2) result.layouts.at(-1).hostBaselineRootOverflow = baselineRootOverflow
      pass(`layout ${name}`, { width: s.width, dpr: s.dpr, elements: s.elements.length })
    }
    const metrics = async () => {
      const data = await cdp('Performance.getMetrics')
      return Object.fromEntries(data.metrics.map((m: any) => [m.name, m.value])) as Record<string, number>
    }
    const sample = async (name: string, seconds: number) => {
      phase = name
      await delay(1500)
      const before = await metrics(), start = performance.now(), wallStart = Date.now(), processBefore = await call({ op: 'metrics' })
      const canvas = document.querySelector<HTMLCanvasElement>('[data-glass-aurora]'), context = canvas?.getContext('2d'), clear = context?.clearRect
      let draws = 0
      if (context && clear) context.clearRect = function (...args) { draws++; return clear.apply(this, args) }
      try { await delay(seconds * 1000) } finally { if (context && clear) context.clearRect = clear }
      const after = await metrics(), processAfter = await call({ op: 'metrics' }), elapsed = (performance.now() - start) / 1000
      const data = { name, wallStart, wallEnd: Date.now(), elapsed, canvasDraws: draws, canvasFPS: draws / elapsed, taskSeconds: after.TaskDuration - before.TaskDuration, layoutSeconds: after.LayoutDuration - before.LayoutDuration, layouts: after.LayoutCount - before.LayoutCount, heapMB: after.JSHeapUsedSize / 1048576, nodes: after.Nodes, processBefore, processAfter,
        resizeErrors: result.errors.filter((e: any) => e.phase === name && /ResizeObserver/.test(e.message)).length }
      result.performance.push(data); pass(`performance sample ${name}`, data)
    }
    const run = async () => {
      try {
        result.environment = await call({ op: 'info' })
        await delay(1000)
        await cdp('Performance.enable')
        // Native theme choices are enumerated, never guessed or edited in storage.
        phase = 'themes'
        await appearance()
        originalMode = controls()[0].textContent!.trim(); originalTheme = controls()[1].textContent!.trim()
        const options = await openSelect(1), themes = options.map((o) => o.textContent!.trim()).filter(Boolean)
        escape()
        result.availableThemes = themes
        result.originalAppearance = { theme: originalTheme, mode: originalMode }
        result.scope = __GLASS_AUDIT_PERF__ ? 'performance-and-visibility-rerun' : __GLASS_AUDIT_EXTENDED__ ? 'extended-rerun-with-original-theme' : 'all-native-themes'
        await call({ op: 'report', value: result })
        console.info('GLASS_ACCEPTANCE THEMES', JSON.stringify({ themes, originalMode, originalTheme }))
        for (const theme of (__GLASS_AUDIT_PERF__ ? [] : __GLASS_AUDIT_EXTENDED__ ? [originalTheme] : themes)) for (const mode of ['深色', '浅色']) {
          await appearance(); await choose(1, theme); await choose(0, mode)
          await wait('mode reactive update', () => ctx.appearance.mode() === (mode === '浅色' ? 'light' : 'dark'))
          await back(); await delay(700)
          const s = snapshot(); result.themes.push({ theme, modeLabel: mode, ...s })
          if (!s.elements.some((e) => e.kind === 'composer')) throw new Error('Composer absent in theme')
          await call({ op: 'capture', name: `theme-${themes.indexOf(theme)}-${mode === '浅色' ? 'light' : 'dark'}` })
          pass(`theme ${theme} / ${mode}`)
        }
        await appearance(); await choose(1, originalTheme); await choose(0, originalMode); await back()
        phase = 'viewport'
        for (const width of (__GLASS_AUDIT_PERF__ ? [] : [1600, 1280, 1024, 800])) {
          await call({ op: 'resize', width, height: 900 }); await delay(1000); layoutCheck(`window-${width}`)
          await call({ op: 'capture', name: `width-${width}` })
        }
        await call({ op: 'resize', width: 1600, height: 900 })
        for (const zoom of (__GLASS_AUDIT_PERF__ ? [] : [0.8, 1, 1.25, 1.5, 2])) {
          await call({ op: 'zoom', value: zoom }); await delay(1000); layoutCheck(`zoom-${zoom}`)
          await call({ op: 'capture', name: `zoom-${String(zoom).replace('.', '-')}` })
        }
        await call({ op: 'zoom', value: 1 })
        await delay(1000)
        await call({ op: 'resize', width: 1280, height: 800 })
        await delay(700)
        for (const dpr of (__GLASS_AUDIT_PERF__ ? [] : [1, 1.25, 1.5, 2])) {
          await cdp('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: dpr, mobile: false })
          await delay(1000)
          prefs({ enabled: false }); await delay(500)
          const baseline = snapshot().rootOverflow
          prefs({ enabled: true }); await delay(700)
          layoutCheck(`dpr-${dpr}`, baseline)
          await call({ op: 'capture', name: `dpr-${String(dpr).replace('.', '-')}` })
          const canvas = document.querySelector<HTMLCanvasElement>('[data-glass-aurora]')
          if (canvas && canvas.width > 1280) throw new Error('Canvas exceeds budget')
        }
        await cdp('Emulation.clearDeviceMetricsOverride')
        prefs({ enabled: true, motion: true, background: true })
        phase = 'reduced-motion'
        await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
        await wait('real reduced-motion pause flag', () => document.documentElement.hasAttribute('data-glass-paused'))
        const canvas = document.querySelector<HTMLCanvasElement>('[data-glass-aurora]')!, context = canvas.getContext('2d')!, method = context.clearRect
        let draws = 0
        context.clearRect = function (...args) { draws++; return method.apply(this, args) }
        try { await delay(200); const start = draws; await delay(1000); if (draws !== start) throw new Error('Reduced motion still draws'); pass('real Chromium reduced-motion stops canvas') }
        finally { context.clearRect = method }
        await cdp('Emulation.setEmulatedMedia', { features: [] })
        await wait('reduced-motion reset', () => !document.documentElement.hasAttribute('data-glass-paused'))
        const visibility: { hidden: boolean; paused: boolean }[] = []
        const recordVisibility = () => visibility.push({ hidden: document.hidden, paused: document.documentElement.hasAttribute('data-glass-paused') })
        document.addEventListener('visibilitychange', recordVisibility)
        let hiddenDraws = 0
        const realClear = context.clearRect
        context.clearRect = function (...args) { if (document.hidden) hiddenDraws++; return realClear.apply(this, args) }
        try { await call({ op: 'minimize-cycle' }); await wait('window visible again', () => !document.hidden) }
        finally { document.removeEventListener('visibilitychange', recordVisibility); context.clearRect = realClear }
        if (!visibility.some((v) => v.hidden && v.paused) || hiddenDraws) throw new Error(`Minimize pause failed ${JSON.stringify({ visibility, hiddenDraws })}`)
        pass('actual minimized window pauses animations and canvas', { visibility, hiddenDraws })
        prefs({ motion: false }); await delay(200)
        const summary = document.querySelector<HTMLElement>('[data-glass-activity-header][aria-expanded=false]')
        if (summary) {
          summary.click(); await delay(150)
          const row = summary.nextElementSibling!
          if (getComputedStyle(row).opacity !== '1' || getComputedStyle(row).animationName !== 'none') throw new Error('Paused new row remains dim/animated')
          pass('newly expanded row is fully opaque with motion OFF')
          summary.click()
        }
        // Same-window A/B samples: other live sessions can still affect process metrics.
        prefs({ enabled: false }); await sample('off', 15)
        prefs({ enabled: true, motion: false }); await sample('static', 15)
        prefs({ motion: true }); await sample('motion', 60)
        prefs({ enabled: false }); await sample('off-repeat', 15)
        result.finished = new Date().toISOString()
        console.info('GLASS_ACCEPTANCE COMPLETE')
      } catch (e) { result.failure = String(e); console.error('GLASS_ACCEPTANCE FAIL', String(e)) }
      finally {
        phase = 'restore'
        try { if (originalTheme) { await appearance(); await choose(1, originalTheme); await choose(0, originalMode); await back() } } catch (e) { result.restoreFailure = String(e) }
        prefs(initial)
        try { await call({ op: 'reset' }) } catch (e) { result.resetFailure = String(e) }
        window.removeEventListener('error', error)
        await call({ op: 'report', value: result })
        console.info('GLASS_ACCEPTANCE SAVED')
      }
    }
    void run()
    return () => { stopped = true; timers.forEach(window.clearTimeout); window.removeEventListener('error', error); prefs(initial); cleanup?.() }
  },
})
