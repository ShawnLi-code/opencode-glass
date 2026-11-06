import { Plugin } from '@opencode/plugin/gui'
import plugin from '../src/gui'
import { indexActivity } from '../src/activity'
export default Plugin.define({ ...plugin, setup(ctx) {
  const cleanup = plugin.setup?.(ctx)
  const timer = window.setTimeout(() => {
    const session = ctx.sessions.current(), messages = session?.server.data.session.message.list(session.id) ?? []
    const index = indexActivity(messages)
    const lists = Array.from(document.querySelectorAll<HTMLElement>('[data-component=context-tool-group-list]'))
    console.info('GLASS_STRUCTURE_INSPECT', JSON.stringify({ messages: messages.length, indexed: index.size,
      panes: document.querySelectorAll('[data-slot=session-chat-panel]').length,
      lists: lists.length, headers: document.querySelectorAll('[data-glass-activity-header]').length,
      sample: lists.slice(-2).map((list) => ({ children: Array.from(list.children).slice(0, 5).map((item) => ({
        tag: item.tagName, slot: item.getAttribute('data-slot'),
        parts: Array.from(item.querySelectorAll('[data-timeline-part-id]')).slice(0, 5).map((el) => ({
          id: el.getAttribute('data-timeline-part-id'), matched: index.has(el.getAttribute('data-timeline-part-id')!),
        })),
      })) })),
    }))
  }, 1200)
  return () => { window.clearTimeout(timer); cleanup?.() }
} })
