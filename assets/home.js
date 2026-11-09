/* ===== estimate ===== */
(function(){
"use strict";
const {$,$$,toast}=window.CC;
const usd=(n,c)=>n.toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:c?2:0,maximumFractionDigits:c?2:0});
const u2=n=>usd(n,true),r2=n=>Math.round(n*100)/100;
const TIERS=window.CC_TIERS;
const BANDS=[25,35,65,125];
const P={mode:"vault",cards:200,choice:"auto",inv:0,base:0,baseH:"return",cond:0,g0:0,g1:0,g2:0,g3:0,slab:0,ret:0};
const monthly=(t,c)=>t.price+Math.ceil(Math.max(0,c-t.cap)/200)*30;
function bestTier(c){let b=TIERS[0],bm=monthly(b,c);TIERS.forEach(t=>{const m=monthly(t,c);if(m<=bm){b=t;bm=m;}});return b;}
function quote(){
  const vault=P.mode==="vault";
  const tier=vault?(P.choice==="auto"?bestTier(P.cards):TIERS.find(t=>t.id===P.choice)):null;
  const d=tier?tier.disc:0,L=[];
  const invN=P.inv+(P.baseH==="inventory"?P.base:0);
  const ip=r2(2*(1-d)),cp=r2(10*(1-d)),gp=BANDS.map(b=>r2(b*(1-d))),sp=tier?tier.slab:99;
  if(invN)L.push([`Inventory, ${invN} cards`,invN*ip]);
  if(P.cond)L.push([`Condition checks, ${P.cond}`,P.cond*cp]);
  ["g0","g1","g2","g3"].forEach((k,i)=>{if(P[k])L.push([`Grading ${["to $1,000","to $2,500","to $10,000","over $10,000"][i]}, ${P[k]}`,P[k]*gp[i]]);});
  if(P.slab)L.push([`Display slabs, ${P.slab}`,P.slab*sp]);
  const retN=P.ret+(P.baseH==="return"?P.base:0);
  if(retN)L.push([`Return handling, ${retN} cards`,5+retN*.25]);
  const one=r2(L.reduce((a,l)=>a+l[1],0)),mo=tier?monthly(tier,P.cards):0;
  return {tier,d,L,one,mo,ip,cp,gp,sp,extra:tier?mo-tier.price:0,allow:tier?tier.cap+Math.ceil(Math.max(0,P.cards-tier.cap)/200)*200:0};
}
window.ccQuote=()=>({q:quote(),P:{...P}});
$$(".step-in").forEach(el=>{const k=el.dataset.k;el.innerHTML=`<button type="button" data-d="-1" aria-label="Fewer">&minus;</button><input type="number" min="0" value="0" class="num" id="n-${k}" aria-label="Count"><button type="button" data-d="1" aria-label="More">+</button>`;
  el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;P[k]=Math.max(0,(P[k]||0)+(+b.dataset.d));render();});
  $("input",el).addEventListener("change",e=>{P[k]=Math.max(0,Math.min(100000,Math.round(+e.target.value)||0));render();});});
