import fs from 'node:fs';
import {contextTerms,segments,unitKey} from './thai-inventory-text.mjs';
const dictionary=JSON.parse(fs.readFileSync(new URL('../../inventory/th/sentences.json',import.meta.url),'utf8'));
const terms=JSON.parse(fs.readFileSync(new URL('../../inventory/th/context-terms.json',import.meta.url),'utf8'));
const lower=new Map(Object.entries(dictionary).map(([en,th])=>[en.toLowerCase(),th]));
export function translateUnit(s) {
  if(lower.has(s.toLowerCase()))return lower.get(s.toLowerCase());
  for(const [prefix,th] of [['Here, ','ในกรณีนี้ '],['This choice fits a different evidence pattern: ','ตัวเลือกนี้เหมาะกับหลักฐานคนละรูปแบบ: ']]) {
    if(s.startsWith(prefix))return th+translateUnit(s.slice(prefix.length));
  }
  const m=s.match(/^The best first check is "(.*)"$/);
  if(m)return `สิ่งแรกที่ควรตรวจที่สุดคือ “${translateUnit(m[1].replace(/\.$/,''))}”`;
  throw new Error(`Missing complete Thai sentence: ${s}`);
}
const prefixes={
  'Scenario: ':'สถานการณ์: ', 'Use: ':'ข้อมูลที่ใช้: ', 'Rule: ':'ข้อกำหนด: ', 'Risk: ':'ความเสี่ยง: ',
  'Evidence: ':'หลักฐาน: ', 'Extra function cue: ':'เงื่อนไขเพิ่มเติมของสายงาน: ',
  'Extra industry cue: ':'เงื่อนไขเพิ่มเติมของอุตสาหกรรม: ', 'Extra leadership cue: ':'เงื่อนไขเพิ่มเติมของผู้บริหาร: ',
  'Additional detail: ':'รายละเอียดเพิ่มเติม: ', 'Tailor it to this question: ':'ปรับให้ตรงกับคำถามนี้: ',
};
export function translate(text) {
  if(!text)return '';
  return text.split(/\r?\n/).map(line=>segments(line).map(s=>{
    const {key,prefix,slots}=unitKey(s);
    const th=translateUnit(key).replace(/\{\{(\d+)\}\}/g,(_,n)=>{
      const term=contextTerms[slots[Number(n)]];
      if(!term||!terms[term])throw new Error(`Missing context term: ${term}`);
      return terms[term];
    });
    if(/\{\{/.test(th))throw new Error(`Unresolved placeholder: ${th}`);
    return (prefixes[prefix]??'')+th;
  }).join(' ')).join('\n');
}
export function englishProjection(value) {
  if(Array.isArray(value))return value.map(englishProjection);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value)
    .filter(([k])=>!['th','thLabel','thFeedback','thPrompt','translation','locale'].includes(k))
    .map(([k,v])=>[k,englishProjection(v)]));
  return value;
}
