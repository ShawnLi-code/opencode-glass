import { defineConfig } from "vite"
import { gui } from "@opencode/plugin/gui/vite"

export default defineConfig({
  define: {
    __GLASS_AUDIT_EXTENDED__: JSON.stringify(process.env.GLASS_AUDIT_EXTENDED === '1'),
    __GLASS_AUDIT_PERF__: JSON.stringify(process.env.GLASS_AUDIT_PERF === '1'),
  },
  plugins: [gui({
    entry: process.env.GLASS_DESKTOP_TEST === "new-session"
      ? "tests/new-session-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "scroll"
      ? "tests/scroll-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "material"
      ? "tests/material-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "material-inspect"
      ? "tests/material-inspect.ts"
      : process.env.GLASS_DESKTOP_TEST === "palette"
      ? "tests/palette-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "palette-inspect"
      ? "tests/palette-inspect.ts"
      : process.env.GLASS_DESKTOP_TEST === "host-unload"
      ? "tests/host-unload-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "acceptance-resize"
      ? "tests/acceptance-resize.ts"
      : process.env.GLASS_DESKTOP_TEST === "acceptance"
      ? "tests/acceptance.ts"
      : process.env.GLASS_DESKTOP_TEST === "structure"
      ? "tests/structure-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "structure-inspect"
      ? "tests/structure-inspect.ts"
      : process.env.GLASS_DESKTOP_TEST === "layout-inspect"
      ? "tests/layout-inspect.ts"
      : process.env.GLASS_DESKTOP_TEST === "timeline"
      ? "tests/timeline-setup.ts"
      : process.env.GLASS_DESKTOP_TEST === "reference"
      ? "tests/reference-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "inspect"
      ? "tests/inspect-style.ts"
      : process.env.GLASS_DESKTOP_TEST === "final"
      ? "tests/final-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "parallax"
      ? "tests/parallax-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "settings"
      ? "tests/settings-smoke.ts"
      : process.env.GLASS_DESKTOP_TEST === "1" ? "tests/desktop-smoke.ts" : "src/gui.tsx",
  })],
})
