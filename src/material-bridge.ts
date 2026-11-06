interface SavedClip { value: string; priority: string; attribute: string | null }
/** Only neutral opaque containers are eligible, never colored status surfaces. */
export function neutralSurface(color: string): boolean {
  const m = color.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/)
  if (!m) return false
  const channels = m.slice(1, 4).map(Number)
  return Number(m[4] ?? 1) >= .9 && Math.max(...channels) - Math.min(...channels) <= 5
}
/** Fix unreadable text on an opaque action without changing its semantic fill. */
export function buttonInk(background: string, foreground: string, alreadyMarked = false): 'light' | 'dark' | undefined {
  const luminance = (color: string) => {
    const m = color.match(/^rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\s*\)$/)
    if (!m || Number(m[4] ?? 1) < 1) return undefined
    const rgb = m.slice(1,4).map((s) => { const c=Number(s)/255; return c<=.04045?c/12.92:((c+.055)/1.055)**2.4 })
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722
  }
  const bg=luminance(background), fg=luminance(foreground)
  if (bg === undefined || fg === undefined) return
  const ratio=(a:number,b:number)=>(Math.max(a,b)+.05)/(Math.min(a,b)+.05)
  if (!alreadyMarked && ratio(bg,fg)>=4.5) return
  return ratio(bg,1)>ratio(bg,0) ? 'light' : 'dark'
}
export function headerOcclusion(header: { top: number; bottom: number }, viewport: { top: number; bottom: number }): number {
  if (![header.top, header.bottom, viewport.top, viewport.bottom].every(Number.isFinite) || header.top >= viewport.bottom || header.bottom <= viewport.top) return 0
  return Math.max(0, Math.min(header.bottom - viewport.top, viewport.bottom - viewport.top))
}

/** Paint-only protection for the host's virtual timeline row canvas. No scroll,
 * dimensions, rows, text, native events or DOM ownership are changed. */
