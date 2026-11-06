# Desktop test — 2026-11-05

> Source publication follow-up: main now includes all plugin source, build configuration, lockfile, test scripts and historical documentation. A fresh npm ci and npm run verify in this source repository passed all27 tests. Private absolute paths in documentation were redacted; opt-in desktop output paths now use GLASS_TEST_OUTPUT_DIR or the OS temporary directory. The older distribution-only publication notes below describe the original v0.1.0 release, not the current main branch. Private screenshots/logs and machine backups are deliberately excluded.

## Material refinement — 13:17

### New-session fix and portable package

Publication follow-up: after explicit user approval of public visibility, created https://github.com/ShawnLi-code/opencode-glass and published v0.1.0 with tgz and SHA256 assets. This is a prebuilt distribution repository, not the complete development workspace. Allowlisted runtime files and new public instructions only; no tests, local acceptance documents, logs, configuration or screenshots were pushed. Confirmed PUBLIC visibility, non-draft release and unauthenticated download with SHA256 equal to the local artifact. npm registry publication was not performed because npm is not signed in.

Actual new-session entry showed an independent `data-component=new-session` opaque surface and no model enhancement initialization. Both now reuse the existing chat material/capsule; no extra blur, polling or animation. Native entry/reveal/OFF restoration/draft text and native model label checks completed, and the new-page screenshot was personally viewed. Unsent draft routes do not expose SDK `screen.current()`, so the test uses DOM text/labels rather than claiming SDK model-ID verification. Final verify passed27 tests and normal renderer loaded at17:27:30.898.

Portable package generated at workspace `releases/opencode-glass-0.1.0.tgz`, with INSTALL.md beside it. Publish allowlist excludes tests, screenshots, logs and user config; prepack blocks diagnostic GUI code. Server entry is compiled to dist/index.js to avoid Node's inability to strip TypeScript under node_modules. The packed package installed successfully into an isolated temporary prefix using the official npm registry, its installed JavaScript server entry imported successfully, and entrypoint/test-code checks passed. Offline installation initially lacked cached SDK metadata, so full dependency installation requires network or a populated cache. No GitHub upload or npm publish was performed; no repository/account was specified. Other pages were not exhaustively audited.

### Subsequent upward-scroll optimization

Removed document/settings scans from scroll events, cached bindings and batch geometry reads before writes, ignored unrelated scrollers, deferred full activity/metrics reconciliation until120ms after scrolling stops, and removed per-member/activity-header backdrop blur. No palette or animation preferences were reset. Unit assertions verify zero document queries in the scroll hot path and no unrelated-scroll updates. At14:52:40.359, four real upward wheel inputs passed fresh header/row-canvas geometry checks; original scroll and debugger/throttling were restored. Final normal verify passed all26 tests and bundle scan excluded test entries. No FPS/GPU improvement percentage was measured. A broad material smoke's exact-scroll-offset check failed amid ongoing generation/follow-bottom, so that attempt is not a pass; the bounded native-wheel check replaced it for this narrow change. New-session blank-page coverage remains a separate unresolved report.

- All26 automated tests passed during implementation: geometry/clamping/scroll cut updates, original inline property/priority restoration, neutral surface eligibility, opaque button contrast, disabled controls, marker cleanup, two-light Canvas and existing six-palette/semantic/state tests.
- Actual material smoke completed at13:17:51.331, preserving original graphite preferences. Verified native settings surfaces and OFF restoration, actual row-canvas protection and native scroll updates, real visible expanded tools, six colors, unchanged draft/model, real100%/200% viewport change and exact withdrawal of owned clip properties. Final screenshots use painted-frame waits; early screenshots with unchanged viewport and the wrong scrollbar-only clipping target were rejected, not counted as successful visual protection.
- Independent read-only review confirmed major reduction of settings material discontinuity and stable background behind text. Main agent corrected its four findings: opaque action text contrast, native fade-band edge residue, composer outer glow/double-edge and native tabs trigger-wrapper's solid gray selection. Final screenshots were personally rechecked after corrections. Tool screenshot required native wheel input before expanding because host follow-bottom otherwise returned to the last response; a DOM-expanded state alone was not accepted as visible tool evidence.
- Scope remains local GUI styling and reversible paint markers/listeners. No model selection, message submission, installation package edit or new service. Third-party colored cards, alerts and primary action fills retain native semantics. No claim of zero GPU overhead or elimination of historical ResizeObserver warnings.
- Structural regression completed at13:20:37.009: live counts/status/durations, native model reveal, original metric labels, statistics menu and native Escape, hidden-menu Escape handling, unchanged draft/model and native fold restoration. First attempt sent Escape immediately after menu DOM appeared and failed; waiting for painted frames and deferred host listeners before native input passed, without changing product Escape logic.
- Eight-row settings regression completed at13:22:10.092, including boolean controls/intensity/draw pause/OFF/ON and original preference restoration. Final normal `npm run verify` passed TypeScript, production build and all26 tests; bundle scan found no temporary test code. Normal renderer setup completed at13:23:32.552. No forced desktop restart, commit or push.

