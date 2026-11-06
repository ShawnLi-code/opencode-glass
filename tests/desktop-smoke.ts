import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"

// Opt-in entry only. Rebuild the production entry after the test finishes.
// Exercise the real host command and reactive store; restore the initial state.
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    if (!plugin.setup) throw new Error("Production plugin has no window setup")
    const cleanup = plugin.setup(ctx)
    const initial = ctx.stores.prefs.value.enabled
    let stopped = false
    const timers = new Set<number>()
    const delay = (ms: number) => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, ms)
      timers.add(timer)
    })
    const snapshot = () => ({
      enabled: ctx.stores.prefs.value.enabled,
      canvas: document.querySelectorAll("[data-glass-aurora]").length,
      veil: document.querySelectorAll("[data-glass-veil]").length,
      grain: document.querySelectorAll("[data-glass-grain]").length,
      styles: Array.from(document.querySelectorAll("style[data-plugin]"))
        .filter((el) => el.getAttribute("data-plugin") === ctx.id).length,
    })
    const check = async (enabled: boolean, label: string) => {
      for (let attempt = 0; attempt < 50 && !stopped; attempt++) {
        const state = snapshot()
        const count = enabled ? 1 : 0
        if (state.enabled === enabled && state.canvas === count && state.veil === count &&
          state.grain === count && state.styles === count) {
          console.info("GLASS_SWITCH_TEST PASS", label, JSON.stringify(state))
          return
        }
        await delay(100)
      }
      throw new Error(`${label}: ${JSON.stringify(snapshot())}`)
    }
    void (async () => {
      try {
        await delay(1000)
        if (stopped) return
        await check(initial, "initial")
        for (let cycle = 1; cycle <= 3 && !stopped; cycle++) {
          if (!ctx.commands.run(`${ctx.id}.toggle`)) throw new Error("toggle command unavailable")
          await check(!initial, `cycle ${cycle} toggled`)
          if (stopped) return
          if (!ctx.commands.run(`${ctx.id}.toggle`)) throw new Error("toggle command unavailable")
          await check(initial, `cycle ${cycle} restored`)
        }
        if (!stopped) console.info("GLASS_SWITCH_TEST COMPLETE")
      } catch (error) {
        console.error("GLASS_SWITCH_TEST FAIL", String(error))
      } finally {
        if (!stopped) ctx.stores.prefs.update((draft) => { draft.enabled = initial })
      }
    })()
    return () => {
      stopped = true
      for (const timer of timers) window.clearTimeout(timer)
      ctx.stores.prefs.update((draft) => { draft.enabled = initial })
      cleanup?.()
    }
  },
})
