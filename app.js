'use strict';

const FALLBACK_COMMITTEES = [
  {id:'f1',type:'CCS',name:'Comité de Contraloría Social Hermosillo Centro',municipality:'Hermosillo',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-02-12',lat:29.0729,lng:-110.9559,status:'Activo',description:'',public:true},
  {id:'f2',type:'CCS',name:'Comité de Contraloría Social Navojoa',municipality:'Navojoa',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-02-20',lat:27.0706,lng:-109.4437,status:'Activo',description:'',public:true},
  {id:'f3',type:'CCS',name:'Comité de Contraloría Social Bacanora',municipality:'Bacanora',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-03-03',lat:28.978,lng:-109.399,status:'Activo',description:'',public:true},
  {id:'f4',type:'CCS',name:'Comité de Contraloría Social San Pedro de la Cueva',municipality:'San Pedro de la Cueva',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-03-18',lat:29.286,lng:-109.737,status:'Activo',description:'',public:true},
  {id:'f5',type:'CCS',name:'Comité de Contraloría Social Guaymas',municipality:'Guaymas',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-04-07',lat:27.9193,lng:-110.8974,status:'Activo',description:'',public:true},
  {id:'f6',type:'CCS',name:'Comité de Contraloría Social Nogales',municipality:'Nogales',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-04-13',lat:31.3012,lng:-110.9381,status:'Activo',description:'',public:true},
  {id:'f7',type:'CCS',name:'Comité de Contraloría Social Caborca',municipality:'Caborca',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-04-29',lat:30.7167,lng:-112.1647,status:'Activo',description:'',public:true},
  {id:'f8',type:'CCS',name:'Comité de Contraloría Social Agua Prieta',municipality:'Agua Prieta',colony:'',program:'Programa de Bienestar Social',members:7,date:'2026-05-08',lat:31.3307,lng:-109.5489,status:'Activo',description:'',public:true},
  {id:'f9',type:'CCS',name:'Comité de Contraloría Social Etchojoa',municipality:'Etchojoa',colony:'',program:'Apoyo Alimentario',members:7,date:'2026-05-16',lat:26.9104,lng:-109.626,status:'Activo',description:'',public:true},
  {id:'f10',type:'CCS',name:'Comité de Contraloría Social Álamos',municipality:'Álamos',colony:'',program:'Apoyo Comunitario',members:7,date:'2026-05-24',lat:27.0275,lng:-108.9404,status:'Activo',description:'',public:true},
  {id:'f11',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana El Mirador',municipality:'Hermosillo',colony:'El Mirador',program:'',members:8,date:'2026-02-15',lat:29.118,lng:-110.993,status:'Activo',description:'',public:true},
  {id:'f12',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Las Cuevitas',municipality:'Hermosillo',colony:'Las Cuevitas',program:'',members:9,date:'2026-02-28',lat:29.064,lng:-111.012,status:'Activo',description:'',public:true},
  {id:'f13',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Villas del Real',municipality:'Hermosillo',colony:'Villas del Real',program:'',members:7,date:'2026-03-14',lat:29.129,lng:-110.947,status:'Activo',description:'',public:true},
  {id:'f14',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Cañada de los Negros',municipality:'Hermosillo',colony:'Cañada de los Negros',program:'',members:7,date:'2026-03-28',lat:29.083,lng:-110.928,status:'Activo',description:'',public:true},
  {id:'f15',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Internacional',municipality:'Hermosillo',colony:'Internacional',program:'',members:10,date:'2026-04-11',lat:29.096,lng:-111.018,status:'Activo',description:'',public:true},
  {id:'f16',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Solidaridad',municipality:'Hermosillo',colony:'Solidaridad',program:'',members:8,date:'2026-04-26',lat:29.132,lng:-111.002,status:'Activo',description:'',public:true},
  {id:'f17',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Nuevo Hermosillo',municipality:'Hermosillo',colony:'Nuevo Hermosillo',program:'',members:7,date:'2026-05-10',lat:29.008,lng:-110.934,status:'Activo',description:'',public:true},
  {id:'f18',type:'CPS',name:'Comité de Bienestar y Participación Ciudadana Los Olivos',municipality:'Hermosillo',colony:'Los Olivos',program:'',members:8,date:'2026-05-23',lat:29.024,lng:-110.979,status:'Activo',description:'',public:true}
];

const DEFAULT_CONTENT = {
  hero: {
    eyebrow: 'Transparencia, comunidad y participación que generan valor público',
    title: 'La ciudadanía vigila, participa y transforma.',
    subtitle: 'Conoce los Comités de Contraloría Social de Sonora y los Comités de Bienestar y Participación Ciudadana de las colonias de Hermosillo.'
  },
  participation: {
    title: '¿Formas parte de un comité?',
    subtitle: 'Solicita orientación, capacitación o apoyo para fortalecer las actividades de tu comité.'
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

let db = null;
let committees = [];
let adminCommittees = [];
let publicDocuments = [];
let adminDocuments = [];
let trainings = [];
let requests = [];
let profiles = [];
let siteContent = structuredClone(DEFAULT_CONTENT);
let currentSession = null;
let currentProfile = null;
let map;
let markers = [];
let typeChart;
let territoryChart;
let viewMode = 'cards';

function normalizeCommittee(row) {
  return {
    id: row.id,
    type: row.type,
    name: row.name,
    municipality: row.municipality || '',
    colony: row.colony || '',
    program: row.program || '',
    members: Number(row.members || 0),
    date: row.integration_date || row.date,
    lat: Number(row.lat),
    lng: Number(row.lng),
    status: row.status || 'Activo',
    description: row.description || '',
    public: row.public !== false
  };
}

async function hydrateDocumentUrls(rows) {
  if (!db) return rows || [];
  return Promise.all((rows || []).map(async doc => {
    if (!doc.storage_path) return { ...doc, _url: doc.file_url || '' };
    const { data, error } = await db.storage.from('committee-documents').createSignedUrl(doc.storage_path, 3600);
    if (error) { console.warn('No se pudo firmar el documento', doc.id, error.message); return { ...doc, _url: '' }; }
    return { ...doc, _url: data.signedUrl };
  }));
}

function toDbCommittee(obj) {
  return {
    type: obj.type,
    name: obj.name,
    municipality: obj.municipality,
    colony: obj.colony,
    program: obj.program,
    members: obj.members,
    integration_date: obj.date,
    lat: obj.lat,
    lng: obj.lng,
    status: obj.status,
    description: obj.description,
    public: obj.public,
    updated_by: currentSession?.user?.id || null
  };
}

function isConfigured() {
  const cfg = window.COMITES_SUPABASE || {};
  return /^https:\/\/.+\.supabase\.co$/i.test(cfg.url || '') && !String(cfg.key || '').includes('_AQUI') && String(cfg.key || '').length > 20;
}

function initSupabase() {
  if (!isConfigured()) return false;
  const { url, key } = window.COMITES_SUPABASE;
  db = window.supabase.createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  return true;
}

function setConnectionBanner(message = '', kind = 'warning') {
  const el = $('#connectionBanner');
  if (!el) return;
  if (!message) { el.hidden = true; el.textContent = ''; return; }
  el.hidden = false;
  el.className = `connection-banner ${kind}`;
  el.textContent = message;
}

function toast(message, kind = 'success') {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.className = `toast show ${kind}`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => el.className = 'toast', 3200);
}

function openLayer(selector) {
  const el = $(selector);
  if (!el) return;
  el.classList.add('open');
  el.setAttribute('aria-hidden', 'false');
  document.body.classList.add('layer-open');
}

function closeLayer(selector) {
  const el = $(selector);
  if (!el) return;
  el.classList.remove('open');
  el.setAttribute('aria-hidden', 'true');
  if (!$('.modal.open') && !$('.admin-drawer.open')) document.body.classList.remove('layer-open');
}

function formatDate(date) {
  if (!date) return 'Sin fecha';
  const d = new Date(`${date}T12:00:00`);
  if (Number.isNaN(d.getTime())) return esc(date);
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

function kpis(source = committees) {
  const ccs = source.filter(x => x.type === 'CCS').length;
  const cps = source.filter(x => x.type === 'CPS').length;
  const members = source.reduce((sum, x) => sum + Number(x.members || 0), 0);
  const municipalities = new Set(source.filter(x => x.type === 'CCS').map(x => x.municipality).filter(Boolean)).size;
  const colonies = new Set(source.filter(x => x.type === 'CPS').map(x => x.colony).filter(Boolean)).size;
  const values = { committees: source.length, ccs, cps, members, municipalities, colonies };
  Object.entries(values).forEach(([key, value]) => $$(`[data-kpi="${key}"]`).forEach(el => el.textContent = value.toLocaleString('es-MX')));
  $$('[data-hero-kpi="committees"]').forEach(el => el.textContent = source.length.toLocaleString('es-MX'));
}

function applySiteContent() {
  const getPath = path => path.split('.').reduce((acc, key) => acc?.[key], siteContent);
  $$('[data-content]').forEach(el => {
    const value = getPath(el.dataset.content);
    if (typeof value === 'string' && value.trim()) el.textContent = value;
  });
}

async function loadPublicData() {
  if (!db) {
    committees = structuredClone(FALLBACK_COMMITTEES);
    publicDocuments = [];
    siteContent = structuredClone(DEFAULT_CONTENT);
    setConnectionBanner('La plataforma está en modo local hasta completar la conexión de Supabase.', 'warning');
    refreshPublic();
    return;
  }

  try {
    const [committeeRes, documentRes, contentRes] = await Promise.all([
      db.from('committees').select('*').eq('public', true).order('integration_date', { ascending: true }),
      db.from('documents').select('*').eq('public', true).order('created_at', { ascending: false }),
      db.from('site_content').select('key,value')
    ]);
    if (committeeRes.error) throw committeeRes.error;
    if (documentRes.error) throw documentRes.error;
    if (contentRes.error) throw contentRes.error;

    committees = committeeRes.data.map(normalizeCommittee);
    publicDocuments = await hydrateDocumentUrls(documentRes.data || []);
    siteContent = structuredClone(DEFAULT_CONTENT);
    (contentRes.data || []).forEach(row => { if (row.key && row.value) siteContent[row.key] = row.value; });
    setConnectionBanner('');
    refreshPublic();
  } catch (error) {
    console.error(error);
    committees = structuredClone(FALLBACK_COMMITTEES);
    publicDocuments = [];
    setConnectionBanner('No fue posible consultar la base de datos. Se muestra una copia local temporal.', 'error');
    refreshPublic();
  }
}

function options() {
  const municipalities = [...new Set(committees.map(x => x.municipality).filter(Boolean))].sort((a,b) => a.localeCompare(b,'es'));
  const colonies = [...new Set(committees.map(x => x.colony).filter(Boolean))].sort((a,b) => a.localeCompare(b,'es'));
  const fill = (selector, values, placeholder) => {
    const select = $(selector);
    if (!select) return;
    const selected = select.value;
    select.innerHTML = `<option value="">${esc(placeholder)}</option>${values.map(v => `<option value="${esc(v)}">${esc(v)}</option>`).join('')}`;
    if (values.includes(selected)) select.value = selected;
  };
  fill('#municipalityFilter', municipalities, 'Todos los municipios');
  fill('#directoryMunicipality', municipalities, 'Todos los municipios');
  fill('#colonyFilter', colonies, 'Todas las colonias');
  fill('#directoryColony', colonies, 'Todas las colonias');
}

function initMap() {
  if (!$('#committeeMap') || map) return;
  map = L.map('committeeMap', { scrollWheelZoom: false, zoomControl: true }).setView([29.3, -110.7], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
}

function mapFiltered() {
  const types = $$('.type-check:checked').map(x => x.value);
  const q = ($('#mapSearch')?.value || '').trim().toLowerCase();
  const municipality = $('#municipalityFilter')?.value || '';
  const colony = $('#colonyFilter')?.value || '';
  return committees.filter(x => types.includes(x.type) && (!municipality || x.municipality === municipality) && (!colony || x.colony === colony) && (!q || [x.name,x.municipality,x.colony,x.program].join(' ').toLowerCase().includes(q)));
}

function markerIcon(type) {
  const color = type === 'CPS' ? '#6e3f72' : '#a72861';
  return L.divIcon({
    className: 'committee-marker-wrap',
    html: `<span class="committee-marker" style="--marker-color:${color}"><i class="fa-solid ${type === 'CPS' ? 'fa-people-roof' : 'fa-shield-halved'}"></i></span>`,
    iconSize: [38, 38], iconAnchor: [19, 19], popupAnchor: [0, -19]
  });
}

function renderMap() {
  if (!map) return;
  markers.forEach(marker => marker.remove());
  markers = [];
  const data = mapFiltered();
  data.forEach(x => {
    if (!Number.isFinite(x.lat) || !Number.isFinite(x.lng)) return;
    const location = x.type === 'CPS' ? `${x.colony}, Hermosillo` : x.municipality;
    const popup = L.popup({ className: 'committee-map-popup', maxWidth: 310, autoPan: true, autoPanPadding: [40,40] })
      .setContent(`<div class="map-popup-card"><strong>${esc(x.name)}</strong><span class="map-popup-location">${esc(location)}</span><button type="button" data-popup-id="${esc(x.id)}">Ver ficha</button></div>`);
    const marker = L.marker([x.lat,x.lng], { icon: markerIcon(x.type), keyboard: true, title: x.name }).addTo(map).bindPopup(popup);
    markers.push(marker);
  });
  $('#visibleCount').textContent = `${data.length} comités visibles`;
}

function filteredDirectory() {
  const q = ($('#directorySearch')?.value || '').trim().toLowerCase();
  const type = $('#directoryType')?.value || '';
  const municipality = $('#directoryMunicipality')?.value || '';
  const colony = $('#directoryColony')?.value || '';
  return committees.filter(x => (!type || x.type === type) && (!municipality || x.municipality === municipality) && (!colony || x.colony === colony) && (!q || [x.name,x.municipality,x.colony,x.program].join(' ').toLowerCase().includes(q)));
}

function renderDirectory() {
  const data = filteredDirectory();
  const wrap = $('#committeeDirectory');
  if (!wrap) return;
  wrap.className = `directory-grid${viewMode === 'table' ? ' table-view' : ''}`;
  $('#resultsText').textContent = `${data.length} comités encontrados`;
  wrap.innerHTML = data.length ? data.map(x => `
    <article class="committee-card">
      <div class="committee-top"><span class="type-badge ${x.type === 'CPS' ? 'cps' : ''}">${x.type === 'CCS' ? 'Contraloría Social' : 'Bienestar y Participación Ciudadana'}</span></div>
      <h3>${esc(x.name)}</h3>
      <div class="committee-meta">
        <span><i class="fa-solid fa-location-dot"></i> ${esc(x.type === 'CCS' ? x.municipality : `${x.colony}, Hermosillo`)}</span>
        <span><i class="fa-solid fa-users"></i> ${x.members.toLocaleString('es-MX')} integrantes</span>
        <span><i class="fa-solid fa-calendar"></i> ${esc(formatDate(x.date))}</span>
      </div>
      <button class="btn btn-ghost" data-detail-id="${esc(x.id)}">Consultar ficha</button>
    </article>`).join('') : '<div class="empty-public">No hay comités que coincidan con los filtros.</div>';
}

function showDetail(id) {
  const x = committees.find(y => String(y.id) === String(id));
  if (!x) return;
  map?.closePopup();
  const docs = publicDocuments.filter(doc => String(doc.committee_id || '') === String(x.id));
  const photos = docs.filter(doc => String(doc.mime_type || '').startsWith('image/') || doc.category === 'Fotografía');
  const files = docs.filter(doc => !photos.includes(doc));
  const photoHtml = photos.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-images"></i> Fotografías</h3><div class="detail-gallery">${photos.map(doc => `<a href="${esc(doc._url || '#')}" target="_blank" rel="noopener"><img src="${esc(doc._url || '')}" alt="${esc(doc.title || 'Fotografía del comité')}" loading="lazy"><span>${esc(doc.title || 'Fotografía')}</span></a>`).join('')}</div></section>` : '';
  const fileHtml = files.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-folder-open"></i> Expediente público</h3><div class="detail-files">${files.map(doc => `<a href="${esc(doc._url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-file-arrow-down"></i><div><strong>${esc(doc.title)}</strong><span>${esc(doc.category || 'Documento')}</span></div></a>`).join('')}</div></section>` : '';
  $('#detailContent').innerHTML = `
    <div class="detail-hero"><span class="type-badge ${x.type === 'CPS' ? 'cps' : ''}">${x.type === 'CCS' ? 'Comité de Contraloría Social' : 'Comité de Bienestar y Participación Ciudadana'}</span><h2>${esc(x.name)}</h2><p>${esc(x.description || (x.type === 'CCS' ? 'Mecanismo ciudadano de vigilancia y seguimiento de programas sociales.' : 'Mecanismo de organización comunitaria, bienestar y participación ciudadana.'))}</p></div>
    <div class="detail-grid"><div><span>Municipio</span><strong>${esc(x.municipality)}</strong></div>${x.type === 'CPS' ? `<div><span>Colonia</span><strong>${esc(x.colony)}</strong></div>` : `<div><span>Programa</span><strong>${esc(x.program || 'No especificado')}</strong></div>`}<div><span>Integrantes</span><strong>${x.members}</strong></div><div><span>Fecha de integración</span><strong>${esc(formatDate(x.date))}</strong></div><div><span>Estatus</span><strong>${esc(x.status)}</strong></div><div><span>Ubicación</span><strong>${x.lat.toFixed(4)}, ${x.lng.toFixed(4)}</strong></div></div>
    ${fileHtml}${photoHtml}${!docs.length ? '<p class="detail-empty">Aún no hay documentos públicos cargados para este comité.</p>' : ''}`;
  openLayer('#detailModal');
}
function charts() {
  if (!$('#typeChart') || !$('#territoryChart')) return;
  if (typeChart) typeChart.destroy();
  if (territoryChart) territoryChart.destroy();
  const ccs = committees.filter(x => x.type === 'CCS').length;
  const cps = committees.filter(x => x.type === 'CPS').length;
  typeChart = new Chart($('#typeChart'), {
    type: 'bar',
    data: { labels: ['Contraloría Social','Bienestar y Participación Ciudadana'], datasets: [{ data: [ccs,cps], backgroundColor: ['#a72861','#6e3f72'], borderRadius: 12, borderSkipped: false }] },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#eee4e8' } }, x: { grid: { display: false } } } }
  });
  const municipalities = new Set(committees.filter(x => x.type === 'CCS').map(x => x.municipality)).size;
  const colonies = new Set(committees.filter(x => x.type === 'CPS').map(x => x.colony)).size;
  territoryChart = new Chart($('#territoryChart'), {
    type: 'doughnut',
    data: { labels: ['Municipios con CCS','Colonias con CPS'], datasets: [{ data: [municipalities,colonies], backgroundColor: ['#a72861','#6e3f72'], borderWidth: 0 }] },
    options: { cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } }
  });
}

function renderPublicResources() {
  const wrap = $('#publicResources');
  if (!wrap) return;
  const resources = publicDocuments.filter(doc => !(String(doc.mime_type || '').startsWith('image/') || doc.category === 'Fotografía'));
  $('#resourceCount').textContent = `${resources.length} ${resources.length === 1 ? 'recurso' : 'recursos'}`;
  wrap.innerHTML = resources.length ? resources.map(doc => `
    <a class="resource-card" href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener noreferrer" data-category="${esc(doc.category)}">
      <i class="fa-solid fa-file-arrow-down"></i><div><span>${esc(doc.category || 'General')}</span><strong>${esc(doc.title)}</strong><small>${esc(doc.description || 'Abrir documento')}</small></div>
    </a>`).join('') : '<p class="resource-empty">Aún no hay documentos públicos cargados.</p>';
}
function refreshPublic() {
  applySiteContent();
  kpis(committees);
  options();
  renderMap();
  renderDirectory();
  renderPublicResources();
  charts();
}

async function getSessionAndProfile() {
  if (!db) return null;
  const { data: { session } } = await db.auth.getSession();
  currentSession = session;
  if (!session) { currentProfile = null; return null; }
  const { data, error } = await db.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  if (error) { console.error(error); currentProfile = null; return null; }
  currentProfile = data;
  return data;
}

function isStaff() { return currentProfile?.active && ['admin','capturista'].includes(currentProfile.role); }
function isAdmin() { return currentProfile?.active && currentProfile.role === 'admin'; }

async function openAdmin() {
  if (!db) {
    toast('Primero debe configurarse la conexión con Supabase.', 'error');
    return;
  }
  await getSessionAndProfile();
  if (!currentSession || !isStaff()) {
    $('#loginMessage').hidden = true;
    openLayer('#loginModal');
    return;
  }
  await loadAdminData();
  prepareAdminRoleUI();
  openLayer('#adminDrawer');
  setAdminTab('resumen');
}

function prepareAdminRoleUI() {
  const label = $('#adminUserLabel');
  if (label) label.textContent = `${currentSession?.user?.email || ''} · ${currentProfile?.role || ''}`;
  $$('[data-admin-only]').forEach(el => el.hidden = !isAdmin());
}

async function loadAdminData() {
  if (!db || !isStaff()) return;
  const calls = [
    db.from('committees').select('*').order('integration_date', { ascending: false }),
    db.from('documents').select('*').order('created_at', { ascending: false }),
    db.from('trainings').select('*').order('training_date', { ascending: false }),
    db.from('contact_requests').select('*').order('created_at', { ascending: false })
  ];
  if (isAdmin()) calls.push(db.from('profiles').select('*').order('email'));
  const results = await Promise.all(calls);
  const firstError = results.find(r => r.error)?.error;
  if (firstError) { console.error(firstError); toast('No se pudo cargar el panel.', 'error'); return; }
  adminCommittees = results[0].data.map(normalizeCommittee);
  adminDocuments = await hydrateDocumentUrls(results[1].data || []);
  trainings = results[2].data || [];
  requests = results[3].data || [];
  profiles = isAdmin() ? (results[4].data || []) : [];
  renderAdmin();
}

function setAdminTab(tab) {
  if (!isAdmin() && ['contenido','usuarios'].includes(tab)) tab = 'resumen';
  $$('.admin-tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === tab));
  $$('.admin-panel').forEach(panel => panel.hidden = panel.dataset.adminPanel !== tab);
}

function renderAdmin() {
  renderCommitteeAdmin();
  renderDocumentAdmin();
  renderTrainingAdmin();
  renderRequestsAdmin();
  renderUsersAdmin();
  populateCommitteeSelects();
  fillContentForm();
}

function renderCommitteeAdmin() {
  const rows = $('#adminRows');
  if (!rows) return;
  rows.innerHTML = adminCommittees.length ? adminCommittees.map(x => `<tr><td><strong>${esc(x.name)}</strong>${x.public ? '' : '<small class="private-label">Privado</small>'}</td><td>${esc(x.type)}</td><td>${esc(x.type === 'CCS' ? x.municipality : x.colony)}</td><td>${esc(x.status)}</td><td><button class="action-btn" data-edit-id="${esc(x.id)}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button>${isAdmin() ? `<button class="action-btn danger" data-delete-id="${esc(x.id)}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>` : ''}</td></tr>`).join('') : '<tr><td colspan="5">No hay comités registrados.</td></tr>';
}

function populateCommitteeSelects() {
  const opts = adminCommittees.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
  const doc = $('#documentCommittee');
  const training = $('#trainingCommittee');
  if (doc) doc.innerHTML = `<option value="">Selecciona un comité</option>${opts}`;
  if (training) training.innerHTML = `<option value="">General</option>${opts}`;
}

function renderDocumentAdmin() {
  const wrap = $('#adminDocuments');
  if (!wrap) return;
  wrap.innerHTML = adminDocuments.length ? adminDocuments.map(doc => {
    const committee = adminCommittees.find(x => x.id === doc.committee_id);
    return `<article class="admin-card"><div class="admin-card-icon"><i class="fa-solid fa-folder-open"></i></div><div><span>${esc(doc.category || 'General')} · ${doc.public ? 'Público' : 'Interno'}</span><h3>${esc(doc.title)}</h3><p>${esc(committee?.name || doc.description || 'Documento general')}</p><a href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener noreferrer">Abrir documento</a></div>${isAdmin() ? `<button class="action-btn danger" data-delete-document="${esc(doc.id)}" aria-label="Eliminar documento"><i class="fa-solid fa-trash"></i></button>` : ''}</article>`;
  }).join('') : '<div class="empty-state"><i class="fa-solid fa-folder-open"></i><h3>Sin documentos</h3><p>Sube el primer documento institucional.</p></div>';
}

function renderTrainingAdmin() {
  const rows = $('#trainingRows');
  if (!rows) return;
  rows.innerHTML = trainings.length ? trainings.map(item => {
    const committee = adminCommittees.find(x => x.id === item.committee_id);
    return `<tr><td><strong>${esc(item.title)}</strong><small>${esc(item.location || '')}</small></td><td>${esc(formatDate(item.training_date))}</td><td>${esc(committee?.name || 'General')}</td><td>${Number(item.attendees || 0)}</td><td>${esc(item.status)}</td><td><button class="action-btn" data-edit-training="${esc(item.id)}"><i class="fa-solid fa-pen"></i></button>${isAdmin() ? `<button class="action-btn danger" data-delete-training="${esc(item.id)}"><i class="fa-solid fa-trash"></i></button>` : ''}</td></tr>`;
  }).join('') : '<tr><td colspan="6">No hay capacitaciones registradas.</td></tr>';
}

function renderRequestsAdmin() {
  const rows = $('#requestRows');
  if (!rows) return;
  rows.innerHTML = requests.length ? requests.map(item => `<tr><td>${new Date(item.created_at).toLocaleDateString('es-MX')}</td><td><strong>${esc(item.name)}</strong><small>${esc(item.committee_type)}</small></td><td><strong>${esc(item.request_type)}</strong><small>${esc(item.message)}</small></td><td><select data-request-status="${esc(item.id)}"><option ${item.status==='Nueva'?'selected':''}>Nueva</option><option ${item.status==='En atención'?'selected':''}>En atención</option><option ${item.status==='Atendida'?'selected':''}>Atendida</option><option ${item.status==='Descartada'?'selected':''}>Descartada</option></select></td><td>${isAdmin() ? `<button class="action-btn danger" data-delete-request="${esc(item.id)}"><i class="fa-solid fa-trash"></i></button>` : '<span class="muted">—</span>'}</td></tr>`).join('') : '<tr><td colspan="5">No hay solicitudes recibidas.</td></tr>';
}

function renderUsersAdmin() {
  const rows = $('#userRows');
  if (!rows) return;
  if (!isAdmin()) { rows.innerHTML = ''; return; }
  rows.innerHTML = profiles.length ? profiles.map(profile => `<tr><td>${esc(profile.email || '')}</td><td><input data-user-name="${esc(profile.id)}" value="${esc(profile.full_name || '')}"></td><td><select data-user-role="${esc(profile.id)}"><option value="consulta" ${profile.role==='consulta'?'selected':''}>Consulta</option><option value="capturista" ${profile.role==='capturista'?'selected':''}>Capturista</option><option value="admin" ${profile.role==='admin'?'selected':''}>Administrador</option></select></td><td><input type="checkbox" data-user-active="${esc(profile.id)}" ${profile.active?'checked':''}></td><td><button class="btn btn-ghost btn-sm" data-save-user="${esc(profile.id)}">Guardar</button></td></tr>`).join('') : '<tr><td colspan="5">No hay usuarios registrados.</td></tr>';
}

function fillContentForm() {
  if (!isAdmin()) return;
  $('#contentHeroEyebrow').value = siteContent.hero?.eyebrow || '';
  $('#contentHeroTitle').value = siteContent.hero?.title || '';
  $('#contentHeroSubtitle').value = siteContent.hero?.subtitle || '';
  $('#contentParticipationTitle').value = siteContent.participation?.title || '';
  $('#contentParticipationSubtitle').value = siteContent.participation?.subtitle || '';
}

function toggleFormFields() {
  const cps = $('#committeeType').value === 'CPS';
  $('#colonyField').style.display = cps ? 'block' : 'none';
  $('#programField').style.display = cps ? 'none' : 'block';
  $('#committeeColony').required = cps;
  $('#committeeProgram').required = !cps;
  if (cps) $('#committeeMunicipality').value = 'Hermosillo';
}

function newCommitteeForm() {
  $('#committeeForm').reset();
  $('#committeeId').value = '';
  $('#committeePublic').checked = true;
  $('#committeeStatus').value = 'Activo';
  $('#formTitle').textContent = 'Nuevo comité';
  toggleFormFields();
  openLayer('#formModal');
}

function editCommittee(id) {
  const x = adminCommittees.find(y => String(y.id) === String(id));
  if (!x) return;
  $('#formTitle').textContent = 'Editar comité';
  $('#committeeId').value = x.id;
  $('#committeeType').value = x.type;
  $('#committeeName').value = x.name;
  $('#committeeMunicipality').value = x.municipality;
  $('#committeeColony').value = x.colony;
  $('#committeeProgram').value = x.program;
  $('#committeeMembers').value = x.members;
  $('#committeeDate').value = x.date;
  $('#committeeStatus').value = x.status;
  $('#committeeDescription').value = x.description;
  $('#committeePublic').checked = x.public;
  $('#committeeLat').value = x.lat;
  $('#committeeLng').value = x.lng;
  toggleFormFields();
  openLayer('#formModal');
}

async function saveCommittee(event) {
  event.preventDefault();
  if (!db || !isStaff()) return;
  const id = $('#committeeId').value;
  const obj = {
    type: $('#committeeType').value,
    name: $('#committeeName').value.trim(),
    municipality: $('#committeeMunicipality').value.trim(),
    colony: $('#committeeColony').value.trim(),
    program: $('#committeeProgram').value.trim(),
    members: Number($('#committeeMembers').value),
    date: $('#committeeDate').value,
    status: $('#committeeStatus').value,
    description: $('#committeeDescription').value.trim(),
    public: $('#committeePublic').checked,
    lat: Number($('#committeeLat').value),
    lng: Number($('#committeeLng').value)
  };
  const payload = toDbCommittee(obj);
  let result;
  if (id) result = await db.from('committees').update(payload).eq('id', id);
  else result = await db.from('committees').insert({ ...payload, created_by: currentSession.user.id });
  if (result.error) { console.error(result.error); toast('No se pudo guardar el comité.', 'error'); return; }
  closeLayer('#formModal');
  toast(id ? 'Comité actualizado.' : 'Comité creado.');
  await Promise.all([loadPublicData(), loadAdminData()]);
  setAdminTab('comites');
}

async function deleteCommittee(id) {
  if (!isAdmin() || !confirm('¿Eliminar definitivamente este comité?')) return;
  const { error } = await db.from('committees').delete().eq('id', id);
  if (error) { console.error(error); toast('No se pudo eliminar el comité.', 'error'); return; }
  toast('Comité eliminado.');
  await Promise.all([loadPublicData(), loadAdminData()]);
}

async function saveDocument(event) {
  event.preventDefault();
  if (!db || !isStaff()) return;
  const files = [...($('#documentFile').files || [])];
  const committeeId = $('#documentCommittee').value;
  if (!committeeId) { toast('Selecciona el comité al que pertenece el expediente.', 'error'); return; }
  if (!files.length) return;
  if (files.some(file => file.size > 15 * 1024 * 1024)) { toast('Uno de los archivos supera el límite de 15 MB.', 'error'); return; }
  const baseTitle = $('#documentTitle').value.trim();
  const category = $('#documentCategory').value;
  const description = $('#documentDescription').value.trim();
  const isPublic = $('#documentPublic').checked;
  let uploaded = 0;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-');
    const path = `${committeeId}/${crypto.randomUUID()}-${safeName}`;
    const upload = await db.storage.from('committee-documents').upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined });
    if (upload.error) { console.error(upload.error); toast(`No se pudo subir ${file.name}.`, 'error'); continue; }
    const title = files.length === 1 ? baseTitle : `${baseTitle} · ${i + 1}`;
    const insert = await db.from('documents').insert({
      title,
      category,
      committee_id: committeeId,
      description,
      storage_path: path,
      file_url: '',
      file_name: file.name,
      mime_type: file.type || '',
      file_size: file.size,
      public: isPublic,
      created_by: currentSession.user.id
    });
    if (insert.error) {
      console.error(insert.error);
      await db.storage.from('committee-documents').remove([path]);
      toast(`No se pudo registrar ${file.name}.`, 'error');
      continue;
    }
    uploaded++;
  }
  if (!uploaded) return;
  $('#documentForm').reset();
  $('#documentPublic').checked = true;
  closeLayer('#documentModal');
  toast(uploaded === 1 ? 'Archivo agregado al expediente.' : `${uploaded} archivos agregados al expediente.`);
  await Promise.all([loadPublicData(), loadAdminData()]);
  setAdminTab('documentos');
}
async function deleteDocument(id) {
  if (!isAdmin() || !confirm('¿Eliminar este documento?')) return;
  const doc = adminDocuments.find(x => x.id === id);
  if (!doc) return;
  if (doc.storage_path) await db.storage.from('committee-documents').remove([doc.storage_path]);
  const { error } = await db.from('documents').delete().eq('id', id);
  if (error) { console.error(error); toast('No se pudo eliminar el documento.', 'error'); return; }
  toast('Documento eliminado.');
  await Promise.all([loadPublicData(), loadAdminData()]);
}

function newTrainingForm() {
  $('#trainingForm').reset();
  $('#trainingId').value = '';
  $('#trainingAttendees').value = '0';
  $('#trainingStatus').value = 'Programada';
  $('#trainingFormTitle').textContent = 'Nueva capacitación';
  openLayer('#trainingModal');
}

function editTraining(id) {
  const item = trainings.find(x => x.id === id);
  if (!item) return;
  $('#trainingFormTitle').textContent = 'Editar capacitación';
  $('#trainingId').value = item.id;
  $('#trainingTitle').value = item.title;
  $('#trainingCommittee').value = item.committee_id || '';
  $('#trainingDate').value = item.training_date;
  $('#trainingLocation').value = item.location || '';
  $('#trainingAttendees').value = item.attendees || 0;
  $('#trainingStatus').value = item.status;
  $('#trainingNotes').value = item.notes || '';
  openLayer('#trainingModal');
}

async function saveTraining(event) {
  event.preventDefault();
  if (!db || !isStaff()) return;
  const id = $('#trainingId').value;
  const payload = {
    title: $('#trainingTitle').value.trim(),
    committee_id: $('#trainingCommittee').value || null,
    training_date: $('#trainingDate').value,
    location: $('#trainingLocation').value.trim(),
    attendees: Number($('#trainingAttendees').value || 0),
    status: $('#trainingStatus').value,
    notes: $('#trainingNotes').value.trim()
  };
  let res;
  if (id) res = await db.from('trainings').update(payload).eq('id', id);
  else res = await db.from('trainings').insert({ ...payload, created_by: currentSession.user.id });
  if (res.error) { console.error(res.error); toast('No se pudo guardar la capacitación.', 'error'); return; }
  closeLayer('#trainingModal');
  toast('Capacitación guardada.');
  await loadAdminData();
  setAdminTab('capacitaciones');
}

async function deleteTraining(id) {
  if (!isAdmin() || !confirm('¿Eliminar esta capacitación?')) return;
  const { error } = await db.from('trainings').delete().eq('id', id);
  if (error) { console.error(error); toast('No se pudo eliminar.', 'error'); return; }
  toast('Capacitación eliminada.');
  await loadAdminData();
}

async function updateRequestStatus(id, status) {
  const { error } = await db.from('contact_requests').update({ status }).eq('id', id);
  if (error) { console.error(error); toast('No se pudo actualizar la solicitud.', 'error'); return; }
  toast('Solicitud actualizada.');
  await loadAdminData();
}

async function deleteRequest(id) {
  if (!isAdmin() || !confirm('¿Eliminar esta solicitud?')) return;
  const { error } = await db.from('contact_requests').delete().eq('id', id);
  if (error) { console.error(error); toast('No se pudo eliminar.', 'error'); return; }
  toast('Solicitud eliminada.');
  await loadAdminData();
}

async function createUserFromAdmin(event) {
  event.preventDefault();
  if (!db || !isAdmin()) return;
  const message = $('#newUserMessage');
  message.hidden = true;
  const payload = {
    full_name: $('#newUserName').value.trim(),
    email: $('#newUserEmail').value.trim(),
    password: $('#newUserPassword').value,
    role: $('#newUserRole').value
  };
  if (payload.password.length < 8) { message.hidden = false; message.textContent = 'La contraseña debe tener al menos 8 caracteres.'; return; }
  const { data, error } = await db.functions.invoke('admin-create-user', { body: payload });
  if (error || !data?.ok) {
    console.error(error || data);
    message.hidden = false;
    message.textContent = data?.error || error?.message || 'No se pudo crear el usuario. Verifica que la función admin-create-user esté desplegada.';
    return;
  }
  $('#userCreateForm').reset();
  closeLayer('#userModal');
  toast('Usuario creado correctamente.');
  await loadAdminData();
  setAdminTab('usuarios');
}

async function saveUser(id) {
  if (!isAdmin()) return;
  const role = $(`[data-user-role="${CSS.escape(id)}"]`).value;
  const full_name = $(`[data-user-name="${CSS.escape(id)}"]`).value.trim();
  const active = $(`[data-user-active="${CSS.escape(id)}"]`).checked;
  if (id === currentSession.user.id && (!active || role !== 'admin')) {
    if (!confirm('Estás modificando tu propia cuenta administrativa. ¿Continuar?')) return;
  }
  const { error } = await db.from('profiles').update({ role, full_name, active }).eq('id', id);
  if (error) { console.error(error); toast('No se pudo actualizar el usuario.', 'error'); return; }
  toast('Permisos actualizados.');
  await loadAdminData();
}

async function saveContent(event) {
  event.preventDefault();
  if (!isAdmin()) return;
  const hero = {
    eyebrow: $('#contentHeroEyebrow').value.trim(),
    title: $('#contentHeroTitle').value.trim(),
    subtitle: $('#contentHeroSubtitle').value.trim()
  };
  const participation = {
    title: $('#contentParticipationTitle').value.trim(),
    subtitle: $('#contentParticipationSubtitle').value.trim()
  };
  const rows = [
    { key: 'hero', value: hero, updated_by: currentSession.user.id },
    { key: 'participation', value: participation, updated_by: currentSession.user.id }
  ];
  const { error } = await db.from('site_content').upsert(rows, { onConflict: 'key' });
  if (error) { console.error(error); toast('No se pudo guardar el contenido.', 'error'); return; }
  toast('Contenido público actualizado.');
  await loadPublicData();
  setAdminTab('contenido');
}

async function submitContact(event) {
  event.preventDefault();
  if (!db) { toast('El formulario estará disponible al completar la conexión con Supabase.', 'error'); return; }
  const payload = {
    name: $('#contactName').value.trim(),
    committee_type: $('#contactCommitteeType').value,
    request_type: $('#contactRequestType').value,
    message: $('#contactMessage').value.trim()
  };
  const { error } = await db.from('contact_requests').insert(payload);
  if (error) { console.error(error); toast('No fue posible enviar la solicitud.', 'error'); return; }
  event.target.reset();
  toast('Solicitud enviada correctamente.');
}

async function login(event) {
  event.preventDefault();
  if (!db) return;
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  const message = $('#loginMessage');
  message.hidden = true;
  const { error } = await db.auth.signInWithPassword({ email, password });
  if (error) {
    message.hidden = false;
    message.textContent = 'No fue posible iniciar sesión. Revisa tu correo y contraseña.';
    return;
  }
  await getSessionAndProfile();
  if (!isStaff()) {
    await db.auth.signOut();
    message.hidden = false;
    message.textContent = 'La cuenta existe, pero todavía no tiene permisos de administración.';
    return;
  }
  closeLayer('#loginModal');
  await openAdmin();
}

async function registerAccount() {
  if (!db) return;
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  const message = $('#loginMessage');
  if (!email || password.length < 6) {
    message.hidden = false;
    message.textContent = 'Captura un correo y una contraseña de al menos 6 caracteres.';
    return;
  }
  const { error } = await db.auth.signUp({ email, password });
  message.hidden = false;
  if (error) message.textContent = `No fue posible crear la cuenta: ${error.message}`;
  else message.textContent = 'Cuenta registrada. Revisa tu correo si Supabase solicita confirmación. Un administrador debe asignarte permisos.';
}

async function forgotPassword() {
  if (!db) return;
  const email = $('#loginEmail').value.trim();
  const message = $('#loginMessage');
  if (!email) { message.hidden = false; message.textContent = 'Captura primero tu correo electrónico.'; return; }
  const redirectTo = new URL(window.location.href);
  redirectTo.hash = '';
  redirectTo.search = '';
  const { error } = await db.auth.resetPasswordForEmail(email, { redirectTo: redirectTo.toString() });
  message.hidden = false;
  message.textContent = error ? 'No fue posible enviar el correo de recuperación.' : 'Se envió el enlace de recuperación a tu correo.';
}

async function updatePassword(event) {
  event.preventDefault();
  if (!db) return;
  const password = $('#newPassword').value;
  const confirmPasswordValue = $('#confirmPassword').value;
  const message = $('#passwordMessage');
  if (password.length < 8 || password !== confirmPasswordValue) {
    message.hidden = false;
    message.textContent = password !== confirmPasswordValue ? 'Las contraseñas no coinciden.' : 'Usa una contraseña de al menos 8 caracteres.';
    return;
  }
  const { error } = await db.auth.updateUser({ password });
  message.hidden = false;
  if (error) {
    message.textContent = 'No fue posible actualizar la contraseña.';
    return;
  }
  message.textContent = 'Contraseña actualizada correctamente.';
  $('#passwordForm').reset();
  setTimeout(() => closeLayer('#passwordModal'), 900);
}

async function logout() {
  if (db) await db.auth.signOut();
  currentSession = null;
  currentProfile = null;
  closeLayer('#adminDrawer');
  toast('Sesión cerrada.');
  await loadPublicData();
}

function bindUI() {
  $('.menu-toggle')?.addEventListener('click', () => {
    const nav = $('.main-nav');
    nav.classList.toggle('open');
    $('.menu-toggle').setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
  });
  ['mapSearch','municipalityFilter','colonyFilter'].forEach(id => $(`#${id}`)?.addEventListener('input', renderMap));
  $$('.type-check').forEach(x => x.addEventListener('change', renderMap));
  $('#resetMap')?.addEventListener('click', () => {
    map?.setView([29.3,-110.7],6);
    $('#mapSearch').value = '';
    $('#municipalityFilter').value = '';
    $('#colonyFilter').value = '';
    $$('.type-check').forEach(x => x.checked = true);
    renderMap();
  });
  ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id => $(`#${id}`)?.addEventListener('input', renderDirectory));
  $('#clearFilters')?.addEventListener('click', () => {
    ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id => $(`#${id}`).value = '');
    renderDirectory();
  });
  $$('[data-view]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-view]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    viewMode = btn.dataset.view;
    renderDirectory();
  }));
  $$('[data-type-jump]').forEach(btn => btn.addEventListener('click', () => {
    $('#directoryType').value = btn.dataset.typeJump;
    renderDirectory();
    location.hash = 'directorio';
  }));
  $$('[data-open-admin]').forEach(btn => btn.addEventListener('click', openAdmin));
  $$('[data-close-admin]').forEach(btn => btn.addEventListener('click', () => closeLayer('#adminDrawer')));
  $$('[data-close-login]').forEach(btn => btn.addEventListener('click', () => closeLayer('#loginModal')));
  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeLayer('#detailModal')));
  $$('[data-close-form]').forEach(btn => btn.addEventListener('click', () => closeLayer('#formModal')));
  $$('[data-close-document]').forEach(btn => btn.addEventListener('click', () => closeLayer('#documentModal')));
  $$('[data-close-training]').forEach(btn => btn.addEventListener('click', () => closeLayer('#trainingModal')));
  $$('[data-close-user]').forEach(btn => btn.addEventListener('click', () => closeLayer('#userModal')));
  $$('.admin-tabs button').forEach(btn => btn.addEventListener('click', () => setAdminTab(btn.dataset.adminTab)));

  $('#loginForm')?.addEventListener('submit', login);
  $('#forgotPassword')?.addEventListener('click', forgotPassword);
  $('#passwordForm')?.addEventListener('submit', updatePassword);
  $$('[data-close-password]').forEach(btn => btn.addEventListener('click', () => closeLayer('#passwordModal')));
  $('#logoutBtn')?.addEventListener('click', logout);
  $('#refreshAdmin')?.addEventListener('click', async () => { await Promise.all([loadPublicData(), loadAdminData()]); toast('Información actualizada.'); });

  $('#newCommittee')?.addEventListener('click', newCommitteeForm);
  $('#committeeType')?.addEventListener('change', toggleFormFields);
  $('#committeeForm')?.addEventListener('submit', saveCommittee);
  $('#newDocument')?.addEventListener('click', () => { $('#documentForm').reset(); $('#documentPublic').checked = true; openLayer('#documentModal'); });
  $('#documentForm')?.addEventListener('submit', saveDocument);
  $('#newUser')?.addEventListener('click', () => { $('#userCreateForm').reset(); $('#newUserMessage').hidden = true; openLayer('#userModal'); });
  $('#userCreateForm')?.addEventListener('submit', createUserFromAdmin);
  $('#newTraining')?.addEventListener('click', newTrainingForm);
  $('#trainingForm')?.addEventListener('submit', saveTraining);
  $('#contentForm')?.addEventListener('submit', saveContent);
  $('#contactForm')?.addEventListener('submit', submitContact);

  document.addEventListener('click', event => {
    const detail = event.target.closest('[data-detail-id], [data-popup-id]');
    if (detail) { event.preventDefault(); showDetail(detail.dataset.detailId || detail.dataset.popupId); return; }
    const edit = event.target.closest('[data-edit-id]');
    if (edit) { editCommittee(edit.dataset.editId); return; }
    const del = event.target.closest('[data-delete-id]');
    if (del) { deleteCommittee(del.dataset.deleteId); return; }
    const delDoc = event.target.closest('[data-delete-document]');
    if (delDoc) { deleteDocument(delDoc.dataset.deleteDocument); return; }
    const editTrainingBtn = event.target.closest('[data-edit-training]');
    if (editTrainingBtn) { editTraining(editTrainingBtn.dataset.editTraining); return; }
    const delTrainingBtn = event.target.closest('[data-delete-training]');
    if (delTrainingBtn) { deleteTraining(delTrainingBtn.dataset.deleteTraining); return; }
    const delRequestBtn = event.target.closest('[data-delete-request]');
    if (delRequestBtn) { deleteRequest(delRequestBtn.dataset.deleteRequest); return; }
    const saveUserBtn = event.target.closest('[data-save-user]');
    if (saveUserBtn) { saveUser(saveUserBtn.dataset.saveUser); return; }
  });

  document.addEventListener('change', event => {
    const status = event.target.closest('[data-request-status]');
    if (status) updateRequestStatus(status.dataset.requestStatus, status.value);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') ['#detailModal','#loginModal','#passwordModal','#formModal','#documentModal','#trainingModal','#userModal','#adminDrawer'].forEach(closeLayer);
  });

  $$('[data-resource-category]').forEach(link => link.addEventListener('click', () => {
    const category = link.dataset.resourceCategory;
    setTimeout(() => {
      $$('.resource-card').forEach(card => card.classList.toggle('resource-highlight', card.dataset.category === category));
      setTimeout(() => $$('.resource-card').forEach(card => card.classList.remove('resource-highlight')), 1600);
    }, 250);
  }));
}

async function init() {
  initMap();
  bindUI();
  const configured = initSupabase();
  if (configured) {
    db.auth.onAuthStateChange((event, session) => {
      currentSession = session;
      if (event === 'PASSWORD_RECOVERY') openLayer('#passwordModal');
    });
  }
  await loadPublicData();
  if (configured) await getSessionAndProfile();
  $$('.reveal').forEach(el => new IntersectionObserver(([entry], observer) => {
    if (entry.isIntersecting) { el.classList.add('visible'); observer.disconnect(); }
  }, { threshold: .12 }).observe(el));
  setTimeout(() => map?.invalidateSize(), 100);
}

document.addEventListener('DOMContentLoaded', init);