## Six-palette release — 12:00

- Added an optional palette field, preserving legacy preferences without forcing a new schema fallback; default remains original blue. Tests cover six valid choices, unknown-value resolver safety, old settings preservation and schema round trips.
- All six actual setting buttons were exercised. Paused real Canvas repainted in-place; native home/search/new-session and both titlebars matched scoped materials; existing drag attribute remained. Background OFF permitted palette changes without creating a Canvas; OFF returned native home to its captured baseline.
- Two-stage test checkpoint verified jade survived an actual GUI rebuild/reload at11:56:36 and restored the original palette/preferences afterward. See local `glass-palette-checkpoint.json`. A previously incorrect main-storage-key assumption and a too-broad "native has no gradient" assertion were corrected as test issues, not counted as successful observations.
- Settings regression with eight rows completed at11:58:15, including all boolean controls, intensity slider, draw pause and exact original preferences restoration. No native model selection or message submission was performed by palette tests.
- Final normal `npm run verify` passed all20 tests. Bundle scan found no acceptance/test code. Normal renderer setup completed at12:00:57.069. Local screenshot `oc-ui-shots/glass-palette-settings-final.png` shows the actual six-color settings and glass navigation; private evidence is not included in the repository.
- Titlebars use a thicker smoke base after screenshot review found scroll text showing through the initial thin layer. This release does not claim that earlier GPU cost/ResizeObserver warnings have been eliminated, or that all36 host themes multiplied by six palettes received a new physical-device sweep.

## Expanded acceptance follow-up

- Full native theme sweep:36 themes × dark/light,72 screenshots. Window widths1600/1280/1024/800; actual zoom80/100/125/150/200%; simulated DPR1/1.25/1.5/2 with matched window and OFF/ON baseline. See ACCEPTANCE-20261106.md for first failed precondition and corrected rerun.
- Fixed light warning/error colors and paused entry opacity; added a deterministic contrast/pause regression. Real reduced-motion media simulation and native minimize/restore confirmed pause and no hidden canvas drawing. Native Page Visibility test restores Electron background throttling during the check; production never changes it.
- Same-window bounded performance measurements and130 Windows GPU counter samples are recorded, not a claim of negligible overhead. Background draws were23.43 and25.54fps in two60-second samples. Visible GPU cost remains a documented limitation.
- Intermittent ResizeObserver reproduced once while the master switch was OFF. Controlled72 native resizes over OFF/motion/static/OFF did not reproduce it. No suppression or unsupported attribution was added.
- Native host plugin-GUI switch OFF/ON passed style/canvas removal and single-instance restoration. Setting-control regression completed again at10:51:44.
- Final structure regression COMPLETE at11:27:20: real API convergence, native statistics Escape via CDP key input, hidden-menu Escape regression, actual getter-value draft/model invariants, native fold restoration and OFF/ON single-instance cleanup. Earlier synthetic-key delivery failures and getter-reference test weakness were corrected, not silently counted as passing.
- Final normal-entry verify passed15 tests; output contains no acceptance/test IPC or diagnostic entry code. Main loaded11:28:54.638 and renderer setup completed11:28:54.674. Local screenshot is `oc-ui-shots/acceptance-production-final.png`. Acceptance is functionally passing on covered cases, with explicit performance and intermittent-host-warning caveats, not an unconditional all-environments certification.

