import { Schema } from "effect"
import { Plugin, Store } from "@opencode/plugin/gui"
import { PALETTE_IDS } from './palettes'

export const Prefs = Schema.Struct({
  /** Master switch. Off leaves the app exactly as it was. */
  enabled: Schema.Boolean,
  /** How much glass: 0 is nearly solid, 100 is nearly transparent. */
  intensity: Schema.Number,
  /** Aurora blobs drift with the pointer. */
  parallax: Schema.Boolean,
  /** A slow light band sweeps across the frosted panels. */
  shimmer: Schema.Boolean,
  /** The animated background itself. */
  background: Schema.Boolean,
  /** Film grain over the background, so the gradients do not band. */
  grain: Schema.Boolean,
  motion: Schema.Boolean,
  styleRevision: Schema.Number,
  // Optional so existing stored preferences decode without resetting other fields.
  palette: Schema.optional(Schema.Literals(PALETTE_IDS)),
  backgroundStyle: Schema.optional(Schema.Literals(['aurora', 'tide', 'glow'])),
})

export type Prefs = typeof Prefs.Type

export const DEFAULT_PREFS: Prefs = {
  enabled: true,
  intensity: 62,
  parallax: true,
  shimmer: false,
  background: true,
  grain: true,
  motion: true,
  styleRevision: 0,
  palette: 'blue',
  backgroundStyle: 'aurora',
}

export const definition = Plugin.define({
  stores: {
    prefs: Store.global(Prefs, DEFAULT_PREFS),
  },
  i18n: {
    en: {
      title: "Glass",
      "settings.palette": "Glass palette",
      "settings.backgroundStyle": "Background style",
      "settings.backgroundStyle.description": "Choose a light and particle effect for the whole window.",
      "backgroundStyle.aurora": "Aurora ribbons",
      "backgroundStyle.tide": "Tidal particles",
      "backgroundStyle.glow": "Soft glow",
      "settings.palette.description": "Switch the background, navigation, titlebars and accents together. Does not change the native app theme.",
      "palette.blue": "Deep blue",
      "palette.graphite": "Smoked graphite",
      "palette.jade": "Jade green",
      "palette.violet": "Dusk violet",
      "palette.ice": "Glacier cyan",
      "palette.amber": "Warm amber",
      "settings.motion": "Animation",
      "settings.motion.description": "Pause all motion while keeping the glass background. Reduced motion is respected automatically.",
      "settings.intensity": "Glass intensity",
      "settings.intensity.description": "How much of the background shows through the panels.",
      "settings.intensity.low": "Subtle",
      "settings.intensity.medium": "Balanced",
      "settings.intensity.high": "Full",
      "settings.background": "Animated background",
      "settings.background.description": "An aurora that drifts behind the interface.",
      "settings.parallax": "Pointer parallax",
      "settings.parallax.description": "The aurora follows the pointer.",
      "settings.shimmer": "Light sweep",
      "settings.shimmer.description": "A slow highlight travels across the frosted panels.",
      "settings.grain": "Film grain",
      "settings.grain.description": "Fine noise over the background, to avoid gradient banding.",
      "command.toggle": "Toggle glass",
      "command.toggle.description": "Turn the glassmorphism theme on or off.",
    },
    zh: {
      title: "玻璃",
      "settings.palette": "玻璃配色",
      "settings.backgroundStyle": "背景效果",
      "settings.backgroundStyle.description": "选择应用于整个窗口的光影与粒子效果。",
      "backgroundStyle.aurora": "极光丝带",
      "backgroundStyle.tide": "潮汐粒子",
      "backgroundStyle.glow": "柔光流动",
      "settings.palette.description": "背景、导航、顶栏和强调色一起切换；不改动原生主题设置。",
      "palette.blue": "深蓝极光",
      "palette.graphite": "石墨烟灰",
      "palette.jade": "翡翠墨绿",
      "palette.violet": "暮色紫",
      "palette.ice": "冰川青",
      "palette.amber": "琥珀暖灰",
      "settings.motion": "动画",
      "settings.motion.description": "关闭后保留静态玻璃背景；系统减少动态效果时自动暂停。",
      "settings.intensity": "玻璃强度",
      "settings.intensity.description": "背景从面板透出的程度。",
      "settings.intensity.low": "克制",
      "settings.intensity.medium": "标准",
      "settings.intensity.high": "通透",
      "settings.background": "动态背景",
      "settings.background.description": "界面背后缓慢流动的极光。",
      "settings.parallax": "鼠标视差",
      "settings.parallax.description": "极光跟随鼠标位置偏移。",
      "settings.shimmer": "流光扫过",
      "settings.shimmer.description": "一道高光缓慢掠过磨砂面板。",
      "settings.grain": "颗粒噪点",
      "settings.grain.description": "背景上的细噪点，避免渐变出现色带。",
      "command.toggle": "开关玻璃",
      "command.toggle.description": "打开或关闭玻璃拟态主题。",
    },
  },
})
