import { getPalette } from './palettes'

export interface AuroraHandle {
  /** Normalized -1..1, never screen pixels. */
  setPointer(x: number, y: number): void
  setParallax(on: boolean): void
  setMotion(on: boolean): void
  refreshTheme(light: boolean, palette?: string): void
  destroy(): void
}

export function createAurora(options: { motion?: boolean; light?: boolean; palette?: string } = {}): AuroraHandle {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("data-glass-aurora", "")
  canvas.setAttribute("aria-hidden", "true")
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block"
  const ctx = canvas.getContext("2d")
  document.body.appendChild(canvas)
  if (!ctx) return { setPointer() {}, setParallax() {}, setMotion() {}, refreshTheme() {}, destroy() { canvas.remove() } }

  let width = 0, height = 0, time = 0, raf = 0, lastDraw = 0
  let destroyed = false, parallax = true, motion = options.motion ?? true, light = options.light ?? false
  let palette = getPalette(options.palette)
  let base = light ? "#fafafa" : palette.base
  let colors = palette.colors.slice(0, 2)
  const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 }
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
  const canAnimate = () => !destroyed && motion && !document.hidden && (typeof document.hasFocus === "function" ? document.hasFocus() : true) && !reduced?.matches
  const theme = () => {
    const style = getComputedStyle(document.documentElement)
    const raw = style.getPropertyValue("--v2-background-bg-deep").trim()
    base = light ? raw || "#fafafa" : palette.base
    colors = palette.colors.slice(0, 2)
  }
  const render = (advance = false) => {
    if (destroyed) return
    if (advance) {
      eased.x += (pointer.x - eased.x) * .045
      eased.y += (pointer.y - eased.y) * .045
    }
    const px = parallax && motion && !reduced?.matches ? eased.x : 0
    const py = parallax && motion && !reduced?.matches ? eased.y : 0
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = base
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = light ? "multiply" : "lighter"
    for (let i = 0; i < colors.length; i++) {
      const phase = time * [.000008, .000006][i]
      const x = ([.16, .88][i] + Math.sin(phase) * .035 + px * .04) * width
      const y = ([.05, .92][i] + Math.cos(phase * 1.3) * .035 + py * .035) * height
      const r = [.72, .66][i] * Math.min(width, height) * (.94 + Math.sin(phase * .7) * .06)
      const [red, green, blue] = colors[i]
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(${red},${green},${blue},${light ? .13 : .26})`)
      gradient.addColorStop(.45, `rgba(${red},${green},${blue},${light ? .035 : .07})`)
      gradient.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = gradient
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalCompositeOperation = "source-over"
  }
  const schedule = () => { if (!raf && canAnimate()) raf = requestAnimationFrame(frame) }
  const frame = () => {
    raf = 0
    if (!canAnimate()) return
    const now = performance.now()
    if (!lastDraw || now - lastDraw >= 33) {
      time += Math.min(lastDraw ? now - lastDraw : 34, 64)
      lastDraw = now
      render(true)
    }
    schedule()
  }
  const sync = () => {
    cancelAnimationFrame(raf); raf = 0; lastDraw = 0
    if (!destroyed && !document.hidden) { render(); schedule() }
  }
  const resize = () => {
    width = canvas.clientWidth || window.innerWidth
    height = canvas.clientHeight || window.innerHeight
    // Cap backing pixels: gradients are deliberately soft, not text or icons.
    const scale = Math.min(window.devicePixelRatio || 1, 1, 1280 / Math.max(width, 1))
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
    sync()
  }
  const onTheme = () => { theme(); sync() }
  const observer = typeof MutationObserver === "undefined" ? undefined : new MutationObserver(onTheme)
  observer?.observe(document.head, { childList: true, subtree: true, characterData: true })
  window.addEventListener("resize", resize)
  document.addEventListener("visibilitychange", sync)
  reduced?.addEventListener("change", sync)
  
  const onFocusChange = () => sync()
  window.addEventListener("focus", onFocusChange)
  window.addEventListener("blur", onFocusChange)

  theme(); resize()

  return {
    setPointer(x, y) {
      if (!parallax || !canAnimate() || !Number.isFinite(x) || !Number.isFinite(y)) return
      pointer.x = Math.max(-1, Math.min(1, x)); pointer.y = Math.max(-1, Math.min(1, y))
    },
    setParallax(on) {
      if (on === parallax) return
      parallax = on
      if (!on) { pointer.x = 0; pointer.y = 0; eased.x = 0; eased.y = 0; render() }
    },
    setMotion(on) {
      if (on === motion) return
      motion = on
      if (!on) { pointer.x = 0; pointer.y = 0; eased.x = 0; eased.y = 0 }
      sync()
    },
    refreshTheme(nextLight, nextPalette = palette.id) {
      const selected = getPalette(nextPalette)
      if (light === nextLight && palette.id === selected.id) return
      light = nextLight
      palette = selected
      onTheme()
    },
    destroy() {
      if (destroyed) return
      destroyed = true
      cancelAnimationFrame(raf); raf = 0
      window.removeEventListener("resize", resize)
      window.removeEventListener("focus", onFocusChange)
      window.removeEventListener("blur", onFocusChange)
      document.removeEventListener("visibilitychange", sync)
      reduced?.removeEventListener("change", sync)
      observer?.disconnect()
      canvas.remove()
    },
  }
}