## Structure regression — 2026-11-06 10:15:01

- `GLASS_STRUCTURE_TEST COMPLETE`: 8 actual segments independently compared against message API identities, deduplicated counts, status and completed cumulative duration. Text/file/unknown boundaries stay outside summaries; 4 activity unit tests cover parallel timing, interrupted/error plus running, privacy and segmentation.
- Actual summary click hides native rows, a second click restores them. The native model button becomes visible after capsule expansion; its actual dialog opens and closes without selecting anything. Escape folds the capsule when no higher menu/dialog is open. Expanded capsule uses a short label to avoid squeezing model buttons.
- All five header labels (speed, TTFT, context, turn, quota) matched the installed source contributions. Native SDK statistics menu opened with pointer events and dismissed with Escape. Narrow-pane compact statistics buttons were visible; no extra quota endpoint was introduced.
- Input draft and model were unchanged. Master OFF removed all activity headers/member attributes, host hiding, model capsule/native-control attributes, native metric hiding and header statistics. Native model button was visible again. ON restored one capsule and activity summaries without duplicates.
- Tests use programmatic events on the real desktop DOM, not physical mouse automation. They restore plugin enabled preference. No message was sent, no credential/config/database was changed, no app restart or app.asar patch was performed.
- Earlier attempts are recorded in renderer.log: test used the wrong `MountedSession.composer` API; one run lacked a rendered activity list after a session change; Escape originally ran behind host event handling; an old test reference became disconnected after native dialog re-rendering; immediate live speed comparison raced its refresh; SDK menu needs pointerdown rather than `.click()`. Corrected the API/test synchronization and Escape focus/capture behavior. These failures were not acceptance passes.
- Live error/running combination is covered deterministically by unit tests, not by deliberately causing a production tool failure. All built-in themes, OS reduced-motion toggling, sustained GPU performance and every screen width remain outside this run.
- Stronger structure rerun completed at 10:17:17 with 12 groups, bottom-metric deduplication and native outer fold restoration additionally verified. Reference/material regression completed at 10:17:40 (actual composer glass, sidebar gradient, 14px activity blur, border geometry and summary folding). Local screenshot `oc-ui-shots/glass-structure-verified.png` shows completed summaries and actual running tool details, top statistics and collapsed model capsule.
- Final screenshot exposed lazy native collapsed groups with no mounted rows. Added a one-time native expansion to read real identities; unrecognized groups fall back to their previous fold within one second, recognized groups keep the summary and restore the original fold on disable. Full structure rerun completed at 10:20:19, including restoration of originally collapsed native groups and a real running eight-tool segment.
- Final normal-entry `npm run verify` passed typecheck, production build and all 14 tests. Bundle scan found no test/inspection markers. Real main loaded at 10:21:09.346; renderer setup completed at 10:21:09.432. `glass-production-final.png` confirms normal-entry completed/running summaries, header statistics and model capsule. Existing intermittent ResizeObserver loop notifications remain in host logs; no cause attribution or claim of eliminating them is made.

Host: OpenCode Desktop 2.2.5, Windows. No app.asar changes and no app restart during this test.

## Confirmed

- Standard SDK Vite preset builds; TypeScript `tsc --noEmit` passes.
- Minimal `src/probe.ts` hot-loaded: real main and renderer logs both contain `GLASS_PROBE_V1` at 18:00:08.
- Full GUI hot-loaded with the standard preset. Main log contains `GLASS_FULL_V1 main loaded`; renderer completed setup with enabled preferences.
- After another rebuild, runtime readback reports one aurora canvas, one plugin stylesheet (8053 characters), canvas size 1920 × 1032, z-index -1. No duplicate canvas after these reloads.
- Native application screenshot saved locally as `oc-ui-shots/glass-test-real.png`; blue tint visible on sidebar, prose still legible.

## Diagnosis correction

