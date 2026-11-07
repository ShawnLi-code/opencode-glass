# Surface cascade audit — 2026-11-07

Goal: preserve existing palettes, background animation and native interactions;
remove unintended dark bands without globally clearing backgrounds or shadows.

## Confirmed causes

- The shell fallback used `#root` specificity and `!important`. It overrode the
  session header material. Overlay roots were not excluded (only descendants).
- An earlier `#root > .bg-v2-background-bg-deep > .relative` selector also matched
  the real desktop `<header data-slot=titlebar-v2 class="relative …">`.
- The native session fade still painted a 16px `#161616 → transparent` gradient
  beneath the now-transparent header. Runtime inspection showed no box shadow;
  this was a painted fade, not an animation or GPU setting.

## Changes

- Shell fallback uses low-specificity `:where()` and excludes independent surface
  roots plus descendants. Removed the generic direct-child `.relative` override.
- Retain the native fade's layout/scroll geometry. When timeline clipping is
  active, clear its paint; unknown structures retain a palette-tinted fallback.
- Preserve homepage row states, normal-flow home/settings titles, overlay fills,
  animation settings and existing tool-card styling. No new animation or timer
  is shipped in production.

## Verification

- `tests/surface-audit.ts` is an opt-in entry, not the shipped plugin: three
  consecutive rounds exercise actual Chromium CSS cascade under `#root`.
- Checks cover shell/title materials, clip/fallback fade states, home selected
  and unselected rows, home pseudo-elements, settings headings, menu root/child,
  dialog root, and real desktop/session surfaces.
- `tests/theme.test.mjs` covers all six palettes in light/dark for the cascade
  isolation and fade rules. This is CSS-generation coverage, not screenshots of
  every palette or every settings page.
- Session screenshot reviewed:
  `C:/Users/Shawn/AppData/Local/Temp/opencode/global-audit-session.png`.
- Local self-review only; no independent visual reviewer. No copy, preferences,
  background palette or motion design changed.

## Boundaries

Legacy settings-material selectors still target `data-testid=settings-screen`.
They are compatibility code, not enabled by this fix: activating them on current
`.settings-screen` would change settings surfaces and needs separate validation.
Native menus, tool-header defensive fills and review-pane surfaces intentionally
retain backgrounds. Do not replace this with a global `background:none` or
`box-shadow:none` rule.
