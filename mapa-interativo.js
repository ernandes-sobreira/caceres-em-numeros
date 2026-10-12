/* Cáceres em Números · seletor territorial 2D. Nenhum dado modificado. */
(function geoInit(){
"use strict";
const $=id=>document.getElementById(id);
const page=$("explorar"),map=$("map"),metric=$("metric"),sectorDetail=$("sectorDetail");
if(!page||!map||!metric||!sectorDetail||typeof D==="undefined")return;
document.querySelector('.tab[data-p="atlas3d"]')?.remove();
$("atlas3d")?.remove();
document.querySelectorAll(".atlas-teaser,.atlas-mini-icon,.atlas-current-icon").forEach(x=>x.remove());
document.body.classList.add("geo-ready");
const mainTab=document.querySelector('.tab[data-p="explorar"]');
if(mainTab)mainTab.textContent="Mapa interativo";
const text=(v)=>String(v==null?"":v);
const esc=v=>text(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const normalize=s=>text(s).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const good=v=>v!==null&&v!==undefined&&v!==""&&Number.isFinite(Number(v));
const number=v=>good(v)?Number(v):null;
const format=(v,t)=>v===null?"sem dado":typeof fmt==="function"?fmt(v,t):(t==="pct"?(v*100).toFixed(1)+"%":v.toLocaleString("pt-BR"));
const category=k=>{
 if(/score|ivc|deficit/.test(k))return "Prioridade";
 if(/renda|salario|trabalho_mediana|trabalho_media/.test(k))return "Renda";
 if(/agua|rede|fossa|esgoto|hydro/.test(k))return "Água e saneamento";
 if(/ent_dom|paviment|bueiro|calcada|rampa|arboriz|iluminac|obstaculo/.test(k))return "Entorno urbano";
 if(/criancas|idosos|pretaparda|densidade|social/.test(k))return "População";
 if(/cnefe/.test(k))return "Equipamentos";
 if(/transp|desloc|desocupacao|participacao|pct_trab/.test(k))return "Trabalho e mobilidade";
 return "Clima e ambiente";
};
const setor=D.metrics.map(m=>({source:"setor",key:m.key,label:m.label,note:m.note||"Censo 2022",type:m.type||"num",category:category(m.key)}));
const areas=Array.from($("apMetric")?.options||[]).map(o=>({source:"area",key:o.value,label:o.textContent.trim(),note:"Censo 2022 · área de ponderação",type:(o.value.includes("renda")?"money":"pct"),category:category(o.value)}));
const climate=Array.from($("climateMetric")?.options||[]).map(o=>({source:"clima",key:o.value,label:o.textContent.trim(),note:o.value==="sgb"?"SGB 2023 · fonte oficial":o.value==="ivc"?"Indicador exploratório · consultar metodologia":"Camada temática · consultar metodologia",type:"num",category:category(o.value)}));
const all=[...setor,...areas,...climate];
const labelSource={setor:"Setores censitários",area:"Áreas de ponderação",clima:"Clima e vulnerabilidade"};
let activeSource="setor",searchText="",opened=false;
const mapCard=map.closest(".card"),mapWrap=map.closest(".mapwrap"),detailCard=sectorDetail.closest(".card");
if(!mapCard||!mapWrap||!detailCard)return;
if(window.matchMedia("(max-width:620px)").matches){
 const controls=document.getElementById("poiControls");
 if(controls){
   const fold=document.createElement("details");fold.className="mobile-poi";
   const summary=document.createElement("summary");summary.textContent="Pontos do CNEFE · mostrar filtros";
   controls.parentNode.insertBefore(fold,controls);fold.appendChild(summary);fold.appendChild(controls);
 }
}
const dock=document.createElement("div");
dock.className="geo-dock";
dock.innerHTML=`<div class="geo-control-line">
 <div class="geo-heading"><span class="geo-eyebrow">LEITURA DO TERRITÓRIO · CENSO 2022</span><strong id="geoCurrentName">Renda mediana do responsável</strong><span class="geo-heading-note" id="geoCurrentNote">Selecione uma variável para colorir os setores do mapa.</span></div>
 <button type="button" id="geoPickerToggle" aria-expanded="false" aria-controls="geoPicker"><span class="geo-picker-dot"></span> Indicadores <span aria-hidden="true">⌄</span></button>
 </div>
 <div class="geo-shortcuts" id="geoShortcuts" aria-label="Indicadores rápidos"></div>
 <div id="geoPicker" class="geo-picker" role="dialog" aria-label="Selecionar indicador" hidden>
  <div class="geo-picker-head"><strong>Escolha o que mostrar</strong><button type="button" id="geoPickerClose" aria-label="Fechar lista">×</button></div>
  <input type="search" id="geoQuery" aria-label="Buscar indicador" autocomplete="off" placeholder="Buscar renda, árvore, água, bueiro...">
  <div id="geoSources" class="geo-sources" role="group" aria-label="Escala dos indicadores"></div>
  <div id="geoResults" class="geo-results"></div>
  <div class="geo-picker-footer">A escala da informação é preservada: setores, áreas de ponderação e clima não são intercambiáveis.</div>
 </div>`;
mapCard.insertBefore(dock,mapWrap);
const floating=document.createElement("button");
floating.type="button";floating.className="geo-map-selected";floating.id="geoMapSelected";floating.hidden=true;floating.setAttribute("aria-label","Abrir ficha do setor selecionado");mapWrap.appendChild(floating);
floating.addEventListener("click",()=>detailCard.scrollIntoView({behavior:"smooth",block:"start"}));
const insights=document.createElement("section");
insights.className="geo-insights";
insights.id="geoInsights";
insights.setAttribute("aria-label","Distribuição e interpretação do indicador");
insights.innerHTML=`<div class="geo-insights-head"><span>LEITURA DO INDICADOR</span><span id="geoAvailable"></span></div>
 <div class="geo-stat-name">Mediana dos setores visíveis com dado</div>
 <div class="geo-stat-value" id="geoMedian">—</div>
 <div id="geoDistName" class="geo-dist-name"></div>
 <svg id="geoHistogram" viewBox="0 0 320 68" role="img" aria-label="Histograma dos valores dos setores visíveis"></svg>
 <div id="geoRange" class="geo-range"></div>
 <div id="geoSelected" class="geo-selected" hidden></div>
 <div class="geo-rank-header"><strong>Setores com maiores valores</strong><small>Toque para localizar</small></div>
 <div id="geoRank" class="geo-rank"></div>
 <p class="geo-method">Distribuição calculada apenas com os setores visíveis que possuem dado. As cores do mapa usam P5–P95 da seleção; valores ausentes não são convertidos em zero. Valores maiores não significam necessariamente condições melhores.</p>`;
detailCard.insertBefore(insights,sectorDetail);
const favorites=["score_socioeconomico_amb_v4","renda_mediana_resp","sem_rede","fossa","ent_dom_pavimentacao","ent_dom_arborizacao_alguma","ent_dom_bueiro","ent_dom_rampa"];
function labelFor(k){return setor.find(x=>x.key===k)?.label||k;}
function buildShortcuts(){
 $("geoShortcuts").innerHTML=favorites.map(k=>`<button type="button" data-go="${esc(k)}" class="geo-shortcut${metric.value===k?" on":""}">${esc(labelFor(k))}</button>`).join("");
}
function setOpen(v){
 opened=v;
 $("geoPicker").hidden=!v;
 $("geoPickerToggle").setAttribute("aria-expanded",String(v));
 $("geoPickerToggle").classList.toggle("is-open",v);
 if(v){activeSource="setor";$("geoQuery").value="";searchText="";renderPicker();$("geoQuery").focus();}
}
function renderPicker(){
 $("geoSources").innerHTML=["setor","area","clima"].map(src=>`<button type="button" data-source="${src}" aria-pressed="${src===activeSource}">${labelSource[src]}</button>`).join("");
 const matches=all.filter(x=>x.source===activeSource&&normalize(x.label+" "+x.category+" "+x.note).includes(searchText));
 $("geoResults").innerHTML=matches.length?matches.map(m=>`<button type="button" class="geo-result" data-target="${esc(m.key)}" data-from="${m.source}">
 <span class="geo-category-icon" aria-hidden="true"></span><span class="geo-result-body"><strong>${esc(m.label)}</strong><small>${esc(m.category)} · ${esc(m.note)}</small></span><span class="geo-open-arrow" aria-hidden="true">↗</span></button>`).join(""):'<p class="geo-empty">Nenhum indicador encontrado. Tente outra palavra.</p>';
}
function goMetric(k,src){
 if(src==="setor"){
   if(!setor.some(m=>m.key===k))return;
   metric.value=k;
   metric.dispatchEvent(new Event("change",{bubbles:true}));
   updateInfo();
 }else if(src==="area"){
   const el=$("apMetric");if(!el||!areas.some(m=>m.key===k))return;
   el.value=k;
   document.querySelector('.tab[data-p="economia"]')?.click();
   el.dispatchEvent(new Event("change",{bubbles:true}));
   document.getElementById("apMapTheme")?.scrollIntoView({block:"nearest",behavior:"smooth"});
 }else{
   const el=$("climateMetric");if(!el||!climate.some(m=>m.key===k))return;
   el.value=k;
   document.querySelector('.tab[data-p="clima"]')?.click();
   el.dispatchEvent(new Event("change",{bubbles:true}));
 }
 setOpen(false);
}
$("geoPickerToggle").addEventListener("click",()=>setOpen(!opened));
$("geoPickerClose").addEventListener("click",()=>setOpen(false));
$("geoQuery").addEventListener("input",e=>{searchText=normalize(e.target.value.trim());renderPicker()});
$("geoQuery").addEventListener("keydown",e=>{if(e.key==="Enter"){$("geoResults").querySelector(".geo-result")?.click();e.preventDefault()}});
$("geoSources").addEventListener("click",e=>{const b=e.target.closest("[data-source]");if(b){activeSource=b.dataset.source;renderPicker()}});
$("geoResults").addEventListener("click",e=>{const b=e.target.closest("[data-target]");if(b)goMetric(b.dataset.target,b.dataset.from)});
$("geoShortcuts").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)goMetric(b.dataset.go,"setor")});
document.addEventListener("pointerdown",e=>{if(opened&&!dock.contains(e.target))setOpen(false)});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&opened)setOpen(false)});
function quant(a,p){
 if(!a.length)return null;
 const v=a[Math.floor((a.length-1)*p)],n=a[Math.ceil((a.length-1)*p)],r=(a.length-1)*p;
 return v+(n-v)*(r-Math.floor(r));
}
function updateInfo(){
 const m=setor.find(x=>x.key===metric.value);if(!m)return;
 $("geoCurrentName").textContent=m.label;
 $("geoCurrentNote").textContent=(m.note||"Censo 2022")+" · clique em um setor para ver o valor e o contexto.";
 buildShortcuts();
 const rows=typeof visibleRows==="function"?visibleRows():D.sectors;
 const ordered=rows.map(r=>({row:r,val:number(r[m.key])})).filter(x=>x.val!==null).sort((a,b)=>a.val-b.val);
 const vals=ordered.map(x=>x.val),n=vals.length;
 $("geoAvailable").textContent=n+" de "+rows.length+" setores com dado";
 $("geoMedian").textContent=n?format(quant(vals,.5),m.type):"Sem dados";
 $("geoDistName").textContent="Distribuição · "+m.label;
 const lo=n?vals[0]:0,hi=n?vals[n-1]:0,span=hi-lo;
 $("geoRange").innerHTML=`<span>Mín. <b>${format(n?lo:null,m.type)}</b></span><span>Máx. <b>${format(n?hi:null,m.type)}</b></span>`;
 const bins=Array(16).fill(0);
 vals.forEach(v=>{let ix=span?Math.min(15,Math.floor((v-lo)/span*16)):8;bins[ix]++});
 const maxBin=Math.max(1,...bins);
 let chart='<line x1="0" y1="63" x2="320" y2="63" stroke="#dce5e9" stroke-width="1"/>';
 bins.forEach((v,i)=>{const h=Math.max(0,v/maxBin*54),x=i*20+3;
   chart+=`<rect x="${x}" y="${63-h}" width="14" height="${h}" rx="3" fill="${i>=12?"#d59653":"#376d86"}" opacity="${v?0.94:0.2}"/>`;
 });
 let chosen=(typeof selected!=="undefined"&&selected&&rows.some(r=>r.id===selected.id))?selected:null;
 const chosenVal=chosen?number(chosen[m.key]):null;
 if(chosenVal!==null&&n){
    const x=span?Math.min(314,Math.max(6,(chosenVal-lo)/span*320)):170;
    chart+=`<line x1="${x}" y1="2" x2="${x}" y2="66" stroke="#d7503f" stroke-width="2.2" stroke-dasharray="4 3"/><circle cx="${x}" cy="8" r="4.5" fill="#d7503f" stroke="white" stroke-width="1.4"/>`;
 }
 $("geoHistogram").innerHTML=chart;
 $("geoHistogram").setAttribute("aria-label",n?"Histograma de "+n+" setores com dados para "+m.label:"Sem dados disponíveis");
 if(chosen){
   floating.hidden=false;floating.innerHTML=`<span>SETOR · ${esc(chosen.bairro||"Sem bairro")}</span><strong>${format(chosenVal,m.type)}</strong><small>${esc(m.label)} · ver ficha ↗</small>`;
   const percentile=chosenVal===null?null:Math.round(vals.filter(v=>v<=chosenVal).length/n*100);
   $("geoSelected").hidden=false;
   $("geoSelected").innerHTML=`<span class="geo-selected-kicker">SETOR SELECIONADO · ${esc(chosen.bairro||"Sem bairro")}</span><strong>${format(chosenVal,m.type)}</strong><small>${esc(m.label)} · ${esc(chosen.id)}</small>${percentile!==null?`<span class="geo-percentile">Até ${percentile}% dos setores com dado têm valor igual ou menor.</span>`:"<span class='geo-percentile'>Sem medição disponível para esta variável.</span>"}`;
 }else{
   floating.hidden=true;floating.innerHTML="";
   $("geoSelected").hidden=true;$("geoSelected").innerHTML="";
 }
 $("geoRank").innerHTML=ordered.slice(-5).reverse().map((x,i)=>`<button type="button" data-sector="${esc(x.row.id)}"><span class="geo-rank-number">${i+1}</span><span class="geo-rank-label">${esc(x.row.bairro||"Sem bairro")}<small>${esc(x.row.id)}</small></span><strong>${format(x.val,m.type)}</strong><span class="geo-rank-arrow" aria-hidden="true">↗</span></button>`).join("")||'<p class="geo-empty">Sem observações disponíveis nesta seleção.</p>';
}
$("geoRank").addEventListener("click",e=>{
 const b=e.target.closest("[data-sector]");if(!b)return;
 if(typeof focusSectorSearch==="function")focusSectorSearch(b.dataset.sector);
 setTimeout(updateInfo,0);
});
metric.addEventListener("change",updateInfo);
$("scope")?.addEventListener("change",()=>setTimeout(updateInfo,0));
map.addEventListener("pointerup",()=>setTimeout(updateInfo,0));
map.addEventListener("touchend",()=>setTimeout(updateInfo,0),{passive:true});
document.querySelector('.tab[data-p="explorar"]')?.addEventListener("click",()=>setTimeout(updateInfo,0));
updateInfo();

})();