- The previous regex removed `delegateEvents(...)` but left the receiver `n.` before `exports.default`, corrupting the bundle. Actual renderer log at 17:51:44 reports `Cannot set properties of undefined (setting 'default')`.
- A plain Node test with the real Solid DOM module is not equivalent to the desktop main process: the real host supplies inert window-module placeholders. The previous `window is not defined` test did not establish the real host's failure.
- Do not strip compiler output. Current `vite.config.ts` uses only the official `gui()` preset.
- Earlier local-package resolution problems are separate from the now-tested GUI load path. This test does not prove a single root cause for all earlier failed attempts.

## Step 1 — master toggle (18:08)

- Removed eager canvas creation before reading the stored master switch.
- Disabled state now withdraws the Style contribution instead of leaving an empty stylesheet.
- Settings controls now read `prefs.value` via an accessor rather than capturing its current object.
- `npm run typecheck`, production build, and `npm run test:bundle` pass. The bundle test uses inert Solid modules to match the host's main-process module policy.
- Opt-in `tests/desktop-smoke.ts` exercised the actual host command `opencode-glass.toggle` and reactive persisted store for three off/on cycles. The real renderer logged seven PASS snapshots and COMPLETE at 18:08:47.
- Each OFF snapshot: enabled=false, canvas=0, veil=0, grain=0, styles=0.
- Each ON snapshot: enabled=true, canvas=1, veil=1, grain=1, styles=1.
- The test restores the initial enabled value. The normal build does not import the test entry and performs no automatic toggles.
- This establishes command-driven master-toggle behavior, not clicking the Settings switch or confirming frame cancellation/CPU from DOM counts alone.

### Reproduction

Run `npm run verify` for typecheck, normal build and bundle-load check.

