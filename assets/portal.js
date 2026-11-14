/* ===== collector portal: demo login and JB's sample collection ===== */
(function(){
"use strict";
const C=window.CC,{$,$$,usd,usdv,esc,toast,AGG,PHOTO,byId,cat,line,front,gradeTxt,statusTxt,chipFor,fmtDate}=C;
const TIERS=window.CC_TIERS,tierById=id=>TIERS.find(t=>t.id===id);
const TODAY="Nov 8, 2026";
const STAGES=["Label created","Received","Inventoried","Quote approved","At grader","Complete"];
const VAULTED=(AGG.stat["Vaulted"]||{}).n||0,GRADING=(AGG.stat["Grading in progress"]||{}).n||0,READY=(AGG.stat["Ready for decision"]||{}).n||0;
const PEND=AGG.pend||[];
const runsOut=AGG.runs.filter(r=>r.done<r.n);
function seed(){
  const top=PHOTO.filter(r=>r.st==="Vaulted").sort((a,b)=>b.v-a.v);
  const dart=PHOTO.find(r=>/Jaxson Dart/.test(r.n))||PHOTO[0];
  return {tab:"overview",tier:"bronze",
    quote:{id:"CC-24130",status:"pending"},
    subs:[],
    reqs:[
      {id:"SR-1056",card:top[2]?top[2].n:"Vaulted card",cid:top[2]&&top[2].i,service:"Return to me",status:"Packing",open:true,date:"Nov 5"},
      {id:"SR-1051",card:dart.n,cid:dart.i,service:"Consign on eBay",status:"Waiting for review",open:true,date:"Nov 4"}],
    invoices:[
      {date:"Nov 1, 2026",what:"Bronze membership",amt:29,status:"Paid"},
      {date:"Oct 1, 2026",what:"Bronze membership",amt:29,status:"Paid"},
      {date:"Sep 1, 2026",what:"Bronze membership",amt:29,status:"Paid"},
      {date:"Aug 1, 2026",what:"Bronze membership",amt:29,status:"Paid"}],
    activity:[],seq:{sub:24131,req:1057}};
}
const KEY="cc-portal-v4";let S;
try{S=JSON.parse(localStorage.getItem(KEY))||seed();}catch(_){S=seed();}
if(!S||!S.quote)S=seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(_){}};
const qLines=()=>{const t=tierById(S.tier),p=Math.round(10*(1-t.disc)*100)/100;return [[`Condition checks, ${PEND.length} cards at ${usdv(p)}`,PEND.length*p]];};
const qTotal=()=>qLines().reduce((a,l)=>a+l[1],0);
const pendingQuote=()=>S.quote.status==="pending";
const cls=s=>({"Packing":"s-review","Waiting for review":"s-review","Listed":"s-consign","Completed":"s-done","Paid":"s-done","Cancelled":"s-returned"}[s]||"s-review");
const chip=s=>`<span class="status ${cls(s)}">${esc(s)}</span>`;

/* activity: actions taken here, then the real run history */
function activity(){
  const runAct=AGG.runs.slice(0,6).map(r=>({t:fmtDate(r.date).replace(/, \d{4}$/,""),x:`${r.n} cards sent to ${r.gr} in run ${r.b}${r.done?`. ${r.done} back and vaulted`:""}.`}));
  return S.activity.concat(pendingQuote()?[{t:"Nov 3",x:`Pregrade review quote ready for ${PEND.length} cards.`}]:[],runAct).slice(0,7);
}

function bars(rows,lbl){
  const maxN=Math.max(...rows.map(r=>r.n)),maxV=Math.max(...rows.map(r=>r.v));
  return `<div class="bars">${rows.map(r=>`<div class="bar"><span class="lbl">${esc(r.l)}</span><span class="tr" aria-hidden="true"><i style="width:${(r.n/maxN*100).toFixed(1)}%"></i><i class="v" style="width:${(r.v/maxV*100).toFixed(1)}%"></i></span><span class="val num">${r.n.toLocaleString()} · ${usd(r.v)}</span></div>`).join("")}</div>
  <div class="legend"><span><i></i>Cards</span><span><i class="v"></i>Recorded value</span></div>`;
}

const F={q:"",c:"",st:"",sort:"v-desc",view:"gallery",batch:"",page:1};
let reqPre=null;
const V={
 overview(){
  const t=tierById(S.tier);
  const big=AGG.bands.filter(b=>b.lo>=500),bigN=big.reduce((a,b)=>a+b.n,0),bigV=big.reduce((a,b)=>a+b.v,0);
  const small=AGG.bands[0];
  const catRows=Object.entries(AGG.cats).map(([k,o])=>({l:CATN(k),n:o.n,v:o.v})).sort((a,b)=>b.v-a.v);
  const bandRows=AGG.bands.map(b=>({l:b.hi?(b.lo?`${usd(b.lo)} to ${usd(b.hi)}`:`Under ${usd(b.hi)}`):`${usd(b.lo)} and up`,n:b.n,v:b.v}));
  return `<div class="vh"><div><h3>Welcome back, JB.</h3><p>Here is where your ${AGG.n.toLocaleString()} cards stand today.</p></div><a class="btn btn-dark btn-sm" href="./#estimate">New submission</a></div>
  ${pendingQuote()?`<div class="next"><div><b>Waiting for your approval</b><span>Pregrade review for ${PEND.length} of your best raw cards, ${usdv(qTotal())}.</span></div><button class="btn btn-dark btn-sm" type="button" data-go="subs">Review the quote</button></div>`:""}
  <div class="ptiles">
   <div class="pt"><span>Recorded value</span><strong class="num">${usd(AGG.v)}</strong><small class="num">${AGG.n.toLocaleString()} cards inventoried</small></div>
   <div class="pt"><span>At the graders</span><strong class="num">${GRADING.toLocaleString()}</strong><small class="num">in ${runsOut.length} open runs with PSA and BGS</small></div>
   <div class="pt"><span>In your vault</span><strong class="num">${VAULTED} / ${t.cap.toLocaleString()}</strong><small>${t.name} membership, ${usd(t.price)}/mo</small></div>
   <div class="pt"><span>Waiting on you</span><strong class="num">${READY.toLocaleString()}</strong><small>cards ready for a decision</small></div></div>
  <div class="two">
   <div class="card-p"><h4>Where the value sits</h4><p class="lede num">${bigN} cards worth $500 or more hold ${Math.round(bigV/AGG.v*100)}% of the recorded value. The ${small.n.toLocaleString()} cards under $10 hold ${Math.max(1,Math.round(small.v/AGG.v*100))}%.</p>${bars(bandRows)}
    <h4 style="margin-top:22px">By category</h4>${bars(catRows)}</div>
   <div class="card-p"><h4>Recent activity</h4><ul class="feed">${activity().map(a=>`<li><div>${esc(a.x)}<time>${esc(a.t)}</time></div></li>`).join("")}</ul>
    <div class="acts" style="margin-top:18px"><button class="btn btn-line btn-sm" type="button" data-go="collection">Browse the collection</button></div></div></div>`;},
 collection(){
  return `<div class="vh"><div><h3>My collection</h3><p>Every card we have logged for you, wherever it is today.</p></div>
   <div class="toggle" role="group" aria-label="View"><button type="button" data-view="gallery" aria-pressed="${F.view==="gallery"}">Scans</button><button type="button" data-view="ledger" aria-pressed="${F.view==="ledger"}">Full ledger</button></div></div>
  <div class="toolbar">
   <label class="sr" for="f-q">Search</label><input class="in" id="f-q" type="search" placeholder="Search player, character, set or inventory no." value="${esc(F.q)}">
   <label class="sr" for="f-c">Category</label><select class="in" id="f-c"><option value="">All categories</option>${Object.keys(AGG.cats).map(k=>`<option value="${k}" ${F.c===k?"selected":""}>${CATN(k)}</option>`).join("")}</select>
   <label class="sr" for="f-s">Status</label><select class="in" id="f-s"><option value="">Any status</option>${[["Ready for decision","Needs a decision"],["Grading in progress","At the grader"],["Vaulted","Vaulted"]].map(([v,l])=>`<option value="${v}" ${F.st===v?"selected":""}>${l}</option>`).join("")}</select>
   <label class="sr" for="f-o">Sort</label><select class="in" id="f-o">${[["v-desc","Highest value"],["v-asc","Lowest value"],["n","Name, A to Z"],["in","Inventory number"]].map(([v,l])=>`<option value="${v}" ${F.sort===v?"selected":""}>${l}</option>`).join("")}</select>
  </div>
  <div class="result-line" id="res"></div>
  <div id="coll"></div>`;},
 subs(){
  const quote=pendingQuote()?`<article class="subm"><div class="sub-top"><div><h4>Pregrade review, best raw cards</h4><p class="num">${esc(S.quote.id)}, ${PEND.length} cards, quote ready Nov 3, 2026</p></div>${chip("Needs your approval")}</div>
   <ol class="stg">${STAGES.map((x,i)=>`<li class="${i<3?"d":i===3?"n":""}">${x}</li>`).join("")}</ol>
   <p style="font-size:14px;color:var(--soft);margin-top:8px">The ${PEND.length} highest-value cards in your box that haven't had a condition check: ${PEND.slice(0,5).map(p=>esc(p.n)).join(", ")} and ${PEND.length-5} more.</p>
   <div class="quote"><table>${qLines().map(q=>`<tr><td>${esc(q[0])}</td><td class="num">${usdv(q[1])}</td></tr>`).join("")}<tr class="tot"><td>Quote total</td><td class="num">${usdv(qTotal())}</td></tr></table></div>
   <div class="acts"><button class="btn btn-dark btn-sm" type="button" data-ok>Approve quote</button><button class="btn btn-line btn-sm" type="button" data-no>Decline</button><button class="btn btn-line btn-sm" type="button" data-pend>See the ${PEND.length} cards</button></div></article>`:
   S.quote.status==="approved"?`<article class="subm"><div class="sub-top"><div><h4>Pregrade review, best raw cards</h4><p class="num">${esc(S.quote.id)}, ${PEND.length} cards</p></div>${chip("Completed")}</div><p style="font-size:14px;color:var(--soft);margin-top:8px">Quote approved ${esc(S.quote.date||TODAY)}. Condition checks are underway.</p></article>`:"";
  const own=S.subs.map(s=>`<article class="subm"><div class="sub-top"><div><h4>${esc(s.title)}</h4><p class="num">${esc(s.id)}, ${s.cards.toLocaleString()} card${s.cards===1?"":"s"}, started ${esc(s.date)}</p></div><span class="status s-review">${STAGES[s.stage]}</span></div>
   <ol class="stg">${STAGES.map((x,i)=>`<li class="${i<s.stage?"d":i===s.stage?"n":""}">${x}</li>`).join("")}</ol><p style="font-size:14px;color:var(--soft);margin-top:8px">${esc(s.note)}</p></article>`).join("");
  const runs=AGG.runs.map(r=>{const stage=r.done>=r.n?5:4,back=r.done;
   return `<article class="subm"><div class="sub-top"><div><h4>${esc(r.b)}</h4><p class="num">${esc(r.gr)} run, ${r.n} cards, sent ${esc(fmtDate(r.date))}</p></div>${stage===5?`<span class="status s-done">Complete</span>`:`<span class="status s-grader">At ${esc(r.gr)}</span>`}</div>
    <ol class="stg">${STAGES.map((x,i)=>`<li class="${i<stage||stage===5?"d":i===stage?"n":""}">${x}</li>`).join("")}</ol>
    <div class="sub-meta num"><span>${usd(r.v)} recorded value</span><span>${back?`${back} of ${r.n} back and vaulted`:"None back yet"}</span><button type="button" data-batch="${esc(r.b)}">See these cards</button></div></article>`;}).join("");
  return `<div class="vh"><div><h3>Submissions</h3><p>Every box and grading run, from label to finished.</p></div><a class="btn btn-dark btn-sm" href="./#estimate">New submission</a></div>${own}${quote}${runs}`;},
 reqs(){
  const pre=reqPre;
  const opts=(pre&&!PHOTO.includes(pre)?[pre]:[]).concat([...PHOTO].sort((a,b)=>a.n.localeCompare(b.n))).filter(r=>r.st!=="Returned");
  return `<div class="vh"><div><h3>Service requests</h3><p>Ask for anything on a card that is already with us.</p></div></div>
  <form class="form" id="rf"><label for="rq-c">Card<select class="in" id="rq-c">${opts.map(r=>`<option value="${r.i}" ${pre&&pre.i===r.i?"selected":""}>${esc(r.n)}, ${esc(line(r)).slice(0,70)}</option>`).join("")}</select></label>
  <label for="rq-s">Service<select class="in" id="rq-s"><option>Condition check</option><option>Professional grading</option><option>Display slab</option><option>Move to my vault</option><option>Return to me</option><option>Consign on eBay</option><option>Consign on Fanatics Collect</option></select></label>
  <label class="full" for="rq-n">Notes for your concierge (optional)<textarea class="in" id="rq-n" placeholder="For example: list with a $300 floor"></textarea></label>
  <div class="full"><button class="btn btn-dark btn-sm" type="submit">Send request</button></div></form>
  <div class="list">${S.reqs.map(r=>`<div class="item"><div><b>${esc(r.service)}: ${esc(r.card)}</b><small class="num">${esc(r.id)}, requested ${esc(r.date)}${r.note?`. "${esc(r.note)}"`:""}</small></div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">${chip(r.status)}${r.cid&&byId.has(r.cid)?`<button class="btn btn-line btn-sm" type="button" data-card="${r.cid}">View card</button>`:""}${r.open&&r.status==="Waiting for review"?`<button class="btn btn-line btn-sm" type="button" data-cancel="${r.id}">Cancel request</button>`:""}</div></div>`).join("")}</div>`;},
 billing(){const t=tierById(S.tier),v=VAULTED;
  return `<div class="vh"><div><h3>Vault &amp; billing</h3><p>Your plan, your space, and every charge.</p></div></div>
  <div class="card-p" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center">
   <div><span style="font-size:13px;color:var(--soft)">Current plan</span><div style="font:400 2.4rem/1 var(--serif)">${t.name}, ${usd(t.price)}/mo</div></div>
   <div style="flex:1 1 260px;max-width:420px"><span class="num" style="font-size:13.5px">${v} of ${t.cap.toLocaleString()} spaces used</span><div class="meter"><i style="width:${Math.min(100,v/t.cap*100)}%"></i></div><small style="color:var(--soft)">${Math.round(t.disc*100)}% off My CC labor, ${usd(t.slab)} slabs, ${t.guide} planning a month. ${GRADING} cards at the graders come back to the vault as they finish.</small></div></div>
   <h4 style="margin-top:20px">Change plan</h4><div class="pick" id="pick">${TIERS.map(x=>`<button type="button" data-plan="${x.id}" aria-pressed="false" class="${x.id===S.tier?"cur":""}"><b>${x.name}</b><span class="num">${usd(x.price)}/mo, ${x.cap.toLocaleString()} cards</span></button>`).join("")}</div><div id="pc"></div></div>
  <div class="tw"><table class="dt inv"><thead><tr><th>Date</th><th>Charge</th><th class="r">Amount</th><th>Status</th></tr></thead><tbody>${S.invoices.map(i=>`<tr style="cursor:default"><td class="num">${esc(i.date)}</td><td>${esc(i.what)}</td><td class="r num">${usdv(i.amt)}</td><td>${chip(i.status)}</td></tr>`).join("")}</tbody></table></div>`;}
};
function CATN(k){return ({Nonsport:"Non-sport"})[k]||k;}

/* collection rendering */
let current=[];
function keyOf(r){return r._k||(r._k=[r.n,r.s,r.u,r.t,r.in,r.y].filter(Boolean).join(" ").toLowerCase());}
function filtered(src){
  const q=F.q.trim().toLowerCase();const terms=q?q.split(/\s+/):[];
  let R=src.filter(r=>(!F.c||r.c===F.c)&&(!F.st||r.st===F.st)&&(!F.batch||r.b===F.batch)&&(!terms.length||terms.every(t=>keyOf(r).includes(t))));
  const s=F.sort;
  R.sort(s==="v-asc"?(a,b)=>a.v-b.v:s==="n"?(a,b)=>a.n.localeCompare(b.n):s==="in"?(a,b)=>(+a.in||1e9)-(+b.in||1e9):(a,b)=>b.v-a.v);
  return R;
}
function drawColl(){
  const host=$("#coll");if(!host)return;
  const res=$("#res");
  const batchNote=F.batch?` in run ${esc(F.batch)} <button type="button" data-clear-batch>Show all runs</button>`:"";
  if(F.view==="gallery"){
    current=filtered(PHOTO);
    res.innerHTML=`<span class="num">${current.length} of ${PHOTO.length} scanned cards${batchNote}</span><span>Switch to the full ledger to search all ${AGG.n.toLocaleString()}.</span>`;
    host.innerHTML=current.length?`<div class="gal">${current.map((r,i)=>`<button class="gcard" type="button" data-i="${i}"><span class="im"><img src="${front(r)}" alt="" loading="lazy"></span><b>${esc(r.n)}</b><small><span class="num">${r.in?"No. "+esc(r.in):esc(cat(r))}</span><span class="num">${usdv(r.v)}</span></small>${chipFor(r)}</button>`).join("")}</div>`:`<p class="empty">No scanned cards match. Try the full ledger, or clear the search.</p>`;
    return;
  }
  if(!C.ALL){res.innerHTML=`<span>Loading the full ledger of ${AGG.n.toLocaleString()} cards…</span>`;host.innerHTML="";C.loadAll().then(()=>{if(S.tab==="collection")drawColl();});return;}
  current=filtered(C.ALL);
  const shown=current.slice(0,F.page*50);
  res.innerHTML=`<span class="num">Showing ${shown.length.toLocaleString()} of ${current.length.toLocaleString()} cards${batchNote}</span><span class="num">${usd(current.reduce((a,r)=>a+r.v,0))} recorded value</span>${C.loadFailed?`<span>The full ledger didn't load, so only scanned cards are listed.</span>`:""}`;
  host.innerHTML=current.length?`<div class="tw"><table class="dt"><thead><tr><th>Card</th><th>No.</th><th>Grade or pregrade</th><th class="r">Recorded value</th><th>Status</th></tr></thead><tbody>${shown.map((r,i)=>`<tr data-i="${i}" tabindex="0"><td><div class="cc"><span class="th" aria-hidden="true">${r.ph?`<img src="${front(r)}" alt="" loading="lazy">`:esc((r.n||"?").slice(0,1))}</span><div style="min-width:0"><b>${esc(r.n)}</b><small>${esc(line(r))}</small></div></div></td><td class="num">${esc(r.in||"")}</td><td class="grade">${esc(r.g?gradeTxt(r):r.p?r.p:"Not checked")}</td><td class="r num">${r.v?usdv(r.v):"—"}</td><td>${chipFor(r)}</td></tr>`).join("")}</tbody></table></div>
   ${shown.length<current.length?`<div class="more"><button class="btn btn-line btn-sm" type="button" data-more>Show ${Math.min(50,current.length-shown.length)} more</button></div>`:""}`:`<p class="empty">No cards match. Clear the search or choose another status.</p>`;
}
function bindColl(){
  const on=(id,k,ev="input")=>{const el=$("#"+id);el.addEventListener(ev,()=>{F[k]=el.value;F.page=1;drawColl();});};
  on("f-q","q");on("f-c","c","change");on("f-s","st","change");on("f-o","sort","change");
  drawColl();
}

function counts(){$("#who-plan").textContent=tierById(S.tier).name+" member";$("#c-cards").textContent=AGG.n.toLocaleString();
  $("#c-subs").textContent=runsOut.length+(pendingQuote()?1:0)+S.subs.length;$("#c-reqs").textContent=S.reqs.filter(r=>r.open).length;}
function show(tab,opts){const moved=S.tab!==tab;S.tab=tab;save();counts();
  $$(".tab").forEach(b=>{const on=b.dataset.tab===tab;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;});
  $("#view").setAttribute("aria-labelledby","tab-"+tab);
  const v=$("#view");v.innerHTML=V[tab]();v.scrollTop=0;
  if(tab==="collection")bindColl();
  /* phones: the tabs are a sideways strip and the page scrolls, so keep the active tab in view and start the new view at its top */
  const side=$(".app-side"),sel=$("#tab-"+tab);
  if(side.scrollWidth>side.clientWidth)side.scrollLeft+=sel.getBoundingClientRect().left-side.getBoundingClientRect().left-(side.clientWidth-sel.offsetWidth)/2;
  const appTop=$(".app").getBoundingClientRect().top+scrollY;
  if(moved&&scrollY>appTop)scrollTo(0,appTop);
}
window.ccPortal={show:(t)=>show(t),request(r){reqPre=r;show("reqs");const s=$("#rq-s");if(s)s.focus({preventScroll:true});}};

$(".app-side").addEventListener("click",e=>{const b=e.target.closest(".tab");if(b){if(b.dataset.tab==="collection"){F.batch="";}show(b.dataset.tab);}});
$(".app-side").addEventListener("keydown",e=>{if(!["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"].includes(e.key))return;const T=$$(".tab"),i=T.findIndex(t=>t.getAttribute("aria-selected")==="true");const n=T[(i+(e.key==="ArrowDown"||e.key==="ArrowRight"?1:T.length-1))%T.length];e.preventDefault();show(n.dataset.tab);n.focus();});
let pend=null;
$("#view").addEventListener("click",e=>{
 const g=e.target.closest("[data-go]");if(g){show(g.dataset.go);return;}
 const vb=e.target.closest("[data-view]");if(vb){F.view=vb.dataset.view;F.page=1;$$("[data-view]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.view===F.view));drawColl();return;}
 const gc=e.target.closest(".gcard");if(gc){window.ccOpenCard(current,+gc.dataset.i);return;}
 const tr=e.target.closest("tr[data-i]");if(tr){window.ccOpenCard(current,+tr.dataset.i);return;}
 if(e.target.closest("[data-more]")){F.page++;drawColl();return;}
 if(e.target.closest("[data-clear-batch]")){F.batch="";F.page=1;drawColl();return;}
 const bt=e.target.closest("[data-batch]");if(bt){Object.assign(F,{batch:bt.dataset.batch,view:"ledger",q:"",c:"",st:"",page:1});show("collection");return;}
 if(e.target.closest("[data-pend]")){const list=PEND.map(p=>byId.get(p.i)||Object.assign({st:"Ready for decision"},p));window.ccOpenCard(list,0);return;}
 const cd=e.target.closest("[data-card]");if(cd){const r=byId.get(+cd.dataset.card);if(r)window.ccOpenCard([r],0);return;}
 if(e.target.closest("[data-ok]")){S.quote={...S.quote,status:"approved",date:TODAY};S.invoices.unshift({date:TODAY,what:`Pregrade review ${S.quote.id}, ${PEND.length} cards`,amt:qTotal(),status:"Paid"});S.activity.unshift({t:"Today",x:`You approved the pregrade review for ${PEND.length} cards.`});show("subs");toast("Quote approved");return;}
 if(e.target.closest("[data-no]")){S.quote={...S.quote,status:"declined"};S.activity.unshift({t:"Today",x:`You declined the pregrade review. The ${PEND.length} cards stay as they are.`});show("subs");toast("Quote declined");return;}
 const cn=e.target.closest("[data-cancel]");if(cn){const r=S.reqs.find(x=>x.id===cn.dataset.cancel);r.open=false;r.status="Cancelled";S.activity.unshift({t:"Today",x:`You cancelled ${r.id}.`});show("reqs");toast("Request cancelled");return;}
 const pl=e.target.closest("[data-plan]");if(pl){const id=pl.dataset.plan,t=tierById(id),box=$("#pc");$$("#pick button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.plan===id));
  if(id===S.tier){box.innerHTML=`<p style="font-size:14px;color:var(--soft)">You are already on ${t.name}.</p>`;pend=null;return;}
  if(VAULTED>t.cap){box.innerHTML=`<p style="font-size:14px;color:var(--crit)">${t.name} holds ${t.cap} cards and you have ${VAULTED} vaulted. Request a return for some cards first.</p>`;pend=null;return;}
  pend=id;box.innerHTML=`<div class="confirm"><div><b>Switch to ${t.name} for ${usd(t.price)}/mo?</b><br><span>The new price starts with your Dec 1 bill. Member prices change right away.</span></div><button class="btn btn-dark btn-sm" type="button" data-confirm>Switch to ${t.name}</button></div>`;return;}
 if(e.target.closest("[data-confirm]")&&pend){const t=tierById(pend);S.tier=pend;S.activity.unshift({t:"Today",x:`Vault plan changed to ${t.name}.`});show("billing");toast(`Plan changed to ${t.name}`);}
});
$("#view").addEventListener("keydown",e=>{if(e.key!=="Enter")return;const tr=e.target.closest("tr[data-i]");if(tr){e.preventDefault();window.ccOpenCard(current,+tr.dataset.i);}});
$("#view").addEventListener("submit",e=>{if(e.target.id!=="rf")return;e.preventDefault();
 const id=+$("#rq-c").value,c=byId.get(id)||reqPre,s=$("#rq-s").value,note=$("#rq-n").value.trim(),rid="SR-"+(S.seq.req++);
 S.reqs.unshift({id:rid,card:c?c.n:"Card",cid:c&&c.i,service:s,status:"Waiting for review",open:true,date:"Nov 8",note});S.activity.unshift({t:"Today",x:`You requested ${s.toLowerCase()} for ${c?c.n:"a card"}.`});reqPre=null;show("reqs");toast("Request sent");});
$("#reset").addEventListener("click",()=>{S=seed();save();Object.assign(F,{q:"",c:"",st:"",sort:"v-desc",view:"gallery",batch:"",page:1});show("overview");toast("Demo actions reset");});

/* estimates and service requests handed over from the website */
function consumeHandoffs(){
  let est=null,req=null;
  try{est=JSON.parse(localStorage.getItem("cc-pending-estimate")||"null");localStorage.removeItem("cc-pending-estimate");}catch(_){}
  try{req=localStorage.getItem("cc-req-card");localStorage.removeItem("cc-req-card");}catch(_){}
  if(est){const id="CC-"+(S.seq.sub++);
    S.subs.unshift({id,title:"New submission from your estimate",cards:est.n||1,date:TODAY,stage:0,note:`Estimate saved: ${usd(est.one||0,true)} one-time${est.tierName?`, ${est.tierName} membership at ${usd(est.mo||0)}/mo`:""}. Ship your box with tracking. We confirm final counts and fees before any paid work.`});
    S.activity.unshift({t:"Today",x:`You started ${id} from your estimate.`});S.tab="subs";save();setTimeout(()=>toast(`Submission ${id} started`),300);}
  if(req&&byId.has(+req)){reqPre=byId.get(+req);S.tab="reqs";}
}

/* demo sign-in */
const DEMO={email:"demo@mycc.example",pass:"collector"};
const login=$("#login"),shell=$("#app-shell");
const signedIn=()=>{try{return localStorage.getItem("cc-demo-session")==="1";}catch(_){return false;}};
let booted=false;
function enter(){
  try{localStorage.setItem("cc-demo-session","1");}catch(_){}
  login.hidden=true;shell.hidden=false;document.title="JB's collection · My CC portal";
  consumeHandoffs();C.loadAll();
  if(!booted){booted=true;}
  show(V[S.tab]?S.tab:"overview");
  const t=$(".tab[aria-selected=true]");if(t)t.focus({preventScroll:true});
}
function leave(){try{localStorage.removeItem("cc-demo-session");}catch(_){}shell.hidden=true;login.hidden=false;document.title="My CC Collector Portal";$("#demo-in").focus();toast("Signed out");}
$("#demo-in").addEventListener("click",enter);
$("#login-form").addEventListener("submit",e=>{e.preventDefault();
  const em=$("#l-email").value.trim().toLowerCase(),pw=$("#l-pass").value;
  if(em===DEMO.email&&pw===DEMO.pass){$("#l-err").hidden=true;enter();}
  else{const er=$("#l-err");er.hidden=false;er.textContent="That email and password don't match the demo account. Use the demo details below, or continue with the demo account.";}
});
$("#fill-demo").addEventListener("click",()=>{$("#l-email").value=DEMO.email;$("#l-pass").value=DEMO.pass;$("#l-email").focus();});
$("#sign-out").addEventListener("click",leave);
if(signedIn())enter();else{login.hidden=false;shell.hidden=true;}
})();
