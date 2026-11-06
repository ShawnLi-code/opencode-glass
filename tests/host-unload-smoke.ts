import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'
// Opt-in real host GUI switch test. A one-shot disk latch prevents the
// re-enabled test bundle from disabling itself again.
export default Plugin.define({ ...plugin,
  main(ctx) {
    plugin.main?.(ctx)
    void (async () => {
      const fs = await import('node:fs/promises'), { setTimeout: delay } = await import('node:timers/promises')
      const { join } = await import('node:path'), { tmpdir } = await import('node:os')
      const root = process.env.GLASS_TEST_OUTPUT_DIR || join(tmpdir(), 'opencode-glass-tests')
      await fs.mkdir(root, { recursive: true })
      const path = join(root, 'glass-host-unload.json')
      try { await fs.access(path); return } catch {}
      await fs.writeFile(path, JSON.stringify({ status: 'started' }))
      const win = ctx.windows.focused() ?? ctx.windows.list()[0], wc = win!.webContents
      const read = (script: string) => wc.executeJavaScript(`(() => { ${script} })()`)
      const result: any = { status: 'started' }
      try {
        await delay(1800)
        await read(`const tab = Array.from(document.querySelectorAll('[role=tab]')).find(e=>e.textContent.trim()==='插件'); if(!tab) throw new Error('Plugin tab absent'); tab.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,button:0,pointerType:'mouse',pointerId:1})); tab.click();`)
        await delay(700)
        result.inspection = await read(`
          return Array.from(document.querySelectorAll('[role=switch]')).filter(e=>e.checkVisibility()).map(e=>({tag:e.tagName,role:e.getAttribute('role'),label:e.getAttribute('aria-label'),checked:e.getAttribute('aria-checked'),parent:e.parentElement.parentElement.textContent.trim().slice(0,500)}));
        `)
        const toggle = `const toggle = Array.from(document.querySelectorAll('[role=switch]')).find(e=>e.parentElement.parentElement.textContent.includes('opencode-glass')); if(!toggle) throw new Error('Glass GUI switch absent');`
        const inspect = `return { enabled:document.documentElement.hasAttribute('data-glass-enabled'), styles:document.querySelectorAll('style[data-plugin="opencode-glass"]').length, aurora:document.querySelectorAll('[data-glass-aurora]').length, structures:document.querySelectorAll('[data-glass-activity-header],[data-glass-activity-member],[data-glass-model-toggle],[data-glass-native-model],[data-glass-native-metric],[data-glass-vitals]').length };`
        result.before = await read(inspect)
        await read(`${toggle} if(toggle.getAttribute('aria-checked')!=='true') throw new Error('Glass GUI was not initially enabled'); toggle.click();`)
        await delay(900)
        result.off = await read(inspect)
        await fs.writeFile(path, JSON.stringify(result, null, 2))
        if (result.off.enabled || result.off.styles || result.off.aurora || result.off.structures) throw new Error('Host GUI OFF did not clean up')
        await read(`${toggle} if(toggle.getAttribute('aria-checked')==='false') toggle.click();`)
        await delay(1500)
        result.on = await read(inspect)
        if (!result.on.enabled || result.on.styles !== 1 || result.on.aurora !== 1) throw new Error('Host GUI ON did not restore one instance')
        result.status = 'complete'
        ctx.log.write('info', 'GLASS_HOST_UNLOAD COMPLETE', { off: result.off, on: result.on })
      } catch(e) { result.error = String(e)
        // The sole recovery action is re-enabling this plugin's GUI, never
        // touching another plugin or changing the global config file.
        try { await read(`const t=Array.from(document.querySelectorAll('[role=switch]')).find(e=>e.parentElement.parentElement.textContent.includes('opencode-glass')); if(t?.getAttribute('aria-checked')==='false')t.click();`) } catch {}
      }
      await fs.writeFile(path, JSON.stringify(result, null, 2))
    })()
  },
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    ctx.layout.settings('extensions')
    return cleanup
  },
})