For the opt-in real desktop test (changes only this plugin's master preference temporarily):

```powershell
$env:GLASS_DESKTOP_TEST = '1'
try { npm run build } finally { Remove-Item Env:GLASS_DESKTOP_TEST -ErrorAction SilentlyContinue }
# Check the current desktop renderer.log for GLASS_SWITCH_TEST COMPLETE / FAIL.
# Once the test has finished, ALWAYS rebuild the normal entry:
npm run verify
```

The normal build must not contain `GLASS_SWITCH_TEST`. Real-host tests require the desktop to be running and the plugin already configured. No restart is needed.

## Step 2 — Settings master switch (18:11–18:13)

- Added scoped `data-glass-settings` / `data-glass-setting` attributes for locating only this plugin's controls. No changes to host markup or business data.
- Opt-in `tests/settings-smoke.ts` mounted the production SettingsPage through the host's `ctx.layout.settings("glass")` API.
- The real renderer logged COMPLETE at 18:11:42. A stronger rerun also required visible layout (checkVisibility plus nonzero bounds) and completed at 18:13:46 with nine PASS checks.
- Confirmed six visible rows; master switch matched stored state; the actual control's DOM `.click()` toggled its real onChange handler, persisted preference, canvas and stylesheet.
- Navigated to General and back to Glass; the visible settings page retained the toggled state.
- Restored the initial state via the real switch. Toggling through the host command updated the already-mounted switch in both directions.
- Final state: enabled=true, checked=true, canvas=1, styles=1.
- This is programmatic interaction with the real rendered control, not an OS mouse/keyboard accessibility test. It does not establish persistence across app restart or individual background/parallax/shimmer/grain switch behavior.
- Run this test using `GLASS_DESKTOP_TEST='settings'` instead of `'1'` in the opt-in reproduction above, then always rebuild the normal entry after COMPLETE/FAIL.

## Step 3 — pointer parallax (18:23)

- Fixed disabled parallax still accepting pointer targets; disabled now ignores input and clears eased offsets. Added finite/clamped normalized input handling.
- Added window blur and document pointer-leave recentering, with lifecycle cleanup for both listeners.
- Four deterministic aurora tests pass: pointer changes gradient centres; OFF ignores input and no stale offset survives re-enable; invalid input is ignored/bounded; destroy cancels queued frame and resize subscription and removes canvas.
- Together with the main-process bundle check, `npm run verify` passes five tests.
- `tests/parallax-smoke.ts` is opt-in with `GLASS_DESKTOP_TEST='parallax'`. It clicks the real parallax Settings switch, dispatches synthetic PointerEvents, and samples the real 2D canvas's first radial gradient centre per rendered frame. It restores canvas methods and the original enabled/background/parallax preferences.
- First real-host attempt timed out collecting rendered frames at 18:20:52. It is NOT an acceptance pass and does not yet establish whether throttling/occlusion or plugin behavior caused the delay. A bounded rerun collects fewer frames and reports document visibility/focus on failure.
- The reduced-frame rerun completed at 18:23:03 with three PASS checks and COMPLETE. OFF drift across the sampled frames was 0.085 pixels (autonomous drift remains); ON pointer input moved the sampled gradient centre by dx=14.947 and dy=6.657 pixels. Pointer-leave recentered the gradient, and the same single canvas remained mounted throughout.
- This confirms real-host settings/event/render behavior with synthetic input. It does not establish smoothness at sustained frame rates, GPU cost, or physical OS cursor delivery. The first timeout remains recorded rather than being erased by the rerun.
- Middle timeline translucency is a separate outstanding visual issue: current near-opaque host base surfaces suppress the aurora far more than the preview. Do not treat loaded CSS/canvas or sidebar tint as visual acceptance of the main conversation area.

## Final implementation and regression

- Actual DOM layer audit showed the chat pane at alpha .852; its colors were further suppressed by the shell/veil. Replaced the global bg-base override with a selector scoped to the real chat pane. At the user's intensity 68, dark pane alpha is .375. No prose foreground/font/layout overrides.
- Local native screenshot `oc-ui-shots/glass-main-final.png` confirms blue/purple/teal aurora is visible throughout the chat area and text remains legible.
- Background OFF now destroys canvas/veil/grain instead of only hiding part of them. Grain OFF removes the grain element. Shimmer reduced-motion rule now targets the actual animated selectors.
- Added a persistent Animation switch, automatic reduced-motion handling, and hidden-document cancellation/resume. Canvas backing resolution is capped at 1280px wide (actual regression readback 1280 × 688). Aim is 30fps; this is a configured cap, not a measured sustained-performance claim.
- Colors/surface opacity follow light/dark appearance and native background/text tokens; menus are no longer hardcoded near-black. Theme-head mutations refresh canvas colors, with observer cleanup.
- Renderer unit tests cover pause/resume, visibility, reduced motion, input, and cancellation. Theme tests cover bounded intensity, real pause selectors, independent CSS removal, native tokens, and light-mode opacity. Typecheck/build and all 9 tests pass.
- Real-host `GLASS_FINAL_TEST COMPLETE` at 20:26:29 after 30 PASS checks: all seven settings rows; all boolean controls; background destruction; grain-only removal/restoration; shimmer CSS off/on; pause flag and unchanged real canvas draw count over a 400ms observation; backing resolution cap; slider 20/90; master withdrawal/re-enable; original user preferences restored.
- The final test clicks actual rendered Settings controls programmatically, not via physical OS input. It captures/restores only this plugin's preferences and temporary canvas instrumentation.
- Temporary layer-audit and delayed DOM diagnostic code have been removed from the normal plugin. Normal output contains no automatic test/navigation/pointer injection code. Optional test entries remain in `tests/` for reproducibility.

## Remaining verification limits (not unfinished requested functionality)

- No long-running CPU/GPU benchmark or guarantee across all graphics hardware / DPI settings.
- Native screenshot review was dark mode. Light-mode token/opacity behavior is covered by code/tests, but not a full real-host visual sweep across every built-in theme.
- Hidden-window/reduced-motion cancellation is deterministically tested using a mocked environment; changing the real OS accessibility setting was deliberately not automated.
- No destructive uninstall or database edits. Actual master-disable proves stylesheet/layer withdrawal; renderer tests prove frame/listener cleanup. Lifecycle code also disconnects the theme observer.
- Restart-persistence is delegated to the existing host Store.global. Same-process settings reopening was verified; no additional app restart was forced for final testing.

Full plugin is currently active. Usage, build and safe removal are documented in README.md.
Pre-test Vite config and bundle are preserved only on the original development machine (those contain the known broken strip approach and should not be restored as a fix).
