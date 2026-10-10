import { coreContexts, functionContexts, industryContexts, executiveContexts } from '../../inventory/contexts.mjs';

export const contexts = [...coreContexts, ...Object.values(functionContexts), ...Object.values(industryContexts), ...Object.values(executiveContexts)];
export const contextTerms = [...new Set(contexts.flatMap(c => [c.label, c.deliverable, c.source, c.owner]))].sort((a,b) => b.length-a.length);
export function normalize(text) {
  let value = text.trim();
  for (let i=0; i<contextTerms.length; i++) value = value.split(contextTerms[i]).join(`{{C${i}}}`);
  return value;
}
export function segments(text) {
  return normalize(text).split(/(?<=[.!?])\s+|\n+|;\s+/u).map(s=>s.trim()).filter(Boolean);
}
export function unitKey(segment) {
  const prefix=segment.match(/^(Scenario: |Use: |Rule: |Risk: |Evidence: |Extra (?:function|industry|leadership) cue: |Additional detail: |Tailor it to this question: )/)?.[0]??'';
  const slots=[];
  const key=segment.slice(prefix.length).replace(/\{\{C(\d+)\}\}/g,(_,id)=>{slots.push(Number(id));return `{{${slots.length-1}}}`;}).replace(/[.!?]$/,'');
  return {key,prefix,slots};
}
export function fields(q) {
  const out=[];
  const add=(obj,key,thaiObj,thaiKey)=> { if(typeof obj?.[key]==='string' && obj[key]) out.push({obj,key,thaiObj,thaiKey,text:obj[key]}); };
  q.th ??= {};
  for(const key of ['context','prompt','rationale']) add(q,key,q.th,key);
  const opts=arr=> { for(const o of arr??[]) {add(o,'label',o,'thLabel');add(o,'feedback',o,'thFeedback');} };
  opts(q.options);
  const d=q.userFacingDraft;
  if(d) {
    d.th ??={};
    for(const key of ['context','prompt','explanation','rewriteNotes']) add(d,key,d.th,key);
    opts(d.options);
    for(const p of d.parts??[]) {add(p,'prompt',p,'thPrompt');opts(p.options);}
  }
  const a=q.artifactNeed;
  if(a) {a.th??={};for(const key of ['need','artifactLabel','artifactBrief','generationPrompt','prompt']) add(a,key,a.th,key);}
  return out;
}
