/* ===== My CC shared helpers, card viewer, and the home page case ===== */
(function(){
"use strict";
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const usd=(n,c)=>(+n||0).toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:c?2:0,maximumFractionDigits:c?2:0});
const usdv=n=>usd(n,Math.round(n*100)%100!==0);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2800);}
const TIERS=[
 {id:"bronze",name:"Bronze",price:29,cap:200,disc:.05,slab:94,guide:"15 min"},
 {id:"silver",name:"Silver",price:99,cap:1000,disc:.10,slab:89,guide:"45 min"},
 {id:"gold",name:"Gold",price:249,cap:2000,disc:.15,slab:79,guide:"2 hr"},
 {id:"diamond",name:"Diamond",price:499,cap:4000,disc:.20,slab:74,guide:"4 hr"}];
window.CC_TIERS=TIERS;
const AGG=window.CC_AGG||CC_AGG,PHOTO=window.CC_PHOTO||CC_PHOTO;
const byId=new Map(PHOTO.map(r=>[r.i,r]));
const CATN={Nonsport:"Non-sport"};
const cat=r=>CATN[r.c]||r.c||"";
const line=r=>[r.s,r.u].filter(Boolean).join(", ")||r.t||cat(r);
const front=r=>`cards/${r.i}.webp`,back=r=>`cards/${r.i}b.webp`;
function gradeTxt(r){if(r.g)return `${r.gr||"PSA"} ${r.g}`;return "Raw";}
function statusTxt(r){return r.st==="Grading in progress"?`At ${r.gr||"the grader"}`:r.st==="Ready for decision"?"Needs a decision":r.st||"";}
function statusCls(r){return r.st==="Vaulted"?"s-vault":r.st==="Grading in progress"?"s-grader":"s-review";}
const chipFor=r=>`<span class="status ${statusCls(r)}">${esc(statusTxt(r))}</span>`;
const fmtDate=d=>{if(!d)return "";const [y,m,dd]=d.split("-").map(Number);return new Date(y,m-1,dd).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});};

/* full ledger, loaded alongside the page */
let ALL=null,loadP=null,loadFailed=false;
function loadAll(){
  if(ALL)return Promise.resolve(ALL);
  if(!loadP)loadP=fetch("data/collection.json").then(r=>{if(!r.ok)throw new Error(r.status);return r.json();})
    .then(a=>{ALL=a;a.forEach(r=>{if(!byId.has(r.i))byId.set(r.i,r);});return a;})
    .catch(()=>{loadFailed=true;ALL=PHOTO.slice();return ALL;});
  return loadP;
}
window.CC={$,$$,usd,usdv,esc,toast,AGG,PHOTO,byId,cat,line,front,back,gradeTxt,statusTxt,chipFor,fmtDate,loadAll,get ALL(){return ALL},get loadFailed(){return loadFailed},reduce};

/* on-file strip */
const grading=(AGG.stat["Grading in progress"]||{}).n||0,vault=(AGG.stat["Vaulted"]||{}).n||0;
const vals={n:AGG.n.toLocaleString(),v:usd(AGG.v),grading:grading.toLocaleString(),vault:vault.toLocaleString()};
$$("[data-agg]").forEach(el=>{el.textContent=vals[el.dataset.agg];});

/* masthead */
const mast=$("#mast");if(mast){const onS=()=>mast.classList.toggle("solid",scrollY>40);addEventListener("scroll",onS,{passive:true});onS();
const menu=$("#menu"),drawer=$("#drawer");
menu.addEventListener("click",()=>{const o=drawer.classList.toggle("open");menu.setAttribute("aria-expanded",o);menu.textContent=o?"Close":"Menu";mast.classList.add("solid");});
drawer.addEventListener("click",e=>{if(e.target.closest("a")){drawer.classList.remove("open");menu.setAttribute("aria-expanded","false");menu.textContent="Menu";}});}

/* lot one: four inventory scans */
if($("#scans")){const scanPick=PHOTO.filter(r=>!r.sl&&r.bk&&r.in).sort((a,b)=>a.v-b.v).filter((r,i,a)=>i%Math.max(1,Math.floor(a.length/4))===0).slice(0,4);
$("#scans").innerHTML=scanPick.map((r,i)=>`<button class="scan" type="button" data-i="${i}" aria-label="${esc(r.n)}, inventory number ${esc(r.in)}. Open the card"><span class="im"><img src="${front(r)}" alt="" loading="lazy"></span><small><b class="num">No. ${esc(r.in)}</b><span class="num">${usdv(r.v)}</span></small></button>`).join("");
$("#scans").addEventListener("click",e=>{const b=e.target.closest(".scan");if(b)openViewer(scanPick,+b.dataset.i);});}

