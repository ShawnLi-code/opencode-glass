import { getPalette } from './palettes'

export type BackgroundStyle = 'aurora' | 'tide' | 'glow'

export interface AuroraHandle {
  /** Normalized -1..1, never screen pixels. */
  setPointer(x: number, y: number): void
  setParallax(on: boolean): void
  setMotion(on: boolean): void
  setStyle(style?: BackgroundStyle): void
  /** Pause painting for a short burst, e.g. while a session switch remounts the timeline. */
  suspend(ms: number): void
  refreshTheme(light: boolean, palette?: string): void
  destroy(): void
}

export function createAurora(options: { motion?: boolean; light?: boolean; palette?: string; style?: BackgroundStyle } = {}): AuroraHandle {
  const canvas = document.createElement("canvas")
  canvas.setAttribute("data-glass-aurora", "")
  canvas.setAttribute("aria-hidden", "true")
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;display:block"
  const ctx = canvas.getContext("2d")
  document.body.appendChild(canvas)
  if (!ctx) return { setPointer() {}, setParallax() {}, setMotion() {}, setStyle() {}, suspend() {}, refreshTheme() {}, destroy() { canvas.remove() } }

  let width = 0, height = 0, time = 0, raf = 0, lastDraw = 0
  let destroyed = false, parallax = true, motion = options.motion ?? true, light = options.light ?? false
  let scrolling = false, scrollTimer: number | undefined, suspendTimer: number | undefined
  let palette = getPalette(options.palette)
  let style: BackgroundStyle = options.style ?? 'aurora'
  let base = light ? "#fafafa" : palette.base
  let colors = palette.colors.slice(0, 2)
  const pointer = { x: 0, y: 0 }, eased = { x: 0, y: 0 }
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")
  const canAnimate = () => !destroyed && motion && !scrolling && !document.hidden && (typeof document.hasFocus === "function" ? document.hasFocus() : true) && !reduced?.matches
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
      const phase = time * .00022
      const x = (.5 + (i ? -.28 : .28) * Math.sin(phase) + px * .04) * width
      const y = ([.32, .8][i] + py * .035) * height
      const r = Math.max(width * .47, height * .65)
      const [red, green, blue] = colors[i]
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
      gradient.addColorStop(0, `rgba(${red},${green},${blue},${light ? .10 : .38})`)
      gradient.addColorStop(.45, `rgba(${red},${green},${blue},${light ? .035 : .12})`)
      gradient.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = gradient
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalCompositeOperation = "source-over"
    const [red, green, blue] = colors[1]
    const phase = time * .001
    const alpha = light ? .35 : 1
    if (style === 'aurora') {
      for (let row = 0; row < 8; row++) {
        ctx.beginPath()
        for (let x = 0; x <= width + 16; x += 16) {
          const y = height * (.48 + row * .022) + Math.sin(x / width * 7 + phase * .35 + row * .17) * height * .08 + Math.sin(x / width * 3 - phase * .2) * height * .08
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y)
        }
        ctx.lineWidth = 5
        ctx.strokeStyle = `rgba(${red},${green},${blue},${(.025 + row % 3 * .008) * alpha})`
        ctx.stroke()
      }
    }
    if (style === 'tide') {
      for (let row = 0; row < 9; row++) for (let col = 0; col < 48; col++) {
        const x = col * width / 47
        const y = height * (.31 + row * .046) + Math.sin(col * .19 + phase * .4 + row * .2) * height * .06
        const pulse = .5 + .5 * Math.cos(col * .18 - phase * .7)
        ctx.beginPath(); ctx.arc(x, y, 1 + pulse * .55, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${red},${green},${blue},${(.09 + pulse * .27) * alpha})`; ctx.fill()
      }
    } else {
      for (let n = 0; n < 64; n++) {
        const x = (n * 137.7 + Math.sin(phase * .24 + n) * 30 + width) % width
        const y = (n * 71.9 + Math.sin(phase * .32 + n * .9) * 14 + height) % height
        ctx.beginPath(); ctx.arc(x, y, n % 13 ? .8 : 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${red},${green},${blue},${(.12 + .14 * (.5 + .5 * Math.sin(phase * .6 + n))) * alpha})`; ctx.fill()
      }
    }
  }
  const schedule = () => { if (!raf && canAnimate()) raf = requestAnimationFrame(frame) }
  const frame = () => {
    raf = 0
    if (!canAnimate()) return
    const now = performance.now()
    // 8 fps: the drift is deliberately slow, and every painted frame forces the
    // frosted panels in front of the canvas to re-blur, which dominates idle GPU.
    if (!lastDraw || now - lastDraw >= 120) {
      time += Math.min(lastDraw ? now - lastDraw : 121, 160)
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
    const scale = Math.min(window.devicePixelRatio || 1, 1, 960 / Math.max(width, 1))
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
  // Freeze the background during timeline scrolling so the compositor can
  // prioritize the moving conversation and its glass surfaces.
  const onScroll = (event: Event) => {
    if (!(event.target instanceof Element) || !event.target.closest('[data-slot=session-timeline-scroll]')) return
    if (!scrolling) { scrolling = true; cancelAnimationFrame(raf); raf = 0; lastDraw = 0 }
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => { scrolling = false; scrollTimer = undefined; schedule() }, 180)
  }
  document.addEventListener('scroll', onScroll, { capture: true, passive: true })
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
    setStyle(next = 'aurora') {
      if (style === next) return
      style = next
      sync()
    },
    suspend(ms) {
      if (destroyed) return
      scrolling = true
      cancelAnimationFrame(raf); raf = 0; lastDraw = 0
      window.clearTimeout(suspendTimer)
      suspendTimer = window.setTimeout(() => { scrolling = false; suspendTimer = undefined; schedule() }, Math.max(0, ms))
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
      document.removeEventListener('scroll', onScroll, true)
      window.clearTimeout(scrollTimer)
      window.clearTimeout(suspendTimer)
      reduced?.removeEventListener("change", sync)
      observer?.disconnect()
      canvas.remove()
    },
  }
}