export function createMaterialBridge() {
  const clipped = new Map<HTMLElement, SavedClip>()
  const bindings = new Map<HTMLElement, { shield: HTMLElement; viewport: Element }>()
  const surfaces = new Map<HTMLElement, string | null>()
  const contrast = new Map<HTMLElement, string | null>()
  const restoreContrast = (el: HTMLElement, value: string | null) => {
    if (value === null) el.removeAttribute('data-glass-control-ink')
    else el.setAttribute('data-glass-control-ink', value)
    contrast.delete(el)
  }
  const restoreSurface = (el: HTMLElement, value: string | null) => {
    if (value === null) el.removeAttribute('data-glass-settings-surface')
    else el.setAttribute('data-glass-settings-surface', value)
    surfaces.delete(el)
  }
  const restoreClip = (el: HTMLElement, saved: SavedClip) => {
    if (saved.value) el.style.setProperty('--glass-header-cut', saved.value, saved.priority)
    else el.style.removeProperty('--glass-header-cut')
    if (saved.attribute === null) el.removeAttribute('data-glass-timeline-clip')
    else el.setAttribute('data-glass-timeline-clip', saved.attribute)
    clipped.delete(el)
    bindings.delete(el)
  }
  const bridge = {
    sync() {
      const live = new Set<HTMLElement>()
      for (const pane of Array.from(document.querySelectorAll<HTMLElement>('[data-slot=session-chat-panel]'))) {
        if (!pane.checkVisibility()) continue
        for (const layout of Array.from(pane.querySelectorAll<HTMLElement>('.session-header-layout'))) {
          const header = layout.parentElement?.parentElement
          const viewport = header?.closest('.scroll-view__viewport')
          // session-timeline-visible is only the floating scrollbar! Protect
          // the actual tall row canvas, a direct sibling of the sticky title.
          const content = Array.from(viewport?.children ?? []).find((el): el is HTMLElement =>
            el instanceof HTMLElement && el.style.position === 'relative' && el.style.overflowX === 'clip')
          if (!header?.classList.contains('pointer-events-auto') || !content || content.contains(header) || !header.checkVisibility()) continue
          const shield = header.parentElement?.hasAttribute('data-session-title') ? header.parentElement : header
          if (!viewport) continue
          // Include the native 16px fade band, otherwise a readable half-line
          // remains directly below the titlebar even after the bar is clean.
          const cut = headerOcclusion(shield.getBoundingClientRect(), content.getBoundingClientRect())
          if (!cut) continue
          bindings.set(content, { shield, viewport })
          if (!clipped.has(content)) clipped.set(content, { value: content.style.getPropertyValue('--glass-header-cut'), priority: content.style.getPropertyPriority('--glass-header-cut'), attribute: content.getAttribute('data-glass-timeline-clip') })
          const value = `${cut.toFixed(2)}px`
          if (content.style.getPropertyValue('--glass-header-cut') !== value) content.style.setProperty('--glass-header-cut', value)
          if (content.getAttribute('data-glass-timeline-clip') === null) content.setAttribute('data-glass-timeline-clip', '')
          live.add(content)
        }
      }
      for (const [el, saved] of clipped) if (!live.has(el)) restoreClip(el, saved)
      const screen = document.querySelector<HTMLElement>('[data-testid=settings-screen]')
      for (const [el, value] of contrast) if (!screen?.contains(el)) restoreContrast(el, value)
      if (screen?.checkVisibility()) for (const el of Array.from(screen.querySelectorAll<HTMLElement>('.settings-panel button'))) {
        if (el.matches(':disabled,[aria-disabled=true]')) {
          if (contrast.has(el)) restoreContrast(el,contrast.get(el)!)
          continue
        }
        const css=getComputedStyle(el), ink=buttonInk(css.backgroundColor,css.color,contrast.has(el))
        if (!ink) { if(contrast.has(el)) restoreContrast(el,contrast.get(el)!);continue }
        if (!contrast.has(el)) contrast.set(el,el.getAttribute('data-glass-control-ink'))
        if (el.getAttribute('data-glass-control-ink')!==ink) el.setAttribute('data-glass-control-ink',ink)
      }
      for (const [el, value] of surfaces) if (!screen?.contains(el)) restoreSurface(el, value)
      if (screen?.checkVisibility()) for (const el of Array.from(screen.querySelectorAll<HTMLElement>('.settings-panel :is(div,input:not([type]),input[type=text],input[type=number])'))) {
        if (surfaces.has(el) || !el.checkVisibility() || el.closest('button,[role=button],[role=switch],[role=alert],pre,code,[data-glass-palette-options]')) continue
        const css = getComputedStyle(el), box = el.getBoundingClientRect()
        if (box.width < 120 || box.height < 28 || css.backgroundImage !== 'none' || !neutralSurface(css.backgroundColor)) continue
        surfaces.set(el, el.getAttribute('data-glass-settings-surface'))
        el.setAttribute('data-glass-settings-surface', el.parentElement?.closest('[data-glass-settings-surface]') ? 'nested' : 'card')
      }
    },
    destroy() {
      document.removeEventListener('scroll', refresh, true)
      window.removeEventListener('resize', resize)
      for (const [el, saved] of clipped) restoreClip(el, saved)
      for (const [el, saved] of surfaces) restoreSurface(el, saved)
      for (const [el, saved] of contrast) restoreContrast(el, saved)
    },
  }
  // Hot path: no document queries, settings inspection or node discovery.
  // Read all geometry before writes to avoid interleaved layout flushes.
  const refresh = (event?: Event) => {
    const updates: { content: HTMLElement; value: string }[] = []
    for (const [content, { shield, viewport }] of bindings) {
      if (event?.type === 'scroll' && event.target !== viewport) continue
      const cut = headerOcclusion(shield.getBoundingClientRect(), content.getBoundingClientRect())
      updates.push({ content, value: `${cut.toFixed(2)}px` })
    }
    for (const { content, value } of updates) if (content.style.getPropertyValue('--glass-header-cut') !== value) content.style.setProperty('--glass-header-cut', value)
  }
  const resize = () => bridge.sync()
  document.addEventListener('scroll', refresh, { capture: true, passive: true })
  window.addEventListener('resize', resize, { passive: true })
  return bridge
}