/* the case */
if($("#tray")){const FILTERS={
  top:()=>[...PHOTO].sort((a,b)=>b.v-a.v).slice(0,24),
  vault:()=>PHOTO.filter(r=>r.st==="Vaulted").sort((a,b)=>b.v-a.v),
  grader:()=>PHOTO.filter(r=>r.st==="Grading in progress").sort((a,b)=>b.v-a.v).slice(0,24),
  ns:()=>PHOTO.filter(r=>r.c==="Nonsport"||r.c==="Wrestling").sort((a,b)=>b.v-a.v)
};
const NOTES={top:"The 24 highest-value cards in the sample collection.",vault:"Graded, back from the grader and now held in the vault.",grader:"Out at PSA and BGS in this summer's and fall's grading runs. The pregrades are ours.",ns:"Disney, Pixar, Marvel, Star Wars and WWE cards from the same box."};
let trayList=[];
function renderTray(f){
  trayList=FILTERS[f]();
  $$(".chip").forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===f));
  $("#tray").innerHTML=trayList.map((r,i)=>`<button class="piece" type="button" data-i="${i}" aria-label="${esc(r.n)}, ${esc(line(r))}, ${usdv(r.v)}. Open the card">
    <span class="stand"><img src="${front(r)}" alt="" loading="lazy"></span>
    <span class="tag"><span class="row"><span class="num">${r.in?"No. "+esc(r.in):esc(cat(r))}</span><span class="num">${r.v?usdv(r.v):""}</span></span><b>${esc(r.n)}</b><span>${esc(line(r))}</span><span>${esc(r.g?gradeTxt(r):r.p?"Pregrade "+r.p:statusTxt(r))}</span></span></button>`).join("");
  $("#tray").scrollLeft=0;
  $("#tray-note").textContent=NOTES[f];
}
$(".chips").addEventListener("click",e=>{const b=e.target.closest(".chip");if(b)renderTray(b.dataset.f);});
$("#tray").addEventListener("click",e=>{const b=e.target.closest(".piece");if(b)openViewer(trayList,+b.dataset.i);});
const step=d=>{const t=$("#tray");t.scrollBy({left:d*Math.max(260,t.clientWidth*.8),behavior:reduce?"auto":"smooth"});};
$("#tr-prev").addEventListener("click",()=>step(-1));$("#tr-next").addEventListener("click",()=>step(1));
renderTray("top");

}

/* card viewer */
const V={list:[],i:0,turned:false,last:null};
const vw=$("#viewer"),flip=$("#vw-flip");
function paint(){
  const r=V.list[V.i];if(!r)return;
  const hasImg=!!r.ph;V.turned=false;flip.classList.remove("turned");
  $("#vw-flipwrap").hidden=!hasImg;$("#vw-none").hidden=hasImg;
  if(hasImg){$("#vw-f").src=front(r);$("#vw-f").alt=`Front of ${r.n}`;
    if(r.bk){$("#vw-b").src=back(r);$("#vw-b").alt=`Back of ${r.n}`;}else{$("#vw-b").removeAttribute("src");$("#vw-b").alt="";}}
  $("#vw-turn").hidden=!(hasImg&&r.bk);$("#vw-turn").textContent="Turn it over";
  $("#vw-k").innerHTML=`<span>${r.in?"No. "+esc(r.in):esc(cat(r))}</span><span>${r.v?usdv(r.v):""}</span>`;
  $("#vw-h").textContent=r.n;
  $("#vw-set").textContent=line(r);
  const rows=[["Recorded value",r.v?usdv(r.v):"Not priced"],["Where it is",r.st==="Vaulted"?"In the vault":statusTxt(r)],
    ["Grade",r.g?gradeTxt(r):"Raw, not yet graded"],r.p?["Our pregrade",r.p]:null,r.b?["Grading run",`${r.b}${r.sd?", sent "+fmtDate(r.sd):""}`]:null].filter(Boolean);
  $("#vw-dl").innerHTML=rows.map(x=>`<dt>${esc(x[0])}</dt><dd class="num">${esc(x[1])}</dd>`).join("");
  const n=$("#vw-note");n.hidden=!r.nt||r.nt===r.p;if(r.nt)n.innerHTML=`<b>Concierge note at intake</b>${esc(r.nt)}`;
  $("#vw-pos").textContent=V.list.length>1?`${V.i+1} of ${V.list.length.toLocaleString()}`:"";
  $("#vw-prev").disabled=V.i<=0;$("#vw-next").disabled=V.i>=V.list.length-1;
  $(".vw-panel").scrollTop=0;
}
function openViewer(list,i){V.list=list;V.i=i;V.last=document.activeElement;paint();vw.hidden=false;document.documentElement.style.overflow="hidden";$(".vw-x").focus();}
function closeViewer(){vw.hidden=true;document.documentElement.style.overflow="";if(V.last&&V.last.focus)V.last.focus();}
window.ccOpenCard=openViewer;
vw.addEventListener("click",e=>{if(e.target.closest("[data-close]"))closeViewer();});
$("#vw-turn").addEventListener("click",()=>{V.turned=!V.turned;flip.classList.toggle("turned",V.turned);$("#vw-turn").textContent=V.turned?"Show the front":"Turn it over";});
$("#vw-prev").addEventListener("click",()=>{if(V.i>0){V.i--;paint();}});
$("#vw-next").addEventListener("click",()=>{if(V.i<V.list.length-1){V.i++;paint();}});
$("#vw-req").addEventListener("click",()=>{const r=V.list[V.i];closeViewer();if(window.ccPortal){window.ccPortal.request(r);return;}try{localStorage.setItem("cc-req-card",String(r.i));}catch(_){}location.href="portal.html";});
document.addEventListener("keydown",e=>{
  if(vw.hidden)return;
  if(e.key==="Escape"){e.preventDefault();closeViewer();}
  else if(e.key==="ArrowRight"&&V.i<V.list.length-1){V.i++;paint();}
  else if(e.key==="ArrowLeft"&&V.i>0){V.i--;paint();}
  else if(e.key==="Tab"){const f=$$("button:not([disabled]):not([hidden])",vw).filter(b=>b.offsetParent!==null);if(!f.length)return;const a=f[0],z=f[f.length-1];
    if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();}}
});

/* start loading the ledger once the page is idle */
if(document.body.classList.contains("portal-page"))setTimeout(()=>loadAll(),600);
})();
