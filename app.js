const baseCommittees = [
{ id:1,type:'CCS',name:'Comité de Contraloría Social Hermosillo Centro',municipality:'Hermosillo',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-02-12',lat:29.0729,lng:-110.9559,status:'Activo'},
{ id:2,type:'CCS',name:'Comité de Contraloría Social Navojoa',municipality:'Navojoa',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-02-20',lat:27.0706,lng:-109.4437,status:'Activo'},
{ id:3,type:'CCS',name:'Comité de Contraloría Social Bacanora',municipality:'Bacanora',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-03-03',lat:28.978,lng:-109.399,status:'Activo'},
{ id:4,type:'CCS',name:'Comité de Contraloría Social San Pedro de la Cueva',municipality:'San Pedro de la Cueva',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-03-18',lat:29.286,lng:-109.737,status:'Activo'},
{ id:5,type:'CCS',name:'Comité de Contraloría Social Guaymas',municipality:'Guaymas',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-04-07',lat:27.9193,lng:-110.8974,status:'Activo'},
{ id:6,type:'CCS',name:'Comité de Contraloría Social Nogales',municipality:'Nogales',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-04-13',lat:31.3012,lng:-110.9381,status:'Activo'},
{ id:7,type:'CCS',name:'Comité de Contraloría Social Caborca',municipality:'Caborca',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-04-29',lat:30.7167,lng:-112.1647,status:'Activo'},
{ id:8,type:'CCS',name:'Comité de Contraloría Social Agua Prieta',municipality:'Agua Prieta',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-05-08',lat:31.3307,lng:-109.5489,status:'Activo'},
{ id:9,type:'CCS',name:'Comité de Contraloría Social Etchojoa',municipality:'Etchojoa',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-05-16',lat:26.9104,lng:-109.626,status:'Activo'},
{ id:10,type:'CCS',name:'Comité de Contraloría Social Álamos',municipality:'Álamos',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-05-24',lat:27.0275,lng:-108.9404,status:'Activo'},
{ id:11,type:'CPS',name:'Comité de Participación Social El Mirador',municipality:'Hermosillo',colony:'El Mirador',program:'',members:8,date:'2026-02-15',lat:29.118,lng:-110.993,status:'Activo'},
{ id:12,type:'CPS',name:'Comité de Participación Social Las Cuevitas',municipality:'Hermosillo',colony:'Las Cuevitas',program:'',members:9,date:'2026-02-28',lat:29.064,lng:-111.012,status:'Activo'},
{ id:13,type:'CPS',name:'Comité de Participación Social Villas del Real',municipality:'Hermosillo',colony:'Villas del Real',program:'',members:7,date:'2026-03-14',lat:29.129,lng:-110.947,status:'Activo'},
{ id:14,type:'CPS',name:'Comité de Participación Social Cañada de los Negros',municipality:'Hermosillo',colony:'Cañada de los Negros',program:'',members:7,date:'2026-03-28',lat:29.083,lng:-110.928,status:'Activo'},
{ id:15,type:'CPS',name:'Comité de Participación Social Internacional',municipality:'Hermosillo',colony:'Internacional',program:'',members:10,date:'2026-04-11',lat:29.096,lng:-111.018,status:'Activo'},
{ id:16,type:'CPS',name:'Comité de Participación Social Solidaridad',municipality:'Hermosillo',colony:'Solidaridad',program:'',members:8,date:'2026-04-26',lat:29.132,lng:-111.002,status:'Activo'},
{ id:17,type:'CPS',name:'Comité de Participación Social Nuevo Hermosillo',municipality:'Hermosillo',colony:'Nuevo Hermosillo',program:'',members:7,date:'2026-05-10',lat:29.008,lng:-110.934,status:'Activo'},
{ id:18,type:'CPS',name:'Comité de Participación Social Los Olivos',municipality:'Hermosillo',colony:'Los Olivos',program:'',members:8,date:'2026-05-23',lat:29.024,lng:-110.979,status:'Activo'}
];

let committees;
try {
  committees = JSON.parse(localStorage.getItem('cp_committees')) || structuredClone(baseCommittees);
} catch {
  committees = structuredClone(baseCommittees);
}

let map;
let markers=[];
let typeChart;
let territoryChart;
let viewMode='cards';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function save(){ localStorage.setItem('cp_committees',JSON.stringify(committees)); }
function formatDate(d){ return new Date(`${d}T12:00:00`).toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}); }
function openLayer(sel){ const el=$(sel); if(!el) return; el.classList.add('open'); el.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
function closeLayer(sel){ const el=$(sel); if(!el) return; el.classList.remove('open'); el.setAttribute('aria-hidden','true'); if(!$('.modal.open')&&!$('.admin-drawer.open')) document.body.style.overflow=''; }

function kpis(){
  const ccs=committees.filter(x=>x.type==='CCS');
  const cps=committees.filter(x=>x.type==='CPS');
  const vals={
    committees:committees.length,
    ccs:ccs.length,
    cps:cps.length,
    members:committees.reduce((a,b)=>a+Number(b.members||0),0),
    municipalities:new Set(ccs.map(x=>x.municipality)).size,
    colonies:new Set(cps.map(x=>x.colony).filter(Boolean)).size
  };
  Object.entries(vals).forEach(([k,v])=>$$(`[data-kpi="${k}"]`).forEach(e=>e.textContent=v));
  $$('[data-hero-kpi="committees"]').forEach(e=>e.textContent=committees.length);
}

function options(){
  const munis=[...new Set(committees.map(x=>x.municipality).filter(Boolean))].sort();
  const cols=[...new Set(committees.map(x=>x.colony).filter(Boolean))].sort();
  ['municipalityFilter','directoryMunicipality'].forEach(id=>{ const e=$('#'+id); if(e)e.innerHTML='<option value="">Todos los municipios</option>'+munis.map(x=>`<option>${x}</option>`).join(''); });
  ['colonyFilter','directoryColony'].forEach(id=>{ const e=$('#'+id); if(e)e.innerHTML='<option value="">Todas las colonias</option>'+cols.map(x=>`<option>${x}</option>`).join(''); });
}

function initMap(){
  map=L.map('committeeMap',{scrollWheelZoom:true,zoomControl:true,wheelPxPerZoomLevel:60}).setView([29.3,-110.7],6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(map);
  renderMap();
  setTimeout(()=>map.invalidateSize(),150);
}

function filteredMap(){
  const q=($('#mapSearch')?.value||'').toLowerCase();
  const m=$('#municipalityFilter')?.value||'';
  const c=$('#colonyFilter')?.value||'';
  const types=$$('.type-check:checked').map(x=>x.value);
  return committees.filter(x=>types.includes(x.type)&&(!m||x.municipality===m)&&(!c||x.colony===c)&&(!q||[x.name,x.municipality,x.colony,x.program].join(' ').toLowerCase().includes(q)));
}

function renderMap(){
  if(!map) return;
  markers.forEach(m=>m.remove());
  markers=[];
  const data=filteredMap();
  data.forEach(x=>{
    const color=x.type==='CCS'?'#a72861':'#6e3f72';
    const icon=L.divIcon({
      className:'committee-map-marker',
      html:`<span class="marker-dot" style="--marker-color:${color}"></span>`,
      iconSize:[26,26],iconAnchor:[13,13],popupAnchor:[0,-12]
    });
    const location=x.type==='CCS'?x.municipality:`${x.colony}, Hermosillo`;
    const popup=L.popup({className:'committee-map-popup',maxWidth:310,autoPan:true,autoPanPadding:[40,40]})
      .setContent(`<div class="map-popup-card"><strong>${x.name}</strong><span class="map-popup-location">${location}</span><button type="button" data-popup-id="${x.id}">Ver ficha</button></div>`);
    const marker=L.marker([x.lat,x.lng],{icon,keyboard:true,title:x.name}).addTo(map).bindPopup(popup);
    marker.on('click',()=>marker.openPopup());
    marker.on('popupopen',e=>{
      const popupEl=e.popup.getElement();
      const btn=popupEl?.querySelector('[data-popup-id]');
      if(btn){
        btn.addEventListener('click',event=>{
          event.preventDefault();
          event.stopPropagation();
          showDetail(btn.dataset.popupId);
        },{once:true});
      }
    });
    markers.push(marker);
  });
  if($('#visibleCount')) $('#visibleCount').textContent=`${data.length} comités visibles`;
}

function filteredDirectory(){
  const q=($('#directorySearch')?.value||'').toLowerCase();
  const t=$('#directoryType')?.value||'';
  const m=$('#directoryMunicipality')?.value||'';
  const c=$('#directoryColony')?.value||'';
  return committees.filter(x=>(!t||x.type===t)&&(!m||x.municipality===m)&&(!c||x.colony===c)&&(!q||[x.name,x.municipality,x.colony,x.program].join(' ').toLowerCase().includes(q)));
}

function renderDirectory(){
  const data=filteredDirectory();
  const wrap=$('#committeeDirectory');
  if(!wrap)return;
  wrap.className='directory-grid'+(viewMode==='table'?' table-view':'');
  $('#resultsText').textContent=`${data.length} comités encontrados`;
  wrap.innerHTML=data.map(x=>`<article class="committee-card"><div class="committee-top"><span class="type-badge ${x.type==='CPS'?'cps':''}">${x.type==='CCS'?'Contraloría Social':'Participación Social'}</span></div><h3>${x.name}</h3><div class="committee-meta"><span><i class="fa-solid fa-location-dot"></i> ${x.type==='CCS'?x.municipality:`${x.colony}, Hermosillo`}</span><span><i class="fa-solid fa-users"></i> ${x.members} integrantes</span><span><i class="fa-solid fa-calendar"></i> ${formatDate(x.date)}</span></div><button class="btn btn-ghost" data-detail-id="${x.id}">Consultar ficha</button></article>`).join('');
  wrap.querySelectorAll('[data-detail-id]').forEach(b=>b.onclick=event=>{ event.preventDefault(); showDetail(b.dataset.detailId); });
}

window.showDetail=function(id){
  const x=committees.find(y=>String(y.id)===String(id));
  if(!x){ console.warn('No se encontró el comité solicitado:',id); return; }
  map?.closePopup();
  $('#detailContent').innerHTML=`<div class="detail-hero"><span class="type-badge ${x.type==='CPS'?'cps':''}">${x.type==='CCS'?'Comité de Contraloría Social':'Comité de Participación Social'}</span><h2>${x.name}</h2><p>${x.type==='CCS'?'Mecanismo ciudadano de vigilancia y seguimiento de programas sociales.':'Mecanismo de organización comunitaria y colaboración vecinal.'}</p></div><div class="detail-grid"><div><span>Municipio</span><strong>${x.municipality}</strong></div>${x.type==='CPS'?`<div><span>Colonia</span><strong>${x.colony}</strong></div>`:`<div><span>Programa</span><strong>${x.program}</strong></div>`}<div><span>Integrantes</span><strong>${x.members}</strong></div><div><span>Fecha de integración</span><strong>${formatDate(x.date)}</strong></div><div><span>Estatus</span><strong>${x.status}</strong></div><div><span>Ubicación</span><strong>${Number(x.lat).toFixed(4)}, ${Number(x.lng).toFixed(4)}</strong></div></div>`;
  openLayer('#detailModal');
};

function charts(){
  if(typeChart)typeChart.destroy(); if(territoryChart)territoryChart.destroy();
  const ccs=committees.filter(x=>x.type==='CCS').length,cps=committees.filter(x=>x.type==='CPS').length;
  typeChart=new Chart($('#typeChart'),{type:'bar',data:{labels:['Contraloría Social','Participación Social'],datasets:[{data:[ccs,cps],backgroundColor:['#a72861','#6e3f72'],borderRadius:12,borderSkipped:false}]},options:{plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,grid:{color:'#eee4e8'}},x:{grid:{display:false}}}}});
  const state=new Set(committees.filter(x=>x.type==='CCS').map(x=>x.municipality)).size;
  const colonies=new Set(committees.filter(x=>x.type==='CPS').map(x=>x.colony)).size;
  territoryChart=new Chart($('#territoryChart'),{type:'doughnut',data:{labels:['Municipios con CCS','Colonias con CPS'],datasets:[{data:[state,colonies],backgroundColor:['#a72861','#6e3f72'],borderWidth:0}]},options:{cutout:'70%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:18}}}}});
}

function admin(){
  kpis();
  const rows=$('#adminRows'); if(!rows)return;
  rows.innerHTML=committees.map(x=>`<tr><td>${x.name}</td><td>${x.type}</td><td>${x.type==='CCS'?x.municipality:x.colony}</td><td><button class="action-btn" data-edit-id="${x.id}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button><button class="action-btn danger" data-delete-id="${x.id}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button></td></tr>`).join('');
  rows.querySelectorAll('[data-edit-id]').forEach(b=>b.onclick=()=>editCommittee(Number(b.dataset.editId)));
  rows.querySelectorAll('[data-delete-id]').forEach(b=>b.onclick=()=>deleteCommittee(Number(b.dataset.deleteId)));
}

function setAdminTab(tab){
  $$('.admin-tabs button').forEach(b=>b.classList.toggle('active',b.dataset.adminTab===tab));
  $$('.admin-panel').forEach(p=>p.hidden=p.dataset.adminPanel!==tab);
}

window.editCommittee=function(id){
  const x=committees.find(y=>y.id===id); if(!x)return;
  $('#formTitle').textContent='Editar comité'; $('#committeeId').value=x.id; $('#committeeType').value=x.type; $('#committeeName').value=x.name; $('#committeeMunicipality').value=x.municipality; $('#committeeColony').value=x.colony; $('#committeeProgram').value=x.program; $('#committeeMembers').value=x.members; $('#committeeDate').value=x.date; $('#committeeLat').value=x.lat; $('#committeeLng').value=x.lng; toggleFormFields(); openLayer('#formModal');
};
window.deleteCommittee=function(id){ if(confirm('¿Eliminar este comité?')){ committees=committees.filter(x=>x.id!==id); save(); refresh(); } };
function toggleFormFields(){ const cps=$('#committeeType').value==='CPS'; $('#colonyField').style.display=cps?'block':'none'; $('#programField').style.display=cps?'none':'block'; $('#committeeColony').required=cps; $('#committeeProgram').required=!cps; if(cps) $('#committeeMunicipality').value='Hermosillo'; }
function refresh(){ kpis(); options(); renderMap(); renderDirectory(); charts(); admin(); }

function bindUI(){
  $('.menu-toggle').onclick=()=>$('.main-nav').classList.toggle('open');
  ['mapSearch','municipalityFilter','colonyFilter'].forEach(id=>$('#'+id)?.addEventListener('input',renderMap));
  $$('.type-check').forEach(x=>x.addEventListener('change',renderMap));
  $('#resetMap').onclick=()=>{ map.setView([29.3,-110.7],6); $('#mapSearch').value=''; $('#municipalityFilter').value=''; $('#colonyFilter').value=''; $$('.type-check').forEach(x=>x.checked=true); renderMap(); };
  ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id=>$('#'+id)?.addEventListener('input',renderDirectory));
  $('#clearFilters').onclick=()=>{ ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id=>$('#'+id).value=''); renderDirectory(); };
  $$('[data-view]').forEach(b=>b.onclick=()=>{ $$('[data-view]').forEach(x=>x.classList.remove('active')); b.classList.add('active'); viewMode=b.dataset.view; renderDirectory(); });
  $$('[data-type-jump]').forEach(b=>b.onclick=()=>{ $('#directoryType').value=b.dataset.typeJump; renderDirectory(); location.hash='directorio'; });
  $$('[data-open-admin]').forEach(b=>b.onclick=()=>{ openLayer('#adminDrawer'); setAdminTab('resumen'); setTimeout(()=>map?.invalidateSize(),50); });
  $$('[data-close-admin]').forEach(b=>b.onclick=()=>closeLayer('#adminDrawer'));
  $$('[data-close-modal]').forEach(b=>b.onclick=()=>closeLayer('#detailModal'));
  $$('[data-close-form]').forEach(b=>b.onclick=()=>closeLayer('#formModal'));
  $$('.admin-tabs button').forEach(b=>b.onclick=()=>setAdminTab(b.dataset.adminTab));
  $('#newCommittee').onclick=()=>{ $('#committeeForm').reset(); $('#committeeId').value=''; $('#formTitle').textContent='Nuevo comité'; toggleFormFields(); openLayer('#formModal'); };
  $('#committeeType').onchange=toggleFormFields;
  $('#committeeForm').onsubmit=e=>{ e.preventDefault(); const id=Number($('#committeeId').value)||Date.now(); const obj={id,type:$('#committeeType').value,name:$('#committeeName').value.trim(),municipality:$('#committeeMunicipality').value.trim(),colony:$('#committeeColony').value.trim(),program:$('#committeeProgram').value.trim(),members:Number($('#committeeMembers').value),date:$('#committeeDate').value,lat:Number($('#committeeLat').value),lng:Number($('#committeeLng').value),status:'Activo'}; const i=committees.findIndex(x=>x.id===id); if(i>=0)committees[i]=obj; else committees.push(obj); save(); closeLayer('#formModal'); refresh(); setAdminTab('comites'); };
  $('#contactForm').onsubmit=e=>{e.preventDefault();alert('Solicitud registrada de forma demostrativa.');e.target.reset();};
  $('#resetDemoData')?.addEventListener('click',()=>{ if(confirm('¿Restablecer los datos demostrativos?')){ committees=structuredClone(baseCommittees); save(); refresh(); } });
  document.addEventListener('click',e=>{
    const popupButton=e.target.closest('[data-popup-id]');
    if(!popupButton) return;
    e.preventDefault();
    e.stopPropagation();
    showDetail(popupButton.dataset.popupId);
  });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeLayer('#detailModal'); closeLayer('#formModal'); closeLayer('#adminDrawer'); } });
}

document.addEventListener('DOMContentLoaded',()=>{
  initMap(); kpis(); options(); renderDirectory(); charts(); admin(); bindUI();
  $$('.reveal').forEach(el=>new IntersectionObserver(([e],o)=>{if(e.isIntersecting){el.classList.add('visible');o.disconnect();}},{threshold:.12}).observe(el));
});
