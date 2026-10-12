/* Cáceres em Números — Atlas visual 3D. Ilustrações didáticas: nenhuma alteração nos dados. */
(function(){
'use strict';
var byId=function(id){return document.getElementById(id)};
if(!byId('atlas3d')||typeof D==='undefined')return;
var themes={
  score_socioeconomico_amb_v4:'risk',renda_mediana_resp:'coins',renda_media_resp:'coinbars',
  ent_dom_pavimentacao:'road',ent_dom_bueiro:'drain',ent_dom_iluminacao:'lamp',
  ent_dom_calcada:'pavement',ent_dom_rampa:'ramp',ent_dom_arborizacao_alguma:'tree',
  ent_dom_obstaculo_calcada:'barrier',sem_rede:'notap',fossa:'septic',pretaparda:'community',
  criancas:'children',idosos:'elderly',densidade:'city',
  cnefe_ensino:'school',cnefe_saude:'hospital',cnefe_outras_finalidades:'shops',
  cnefe_religioso:'gathering',cnefe_agropecuario:'farm',
  renda_pc_mediana:'coins',renda_pc_media:'coinbars',
  renda_trabalho_mediana:'wage',renda_trabalho_media:'wagebars',
  taxa_desocupacao:'unemployed',taxa_participacao_forca:'workers',
  pct_trab_no_domicilio:'homework',pct_trab_outro_mun:'commute',
  pct_desloc_ate15:'clock',pct_transp_bicicleta:'bike',pct_transp_motocicleta:'motorcycle',
  pct_transp_automovel:'car',pct_transp_onibus:'bus',
  ivc:'risk',sgb:'floodmap',flood:'flood',heat:'heat',hydro:'hydro',
  social:'community',deficit:'shield',alagamento:'floodhouse'
};
var palettes={
  water:['#7ed9fb','#1475c3'],nature:['#84e6bb','#198767'],
  people:['#a4c8ff','#4569b3'],urban:['#e7b982','#987049'],
  work:['#f5ce89','#a6772d'],risk:['#ffab91','#cd5f49'],general:['#bcadea','#7660ba']
};
function family(kind){
if(/tap|hydro|flood|septic|drain/.test(kind))return 'water';
if(/tree|farm/.test(kind))return 'nature';
if(/community|children|elderly|workers|city/.test(kind))return 'people';
if(/road|pavement|ramp|barrier|lamp|school|hospital|shops|gathering/.test(kind))return 'urban';
if(/coin|wage|work|unemploy|commute|clock|bike|car|bus|motorcycle/.test(kind))return 'work';
if(/risk|heat|shield/.test(kind))return 'risk';
return 'general';
}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function line(x1,y1,x2,y2,col,w){return '<path d="M'+x1+' '+y1+' L'+x2+' '+y2+'" fill="none" stroke="'+(col||'#f5fbff')+'" stroke-width="'+(w||5)+'" stroke-linecap="round"/>'}
function rect(x,y,w,h,c,r){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(r||5)+'" fill="'+c+'"/>'}
function circle(x,y,r,c){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>'}
function isoBox(x,y,w,h,depth,fill){
return '<path d="M'+x+' '+y+' l'+depth+' -'+depth*.46+' h'+w+' l-'+depth+' '+depth*.46+'Z" fill="#dbeaf4"/>'+
'<path d="M'+(x+w)+' '+y+' l'+depth+' -'+depth*.46+' v'+h+' l-'+depth+' '+depth*.46+'Z" fill="#3e698c"/>'+
rect(x,y,w,h,fill,2);
}
function people(n,small){
 var out='',r=small?8:11,w=small?17:23;
 for(var i=0;i<n;i++){var x=104+(i-(n-1)/2)*(small?28:38),y=67+(i%2)*5;out+=circle(x,y,r,'url(#pearl)')+rect(x-w/2,y+r+2,w,38, i%2?'#f9aa70':'url(#aqua)',8)}
 return out;
}
function homeRoof(x,y,w){return '<path d="M'+x+' '+y+' l'+w/2+' -22 l'+w/2+' 22Z" fill="#f6c572"/>'}
function cubeCity(){
return isoBox(58,68,34,66,12,'url(#metal)')+isoBox(108,40,42,94,13,'url(#blue)')+
rect(66,82,10,12,'#a4dbf2',1)+rect(114,57,12,16,'#d8edff',1)+rect(130,57,12,16,'#d8edff',1)+
rect(114,82,12,16,'#d8edff',1)+rect(130,82,12,16,'#d8edff',1);
}
function glyph(k){
 var o='';
 if(k==='coins'||k==='coinbars'||k==='wage'||k==='wagebars'){
   var bars=/bars/.test(k),wage=/wage/.test(k);
   o=bars?(isoBox(58,90,23,44,7,'url(#gold)')+isoBox(88,74,23,60,7,'url(#gold)')+isoBox(118,51,25,83,8,'url(#gold)')):
     ('<ellipse cx="86" cy="117" rx="36" ry="12" fill="#d28e32"/>'+rect(50,82,72,35,'url(#gold)',4)+
      '<ellipse cx="86" cy="82" rx="36" ry="13" fill="#ffe6a3"/>'+circle(86,82,14,'#b87526')+
      '<ellipse cx="130" cy="110" rx="21" ry="9" fill="#ffecae"/>'+rect(109,94,42,16,'url(#gold)',3)+
      '<ellipse cx="130" cy="94" rx="21" ry="9" fill="#ffe5a1"/>');
   if(wage)o+=rect(58,40,83,16,'#385f86',7)+rect(75,43,48,9,'#ffdf88',2);
 }else if(k==='tree'||k==='farm'){
   o=rect(95,89,17,48,'#88542e',4)+circle(78,82,29,'url(#leaf)')+circle(119,78,34,'url(#leaf)')+
   circle(99,49,33,'url(#leaf)')+circle(136,105,10,'#8dd8a9');
   if(k==='farm')o+=rect(54,115,27,24,'#efc17c',3)+homeRoof(52,116,32);
 }else if(k==='drain'){
   o=isoBox(51,92,94,37,18,'url(#metal)')+'<path d="M61 93 L89 79 L169 79 L143 93Z" fill="#263f58"/>';
   for(var d=0;d<5;d++)o+=line(75+d*17,88,87+d*17,82,'#8cbbd8',3);
   o+='<path d="M65 126q24 -10 43 0t42 0" stroke="#35aee5" stroke-width="6" fill="none"/>';
 }else if(k==='road'||k==='pavement'){
   o='<path d="M65 47L151 71L143 139L55 114Z" fill="#6f89a2" stroke="#d1e8f3" stroke-width="3"/>';
   if(k==='road')o+='<path d="M103 58L101 121" stroke="#f7da75" stroke-width="5" stroke-dasharray="13 9"/>';
   else for(var p=0;p<4;p++)o+=line(66,65+p*16,145,86+p*14,'#d0e6f7',2);
 }else if(k==='lamp'){
   o=rect(95,42,8,90,'url(#metal)',3)+line(99,47,135,46,'#b6daf1',7)+
    '<path d="M121 47L145 47L138 66L128 66Z" fill="#fff0a5"/>'+circle(133,69,25,'#ffeab94c');
 }else if(k==='ramp'){
   o='<path d="M49 124 L131 84 L154 107 L154 131 Z" fill="url(#metal)" stroke="#bcdde9" stroke-width="3"/>'+
   '<path d="M55 116 L132 77 L154 91L80 131Z" fill="#6b9bb5"/>'+
    line(66,112,137,77,'#f4e6b5',4)+circle(123,69,10,'#ffe7af');
 }else if(k==='barrier'){
   o=isoBox(61,106,85,26,14,'url(#metal)')+'<path d="M95 64L119 117H69Z" fill="#f37e55"/>'+
   rect(78,98,35,7,'#fff1da',2)+rect(83,82,23,5,'#fff1da',2);
 }else if(k==='notap'||k==='hydro'){
   o='<path d="M58 69H129Q144 69 144 84V97" stroke="url(#metal)" stroke-width="15" stroke-linecap="round" fill="none"/>'+
   rect(78,53,14,31,'url(#metal)',3)+rect(65,50,40,8,'#dceef7',4)+
   '<path d="M145 104Q161 122 145 133Q128 122 145 104Z" fill="url(#aqua)"/>';
   if(k==='notap')o+=line(127,108,166,68,'#eb7864',6);
 }else if(k==='septic'){
   o=rect(56,88,96,50,'url(#metal)',12)+'<ellipse cx="104" cy="88" rx="48" ry="14" fill="#d9eafa"/>'+
   rect(83,58,37,25,'url(#blue)',4)+line(63,117,144,117,'#59c6da',7)+
   circle(87,104,5,'#8dd9e2')+circle(124,110,6,'#8dd9e2');
 }else if(k==='community'||k==='workers'||k==='children'||k==='elderly'){
   o=people(k==='children'?2:k==='elderly'?2:3,k==='community'||k==='workers');
   if(k==='elderly')o+=line(142,96,142,138,'#f3d68f',5)+line(142,96,154,96,'#f3d68f',5);
   if(k==='workers')o+=rect(63,111,87,14,'url(#metal)',5);
   if(k==='children')o+=circle(151,111,13,'url(#gold)');
 }else if(k==='city')o=cubeCity()+circle(45,54,11,'#f2c87d');
 else if(k==='school'||k==='hospital'||k==='shops'||k==='gathering'){
   o=isoBox(61,66,89,69,18,'url(#metal)')+homeRoof(56,65,110)+
    rect(77,89,17,25,'#62b5db',2)+rect(113,89,23,29,'#62b5db',2);
   if(k==='hospital')o+=rect(97,42,25,7,'#dc5e57',1)+rect(106,34,7,23,'#dc5e57',1);
   if(k==='school')o+=rect(93,40,30,14,'#15395a',3)+rect(106,40,4,14,'#fff',1);
   if(k==='shops')o+=rect(71,78,72,12,'#e9a75d',4)+line(90,78,90,90,'#fff',3)+line(112,78,112,90,'#fff',3);
   if(k==='gathering')o+=circle(105,49,8,'#5d8dbd')+line(105,35,105,63,'#e5eff7',2);
 }else if(k==='homework'||k==='commute'){
   o=isoBox(59,76,87,59,12,'url(#metal)')+homeRoof(55,76,100)+
   rect(83,98,50,31,'#385a7d',4)+rect(87,101,42,23,'url(#blue)',2);
   if(k==='commute')o+='<path d="M140 58Q157 70 143 83" fill="none" stroke="#ffc66c" stroke-width="6"/>'+
    '<path d="M144 83l-6 -11h13Z" fill="#ffc66c"/>';
 }else if(k==='unemployed'){
   o=rect(64,81,80,53,'url(#metal)',8)+
     '<path d="M84 81V70Q84 60 94 60H113Q124 60 124 70V81" fill="none" stroke="#d4e9f4" stroke-width="8"/>'+
     line(73,92,136,124,'#e87665',7);
 }else if(k==='clock'){
   o=circle(105,91,48,'url(#metal)')+circle(105,91,38,'#e3f6ff')+
   line(105,91,105,63,'#2c6f9d',7)+line(105,91,127,99,'#2c6f9d',7)+circle(105,91,6,'#2c6f9d');
 }else if(k==='bike'||k==='motorcycle'||k==='car'||k==='bus'){
   if(k==='bike'||k==='motorcycle'){
     o='<circle cx="70" cy="116" r="21" fill="#244359" stroke="#cde2ee" stroke-width="5"/>'+
       '<circle cx="142" cy="116" r="21" fill="#244359" stroke="#cde2ee" stroke-width="5"/>'+
       '<path d="M70 116L98 86L117 116L70 116M98 86L142 116" stroke="#e8b15e" stroke-width="6" fill="none"/>'+
       line(98,86,89,77,'#d6e9f0',4)+line(130,78,142,116,'#d6e9f0',4);
     if(k==='motorcycle')o+=rect(91,76,42,18,'url(#blue)',7);
   }else{
     o=rect(k==='bus'?47:56,k==='bus'?65:89,k==='bus'?121:103,k==='bus'?63:42,'url(#blue)',9)+
      '<path d="M72 90 L90 72H133L146 90Z" fill="#9dd5ed"/>'+
      circle(79,134,12,'#284156')+circle(137,134,12,'#284156');
     if(k==='bus')o+=rect(59,76,32,21,'#c8edfd',3)+rect(99,76,31,21,'#c8edfd',3);
   }
 }else if(k==='heat'){
   o=cubeCity()+'<circle cx="155" cy="52" r="19" fill="url(#gold)"/>'+
   rect(48,54,12,59,'url(#metal)',7)+circle(54,122,16,'#ef735a')+rect(52,79,5,38,'#ef735a',2);
 }else if(k==='flood'||k==='floodhouse'||k==='floodmap'){
   o=k==='floodhouse'?(isoBox(73,73,66,61,12,'url(#metal)')+homeRoof(69,71,78)):
     k==='floodmap'?('<path d="M49 80L95 57L151 79L108 109Z" fill="url(#leaf)" stroke="#b0eed7" stroke-width="3"/>'):
      isoBox(60,76,83,55,12,'url(#metal)');
   for(var j=0;j<3;j++)o+='<path d="M'+(45+j*4)+' '+(103+j*12)+'q22 -10 42 0t42 0t32 0" fill="none" stroke="'+(j===0?'#a6f1ff':'#3bb7e9')+'" stroke-width="6" stroke-linecap="round"/>';
 }else if(k==='risk'||k==='shield'){
   o='<path d="M106 41L150 60V95Q146 122 106 144Q66 123 63 95V60Z" fill="url(#blue)" stroke="#b9e2f7" stroke-width="3"/>';
   if(k==='risk')o+='<path d="M103 60L90 94L112 98L101 124L130 88L109 85L121 60Z" fill="url(#gold)"/>';
   else o+='<path d="M86 94l14 14 27 -31" stroke="#a2ffd2" stroke-width="9" fill="none" stroke-linecap="round"/>';
 }else{
   o=cubeCity();
 }
 return o;
}
function illustration(kind,title){
var fam=family(kind),accent=palettes[fam]||palettes.general;
return '<svg class="atlas-image" viewBox="0 0 210 184" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="'+esc('Ilustração 3D de '+title)+'">'+
'<defs>'+
'<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edf8ff"/><stop offset=".46" stop-color="#b6d1e5"/><stop offset="1" stop-color="#5c89ad"/></linearGradient>'+
'<linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b4eaff"/><stop offset=".42" stop-color="'+accent[0]+'"/><stop offset="1" stop-color="'+accent[1]+'"/></linearGradient>'+
'<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff4bf"/><stop offset=".5" stop-color="#f7c568"/><stop offset="1" stop-color="#c58b3c"/></linearGradient>'+
'<linearGradient id="aqua" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d2fbff"/><stop offset=".55" stop-color="#6de0f9"/><stop offset="1" stop-color="#1479c0"/></linearGradient>'+
'<radialGradient id="leaf"><stop stop-color="#b2f9be"/><stop offset=".55" stop-color="#48c48b"/><stop offset="1" stop-color="#187851"/></radialGradient>'+
'<radialGradient id="pearl"><stop stop-color="#ffeed4"/><stop offset="1" stop-color="#bb88a0"/></radialGradient>'+
'</defs><ellipse cx="104" cy="151" rx="65" ry="13" fill="#0d325449"/>'+
'<path d="M38 139L107 110L173 137L103 168Z" fill="#c8e1ef" opacity=".65"/>'+
'<path d="M38 139L103 168V174L38 146Z" fill="#80a5bf" opacity=".75"/>'+
'<path d="M103 168L173 137V145L103 174Z" fill="#537c9a" opacity=".6"/>'+
'<g filter="none">'+glyph(kind)+'</g></svg>';
}
var defs=[];
D.metrics.forEach(function(m){defs.push({key:m.key,label:m.label,note:m.note||'Censo 2022',source:'setor',kind:themes[m.key]||'city',unit:m.type==='pct'?'Percentual':m.type==='money'?'Valor monetário':'Contagem ou índice'})});
Array.from(byId('apMetric').options).forEach(function(x){defs.push({key:x.value,label:x.textContent.trim(),note:'Censo 2022 · área de ponderação; não atribuir aos setores',source:'area',kind:themes[x.value]||'coinbars',unit:x.value.indexOf('renda')!==-1?'Valor monetário':'Percentual'})});
Array.from(byId('climateMetric').options).forEach(function(x){
 var note=x.value==='sgb'?'SGB 2023 · consulta ao serviço oficial de suscetibilidade':x.value==='alagamento'?'Registros e categorias constantes da base original':'Indicador ou proxy exploratória calculada na plataforma; consultar metodologia';
 defs.push({key:x.value,label:x.textContent.trim(),note:note,source:'clima',kind:themes[x.value]||'risk',unit:'Camada temática'});
});
var familyName={setor:'Mapa por setor',area:'Área de ponderação',clima:'Clima e vulnerabilidade'};
var active='todos',term='';
function card(m){
 return '<article class="atlas-card">'+
 '<div class="atlas-scene atlas-scene-'+family(m.kind)+'">'+illustration(m.kind,m.label)+'</div>'+
 '<div class="atlas-card-body"><span class="atlas-genre">'+esc(familyName[m.source])+'</span>'+
 '<h3>'+esc(m.label)+'</h3>'+
 '<p>'+esc(m.note)+'</p>'+
 '<button type="button" class="atlas-view" data-key="'+esc(m.key)+'" data-src="'+esc(m.source)+'" aria-label="'+esc('Abrir '+m.label+' no painel')+'">Ver no painel <span aria-hidden="true">↗</span></button></div></article>';
}
function render(){
 var a=defs.filter(function(m){return(active==='todos'||m.source===active)&&(!term||(m.label+' '+m.note).toLocaleLowerCase('pt-BR').includes(term))});
 byId('atlasList').innerHTML=a.length?a.map(card).join(''):'<div class="atlas-empty">Não encontramos uma variável com esse termo. Tente outra palavra.</div>';
 byId('atlasCount').textContent=a.length+' de '+defs.length+' variáveis';
 byId('atlasFilterSummary').textContent=active==='todos'?'Todas as escalas de análise':familyName[active];
}
function openTab(id){
 var b=document.querySelector('.tab[data-p="'+id+'"]');
 if(!b)return;
 if(typeof activateTab==='function')activateTab(b,true);
 else {document.querySelectorAll('.page').forEach(function(p){p.classList.toggle('on',p.id===id)});document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t===b)})}
 b.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
}
function openMetric(key,source){
 var el=byId(source==='setor'?'metric':source==='area'?'apMetric':'climateMetric');
 if(!el)return;el.value=key;
 openTab(source==='setor'?'explorar':source==='area'?'economia':'clima');
 el.dispatchEvent(new Event('change',{bubbles:true}));
 window.requestAnimationFrame(function(){el.scrollIntoView({behavior:'smooth',block:'nearest'})});
}
var btn=document.querySelector('.tab[data-p="atlas3d"]');
if(btn)btn.addEventListener('click',function(){openTab('atlas3d')});
byId('atlasSearch').addEventListener('input',function(e){term=e.target.value.trim().toLocaleLowerCase('pt-BR');render()});
byId('atlasFilters').addEventListener('click',function(e){
 var b=e.target.closest('button[data-atlasfilter]');if(!b)return;
 active=b.dataset.atlasfilter;byId('atlasFilters').querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});render();
});
byId('atlasList').addEventListener('click',function(e){
 var b=e.target.closest('button[data-key]');if(b)openMetric(b.dataset.key,b.dataset.src);
});
function decorate(id,kinds){
 var holder=byId(id);if(!holder)return;
 Array.from(holder.children).forEach(function(card,i){
  if(card.querySelector('.atlas-mini-icon'))return;
  var kind=kinds[i]||'city',s=document.createElement('span');s.className='atlas-mini-icon';s.setAttribute('aria-hidden','true');
  s.innerHTML=illustration(kind,'');card.insertBefore(s,card.firstChild);
 });
}
function decorateAll(){
 decorate('kpis',['city','community','coins','road','shops','city']);
 decorate('climateKpis',['risk','floodhouse','floodmap','tree']);
}
function currentIcon(){
 var el=byId('metric'),holder=byId('legTitle');if(!el||!holder)return;
 var k=el.value,svg=illustration(themes[k]||'city',el.selectedOptions[0]?.textContent||k);
 var icon=byId('atlasCurrentIcon');
 if(!icon){icon=document.createElement('span');icon.id='atlasCurrentIcon';icon.className='atlas-current-icon';holder.parentNode.insertBefore(icon,holder)}
 icon.innerHTML=svg;icon.setAttribute('aria-hidden','true');
}
if(byId('metric'))byId('metric').addEventListener('change',currentIcon);
if(byId('climateScope'))byId('climateScope').addEventListener('change',function(){window.requestAnimationFrame(decorateAll)});
decorateAll();currentIcon();
var heroArt=byId('atlasHeroArtwork');if(heroArt)heroArt.innerHTML=illustration('city','Cáceres em Números');
render();
var teaser=document.createElement('div');teaser.className='atlas-teaser';
teaser.innerHTML='<div class="atlas-teaser-objects">'+illustration('tree','Arborização')+illustration('notap','Abastecimento de água')+illustration('city','População')+'</div>'+
'<div class="atlas-teaser-copy"><span class="atlas-eyebrow">NOVO · ATLAS VISUAL</span><h2>Veja o que cada indicador representa.</h2><p>42 variáveis com objetos ilustrativos em 3D e ligação direta às análises reais de Cáceres.</p></div>'+
'<button class="atlas-teaser-go" type="button">Conhecer variáveis <span aria-hidden="true">↗</span></button>';
var start=byId('kpis');if(start&&start.parentNode){start.parentNode.insertBefore(teaser,start);teaser.querySelector('button').addEventListener('click',function(){openTab('atlas3d')})}
})();
