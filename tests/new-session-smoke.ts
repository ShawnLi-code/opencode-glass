import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup=plugin.setup?.(ctx), original=ctx.sessions.current(), prefs={...ctx.stores.prefs.value}
  let stopped=false
  const timers=new Set<number>()
  const delay=()=>new Promise<void>((resolve)=>{const t=window.setTimeout(()=>{timers.delete(t);resolve()},100);timers.add(t)})
  const call=async(input:object)=>JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  const restore=()=>{ctx.stores.prefs.update((p)=>{Object.assign(p,prefs)});if(original)ctx.tabs.open({server:original.server.id,id:original.id},{focus:true})}
  const wait=async(label:string,check:()=>boolean)=>{const end=performance.now()+12000;while(!stopped&&performance.now()<end){if(check())return;await delay()}throw new Error(label)}
  void(async()=>{try{
    await call({op:'info'})
    document.querySelector<HTMLElement>('[data-action=vertical-tabs-new-session]')?.click()
    await wait('new session visible',()=>!ctx.sessions.current()&&!!document.querySelector('[data-component=new-session] [data-component=composer]'))
    ctx.stores.prefs.update((p)=>{p.enabled=true;p.background=true})
    await wait('new session model capsule ready',()=>!!document.querySelector('[data-component=new-session] [data-glass-model-toggle]'))
    const root=document.querySelector<HTMLElement>('[data-component=new-session]')!
    // The SDK has no screen.current() for an unsent draft route.
    const text=()=>root.querySelector('[contenteditable=true]')?.textContent
    const modelLabel=()=>root.querySelector('[data-action=composer-model]')?.textContent
    const draft=text(),model=modelLabel(), glass=getComputedStyle(root).backgroundColor
    if(!glass.startsWith('rgba('))throw new Error('Opaque new session surface remains')
    const toggle=root.querySelector<HTMLElement>('[data-glass-model-toggle]')!
    toggle.click();await wait('native model controls revealed',()=>!!root.querySelector<HTMLElement>('[data-action=composer-model]')?.checkVisibility());toggle.click()
    ctx.stores.prefs.update((p)=>{p.enabled=false})
    await wait('OFF restores native new session controls',()=>!root.querySelector('[data-glass-model-toggle]')&&!!root.querySelector<HTMLElement>('[data-action=composer-model]')?.checkVisibility())
    if(getComputedStyle(root).backgroundColor===glass)throw new Error('Native new session background not restored')
    ctx.stores.prefs.update((p)=>{p.enabled=true})
    await wait('ON restores new session capsule',()=>!!root.querySelector('[data-glass-model-toggle]'))
    if(text()!==draft||modelLabel()!==model)throw new Error('Draft text or native model label changed')
    const composer=document.querySelector('[data-component=composer]')
    const rows=[]
    for(let el=composer,i=0;el&&i<13;el=el.parentElement,i++){
      const css=getComputedStyle(el)
      rows.push({tag:el.tagName,attrs:Object.fromEntries(Array.from(el.attributes).filter((a)=>/^(class|data-)/.test(a.name)).map((a)=>[a.name,a.value])),background:css.backgroundColor,box:el.getBoundingClientRect()})
    }
    console.info('GLASS_NEW_SESSION_INSPECT',JSON.stringify({path:ctx.router.path(),session:!!ctx.sessions.current(),rows}))
    await new Promise<void>((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())))
    await call({op:'capture',name:'new-session-current'})
    console.info('GLASS_NEW_SESSION_TEST COMPLETE glass surface, model reveal, OFF restoration and draft/model unchanged')
  }catch(e){console.error('GLASS_NEW_SESSION_TEST FAIL',String(e))}
  finally{if(!stopped){restore();await call({op:'reset'})}}})()
  return()=>{stopped=true;timers.forEach(window.clearTimeout);restore();cleanup?.()}
} })
