import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"

// Real SettingsPage controls, mounted by the real desktop host. Opt-in only.
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    if (!plugin.setup) throw new Error("Missing production setup")
    const cleanup = plugin.setup(ctx)
    const initial = ctx.stores.prefs.value.enabled
    let stopped = false
    const timers = new Set<number>()
    const delay = (ms: number) => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, ms)
      timers.add(timer)
    })
    const waitFor = async (label: string, predicate: () => boolean) => {
      for (let attempt = 0; attempt < 80 && !stopped; attempt++) {
        if (predicate()) { console.info("GLASS_SETTINGS_TEST PASS", label); return }
        await delay(100)
      }
      throw new Error(`${label} timed out${stopped ? " (disposed)" : ""}`)
    }
    const root = () => document.querySelector<HTMLElement>("[data-glass-settings]")
    const visible = () => {
      const el = root()
      const rect = el?.getBoundingClientRect()
      return !!el && el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }) &&
        !!rect && rect.width > 0 && rect.height > 0
    }
    const control = () => root()?.querySelector<HTMLElement>(
      '[data-glass-setting="enabled"] [role="switch"], [data-glass-setting="enabled"] input[type="checkbox"]',
    )
    const checked = () => {
      const el = control()
      return el instanceof HTMLInputElement ? el.checked : el?.getAttribute("aria-checked") === "true"
    }
    const canvasCount = () => document.querySelectorAll("[data-glass-aurora]").length
    const styleCount = () => Array.from(document.querySelectorAll("style[data-plugin]"))
      .filter((el) => el.getAttribute("data-plugin") === ctx.id).length
    const checkState = (value: boolean) => ctx.stores.prefs.value.enabled === value &&
      checked() === value && canvasCount() === (value ? 1 : 0) && styleCount() === (value ? 1 : 0)

    void (async () => {
      try {
        await delay(1000)
        if (stopped) return
        ctx.layout.settings("glass")
        await waitFor("settings visible: all eight rows", () => visible() && root()?.querySelectorAll("[data-glass-setting]").length === 8)
        await waitFor("initial switch matches stored preference", () => !!control() && checkState(initial))
        control()!.click()
        await waitFor("real Settings switch click toggles preference and layers", () => checkState(!initial))
        ctx.layout.settings("general")
        await waitFor("left glass settings", () => !root())
        ctx.layout.settings("glass")
        await waitFor("reopened visible settings keeps toggled state", () => visible() && !!control() && checkState(!initial))
        control()!.click()
        await waitFor("real Settings switch restores initial state", () => checkState(initial))
        if (!ctx.commands.run(`${ctx.id}.toggle`)) throw new Error("Toggle command missing")
        await waitFor("mounted Settings switch reacts to command change", () => checkState(!initial))
        if (!ctx.commands.run(`${ctx.id}.toggle`)) throw new Error("Toggle command missing")
        await waitFor("mounted Settings switch reacts to command restore", () => checkState(initial))
        ctx.layout.settings("glass")
        await waitFor("final settings visible for inspection", () => visible() && checkState(initial))
        if (!stopped) console.info("GLASS_SETTINGS_TEST COMPLETE", JSON.stringify({
          enabled: ctx.stores.prefs.value.enabled, checked: checked(), canvas: canvasCount(), styles: styleCount(),
        }))
      } catch (error) {
        console.error("GLASS_SETTINGS_TEST FAIL", String(error))
        console.info("GLASS_SETTINGS_TEST diagnostic", JSON.stringify({
          rows: root()?.querySelectorAll("[data-glass-setting]").length,
          control: control()?.outerHTML, enabled: ctx.stores.prefs.value.enabled,
        }))
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
