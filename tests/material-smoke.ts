import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
import { PALETTES } from '../src/palettes'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup = plugin.setup?.(ctx), initial = { ...ctx.stores.prefs.value }
  let stopped = false, restoreScroll: (() => void) | undefined
  const timers = new Set<number>()
  const delay = () => new Promise<void>((resolve) => { const t=window.setTimeout(() => { timers.delete(t); resolve() },100);timers.add(t) })
  const q = (selector: string) => document.querySelector<HTMLElement>(selector)
  const call = async (input: { op: string; [key: string]: unknown }) => {
    if(input.op==='capture') {
      await new Promise<void>((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())))
      await delay()
    }
    return JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  }
  const update = (value: Partial<typeof initial>) => ctx.stores.prefs.update((p) => { Object.assign(p,value) })
  const wait = async (label: string, check: () => boolean) => {
    const end=performance.now()+15000
    while(!stopped && performance.now()<end) { if(check()) { console.info('GLASS_MATERIAL_TEST PASS',label);return };await delay() }
    throw new Error(label)
  }
  const assert = (value: unknown, label: string) => { if(!value) throw new Error(label); console.info('GLASS_MATERIAL_TEST PASS',label) }
  const header = () => q('.session-header-layout')?.parentElement?.parentElement
  const restore = () => update(initial)
  void (async () => { try {
    await call({op:'info'})
    update({ enabled:true })
    ctx.layout.settings('glass')
    await wait('glass settings visible',() => !!q('[data-glass-settings]')?.checkVisibility())
    await call({op:'capture',name:'material-after-glass-settings'})
    const agy = Array.from(document.querySelectorAll('[role=tab]')).find((el) => el.textContent?.trim()==='Antigravity')?.id.match(/-trigger-(.+)$/)?.[1]
    if(agy) {
      ctx.layout.settings(agy)
      await wait('neutral settings cards tagged',() => !!q('[data-glass-settings-surface]')?.checkVisibility())
      const cards=Array.from(document.querySelectorAll<HTMLElement>('[data-glass-settings-surface]'))
      assert(cards.length>=2,'multiple neutral settings surfaces unified')
      const screen=q('[data-testid=settings-screen]')!, screenBackground=getComputedStyle(screen).backgroundColor
      console.info('GLASS_MATERIAL_TEST SURFACES',JSON.stringify({screen:screenBackground,cards:cards.map((el)=>({kind:el.dataset.glassSettingsSurface,background:getComputedStyle(el).backgroundColor}))}))
      console.info('GLASS_MATERIAL_TEST SETTINGSDETAIL',JSON.stringify({tabs:Array.from(document.querySelectorAll('[role=tab]')).filter((el)=>el.textContent?.trim()==='Antigravity').map((el)=>({attrs:Object.fromEntries(Array.from(el.attributes).map((a)=>[a.name,a.value])),background:getComputedStyle(el).backgroundColor})),buttons:Array.from(screen.querySelectorAll('button')).filter((el)=>el.textContent?.trim()==='添加账号').map((el)=>({attrs:Object.fromEntries(Array.from(el.attributes).map((a)=>[a.name,a.value])),background:getComputedStyle(el).backgroundColor,color:getComputedStyle(el).color}))}))
      console.info('GLASS_MATERIAL_TEST TABCHILDREN',JSON.stringify(Array.from(screen.querySelectorAll('[role=tab][aria-selected=true] *')).map((el)=>({attrs:Object.fromEntries(Array.from(el.attributes).map((a)=>[a.name,a.value])),background:getComputedStyle(el).backgroundColor,image:getComputedStyle(el).backgroundImage}))))
      console.info('GLASS_MATERIAL_TEST INDICATORS',JSON.stringify(Array.from(screen.querySelectorAll('[data-slot*=indicator],[data-part=indicator]')).map((el)=>({attrs:Object.fromEntries(Array.from(el.attributes).map((a)=>[a.name,a.value])),background:getComputedStyle(el).backgroundColor}))))
      console.info('GLASS_MATERIAL_TEST NAVSURFACE',JSON.stringify(Array.from(screen.querySelectorAll('*')).filter((el)=>{const r=el.getBoundingClientRect();return !el.closest('.settings-panel')&&r.width>100&&r.height>=20&&r.height<70&&getComputedStyle(el).backgroundColor!=='rgba(0, 0, 0, 0)'}).map((el)=>({attrs:Object.fromEntries(Array.from(el.attributes).map((a)=>[a.name,a.value])),background:getComputedStyle(el).backgroundColor}))))
      await call({op:'capture',name:'material-after-settings'})
      update({enabled:false})
      await wait('OFF removes all settings markers',()=>!q('[data-glass-settings-surface],[data-glass-control-ink]'))
      assert(getComputedStyle(screen).backgroundColor!==screenBackground,'OFF restores native settings canvas')
      update({enabled:true})
      await wait('settings material returns after ON',()=>!!q('[data-glass-settings-surface]'))
    }
    Array.from(document.querySelectorAll<HTMLElement>('button')).find((b)=>b.checkVisibility()&&(b.getAttribute('aria-label')==='返回应用'||b.textContent?.trim()==='返回应用'))?.click()
    await wait('composer visible after settings',()=>!!q('[data-component=composer]')?.checkVisibility())
    const nativeHeader=header()
    console.info('GLASS_MATERIAL_TEST STRUCTURE',JSON.stringify({parents:(()=>{const rows=[];for(let p=nativeHeader,i=0;p&&i<8;p=p.parentElement,i++)rows.push({tag:p.tagName,slot:p.getAttribute('data-slot'),class:p.className});return rows})(),visibleLayers:Array.from(document.querySelectorAll('[data-slot=session-timeline-visible]')).map((el)=>({box:el.getBoundingClientRect(),parent:el.parentElement?.getAttribute('data-slot')})),slots:Array.from(document.querySelectorAll('[data-slot]')).map((el)=>el.getAttribute('data-slot')).filter((s)=>/timeline|scroll/.test(s!))}))
    await wait('session material and timeline clip ready',()=>!!q('[data-glass-timeline-clip]')&&!!q('[data-glass-model-toggle]')?.checkVisibility())
    const content=q('[data-glass-timeline-clip]')!, bar=header()!
    const clipCheck=()=>{
      const shield=bar.parentElement?.hasAttribute('data-session-title')?bar.parentElement:bar
      const cut=parseFloat(content.style.getPropertyValue('--glass-header-cut')),expected=shield.getBoundingClientRect().bottom-content.getBoundingClientRect().top
      return cut>0&&Math.abs(cut-expected)<1&&getComputedStyle(content).clipPath.startsWith('inset(')
    }
    await wait('clip matches actual header bottom',clipCheck)
    const tree=(el:Element,depth=0):unknown=>({tag:el.tagName,slot:el.getAttribute('data-slot'),component:el.getAttribute('data-component'),class:el.className,style:el.getAttribute('style'),box:el.getBoundingClientRect(),children:depth<2?Array.from(el.children).slice(0,12).map((c)=>tree(c,depth+1)):[]})
    console.info('GLASS_MATERIAL_TEST PAINTTREE',JSON.stringify({viewport:tree(q('[data-slot=session-timeline-scroll] .scroll-view__viewport')!),paint:tree(content)}))
    assert(!content.contains(bar),'timeline clipping cannot clip native titlebar')
    const host=q('[data-glass-activity-host]')
    if(host) {
      console.info('GLASS_MATERIAL_TEST HOST',JSON.stringify({background:getComputedStyle(host).backgroundColor,overflow:getComputedStyle(host).overflow,classes:host.className}))
      console.info('GLASS_MATERIAL_TEST CASCADE',JSON.stringify(Array.from(document.styleSheets).flatMap((sheet)=>{try{return Array.from(sheet.cssRules).filter((r):r is CSSStyleRule=>r instanceof CSSStyleRule&&!!r.style.background&&host.matches(r.selectorText)).map((r)=>({selector:r.selectorText,background:r.style.background,priority:r.style.getPropertyPriority('background')}))}catch{return[]}})))
      await wait('activity host no longer adds a white slab or clips detail',()=>getComputedStyle(host).backgroundColor==='rgba(0, 0, 0, 0)'&&getComputedStyle(host).overflow==='visible')
    }
    console.info('GLASS_MATERIAL_TEST HEADER',JSON.stringify({cut:content.style.getPropertyValue('--glass-header-cut'),clip:getComputedStyle(content).clipPath,background:getComputedStyle(bar).backgroundColor}))
    await call({op:'capture',name:'material-after-chat'})
    const viewport=q('[data-slot=session-timeline-scroll] .scroll-view__viewport')!,originalScroll=viewport.scrollTop
    restoreScroll=()=>{viewport.scrollTop=originalScroll}
    const destination=Math.max(0,originalScroll-250)
    if(destination!==originalScroll) {
      viewport.scrollTop=destination
      await wait('timeline clip follows native scrolling',()=>viewport.scrollTop===destination&&clipCheck())
      await call({op:'capture',name:'material-after-scroll'})
      restoreScroll();await wait('original native scroll offset restored',()=>viewport.scrollTop===originalScroll&&clipCheck())
    }
    restoreScroll=undefined
    const collapsed=q('[data-glass-activity-header][aria-expanded=false]')
    if(collapsed) {
      const oldScroll=viewport.scrollTop
      restoreScroll=()=>{viewport.scrollTop=oldScroll}
      const vr=viewport.getBoundingClientRect()
      await call({op:'cdp',method:'Input.dispatchMouseEvent',params:{type:'mouseWheel',x:vr.x+vr.width/2,y:vr.y+vr.height/2,deltaX:0,deltaY:-200}})
      await wait('native wheel leaves follow-bottom before tool inspection',()=>viewport.scrollTop<oldScroll)
      collapsed.scrollIntoView({block:'center',behavior:'instant'})
      await wait('activity card genuinely in visible reading area',()=>{const r=collapsed.getBoundingClientRect();return r.top>bar.getBoundingClientRect().bottom&&r.top<innerHeight-160})
      collapsed.click();await wait('native activity details expanded',()=>collapsed.getAttribute('aria-expanded')==='true')
      collapsed.scrollIntoView({block:'center',behavior:'instant'})
      await wait('expanded card remains in visible viewport',()=>{const r=collapsed.getBoundingClientRect();return r.top>bar.getBoundingClientRect().bottom&&r.top<innerHeight-160&&r.height>0})
      await call({op:'capture',name:'material-after-expanded'})
      collapsed.click();await wait('activity card collapsed again',()=>collapsed.getAttribute('aria-expanded')==='false')
      await wait('scroll restored after visible tool inspection',()=>{restoreScroll!();return Math.abs(viewport.scrollTop-Math.min(oldScroll,viewport.scrollHeight-viewport.clientHeight))<2&&clipCheck()});restoreScroll=undefined
    }
    const composer=ctx.screen.current()!.composer,draft=composer.text(),model=JSON.stringify(composer.model())
    for(const palette of PALETTES) {
      update({palette:palette.id})
      await wait(`neutral material and clip survive ${palette.id}`,()=>document.documentElement.dataset.glassPalette===palette.id&&clipCheck())
    }
    assert(composer.text()===draft&&JSON.stringify(composer.model())===model,'material and palette changes preserve real draft and model')
    update({palette:initial.palette})
    const normalWidth=innerWidth
    await call({op:'zoom',value:2})
    await wait('host zoom actually changes viewport width',()=>innerWidth<normalWidth*.65)
    await wait('clip follows 200 percent zoom',clipCheck)
    await call({op:'capture',name:'material-after-zoom200'})
    await call({op:'zoom',value:1})
    await wait('host viewport width restored',()=>innerWidth===normalWidth)
    await wait('clip follows 100 percent zoom',clipCheck)
    update({enabled:false})
    await wait('OFF restores timeline paint and removes bridge markers',()=>!q('[data-glass-timeline-clip]')&&!q('[data-glass-settings-surface]'))
    assert(!content.style.getPropertyValue('--glass-header-cut')&&getComputedStyle(content).clipPath==='none','OFF restores host clip property')
    restore()
    console.info('GLASS_MATERIAL_TEST COMPLETE',JSON.stringify({originalPalette:initial.palette}))
  } catch(e) { if(!stopped) console.error('GLASS_MATERIAL_TEST FAIL',String(e),JSON.stringify({path:ctx.router.path(),enabled:ctx.stores.prefs.value.enabled,model:!!q('[data-glass-model-toggle]'),clips:document.querySelectorAll('[data-glass-timeline-clip]').length,headers:Array.from(document.querySelectorAll<HTMLElement>('.session-header-layout')).map((el)=>{const h=el.parentElement?.parentElement,c=h?.closest('[data-slot=session-timeline-scroll]')?.querySelector('[data-slot=session-timeline-visible]');return{visible:el.checkVisibility(),header:h?.getBoundingClientRect(),content:c?.getBoundingClientRect(),contains:c?.contains(h!)}})})) }
  finally { restoreScroll?.();if(!stopped) { restore();await call({op:'reset'}) } } })()
  return ()=>{stopped=true;timers.forEach(window.clearTimeout);restoreScroll?.();restore();cleanup?.()}
} })
