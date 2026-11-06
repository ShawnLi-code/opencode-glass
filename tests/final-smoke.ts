import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"

export default Plugin.define({
  ...plugin,
  setup(ctx) {
    if (!plugin.setup) throw new Error("Missing production setup")
    const cleanup = plugin.setup(ctx)
    const initial = { ...ctx.stores.prefs.value }
    let stopped = false
    const timers = new Set<number>()
    let restoreContext: (() => void) | undefined
    const restore = () => ctx.stores.prefs.update((draft) => { Object.assign(draft, initial) })
    const delay = (ms: number) => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, ms)
      timers.add(timer)
    })
    const waitFor = async (label: string, check: () => boolean) => {
      const until = performance.now() + 12000
      while (!stopped && performance.now() < until) {
        if (check()) { console.info("GLASS_FINAL_TEST PASS", label); return }
        await delay(100)
      }
      throw new Error(label)
    }
    const control = (id: string) => document.querySelector<HTMLElement>(
      `[data-glass-setting="${id}"] [role=switch], [data-glass-setting="${id}"] input[type=checkbox]`,
    )
    const checked = (id: string) => {
      const el = control(id)
      return el instanceof HTMLInputElement ? el.checked : el?.getAttribute("aria-checked") === "true"
    }
    const set = async (id: "enabled" | "background" | "grain" | "shimmer" | "motion" | "parallax", value: boolean) => {
      if (checked(id) !== value) control(id)!.click()
      await waitFor(`${id}=${value}: UI/store agree`, () => checked(id) === value && ctx.stores.prefs.value[id] === value)
    }
    const count = (name: string) => document.querySelectorAll(`[data-glass-${name}]`).length
    const style = () => Array.from(document.querySelectorAll("style[data-plugin]"))
      .find((el) => el.getAttribute("data-plugin") === ctx.id)?.textContent ?? ""
    void (async () => {
      try {
        await delay(1000)
        if (stopped) return
        ctx.layout.settings("glass")
        await waitFor("all eight settings rows mounted", () => document.querySelectorAll("[data-glass-setting]").length === 8 && !!control("enabled"))
        await set("enabled", true)
        await set("background", true)
        await set("grain", true)
        await waitFor("background mounted once", () => count("aurora") === 1 && count("veil") === 1 && count("grain") === 1)
        const pane = document.querySelector<HTMLElement>("[data-slot=session-chat-panel] > .bg-v2-background-bg-base")
        if (pane) console.info("GLASS_FINAL_TEST pane", JSON.stringify({
          background: getComputedStyle(pane).backgroundColor, blur: getComputedStyle(pane).backdropFilter,
        }))
        await set("background", false)
        await waitFor("background OFF destroys every backdrop layer", () => count("aurora") === 0 && count("veil") === 0 && count("grain") === 0)
        await set("background", true)
        await set("grain", false)
        await waitFor("grain OFF removes grain only", () => count("grain") === 0 && count("aurora") === 1)
        await set("grain", true)
        await waitFor("grain ON restores once", () => count("grain") === 1)
        await set("shimmer", false)
        await waitFor("shimmer OFF removes animation CSS", () => !style().includes("@keyframes glass-shimmer"))
        await set("shimmer", true)
        await waitFor("shimmer ON restores animation CSS", () => style().includes("@keyframes glass-shimmer"))
        await set("motion", false)
        await waitFor("pause sets CSS animation pause flag", () => document.documentElement.hasAttribute("data-glass-paused"))
        const canvas = document.querySelector<HTMLCanvasElement>("[data-glass-aurora]")!
        const context = canvas.getContext("2d")!
        const gradient = context.createRadialGradient
        let gradients = 0
        context.createRadialGradient = function (...args) { gradients++; return gradient.apply(this, args) }
        restoreContext = () => { context.createRadialGradient = gradient }
        await delay(250)
        const before = gradients
        await delay(400)
        if (gradients !== before) throw new Error("Canvas still animates while paused")
        console.info("GLASS_FINAL_TEST PASS pause stops actual canvas draws")
        restoreContext(); restoreContext = undefined
        if (canvas.width > 1280) throw new Error("Canvas backing pixel budget exceeded")
        console.info("GLASS_FINAL_TEST PASS canvas backing budget", canvas.width, canvas.height)
        await set("motion", true)
        await set("parallax", false)
        await set("parallax", true)
        const slider = document.querySelector<HTMLInputElement>('[data-glass-setting="intensity"] input[type=range]')!
        for (const value of [20, 90]) {
          slider.value = String(value)
          slider.dispatchEvent(new Event("input", { bubbles: true }))
          await waitFor(`intensity slider=${value}`, () => ctx.stores.prefs.value.intensity === value && slider.value === String(value))
        }
        await set("enabled", false)
        await waitFor("master OFF withdraws styles, layers and enabled attribute", () => !style() && count("aurora") === 0 && !document.documentElement.hasAttribute("data-glass-enabled"))
        await set("enabled", true)
        await waitFor("master ON restores exactly once", () => !!style() && count("aurora") === 1)
        restore()
        await waitFor("original user preferences restored", () => Object.entries(initial)
          .every(([key, value]) => ctx.stores.prefs.value[key as keyof typeof initial] === value))
        console.info("GLASS_FINAL_TEST COMPLETE")
      } catch (error) {
        if (!stopped) console.error("GLASS_FINAL_TEST FAIL", String(error))
      } finally {
        restoreContext?.()
        if (!stopped) restore()
      }
    })()
    return () => {
      stopped = true
      for (const timer of timers) window.clearTimeout(timer)
      restoreContext?.(); restore(); cleanup?.()
    }
  },
})
