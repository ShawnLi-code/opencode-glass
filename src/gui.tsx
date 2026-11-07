import { Plugin, Command, SettingsPage, Style } from "@opencode/plugin/gui"
import { definition } from "./definition"
import { createAurora, type AuroraHandle } from "./aurora"
import { buildCSS } from "./theme"
import { createEffect, For } from "solid-js"
import { registerVitals } from "./vitals"
import { createLayoutBridge } from "./layout-bridge"
import { getPalette, PALETTES } from './palettes'

export default Plugin.define({
  ...definition,

  main(ctx) {
    ctx.log.write("info", "GLASS_FULL_V1 main loaded")
  },

  setup(ctx) {
    console.info("GLASS_FULL_V1 setup started")
    const prefs = ctx.stores.prefs
    const withdrawVitals = registerVitals(ctx)
    let layout: ReturnType<typeof createLayoutBridge> | undefined
    createEffect(() => {
      if (prefs.value.enabled) {
        layout ??= createLayoutBridge(() => {
          try {
            const session = ctx.sessions.current()
            return session?.server.data.session.message.list(session.id) ?? []
          } catch { return [] }
        })
      } else { layout?.destroy(); layout = undefined }
    })
    // One-time reference-skin migration. Preserve every other user preference.
    if (prefs.value.styleRevision < 1) prefs.update((draft) => {
      draft.shimmer = false
      draft.styleRevision = 1
    })
    const root = document.documentElement
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncPaused = () => root.toggleAttribute("data-glass-paused",
      !prefs.value.motion || document.hidden || reducedMotion.matches)
    document.addEventListener("visibilitychange", syncPaused)
    reducedMotion.addEventListener("change", syncPaused)

    // ----------------------------------------------------------------
    // The aurora, its veil and its grain live in the document body.
    // They are plain elements rather than Solid components, because the
    // canvas has to sit behind the app's own z-index stack.
    // ----------------------------------------------------------------
    let aurora: AuroraHandle | undefined
    let veil: HTMLDivElement | undefined
    let grain: HTMLDivElement | undefined

    const ensureBackdrop = () => {
      if (!aurora) aurora = createAurora({ motion: prefs.value.motion, light: ctx.appearance.mode() === "light", palette: prefs.value.palette, style: prefs.value.backgroundStyle })
      if (!veil) {
        veil = document.createElement("div")
        veil.setAttribute("data-glass-veil", "")
        veil.setAttribute("aria-hidden", "true")
        document.body.appendChild(veil)
      }
      if (!grain && prefs.value.grain) {
        grain = document.createElement("div")
        grain.setAttribute("data-glass-grain", "")
        grain.setAttribute("aria-hidden", "true")
        document.body.appendChild(grain)
      }
    }

    const removeBackdrop = () => {
      aurora?.destroy()
      aurora = undefined
      veil?.remove()
      veil = undefined
      grain?.remove()
      grain = undefined
    }

    // A session switch remounts the whole timeline. Pause the background and
    // lift the heavy backdrop blur for that burst so the switch stays responsive.
    let lastSession: string | undefined
    let switchTimer: number | undefined
    createEffect(() => {
      const id = ctx.sessions.current()?.id
      if (id === lastSession) return
      lastSession = id
      if (!prefs.value.enabled || !prefs.value.background) return
      aurora?.suspend(400)
      root.setAttribute("data-glass-scrolling", "true")
      window.clearTimeout(switchTimer)
      switchTimer = window.setTimeout(() => root.removeAttribute("data-glass-scrolling"), 400)
    })

    // ----------------------------------------------------------------
    // The stylesheet. `ctx.add(Style, fn)` re-runs `fn` when the state it
    // reads changes, so reading the preferences inside it is what keeps
    // the CSS in step with the settings.
    // ----------------------------------------------------------------
    ctx.add(Style, () => {
      const p = prefs.value
      root.toggleAttribute("data-glass-enabled", p.enabled)
      root.toggleAttribute("data-glass-background", p.enabled && p.background)
      if (p.enabled) root.setAttribute('data-glass-palette', getPalette(p.palette).id)
      else root.removeAttribute('data-glass-palette')
      syncPaused()
      if (!p.enabled) {
        removeBackdrop()
        return undefined
      }

      if (p.background) {
        ensureBackdrop()
        aurora?.setParallax(p.parallax)
        aurora?.setMotion(p.motion)
        aurora?.setStyle(p.backgroundStyle)
        aurora?.refreshTheme(ctx.appearance.mode() === "light", getPalette(p.palette).id)
        if (!p.grain) { grain?.remove(); grain = undefined }
      } else removeBackdrop()

      return buildCSS({
        intensity: p.intensity,
        background: p.background,
        shimmer: p.shimmer,
        parallax: p.parallax,
        grain: p.grain,
        light: ctx.appearance.mode() === "light",
        palette: p.palette,
      })
    })

    // ----------------------------------------------------------------
    // Pointer parallax. The aurora eases toward the pointer, so the
    // movement is read at 30fps rather than on every pointer event.
    // ----------------------------------------------------------------
    const onPointerMove = (event: PointerEvent) => {
      if (!aurora) return
      const w = window.innerWidth
      const h = window.innerHeight
      if (!w || !h) return
      aurora.setPointer((event.clientX / w - 0.5) * 2, (event.clientY / h - 0.5) * 2)
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    const resetPointer = () => aurora?.setPointer(0, 0)
    document.documentElement.addEventListener("pointerleave", resetPointer)
    window.addEventListener("blur", resetPointer)

    // ----------------------------------------------------------------
    // Contributions.
    // ----------------------------------------------------------------
    ctx.add(Command, () => ({
      id: "toggle",
      title: ctx.t("command.toggle"),
      description: ctx.t("command.toggle.description"),
      keywords: "glass glassmorphism theme aurora",
      run: () => {
        prefs.update((draft) => {
          draft.enabled = !draft.enabled
        })
      },
    }))

    ctx.add(SettingsPage, {
      id: "glass",
      icon: "appearance",
      get title() {
        return ctx.t("title")
      },
      get entries() {
        return [
          { id: "palette", title: ctx.t("settings.palette"), keywords: "palette color blue graphite jade violet ice amber 配色 颜色" },
          { id: "backgroundStyle", title: ctx.t("settings.backgroundStyle"), keywords: "aurora tide glow wave particle 光波 粒子 背景 效果" },
          { id: "intensity", title: ctx.t("settings.intensity"), keywords: "glass blur transparency" },
          { id: "background", title: ctx.t("settings.background"), keywords: "aurora animated background" },
          { id: "parallax", title: ctx.t("settings.parallax"), keywords: "mouse pointer parallax" },
          { id: "shimmer", title: ctx.t("settings.shimmer"), keywords: "sweep shine light" },
          { id: "grain", title: ctx.t("settings.grain"), keywords: "noise grain banding" },
          { id: "motion", title: ctx.t("settings.motion"), keywords: "pause animation motion" },
        ]
      },
      render: () => {
        const p = () => prefs.value
        const ui = ctx.ui

        const Row = (props: {
          id: string
          title: string
          description: string
          children: unknown
        }) => (
          <div
            data-glass-setting={props.id}
            id={`glass-setting-${props.id}`}
            style={{
              display: "flex",
              "align-items": "center",
              gap: "16px",
              padding: "12px 0",
              "border-bottom": "0.5px solid var(--v2-border-border-muted)",
            }}
          >
            <div style={{ flex: "1", "min-width": "0" }}>
              <div style={{ "font-size": "13px", color: "var(--v2-text-text-base)" }}>{props.title}</div>
              <div style={{ "font-size": "12px", color: "var(--v2-text-text-muted)", "margin-top": "2px" }}>
                {props.description}
              </div>
            </div>
            <div style={{ flex: "none" }}>{props.children as never}</div>
          </div>
        )

        const toggle = (key: "background" | "parallax" | "shimmer" | "grain" | "motion") => (checked: boolean) =>
          prefs.update((draft) => {
            draft[key] = checked
          })

        return (
          <div data-glass-settings style={{ padding: "4px 0 24px" }}>
            <Row id="enabled" title={ctx.t("title")} description={ctx.t("command.toggle.description")}>
              <ui.Switch
                label={ctx.t("title")}
                checked={p().enabled}
                onChange={(checked) =>
                  prefs.update((draft) => {
                    draft.enabled = checked
                  })
                }
              />
            </Row>

            <Row id="palette" title={ctx.t('settings.palette')} description={ctx.t('settings.palette.description')}>
              <div role="group" aria-label={ctx.t('settings.palette')} data-glass-palette-options
                style={{ display: 'grid', 'grid-template-columns': 'repeat(2,minmax(0,1fr))', gap: '6px', width: 'min(280px,42vw)' }}>
                <For each={PALETTES}>{(palette) => <button type="button" data-glass-palette-option={palette.id}
                  aria-pressed={getPalette(p().palette).id === palette.id}
                  onClick={() => prefs.update((draft) => { draft.palette = palette.id })}
                  style={{ display: 'flex', 'align-items': 'center', gap: '7px', padding: '7px 9px', 'border-radius': '8px',
                    border: getPalette(p().palette).id === palette.id ? `1px solid ${palette.ink}` : '1px solid var(--v2-border-border-muted)',
                    background: getPalette(p().palette).id === palette.id ? 'var(--v2-background-bg-layer-02)' : 'transparent',
                    color: 'var(--v2-text-text-base)', cursor: 'pointer', 'font-size': '12px', 'text-align': 'start' }}>
                  <span aria-hidden="true" style={{ width: '9px', height: '9px', 'border-radius': '50%', 'flex-shrink': '0', background: palette.ink }} />
                  {ctx.t(`palette.${palette.id}`)}
                </button>}</For>
              </div>
            </Row>

            <Row id="backgroundStyle" title={ctx.t('settings.backgroundStyle')} description={ctx.t('settings.backgroundStyle.description')}>
              <div role="group" aria-label={ctx.t('settings.backgroundStyle')} style={{ display: 'flex', 'flex-wrap': 'wrap', gap: '6px', width: 'min(280px,42vw)' }}>
                <For each={['aurora', 'tide', 'glow'] as const}>{(style) => <button type="button"
                  data-glass-background-style={style} aria-pressed={(p().backgroundStyle ?? 'aurora') === style}
                  onClick={() => prefs.update((draft) => { draft.backgroundStyle = style })}
                  style={{ padding: '7px 9px', 'border-radius': '8px',
                    border: (p().backgroundStyle ?? 'aurora') === style ? `1px solid ${getPalette(p().palette).ink}` : '1px solid var(--v2-border-border-muted)',
                    background: (p().backgroundStyle ?? 'aurora') === style ? 'var(--v2-background-bg-layer-02)' : 'transparent',
                    color: 'var(--v2-text-text-base)', cursor: 'pointer', 'font-size': '12px' }}>
                  {ctx.t(`backgroundStyle.${style}`)}
                </button>}</For>
              </div>
            </Row>

            <Row
              id="intensity"
              title={ctx.t("settings.intensity")}
              description={ctx.t("settings.intensity.description")}
            >
              <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                <input
                  aria-label={ctx.t("settings.intensity")}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={p().intensity}
                  style={{ width: "140px" }}
                  onInput={(event) => {
                    const value = Number((event.target as HTMLInputElement).value)
                    prefs.update((draft) => {
                      draft.intensity = value
                    })
                  }}
                />
                <span
                  style={{
                    "font-size": "12px",
                    color: "var(--v2-text-text-muted)",
                    "min-width": "30px",
                    "text-align": "right",
                    "font-variant-numeric": "tabular-nums",
                  }}
                >
                  {p().intensity}
                </span>
              </div>
            </Row>

            <Row
              id="background"
              title={ctx.t("settings.background")}
              description={ctx.t("settings.background.description")}
            >
              <ui.Switch label={ctx.t("settings.background")} checked={p().background} onChange={toggle("background")} />
            </Row>

            <Row
              id="parallax"
              title={ctx.t("settings.parallax")}
              description={ctx.t("settings.parallax.description")}
            >
              <ui.Switch label={ctx.t("settings.parallax")} checked={p().parallax} onChange={toggle("parallax")} />
            </Row>

            <Row
              id="shimmer"
              title={ctx.t("settings.shimmer")}
              description={ctx.t("settings.shimmer.description")}
            >
              <ui.Switch label={ctx.t("settings.shimmer")} checked={p().shimmer} onChange={toggle("shimmer")} />
            </Row>

            <Row
              id="motion"
              title={ctx.t("settings.motion")}
              description={ctx.t("settings.motion.description")}
            >
              <ui.Switch label={ctx.t("settings.motion")} checked={p().motion} onChange={toggle("motion")} />
            </Row>

            <Row
              id="grain"
              title={ctx.t("settings.grain")}
              description={ctx.t("settings.grain.description")}
            >
              <ui.Switch label={ctx.t("settings.grain")} checked={p().grain} onChange={toggle("grain")} />
            </Row>
          </div>
        )
      },
    })

    console.info("GLASS_FULL_V1 setup completed")
    return () => {
      layout?.destroy()
      withdrawVitals()
      window.clearTimeout(switchTimer)
      window.removeEventListener("pointermove", onPointerMove)
      document.documentElement.removeEventListener("pointerleave", resetPointer)
      window.removeEventListener("blur", resetPointer)
      document.removeEventListener("visibilitychange", syncPaused)
      reducedMotion.removeEventListener("change", syncPaused)
      root.removeAttribute("data-glass-enabled")
      root.removeAttribute("data-glass-background")
      root.removeAttribute('data-glass-palette')
      root.removeAttribute("data-glass-paused")
      removeBackdrop()
    }
  },
})
