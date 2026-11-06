import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"

// Opt-in real-host test. PointerEvents are synthetic, not OS mouse input.
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    if (!plugin.setup) throw new Error("Missing production setup")
    const cleanup = plugin.setup(ctx)
    const { enabled, background, parallax } = ctx.stores.prefs.value
    const restorePrefs = () => ctx.stores.prefs.update((draft) => {
      draft.enabled = enabled; draft.background = background; draft.parallax = parallax
    })
    let stopped = false
    let renderedFrames = 0
    let restoreContext: (() => void) | undefined
    const timers = new Set<number>()
    const delay = (ms: number) => new Promise<void>((resolve) => {
      const timer = window.setTimeout(() => { timers.delete(timer); resolve() }, ms)
      timers.add(timer)
    })
    const waitFor = async (label: string, predicate: () => boolean) => {
      const deadline = performance.now() + 20000
      while (!stopped && performance.now() < deadline) {
        if (predicate()) return
        await delay(50)
      }
      throw new Error(`${label} timed out`)
    }
    const control = () => document.querySelector<HTMLElement>(
      '[data-glass-setting="parallax"] [role="switch"], [data-glass-setting="parallax"] input[type="checkbox"]',
    )
    const checked = () => {
      const el = control()
      return el instanceof HTMLInputElement ? el.checked : el?.getAttribute("aria-checked") === "true"
    }
    const setParallax = async (value: boolean) => {
      if (checked() !== value) control()!.click()
      await waitFor("parallax control update", () => checked() === value && ctx.stores.prefs.value.parallax === value)
    }
    const pointer = (x: number, y: number) => window.dispatchEvent(new PointerEvent("pointermove", {
      clientX: x * window.innerWidth, clientY: y * window.innerHeight,
    }))
    void (async () => {
      try {
        await delay(1000)
        if (stopped) return
        ctx.stores.prefs.update((draft) => { draft.enabled = true; draft.background = true })
        ctx.layout.settings("glass")
        await waitFor("visible parallax settings", () => !!control()?.checkVisibility({ checkVisibilityCSS: true }))
        const canvas = document.querySelector<HTMLCanvasElement>("[data-glass-aurora]")
        const context = canvas?.getContext("2d")
        if (!canvas || !context) throw new Error("No rendered aurora context")
        const clear = context.clearRect
        const gradient = context.createRadialGradient
        const centres: { x: number; y: number }[] = []
        let first = false
        context.clearRect = function (...args) { first = true; return clear.apply(this, args) }
        context.createRadialGradient = function (...args) {
          if (first) { centres.push({ x: args[0], y: args[1] }); renderedFrames++; first = false }
          return gradient.apply(this, args)
        }
        restoreContext = () => { context.clearRect = clear; context.createRadialGradient = gradient }
        const sample = async (frames: number) => {
          const target = centres.length + frames
          await waitFor("aurora rendered frames", () => centres.length >= target)
          return centres[centres.length - 1]
        }
        await setParallax(false)
        pointer(0.5, 0.5)
        const offStart = await sample(2)
        pointer(1, 1)
        const offEnd = await sample(2)
        const offDelta = Math.hypot(offEnd.x - offStart.x, offEnd.y - offStart.y)
        if (offDelta > window.innerWidth * 0.004) throw new Error(`Pointer affected disabled parallax: ${offDelta}`)
        console.info("GLASS_PARALLAX_TEST PASS disabled ignores pointer", JSON.stringify({ offDelta }))
        await setParallax(true)
        pointer(0.5, 0.5)
        const onStart = await sample(2)
        pointer(1, 1)
        const onEnd = await sample(2)
        const dx = onEnd.x - onStart.x, dy = onEnd.y - onStart.y
        if (dx < window.innerWidth * 0.003 || dy < window.innerHeight * 0.0025) {
          throw new Error(`Enabled parallax did not move gradients: ${dx}, ${dy}`)
        }
        console.info("GLASS_PARALLAX_TEST PASS enabled follows pointer", JSON.stringify({ dx, dy }))
        document.documentElement.dispatchEvent(new PointerEvent("pointerleave"))
        const returned = await sample(4)
        if (returned.x >= onEnd.x - window.innerWidth * 0.0005) throw new Error("Pointer leave did not recenter")
        if (document.querySelectorAll("[data-glass-aurora]").length !== 1 || canvas !== document.querySelector("[data-glass-aurora]")) {
          throw new Error("Parallax toggle recreated or duplicated the canvas")
        }
        console.info("GLASS_PARALLAX_TEST PASS leave recenters; same single canvas")
        if (!stopped) console.info("GLASS_PARALLAX_TEST COMPLETE")
      } catch (error) {
        if (!stopped) console.error("GLASS_PARALLAX_TEST FAIL", String(error), JSON.stringify({
          renderedFrames, visibility: document.visibilityState, focused: document.hasFocus(),
        }))
      } finally {
        restoreContext?.()
        pointer(0.5, 0.5)
        if (!stopped) restorePrefs()
      }
    })()
    return () => {
      stopped = true
      for (const timer of timers) window.clearTimeout(timer)
      restoreContext?.()
      restorePrefs()
      cleanup?.()
    }
  },
})
