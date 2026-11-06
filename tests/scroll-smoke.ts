import { Plugin } from '@opencode/plugin/gui'
import audit, { Audit } from './acceptance'
import plugin from '../src/gui'
export default Plugin.define({ ...audit, setup(ctx) {
  const cleanup=plugin.setup?.(ctx)
  let stopped=false, restore:(()=>void)|undefined
  const call=async(input:object)=>JSON.parse(await ctx.main(Audit).control(JSON.stringify(input)))
  const frame=()=>new Promise<void>((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())))
  void(async()=>{try{
    await call({op:'info'});await frame()
    const viewport=document.querySelector<HTMLElement>('[data-slot=session-timeline-scroll] .scroll-view__viewport')
    if(!viewport)throw new Error('No active timeline')
    const original=viewport.scrollTop;restore=()=>{viewport.scrollTop=original}
    const box=viewport.getBoundingClientRect()
    for(let i=0;i<4&&!stopped;i++){
      await call({op:'cdp',method:'Input.dispatchMouseEvent',params:{type:'mouseWheel',x:box.x+box.width/2,y:box.y+box.height/2,deltaX:0,deltaY:-180}})
      await frame();await frame()
      const content=document.querySelector<HTMLElement>('[data-glass-timeline-clip]')
      const shield=document.querySelector<HTMLElement>('[data-session-title]')
      if(!content||!shield)throw new Error('Protection missing')
      const expected=Math.max(0,shield.getBoundingClientRect().bottom-content.getBoundingClientRect().top)
      if(Math.abs(parseFloat(content.style.getPropertyValue('--glass-header-cut'))-expected)>2)throw new Error('Scroll clip is stale')
    }
    console.info('GLASS_SCROLL_TEST COMPLETE cached clip follows native upward wheel')
  }catch(e){console.error('GLASS_SCROLL_TEST FAIL',String(e))}
  finally{restore?.();if(!stopped)await call({op:'reset'})}})()
  return()=>{stopped=true;restore?.();cleanup?.()}
} })