$("#base-h").addEventListener("change",e=>{P.baseH=e.target.value;render();});
$$("[data-mode]").forEach(b=>b.addEventListener("click",()=>{P.mode=b.dataset.mode;render();}));
const vC=$("#v-cards"),vR=$("#v-range");
vC.addEventListener("input",()=>{P.cards=Math.max(0,Math.min(100000,Math.round(+vC.value)||0));render(true);});
vR.addEventListener("input",()=>{P.cards=+vR.value;render();});
$("#presets").innerHTML=[200,1000,2000,4000,10000].map(n=>`<button type="button" data-n="${n}">${n.toLocaleString()}</button>`).join("");
$("#presets").addEventListener("click",e=>{const b=e.target.closest("[data-n]");if(b){P.cards=+b.dataset.n;render();}});
$("#tiers").addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(b){P.choice=b.dataset.t===bestTier(P.cards).id?"auto":b.dataset.t;render();}});
function render(fromInput){
  const q=quote(),vault=P.mode==="vault",best=bestTier(P.cards);
  $$("[data-mode]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.mode===P.mode));
  $("#vault-ui").hidden=!vault;
  if(!fromInput)vC.value=P.cards;
  vR.value=Math.min(10000,P.cards);vR.style.setProperty("--p",(Math.min(10000,P.cards)/100)+"%");
  $$("#presets button").forEach(b=>b.setAttribute("aria-pressed",+b.dataset.n===P.cards));
  $("#tiers").innerHTML=TIERS.map(t=>{const m=monthly(t,P.cards),on=q.tier&&q.tier.id===t.id;return `<button type="button" class="tierrow" data-t="${t.id}" aria-pressed="${on}">
    <span class="dot" aria-hidden="true"></span><span class="nm">${t.name}${t.id===best.id?"<em>Lowest for your volume</em>":""}</span>
    <span class="m num">${t.cap.toLocaleString()} cards, ${Math.round(t.disc*100)}% off</span><span class="m num">${usd(t.slab)} slabs, ${t.guide}</span><span class="you num">${usd(m)}<span> /mo</span></span></button>`;}).join("");
  $("#auto-note").textContent=P.choice==="auto"?"We've picked the lowest monthly price for your volume. Ties go to the plan with more benefits.":"You've picked a plan yourself. Choose the one marked lowest to go back.";
  const std=(s,m)=>q.d?`<s>${u2(s)}</s> ${u2(m)}`:u2(m);
  $("#d-inv").innerHTML=`${std(2,q.ip)} a card, with scans and market pricing`;
  $("#d-cond").innerHTML=`${std(10,q.cp)} a card, with notes and a grade range`;
  BANDS.forEach((b,i)=>$("#d-g"+i).innerHTML=`${std(b,q.gp[i])} a card, plus the grader's fee`);
  $("#d-slab").innerHTML=`${q.tier?`<s>$99</s> ${usd(q.sp)}`:"$99"} each, engraved, matched hardware`;
  $$(".step-in").forEach(el=>{$("input",el).value=P[el.dataset.k];});
  $("#base-h").value=P.baseH;
  $("#r-top").innerHTML=vault
    ?`<span class="k">Draft estimate</span><h4>${q.tier.name} membership</h4><div class="big num">${usd(q.mo)}<small> a month</small></div><p class="sm num">${P.cards.toLocaleString()} vaulted cards, ${Math.round(q.d*100)}% off our labor</p>`
    :`<span class="k">Draft estimate</span><h4>Services only</h4><div class="big num">${u2(q.one)}</div><p class="sm">Standard prices, no monthly charge</p>`;
  let h="";
  if(vault)h+=`<tr><td>Membership</td><td class="num">${usd(q.tier.price)}</td></tr><tr><td>Extra vault space</td><td class="num">${usd(q.extra)}</td></tr><tr><td>Vault allowance</td><td class="num">${q.allow.toLocaleString()} cards</td></tr><tr><td colspan="2" style="border:0;padding:0 0 6px"><div class="r-meter"><i style="width:${q.allow?Math.min(100,P.cards/q.allow*100):0}%"></i></div></td></tr>`;
  h+=`<tr class="h"><td colspan="2">One-time services</td></tr>`;
  h+=q.L.length?q.L.map(l=>`<tr><td>${l[0]}</td><td class="num">${u2(l[1])}</td></tr>`).join(""):`<tr class="muted"><td colspan="2">Nothing added yet. Every service is optional.</td></tr>`;
  h+=`<tr class="tot"><td>One-time total</td><td class="num">${u2(q.one)}</td></tr>`;
  if(P.g0+P.g1+P.g2+P.g3)h+=`<tr class="muted"><td>Grading-company fees</td><td>At cost</td></tr>`;
  $("#r-lines").innerHTML=h;
  $("#r-grand-lbl").textContent=vault?"First month plus one-time":"One-time total";
  $("#r-grand").textContent=u2(r2(q.one+q.mo));
}
render();
$("#start-sub").addEventListener("click",()=>{const q=quote();
  const n=Math.max(1,P.inv+P.base+P.cond+P.g0+P.g1+P.g2+P.g3+P.slab+P.ret);
  try{localStorage.setItem("cc-pending-estimate",JSON.stringify({one:q.one,mo:q.mo,tier:q.tier?q.tier.id:null,tierName:q.tier?q.tier.name:null,n}));}catch(_){}
  location.href="portal.html";});
$("#copy-est").addEventListener("click",()=>{const q=quote();
  const lines=["My Collector Concierge, draft estimate",P.mode==="vault"?`${q.tier.name} membership: ${usd(q.mo)} a month for ${P.cards} cards`:"Services only"].concat(q.L.map(l=>`${l[0]}: ${u2(l[1])}`),[`One-time total: ${u2(q.one)}`,`First month plus one-time: ${u2(q.one+q.mo)}`]);
  try{navigator.clipboard.writeText(lines.join("\n")).then(()=>toast("Estimate copied"),()=>toast("Copying is blocked here. Select the slip text and copy it."));}catch(_){toast("Copying is blocked here. Select the slip text and copy it.");}});
})();
