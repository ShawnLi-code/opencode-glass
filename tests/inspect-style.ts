import { Plugin } from "@opencode/plugin/gui"
import plugin from "../src/gui"
export default Plugin.define({
  ...plugin,
  setup(ctx) {
    const cleanup = plugin.setup?.(ctx)
    const tree = (el: Element, depth = 0): unknown => ({
      tag: el.tagName, attrs: Object.fromEntries(Array.from(el.attributes)
        .filter((a) => /^(class|data-|role$|aria-expanded$|aria-current$)/.test(a.name))
        .map((a) => [a.name, a.value.slice(0, 250)])),
      children: depth < 3 ? Array.from(el.children).slice(0, 6).map((child) => tree(child, depth + 1)) : [],
    })
    const timer = window.setTimeout(() => {
      for (const selector of [
        '[data-component=collapsed-tool-group] > .tool-collapsible',
        '[data-component=task-tool-surface]', '[data-slot=vertical-tabs-mount]',
        '[data-component=dock-prompt]', '[data-component=prompt-input]',
        '[data-component=apply-patch-file-diff]',
        '[data-slot=basic-tool-tool-trigger-content]', '[data-slot=sidebar-inbox]',
        '[data-slot=context-tool-group-item]',
      ]) {
        const els = Array.from(document.querySelectorAll(selector))
        console.info("GLASS_STYLE_INSPECT", JSON.stringify({ selector, count: els.length, sample: els.slice(0, 2).map((el) => tree(el)) }))
      }
      const editor = document.querySelector('[contenteditable=true]')
      if (editor) {
        const ancestors = []
        for (let el: Element | null = editor.parentElement, i = 0; el && i < 6; el = el.parentElement, i++) {
          ancestors.push({ tag: el.tagName, attrs: Object.fromEntries(Array.from(el.attributes)
            .filter((a) => /^(class|data-|role$)/.test(a.name)).map((a) => [a.name, a.value])) })
        }
        console.info("GLASS_STYLE_EDITOR", JSON.stringify(ancestors))
      }
    }, 700)
    return () => { window.clearTimeout(timer); cleanup?.() }
  },
})
