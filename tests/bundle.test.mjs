import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { test } from "node:test"
import * as effect from "effect"
import * as main from "@opencode/plugin/gui/main"

// Match the host's main-process policy: DOM/Solid modules are inert, not real
// browser modules. This is a load/export check, not a substitute for the app.
const inert = new Proxy(function () {}, {
  get: (_, key) => key === "then" ? undefined : inert,
  apply: () => inert,
  construct: () => inert,
})

test("standard bundle evaluates without a DOM and exports the GUI definition", async () => {
  const code = await readFile(new URL("../dist/gui-experimental.cjs", import.meta.url), "utf8")
  const shared = new Map([
    ["effect", effect],
    ["@opencode/plugin/gui", main],
    ["solid-js", inert],
    ["solid-js/web", inert],
    ["solid-js/store", inert],
  ])
  const module = { exports: {} }
  Function("require", "module", "exports", code)((id) => {
    assert.ok(shared.has(id), `Unexpected external: ${id}`)
    return shared.get(id)
  }, module, module.exports)
  const plugin = module.exports.default
  assert.equal(typeof plugin.setup, "function")
  assert.equal(typeof plugin.main, "function")
  assert.equal(plugin.stores.prefs.scope, "global")
  assert.equal(plugin.stores.prefs.initial.enabled, true)
})
