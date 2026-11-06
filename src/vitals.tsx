import { For, Show, createMemo, onCleanup } from 'solid-js'
import { ComposerPill, Slot, type SetupContext, type SlotMap } from '@opencode/plugin/gui'
import type { definition } from './definition'

type Context = SetupContext<typeof definition>
// Only the verified usage-pill contributions; leave goal/background work alone.
export const metricIds = new Set(['speed', 'ttft', 'context', 'turn', 'chatgpt-quota'])

export function registerVitals(ctx: Context) {
  const Pill = (props: { item: ComposerPill; input: SlotMap['session.header'] }) => {
    const view = createMemo(() => {
      try { return props.item.show(props.input) } catch { return undefined }
    })
    return <Show when={view()}>{(v) =>
      <span data-glass-vital data-glass-metric-id={props.item.id} data-glass-metric-label={v().label}
        data-glass-metric-title={v().title ?? ''} data-tone={v().tone}>
        <ctx.ui.Tooltip value={v().title ?? v().label}>
          <Show when={v().rows?.length} fallback={<button type="button" disabled={!v().run} onClick={() => v().run?.()}>{v().label}</button>}>
            <ctx.ui.Menu trigger="button" label={v().label} placement="bottom-end"
            items={(v().rows ?? []).map((row) => ({
              label: row.detail ? `${row.label} · ${row.detail}` : row.label, icon: row.icon,
              onSelect: () => row.run?.(),
            }))} />
          </Show>
        </ctx.ui.Tooltip>
      </span>
    }</Show>
  }
  return ctx.add(Slot, { at: 'session.header', order: 80, render: (input) => {
    let details: HTMLDetailsElement | undefined
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Element && event.target.closest('[role=menu],[role=menuitem],[data-component=tooltip]')) return
      if (input.compact && details && event.target instanceof Node && !details.contains(event.target)) details.open = false
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !input.compact || !details?.open) return
      const overlayOpen = Array.from(document.querySelectorAll<HTMLElement>('[role=menu],[role=dialog]')).some((el) => el.checkVisibility())
      if (!overlayOpen) {
        details.open = false
        details.querySelector('summary')?.focus({ preventScroll: true })
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', escape, true)
    onCleanup(() => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape, true) })
    const pills = () => ctx.list(ComposerPill).filter((p) => metricIds.has(p.id) && !p.menu)
    return <Show when={input.active && ctx.stores.prefs.value.enabled && pills().length > 0}>
      <details ref={details} data-glass-vitals data-glass-layout-owned data-compact={input.compact} open={!input.compact}>
        <summary aria-label="会话统计">统计 ▾</summary>
        <div data-glass-vital-list><For each={pills()}>{(item) => <Pill item={item} input={input} />}</For></div>
      </details>
    </Show>
  } })
}
