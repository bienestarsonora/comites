window.COMITES_BUILD = 'v25-buscador-ficha-publica-live';
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
let publicFileStatus = [];
let resourceVisibleCount = 9;
let adminDocuments = [];
let trainings = [];
let requests = [];
let profiles = [];
let publicTrainings = [];
let publicEvents = [];
let publicCommitments = [];
let publicManagements = [];
let adminEvents = [];
let adminCommitments = [];
let adminManagements = [];
let siteContent = structuredClone(DEFAULT_CONTENT);
let currentSession = null;
let currentProfile = null;
let map;
let markers = [];
let typeChart;
let territoryChart;
let requestStatusChart;
let requestTrendChart;
let viewMode = 'cards';
let directoryVisibleCount = 9;
const DIRECTORY_PAGE_SIZE = 9;

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

function formatDateRange(start, end) {
  const a = start || end;
  const b = end || start;
  if (!a && !b) return 'Sin fecha';
  if (!b || a === b) return formatDate(a);
  return `${formatDate(a)} — ${formatDate(b)}`;
}

function daysBetween(start, end) {
  if (!start || !end) return null;
  const a = new Date(`${start}T12:00:00`);
  const b = new Date(`${end}T12:00:00`);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null;
  return Math.max(0, Math.round((b - a) / 86400000));
}

function isImageDocument(doc) {
  return String(doc?.mime_type || '').startsWith('image/') || doc?.category === 'Fotografía';
}

function fileStatusForCommittee(committeeId) {
  return publicFileStatus.find(row => String(row.committee_id || '') === String(committeeId || '')) || null;
}

function impactStats(sourceCommittees = committees, sourceManagements = publicManagements, sourceEvents = publicEvents, sourceCommitments = publicCommitments) {
  const active = sourceCommittees.filter(x => x.status === 'Activo').length;
  const requests = sourceManagements.length;
  const concluded = sourceManagements.filter(x => x.status === 'Concluida');
  const requestsCompletedPct = requests ? Math.round(concluded.length / requests * 100) : 0;
  const responseDays = sourceManagements
    .map(x => daysBetween(x.request_date, x.first_response_date))
    .filter(x => Number.isFinite(x));
  const avgResponseDays = responseDays.length ? Math.round(responseDays.reduce((a,b)=>a+b,0) / responseDays.length * 10) / 10 : null;
  const inProgress = sourceManagements.filter(x => ['En gestión','Programada','En ejecución'].includes(x.status)).length;
  const completedCommitments = sourceCommitments.filter(x => x.status === 'Cumplido');
  const commitmentsCompletedPct = sourceCommitments.length ? Math.round(completedCommitments.length / sourceCommitments.length * 100) : 0;

  // La integridad del expediente se calcula por existencia del acta + lista,
  // aunque alguno de esos archivos sea privado. La privacidad controla quién
  // puede abrir el archivo, no si el expediente existe.
  const completeFiles = sourceCommittees.filter(c => {
    const status = fileStatusForCommittee(c.id);
    return Boolean(status?.has_acta && status?.has_attendance);
  }).length;
  const completeFilesPct = sourceCommittees.length ? Math.round(completeFiles / sourceCommittees.length * 100) : 0;

  return { active, requests, requestsCompletedPct, avgResponseDays, inProgress, events: sourceEvents.length, commitmentsCompletedPct, completeFilesPct };
}

function committeeStrengthScore(committee) {
  const id = String(committee.id);
  const docs = publicDocuments.filter(d => String(d.committee_id||'') === id);
  const trainingsFor = publicTrainings.filter(t => String(t.committee_id||'') === id && t.status === 'Realizada');
  const managementsFor = publicManagements.filter(r => String(r.committee_id||'') === id);
  const eventsFor = publicEvents.filter(e => String(e.committee_id||'') === id);
  const commitmentsFor = publicCommitments.filter(c => String(c.committee_id||'') === id);
  const fileStatus = fileStatusForCommittee(committee.id);
  const hasActa = Boolean(fileStatus?.has_acta);
  const hasAttendance = Boolean(fileStatus?.has_attendance);
  const hasEvidence = docs.some(isImageDocument) || docs.some(d => d.category === 'Evidencia');
  const recentActivity = eventsFor.length > 0;
  const followup = commitmentsFor.length ? (commitmentsFor.some(c => ['Cumplido','En proceso'].includes(c.status)) ? 15 : 8) : 0;
  const parts = {
    constitucion: (hasActa ? 10 : 0) + (hasAttendance ? 10 : 0),
    capacitacion: (trainingsFor.length || managementsFor.some(r => r.status === 'Concluida')) ? 20 : 0,
    actividad: recentActivity ? 20 : 0,
    evidencia: hasEvidence ? 15 : 0,
    seguimiento: followup,
    participacion: Number(committee.members||0) > 0 ? 10 : 0
  };
  return { ...parts, total: Object.values(parts).reduce((a,b)=>a+b,0) };
}

async function optionalData(promise, label) {
  try {
    const res = await promise;
    if (res.error) { console.warn(`Módulo opcional ${label}:`, res.error.message); return []; }
    return res.data || [];
  } catch (error) {
    console.warn(`Módulo opcional ${label}:`, error?.message || error);
    return [];
  }
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
    publicFileStatus = [];
    publicTrainings = [];
    publicEvents = [];
    publicCommitments = [];
    publicManagements = [];
    siteContent = structuredClone(DEFAULT_CONTENT);
    setConnectionBanner('La plataforma está en modo local hasta completar la conexión de Supabase.', 'warning');
    refreshPublic();
    return;
  }

  try {
    const [committeeRes, documentRes, contentRes, fileStatusRes] = await Promise.all([
      db.from('committees').select('*').eq('public', true).order('integration_date', { ascending: true }),
      db.from('documents').select('*').eq('public', true).order('created_at', { ascending: false }),
      db.from('site_content').select('key,value'),
      db.rpc('get_committee_file_status')
    ]);
    if (committeeRes.error) throw committeeRes.error;
    if (documentRes.error) throw documentRes.error;
    if (contentRes.error) throw contentRes.error;
    if (fileStatusRes.error) throw fileStatusRes.error;

    committees = committeeRes.data.map(normalizeCommittee);
    publicDocuments = await hydrateDocumentUrls(documentRes.data || []);
    publicFileStatus = fileStatusRes.data || [];
    const [trainingRows, eventRows, commitmentRows, managementRows] = await Promise.all([
      optionalData(db.from('trainings').select('*').eq('public', true).order('training_date', { ascending: false }), 'capacitaciones públicas'),
      optionalData(db.from('committee_events').select('*').eq('public', true).order('event_date', { ascending: false }), 'bitácora pública'),
      optionalData(db.from('commitments').select('*').eq('public', true).order('commitment_date', { ascending: false }), 'compromisos públicos'),
      optionalData(db.from('committee_requests').select('*').eq('public', true).order('request_date', { ascending: false }), 'gestiones públicas')
    ]);
    publicTrainings = trainingRows;
    publicEvents = eventRows;
    publicCommitments = commitmentRows;
    publicManagements = managementRows;
    siteContent = structuredClone(DEFAULT_CONTENT);
    (contentRes.data || []).forEach(row => { if (row.key && row.value) siteContent[row.key] = row.value; });
    setConnectionBanner('');
    refreshPublic();
  } catch (error) {
    console.error(error);
    committees = structuredClone(FALLBACK_COMMITTEES);
    publicDocuments = [];
    publicFileStatus = [];
    publicTrainings = [];
    publicEvents = [];
    publicCommitments = [];
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
  map = L.map('committeeMap', {
    scrollWheelZoom: true,
    zoomControl: true,
    wheelDebounceTime: 30,
    wheelPxPerZoomLevel: 60
  }).setView([29.3, -110.7], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Zoom con la rueda del mouse habilitado de forma permanente.
  map.scrollWheelZoom.enable();
}


function isMapFullscreen() {
  const frame = $('#mapFrame');
  return document.fullscreenElement === frame ||
    document.webkitFullscreenElement === frame ||
    frame?.classList.contains('map-pseudo-fullscreen');
}

function syncMapFullscreenButton() {
  const button = $('#mapFullscreenBtn');
  if (!button) return;
  const active = isMapFullscreen();
  button.classList.toggle('active', active);
  button.setAttribute('aria-label', active ? 'Salir de pantalla completa' : 'Ver mapa en pantalla completa');
  button.title = active ? 'Salir de pantalla completa' : 'Pantalla completa';
  button.innerHTML = `<i class="fa-solid ${active ? 'fa-compress' : 'fa-expand'}"></i><span>${active ? 'Salir' : 'Pantalla completa'}</span>`;
  setTimeout(() => map?.invalidateSize({ animate: false }), 80);
}

async function toggleMapFullscreen() {
  const frame = $('#mapFrame');
  if (!frame) return;

  try {
    if (isMapFullscreen()) {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else {
        frame.classList.remove('map-pseudo-fullscreen');
        document.body.classList.remove('map-fullscreen-open');
        syncMapFullscreenButton();
      }
      return;
    }

    if (frame.requestFullscreen) {
      await frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
      frame.webkitRequestFullscreen();
    } else {
      frame.classList.add('map-pseudo-fullscreen');
      document.body.classList.add('map-fullscreen-open');
      syncMapFullscreenButton();
    }
  } catch (error) {
    // Fallback visual si el navegador bloquea la Fullscreen API.
    frame.classList.toggle('map-pseudo-fullscreen');
    document.body.classList.toggle('map-fullscreen-open', frame.classList.contains('map-pseudo-fullscreen'));
    syncMapFullscreenButton();
  }
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
    marker._committeeId = String(x.id);
    markers.push(marker);
  });
  $('#visibleCount').textContent = `${data.length} ${data.length === 1 ? 'comité visible' : 'comités visibles'}`;
}

function focusMapSearchResults() {
  if (!map) return;
  const query = ($('#mapSearch')?.value || '').trim().toLowerCase();
  if (!query) return;

  const data = mapFiltered().filter(x => Number.isFinite(x.lat) && Number.isFinite(x.lng));
  if (!data.length) return;

  // Detiene cualquier vuelo anterior. Esto evita que una búsqueda nueva
  // (por ejemplo, cambiar de Caborca a Navojoa) quede anulada por la animación previa.
  map.stop();

  // Prioriza una coincidencia exacta por nombre, municipio o colonia.
  const exact = data.find(x =>
    String(x.name || '').toLowerCase() === query ||
    String(x.municipality || '').toLowerCase() === query ||
    String(x.colony || '').toLowerCase() === query
  );

  const target = exact || (data.length === 1 ? data[0] : null);

  if (target) {
    const zoom = target.type === 'CPS' ? 16 : 14;
    const marker = markers.find(m => m._committeeId === String(target.id));

    // setView es intencionalmente inmediato y determinista.
    // Cada nueva búsqueda fuerza centro + nivel de zoom aunque el mapa
    // venga de una búsqueda anterior.
    map.setView([target.lat, target.lng], zoom, { animate: false });

    if (marker) {
      setTimeout(() => {
        marker.openPopup();
        map.panInside([target.lat, target.lng], { padding: [70, 70], animate: false });
      }, 40);
    }
    return;
  }

  const bounds = L.latLngBounds(data.map(x => [x.lat, x.lng]));
  if (bounds.isValid()) {
    map.fitBounds(bounds, { padding: [55, 55], maxZoom: 14, animate: false });
  }
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

  // En vista de tarjetas mostramos resultados de forma progresiva para
  // evitar una página interminable cuando existen muchos comités.
  const visibleData = viewMode === 'cards'
    ? data.slice(0, directoryVisibleCount)
    : data;

  wrap.className = `directory-grid${viewMode === 'table' ? ' table-view' : ''}`;

  const results = $('#resultsText');
  if (results) {
    results.textContent = data.length
      ? `Mostrando ${visibleData.length} de ${data.length} ${data.length === 1 ? 'comité encontrado' : 'comités encontrados'}`
      : '0 comités encontrados';
  }

  wrap.innerHTML = visibleData.length ? visibleData.map(x => `
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

  const loadMoreWrap = $('#directoryLoadMoreWrap');
  const loadMoreBtn = $('#directoryLoadMore');
  if (loadMoreWrap && loadMoreBtn) {
    const remaining = Math.max(0, data.length - visibleData.length);
    const shouldShow = viewMode === 'cards' && remaining > 0;
    loadMoreWrap.hidden = !shouldShow;
    loadMoreBtn.innerHTML = shouldShow
      ? `<span>Mostrar más comités</span><small>${remaining} restantes</small><i class="fa-solid fa-chevron-down"></i>`
      : '';
  }
}


async function freshPublicDocumentsForCommittee(committeeId) {
  const cached = publicDocuments.filter(doc => String(doc.committee_id || '') === String(committeeId || ''));
  if (!db) return cached;

  try {
    const { data, error } = await db
      .from('documents')
      .select('*')
      .eq('committee_id', committeeId)
      .eq('public', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('No se pudieron actualizar los documentos públicos del comité:', error);
      return cached;
    }

    const hydrated = await hydrateDocumentUrls(data || []);

    // Reemplazamos únicamente los documentos de este comité dentro del caché público.
    publicDocuments = [
      ...publicDocuments.filter(doc => String(doc.committee_id || '') !== String(committeeId || '')),
      ...hydrated
    ];

    return hydrated;
  } catch (error) {
    console.error('Error al refrescar el expediente público:', error);
    return cached;
  }
}

async function showDetail(id) {
  const x = committees.find(y => String(y.id) === String(id));
  if (!x) return;
  map?.closePopup();

  const detailWrap = $('#detailContent');
  if (detailWrap) {
    detailWrap.innerHTML = `<div class="detail-loading"><i class="fa-solid fa-circle-notch fa-spin"></i><strong>Actualizando ficha pública…</strong><span>Consultando la última versión del expediente.</span></div>`;
  }
  openLayer('#detailModal');

  // Cada vez que se abre una ficha se consulta Supabase de nuevo.
  // Así un documento recién marcado como Público aparece sin depender
  // del caché que ya tenía cargada la página.
  const docs = await freshPublicDocumentsForCommittee(x.id);
  const acta = docs.find(doc => doc.category === 'Acta constitutiva') || null;
  const attendance = docs.find(doc => doc.category === 'Lista de asistencia') || null;
  const photos = docs.filter(isImageDocument);
  const files = docs.filter(doc => !photos.includes(doc) && !['Acta constitutiva','Lista de asistencia'].includes(doc.category));
  const events = publicEvents.filter(e => String(e.committee_id||'') === String(x.id)).sort((a,b)=>String(b.event_date||'').localeCompare(String(a.event_date||'')));
  const commitments = publicCommitments.filter(c => String(c.committee_id||'') === String(x.id)).sort((a,b)=>String(b.commitment_date||'').localeCompare(String(a.commitment_date||'')));
  const managements = publicManagements.filter(r => String(r.committee_id||'') === String(x.id)).sort((a,b)=>String(b.request_date||'').localeCompare(String(a.request_date||'')));
  const score = committeeStrengthScore(x);
  const scoreLabel = score.total >= 80 ? 'Comité consolidado' : score.total >= 60 ? 'Comité en fortalecimiento' : score.total >= 40 ? 'Comité en desarrollo' : 'Fortalecimiento inicial';
  const photoHtml = photos.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-images"></i> Fotografías</h3><div class="detail-gallery">${photos.map(doc => `<a href="${esc(doc._url || '#')}" target="_blank" rel="noopener"><img src="${esc(doc._url || '')}" alt="${esc(doc.title || 'Fotografía del comité')}" loading="lazy"><span>${esc(doc.title || 'Fotografía')}</span></a>`).join('')}</div></section>` : '';
  const coreFileHtml = `<section class="detail-expediente"><h3><i class="fa-solid fa-folder-tree"></i> Expediente del comité</h3><div class="detail-core-files">${acta ? `<a class="detail-core-file available" href="${esc(acta._url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-file-signature"></i><div><strong>Acta constitutiva</strong><span>Consultar documento</span></div><b><i class="fa-solid fa-circle-check"></i> Disponible</b></a>` : `<div class="detail-core-file missing"><i class="fa-solid fa-file-signature"></i><div><strong>Acta constitutiva</strong><span>No disponible públicamente</span></div></div>`}${attendance ? `<a class="detail-core-file available" href="${esc(attendance._url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-list-check"></i><div><strong>Lista de asistencia</strong><span>Consultar documento</span></div><b><i class="fa-solid fa-circle-check"></i> Disponible</b></a>` : `<div class="detail-core-file missing"><i class="fa-solid fa-list-check"></i><div><strong>Lista de asistencia</strong><span>No disponible públicamente</span></div></div>`}</div></section>`;
  const fileHtml = files.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-paperclip"></i> Otros documentos y evidencias</h3><div class="detail-files">${files.map(doc => `<a href="${esc(doc._url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-file-arrow-down"></i><div><strong>${esc(doc.title)}</strong><span>${esc(doc.category || 'Documento')}</span></div></a>`).join('')}</div></section>` : '';
  const timelineHtml = events.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-timeline"></i> Bitácora de acciones</h3><div class="public-timeline">${events.map(e => `<article><time>${esc(formatDate(e.event_date))}</time><span class="event-dot"></span><div><b>${esc(e.event_type)}</b><strong>${esc(e.title)}</strong>${e.description ? `<p>${esc(e.description)}</p>` : ''}</div></article>`).join('')}</div></section>` : '';
  const commitmentsHtml = commitments.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-list-check"></i> Seguimiento de compromisos</h3><div class="public-commitments">${commitments.map(c => `<article class="commitment-card status-${esc(String(c.status).toLowerCase().replaceAll(' ','-'))}"><div><strong>${esc(c.title)}</strong><span>${esc(c.responsible_agency || 'Responsable por definir')}</span></div><span class="status-chip">${esc(c.status)}</span><small>Fecha límite: ${esc(formatDate(c.due_date))}${Number.isFinite(Number(c.progress)) ? ` · Avance: ${Number(c.progress)}%` : ''}</small></article>`).join('')}</div></section>` : '';
  const managementsHtml = managements.length ? `<section class="detail-expediente"><h3><i class="fa-solid fa-handshake-angle"></i> Gestiones y resultados</h3><div class="public-managements">${managements.map(r => { const response = daysBetween(r.request_date,r.first_response_date); const duration = daysBetween(r.start_date,r.completion_date); return `<article class="management-public-card"><div class="management-public-head"><span class="management-category">${esc(r.category)}</span><span class="status-chip ${statusClass(r.status)}">${esc(r.status)}</span></div><h4>${esc(r.title)}</h4>${r.description?`<p>${esc(r.description)}</p>`:''}<div class="management-dates"><span><b>Solicitud</b>${esc(formatDate(r.request_date))}</span>${r.first_response_date?`<span><b>Primera respuesta</b>${esc(formatDate(r.first_response_date))}${Number.isFinite(response)?` · ${response} ${response===1?'día':'días'}`:''}</span>`:''}${r.start_date?`<span><b>Inicio</b>${esc(formatDate(r.start_date))}</span>`:''}${r.completion_date?`<span><b>Conclusión</b>${esc(formatDate(r.completion_date))}${Number.isFinite(duration)?` · proceso de ${duration} ${duration===1?'día':'días'}`:''}</span>`:''}</div>${r.result?`<div class="management-result"><b>Resultado</b><p>${esc(r.result)}</p></div>`:''}${r.responsible_agency?`<small>Responsable: ${esc(r.responsible_agency)}</small>`:''}</article>`; }).join('')}</div></section>` : '';
  $('#detailContent').innerHTML = `
    <div class="detail-hero"><span class="type-badge ${x.type === 'CPS' ? 'cps' : ''}">${x.type === 'CCS' ? 'Comité de Contraloría Social' : 'Comité de Bienestar y Participación Ciudadana'}</span><h2>${esc(x.name)}</h2><p>${esc(x.description || (x.type === 'CCS' ? 'Mecanismo ciudadano de vigilancia y seguimiento de programas sociales.' : 'Mecanismo de organización comunitaria, bienestar y participación ciudadana.'))}</p></div>
    <div class="detail-grid"><div><span>Municipio</span><strong>${esc(x.municipality)}</strong></div>${x.type === 'CPS' ? `<div><span>Colonia</span><strong>${esc(x.colony)}</strong></div>` : `<div><span>Programa</span><strong>${esc(x.program || 'No especificado')}</strong></div>`}<div><span>Integrantes</span><strong>${x.members}</strong></div><div><span>Fecha de integración</span><strong>${esc(formatDate(x.date))}</strong></div><div><span>Estatus</span><strong>${esc(x.status)}</strong></div><div><span>Ubicación</span><strong>${x.lat.toFixed(4)}, ${x.lng.toFixed(4)}</strong></div></div>
    <section class="strength-card"><div><span>Índice de Fortalecimiento del Comité</span><strong>${score.total}<small>/100</small></strong><b>${scoreLabel}</b></div><div class="strength-bars">${[['Constitución',score.constitucion,20],['Capacitación',score.capacitacion,20],['Actividad',score.actividad,20],['Evidencia',score.evidencia,15],['Seguimiento',score.seguimiento,15],['Participación',score.participacion,10]].map(([label,value,max])=>`<label><span>${label}<b>${value}/${max}</b></span><i><em style="width:${Math.round(value/max*100)}%"></em></i></label>`).join('')}</div></section>
    ${managementsHtml}${commitmentsHtml}${timelineHtml}${coreFileHtml}${fileHtml}${photoHtml}${!docs.length && !events.length && !commitments.length && !managements.length ? '<p class="detail-empty">Este comité aún no cuenta con expediente o seguimiento público registrado.</p>' : ''}`;
}

function charts() {
  if (!$('#typeChart') || !$('#territoryChart')) return;
  [typeChart, territoryChart, requestStatusChart, requestTrendChart].forEach(chart => chart?.destroy());
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
    data: { labels: ['Municipios con CCS','Colonias con BPC'], datasets: [{ data: [municipalities,colonies], backgroundColor: ['#a72861','#6e3f72'], borderWidth: 0 }] },
    options: { cutout: '70%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 18 } } } }
  });
  if ($('#requestStatusChart')) {
    const statuses = ['Recibida','En gestión','Programada','En ejecución','Concluida','No procedente','Cancelada'];
    const counts = statuses.map(s => publicManagements.filter(r => r.status === s).length);
    requestStatusChart = new Chart($('#requestStatusChart'), {
      type: 'doughnut', data: { labels: statuses, datasets: [{ data: counts, backgroundColor: ['#b8adb3','#e9b949','#8d6b9f','#4d79a8','#2f9e62','#8e8e8e','#c83f49'], borderWidth: 0 }] },
      options: { cutout: '67%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 12 } } } }
    });
  }
  if ($('#requestTrendChart')) {
    const now = new Date();
    const months = Array.from({length:12}, (_,i) => { const d = new Date(now.getFullYear(), now.getMonth()-11+i, 1); return { key:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, label:d.toLocaleDateString('es-MX',{month:'short'}) }; });
    const values = months.map(m => publicManagements.filter(r => r.status === 'Concluida' && String(r.completion_date||'').startsWith(m.key)).length);
    requestTrendChart = new Chart($('#requestTrendChart'), {
      type: 'line', data: { labels: months.map(m=>m.label), datasets: [{ label:'Concluidas', data: values, borderColor:'#6f1238', backgroundColor:'rgba(111,18,56,.08)', tension:.35, fill:true, pointRadius:3 }] },
      options: { plugins: { legend: { display:false } }, scales:{ y:{ beginAtZero:true, ticks:{precision:0}, grid:{color:'#eee4e8'} }, x:{grid:{display:false}} } }
    });
  }
}

function renderImpactDashboard() {
  const stats = impactStats();
  const values = { active: stats.active, requests: stats.requests, requestsCompletedPct: `${stats.requestsCompletedPct}%`, avgResponseDays: stats.avgResponseDays == null ? '—' : `${stats.avgResponseDays} días`, inProgress: stats.inProgress, commitmentsCompletedPct: `${stats.commitmentsCompletedPct}%`, events: stats.events, completeFilesPct: `${stats.completeFilesPct}%` };
  Object.entries(values).forEach(([key,value]) => $$(`[data-impact="${key}"]`).forEach(el => el.textContent = typeof value === 'number' ? value.toLocaleString('es-MX') : value));
  const updated = $('#openDataUpdated');
  if (updated) updated.textContent = new Date().toLocaleString('es-MX', { dateStyle:'medium', timeStyle:'short' });
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replaceAll('"','""')}"` : s;
}

function downloadText(filename, text, mime='text/plain;charset=utf-8') {
  const blob = new Blob([text], { type:mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function openDataPayload() {
  return {
    generated_at: new Date().toISOString(),
    source: 'Secretaría de Bienestar del Estado de Sonora',
    committees,
    managements: publicManagements,
    commitments: publicCommitments,
    actions: publicEvents,
    trainings: publicTrainings.map(({notes,created_by,...rest}) => rest),
    documents: publicDocuments.map(({_url,storage_path,created_by,...rest}) => ({...rest, url:_url || rest.file_url || ''}))
  };
}

function downloadOpenCsv() {
  const headers = ['id','tipo','nombre','municipio','colonia','programa','integrantes','fecha_integracion','estatus','latitud','longitud','indice_fortalecimiento'];
  const rows = committees.map(c => [c.id,c.type,c.name,c.municipality,c.colony,c.program,c.members,c.date,c.status,c.lat,c.lng,committeeStrengthScore(c).total]);
  downloadText('comites-datos-abiertos.csv', [headers,...rows].map(r=>r.map(csvCell).join(',')).join('\n'), 'text/csv;charset=utf-8');
}

function downloadOpenJson() { downloadText('comites-datos-abiertos.json', JSON.stringify(openDataPayload(), null, 2), 'application/json;charset=utf-8'); }

function downloadDataDictionary() {
  const rows = [
    ['campo','descripcion'],['id','Identificador único del comité'],['tipo','CCS = Contraloría Social; CPS = Bienestar y Participación Ciudadana'],['nombre','Denominación pública del comité'],['municipio','Municipio'],['colonia','Colonia cuando aplica'],['programa','Programa social cuando aplica'],['integrantes','Número de integrantes registrados'],['fecha_integracion','Fecha de integración'],['estatus','Activo, En seguimiento o Inactivo'],['latitud','Coordenada geográfica'],['longitud','Coordenada geográfica'],['indice_fortalecimiento','Puntaje 0-100 calculado con la metodología publicada']
  ];
  downloadText('diccionario-datos-comites.csv', rows.map(r=>r.map(csvCell).join(',')).join('\n'), 'text/csv;charset=utf-8');
}

function renderPublicResources() {
  const wrap = $('#publicResources');
  if (!wrap) return;
  const resources = publicDocuments.filter(doc =>
    !doc.committee_id &&
    !(String(doc.mime_type || '').startsWith('image/') || doc.category === 'Fotografía')
  );
  const visible = resources.slice(0, resourceVisibleCount);
  $('#resourceCount').textContent = `${resources.length} ${resources.length === 1 ? 'recurso' : 'recursos'}`;
  const shown = $('#resourceShownCount');
  if (shown) shown.textContent = resources.length ? `Mostrando ${visible.length} de ${resources.length}` : '';
  const more = $('#showMoreResources');
  if (more) {
    more.hidden = visible.length >= resources.length;
    const remaining = Math.min(9, Math.max(0, resources.length - visible.length));
    more.innerHTML = `<i class="fa-solid fa-chevron-down"></i> Mostrar ${remaining || 9} más`;
  }
  wrap.innerHTML = visible.length ? visible.map(doc => `
    <a class="resource-card" href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener noreferrer" data-category="${esc(doc.category)}">
      <i class="fa-solid fa-file-arrow-down"></i><div><span>${esc(doc.category || 'General')}</span><strong>${esc(doc.title)}</strong><small>${esc(doc.description || 'Abrir documento')}</small></div>
    </a>`).join('') : '<p class="resource-empty">Aún no hay recursos institucionales generales publicados.</p>';
}

function refreshPublic() {
  applySiteContent();
  kpis(committees);
  options();
  renderMap();
  renderDirectory();
  renderPublicResources();
  renderImpactDashboard();
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
  const [committeesRes, documentsRes, trainingsRes, requestsRes] = await Promise.all([
    db.from('committees').select('*').order('integration_date', { ascending: false }),
    db.from('documents').select('*').order('created_at', { ascending: false }),
    db.from('trainings').select('*').order('training_date', { ascending: false }),
    db.from('contact_requests').select('*').order('created_at', { ascending: false })
  ]);
  const coreError = [committeesRes,documentsRes,trainingsRes,requestsRes].find(r=>r.error)?.error;
  if (coreError) { console.error(coreError); toast('No se pudo cargar el panel.', 'error'); return; }
  adminCommittees = committeesRes.data.map(normalizeCommittee);
  adminDocuments = await hydrateDocumentUrls(documentsRes.data || []);
  trainings = trainingsRes.data || [];
  requests = requestsRes.data || [];
  const extras = await Promise.all([
    optionalData(db.from('committee_events').select('*').order('event_date', {ascending:false}), 'acciones'),
    optionalData(db.from('commitments').select('*').order('commitment_date', {ascending:false}), 'compromisos'),
    optionalData(db.from('committee_requests').select('*').order('request_date', {ascending:false}), 'gestiones'),
    isAdmin() ? optionalData(db.from('profiles').select('*').order('email'), 'usuarios') : Promise.resolve([])
  ]);
  adminEvents = extras[0]; adminCommitments = extras[1]; adminManagements = extras[2]; profiles = extras[3];
  renderAdmin();
}

function setAdminTab(tab) {
  if (!isAdmin() && ['contenido','usuarios'].includes(tab)) tab = 'resumen';
  $$('.admin-tabs button').forEach(btn => btn.classList.toggle('active', btn.dataset.adminTab === tab));
  $$('.admin-panel').forEach(panel => panel.hidden = panel.dataset.adminPanel !== tab);
}

function renderAdmin() {
  renderCommitteeAdmin();
  renderManagementAdmin();
  renderActionsAdmin();
  renderDocumentAdmin();
  renderTrainingAdmin();
  renderRequestsAdmin();
  renderUsersAdmin();
  populateCommitteeSelects();
  fillContentForm();
  renderAdminImpact();
}

function committeeTypeLabel(type) {
  return type === 'CCS' ? 'Contraloría Social' : 'Bienestar y Participación Ciudadana';
}

function committeeTypeTag(type) {
  const klass = type === 'CCS' ? 'ccs' : 'bpc';
  return `<span class="admin-type-tag ${klass}"><i></i>${esc(committeeTypeLabel(type))}</span>`;
}

function renderCommitteeAdmin() {
  const rows = $('#adminRows');
  if (!rows) return;
  const typeFilter = $('#adminCommitteeTypeFilter')?.value || '';
  const search = ($('#adminCommitteeSearch')?.value || '').trim().toLowerCase();
  const filtered = adminCommittees.filter(x => {
    if (typeFilter && x.type !== typeFilter) return false;
    if (!search) return true;
    return [
      x.name,
      x.municipality,
      x.colony,
      x.program,
      committeeTypeLabel(x.type),
      x.status
    ].some(value => String(value || '').toLowerCase().includes(search));
  });
  const count = $('#adminCommitteeFilterCount');
  if (count) count.textContent = `${filtered.length} ${filtered.length === 1 ? 'comité' : 'comités'}`;
  const expediente = committeeId => {
    const docs = adminDocuments.filter(d => String(d.committee_id || '') === String(committeeId));
    const acta = docs.some(d => d.category === 'Acta constitutiva');
    const list = docs.some(d => d.category === 'Lista de asistencia');
    const extras = docs.filter(d => !['Acta constitutiva','Lista de asistencia'].includes(d.category));
    const total = docs.length;
    const extraCount = extras.length;

    return `<div class="admin-file-status">
      <span class="${acta?'ok':'missing'}"><i class="fa-solid ${acta?'fa-circle-check':'fa-circle-minus'}"></i> Acta</span>
      <span class="${list?'ok':'missing'}"><i class="fa-solid ${list?'fa-circle-check':'fa-circle-minus'}"></i> Lista</span>
      <small class="file-total"><b>${total} ${total === 1 ? 'archivo total' : 'archivos totales'}</b><span>Acta + Lista${extraCount ? ` + ${extraCount} adicional${extraCount === 1 ? '' : 'es'}` : ''}</span></small>
    </div>`;
  };
  rows.innerHTML = filtered.length ? filtered.map(x => `<tr><td><strong>${esc(x.name)}</strong>${x.public ? '' : '<small class="private-label">Privado</small>'}</td><td>${committeeTypeTag(x.type)}</td><td>${esc(x.type === 'CCS' ? x.municipality : x.colony)}</td><td>${expediente(x.id)}</td><td>${esc(x.status)}</td><td><button class="action-btn" data-edit-id="${esc(x.id)}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button>${isAdmin() ? `<button class="action-btn danger" data-delete-id="${esc(x.id)}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>` : ''}</td></tr>`).join('') : '<tr><td colspan="6">No hay comités que coincidan con el filtro seleccionado.</td></tr>';
}

function populateCommitteeSelects() {
  const opts = adminCommittees.map(x => `<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
  const doc = $('#documentCommittee');
  const training = $('#trainingCommittee');
  const action = $('#actionCommittee');
  const management = $('#managementCommittee');
  if (doc) doc.innerHTML = `<option value="">Selecciona un comité</option>${opts}`;
  if (training) training.innerHTML = `<option value="">General</option>${opts}`;
  if (action) action.innerHTML = `<option value="">Selecciona un comité</option>${opts}`;
  if (management) management.innerHTML = `<option value="">Selecciona un comité</option>${opts}`;
}

function managementFiltered() {
  const status = $('#managementStatusFilter')?.value || '';
  const q = ($('#managementSearch')?.value || '').trim().toLowerCase();
  return adminManagements.filter(r => {
    if (status && r.status !== status) return false;
    if (!q) return true;
    const committee = adminCommittees.find(c => String(c.id) === String(r.committee_id));
    return [r.category,r.title,r.responsible_agency,r.result,committee?.name].some(v => String(v||'').toLowerCase().includes(q));
  });
}

function renderManagementAdmin() {
  const wrap = $('#adminManagements');
  if (!wrap) return;
  const rows = managementFiltered();
  const count = $('#managementCount');
  if (count) count.textContent = `${rows.length} ${rows.length === 1 ? 'gestión' : 'gestiones'}`;
  wrap.innerHTML = rows.length ? rows.map(r => {
    const committee = adminCommittees.find(c => String(c.id) === String(r.committee_id));
    const response = daysBetween(r.request_date,r.first_response_date);
    const duration = daysBetween(r.start_date,r.completion_date);
    return `<article class="management-admin-card"><div class="management-admin-main"><div class="management-card-top"><span class="management-category">${esc(r.category)}</span><span class="status-chip ${statusClass(r.status)}">${esc(r.status)}</span></div><h4>${esc(r.title)}</h4><p>${esc(committee?.name || 'Comité no disponible')}${r.responsible_agency?` · ${esc(r.responsible_agency)}`:''}</p><div class="management-metrics"><span><b>Solicitud</b>${esc(formatDate(r.request_date))}</span><span><b>Primera respuesta</b>${r.first_response_date ? `${esc(formatDate(r.first_response_date))}${Number.isFinite(response)?` · ${response} ${response===1?'día':'días'}`:''}` : 'Pendiente'}</span><span><b>Ejecución</b>${r.start_date ? esc(formatDateRange(r.start_date,r.completion_date||r.start_date)) : 'Sin iniciar'}${Number.isFinite(duration)?` · ${duration} ${duration===1?'día':'días'}`:''}</span></div>${r.result?`<small class="management-admin-result">Resultado: ${esc(r.result)}</small>`:''}</div><div><button class="action-btn" data-edit-management="${esc(r.id)}" aria-label="Editar"><i class="fa-solid fa-pen"></i></button>${isAdmin()?`<button class="action-btn danger" data-delete-management="${esc(r.id)}" aria-label="Eliminar"><i class="fa-solid fa-trash"></i></button>`:''}</div></article>`;
  }).join('') : '<div class="empty-state"><h3>Sin gestiones</h3><p>Registra la primera solicitud o necesidad de un comité.</p></div>';
}

function validateManagementDates() {
  const req = $('#managementRequestDate')?.value;
  const response = $('#managementResponseDate')?.value;
  const start = $('#managementStartDate')?.value;
  const end = $('#managementCompletionDate')?.value;
  const msg = $('#managementDateMessage');
  let error = '';
  if (response && req && response < req) error = 'La primera respuesta no puede ser anterior a la solicitud.';
  else if (start && req && start < req) error = 'El inicio de ejecución no puede ser anterior a la solicitud.';
  else if (end && start && end < start) error = 'La conclusión no puede ser anterior al inicio de ejecución.';
  if (msg) { msg.hidden = !error; msg.textContent = error; msg.className = 'form-message error'; }
  return !error;
}

function newManagementForm() {
  $('#managementForm').reset();
  $('#managementId').value = '';
  $('#managementPublic').checked = true;
  $('#managementStatus').value = 'Recibida';
  $('#managementRequestDate').value = new Date().toISOString().slice(0,10);
  $('#managementFormTitle').textContent = 'Nueva gestión';
  $('#managementDateMessage').hidden = true;
  openLayer('#managementModal');
}

function editManagement(id) {
  const r = adminManagements.find(x => String(x.id) === String(id)); if (!r) return;
  $('#managementForm').reset();
  $('#managementId').value=r.id; $('#managementCommittee').value=r.committee_id||''; $('#managementCategory').value=r.category||''; $('#managementTitle').value=r.title||''; $('#managementDescription').value=r.description||''; $('#managementAgency').value=r.responsible_agency||''; $('#managementRequestDate').value=r.request_date||''; $('#managementResponseDate').value=r.first_response_date||''; $('#managementStartDate').value=r.start_date||''; $('#managementCompletionDate').value=r.completion_date||''; $('#managementStatus').value=r.status||'Recibida'; $('#managementBeneficiaries').value=Number(r.beneficiaries||0); $('#managementActivities').value=Number(r.activities_count||0); $('#managementReference').value=r.reference||''; $('#managementResult').value=r.result||''; $('#managementPublic').checked=r.public!==false; $('#managementFormTitle').textContent='Editar gestión'; $('#managementDateMessage').hidden=true; openLayer('#managementModal');
}

async function saveManagement(event) {
  event.preventDefault(); if (!db || !isStaff() || !validateManagementDates()) return;
  const id=$('#managementId').value;
  const payload={ committee_id:$('#managementCommittee').value, category:$('#managementCategory').value.trim(), title:$('#managementTitle').value.trim(), description:$('#managementDescription').value.trim(), responsible_agency:$('#managementAgency').value.trim(), request_date:$('#managementRequestDate').value, first_response_date:$('#managementResponseDate').value||null, start_date:$('#managementStartDate').value||null, completion_date:$('#managementCompletionDate').value||null, status:$('#managementStatus').value, beneficiaries:Number($('#managementBeneficiaries').value||0), activities_count:Number($('#managementActivities').value||0), reference:$('#managementReference').value.trim(), result:$('#managementResult').value.trim(), public:$('#managementPublic').checked, updated_by:currentSession.user.id };
  const result=id ? await db.from('committee_requests').update(payload).eq('id',id) : await db.from('committee_requests').insert({...payload,created_by:currentSession.user.id});
  if (result.error) { console.error(result.error); toast('No se pudo guardar la gestión. Ejecuta el supabase.sql de esta versión.', 'error'); return; }
  closeLayer('#managementModal'); toast(id?'Gestión actualizada.':'Gestión registrada.'); await Promise.all([loadPublicData(),loadAdminData()]); setAdminTab('gestiones');
}

async function deleteManagement(id) {
  if (!isAdmin() || !confirm('¿Eliminar esta gestión? Esta acción no se puede deshacer.')) return;
  const {error}=await db.from('committee_requests').delete().eq('id',id); if(error){toast('No se pudo eliminar la gestión.','error');return;}
  toast('Gestión eliminada.'); await Promise.all([loadPublicData(),loadAdminData()]); setAdminTab('gestiones');
}

function statusClass(status) {
  return String(status||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replaceAll(' ','-');
}

function renderActionsAdmin() {
  const commitmentsWrap = $('#adminCommitments');
  const eventsWrap = $('#adminEvents');
  if (commitmentsWrap) {
    $('#commitmentAdminCount').textContent = `${adminCommitments.length} registros`;
    commitmentsWrap.innerHTML = adminCommitments.length ? adminCommitments.map(c => {
      const committee = adminCommittees.find(x=>String(x.id)===String(c.committee_id));
      return `<article class="admin-action-card"><div><span class="status-chip ${statusClass(c.status)}">${esc(c.status)}</span><h4>${esc(c.title)}</h4><p>${esc(committee?.name || 'Comité no disponible')} · ${esc(c.responsible_agency || 'Responsable por definir')}</p><small>Fecha límite: ${esc(formatDate(c.due_date))} · Avance ${Number(c.progress||0)}%</small></div><div><button class="action-btn" data-edit-commitment="${esc(c.id)}"><i class="fa-solid fa-pen"></i></button>${isAdmin()?`<button class="action-btn danger" data-delete-commitment="${esc(c.id)}"><i class="fa-solid fa-trash"></i></button>`:''}</div></article>`;
    }).join('') : '<div class="empty-state"><h3>Sin compromisos</h3><p>Registra el primer compromiso institucional.</p></div>';
  }
  if (eventsWrap) {
    $('#eventAdminCount').textContent = `${adminEvents.length} registros`;
    eventsWrap.innerHTML = adminEvents.length ? adminEvents.map(e => {
      const committee = adminCommittees.find(x=>String(x.id)===String(e.committee_id));
      return `<article class="admin-event-card"><time>${esc(formatDate(e.event_date))}</time><div><span>${esc(e.event_type)}</span><h4>${esc(e.title)}</h4><p>${esc(committee?.name || 'Comité no disponible')}</p></div><div><button class="action-btn" data-edit-event="${esc(e.id)}"><i class="fa-solid fa-pen"></i></button>${isAdmin()?`<button class="action-btn danger" data-delete-event="${esc(e.id)}"><i class="fa-solid fa-trash"></i></button>`:''}</div></article>`;
    }).join('') : '<div class="empty-state"><h3>Sin acciones</h3><p>Registra la primera acción de seguimiento.</p></div>';
  }
}

function renderAdminImpact() {
  const stats = impactStats(adminCommittees, adminManagements, adminEvents, adminCommitments, adminDocuments);
  const values = { requests:stats.requests, requestsCompletedPct:`${stats.requestsCompletedPct}%`, inProgress:stats.inProgress, avgResponseDays:stats.avgResponseDays == null ? '—' : `${stats.avgResponseDays} días` };
  Object.entries(values).forEach(([key,value]) => $$(`[data-impact-admin="${key}"]`).forEach(el => el.textContent = value));
}

function toggleActionFields() {
  const commitment = $('#actionRecordType')?.value === 'commitment';
  if ($('#eventFields')) $('#eventFields').hidden = commitment;
  if ($('#commitmentFields')) $('#commitmentFields').hidden = !commitment;
  if ($('#eventDate')) $('#eventDate').required = !commitment;
  if ($('#commitmentDate')) $('#commitmentDate').required = commitment;
}

function newActionForm() {
  $('#actionForm').reset();
  $('#actionId').value = '';
  $('#actionPublic').checked = true;
  $('#actionRecordType').value = 'event';
  $('#actionFormTitle').textContent = 'Nueva acción o compromiso';
  $('#eventDate').value = new Date().toISOString().slice(0,10);
  toggleActionFields();
  openLayer('#actionModal');
}

function editEvent(id) {
  const e = adminEvents.find(x=>String(x.id)===String(id)); if (!e) return;
  $('#actionForm').reset(); $('#actionId').value=e.id; $('#actionRecordType').value='event'; $('#actionCommittee').value=e.committee_id||''; $('#eventType').value=e.event_type; $('#eventDate').value=e.event_date||''; $('#actionTitle').value=e.title||''; $('#actionDescription').value=e.description||''; $('#actionPublic').checked=e.public!==false; $('#actionFormTitle').textContent='Editar acción'; toggleActionFields(); openLayer('#actionModal');
}

function editCommitment(id) {
  const c = adminCommitments.find(x=>String(x.id)===String(id)); if (!c) return;
  $('#actionForm').reset(); $('#actionId').value=c.id; $('#actionRecordType').value='commitment'; $('#actionCommittee').value=c.committee_id||''; $('#actionTitle').value=c.title||''; $('#actionDescription').value=c.description||''; $('#commitmentAgency').value=c.responsible_agency||''; $('#commitmentDate').value=c.commitment_date||''; $('#commitmentDueDate').value=c.due_date||''; $('#commitmentStatus').value=c.status||'Por iniciar'; $('#commitmentProgress').value=Number(c.progress||0); $('#commitmentCompletedDate').value=c.completed_date||''; $('#actionPublic').checked=c.public!==false; $('#actionFormTitle').textContent='Editar compromiso'; toggleActionFields(); openLayer('#actionModal');
}

async function saveAction(event) {
  event.preventDefault(); if (!db || !isStaff()) return;
  const id = $('#actionId').value; const kind = $('#actionRecordType').value;
  let result;
  if (kind === 'commitment') {
    const status = $('#commitmentStatus').value;
    const completedDate = status === 'Cumplido' ? ($('#commitmentCompletedDate').value || new Date().toISOString().slice(0,10)) : ($('#commitmentCompletedDate').value || null);
    const payload = { committee_id:$('#actionCommittee').value, title:$('#actionTitle').value.trim(), description:$('#actionDescription').value.trim(), responsible_agency:$('#commitmentAgency').value.trim(), commitment_date:$('#commitmentDate').value, due_date:$('#commitmentDueDate').value || null, completed_date:completedDate, status, progress:Number($('#commitmentProgress').value||0), public:$('#actionPublic').checked, updated_by:currentSession.user.id };
    result = id ? await db.from('commitments').update(payload).eq('id',id) : await db.from('commitments').insert({...payload,created_by:currentSession.user.id});
  } else {
    const payload = { committee_id:$('#actionCommittee').value, event_type:$('#eventType').value, event_date:$('#eventDate').value, title:$('#actionTitle').value.trim(), description:$('#actionDescription').value.trim(), public:$('#actionPublic').checked, updated_by:currentSession.user.id };
    result = id ? await db.from('committee_events').update(payload).eq('id',id) : await db.from('committee_events').insert({...payload,created_by:currentSession.user.id});
  }
  if (result.error) { console.error(result.error); toast('No se pudo guardar el registro. Ejecuta el supabase.sql de la versión instalada si aún no lo has hecho.', 'error'); return; }
  closeLayer('#actionModal'); toast(id?'Registro actualizado.':'Registro creado.'); await Promise.all([loadPublicData(),loadAdminData()]); setAdminTab('acciones');
}

async function deleteAction(kind,id) {
  if (!isAdmin() || !confirm('¿Eliminar este registro? Esta acción no se puede deshacer.')) return;
  const table = kind === 'commitment' ? 'commitments' : 'committee_events';
  const {error} = await db.from(table).delete().eq('id',id); if (error) { toast('No se pudo eliminar.', 'error'); return; }
  toast('Registro eliminado.'); await Promise.all([loadPublicData(),loadAdminData()]); setAdminTab('acciones');
}

function renderDocumentAdmin() {
  const wrap = $('#adminDocuments');
  if (!wrap) return;
  const libraryDocuments = adminDocuments.filter(doc => !doc.committee_id);
  wrap.innerHTML = libraryDocuments.length ? libraryDocuments.map(doc => `<article class="admin-card"><div class="admin-card-icon"><i class="fa-solid fa-book-open"></i></div><div><span>${esc(doc.category || 'General')} · ${doc.public ? 'Público' : 'Interno'}</span><h3>${esc(doc.title)}</h3><p>${esc(doc.description || 'Recurso institucional general')}</p><a href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener noreferrer">Abrir recurso</a></div>${isAdmin() ? `<button class="action-btn danger" data-delete-document="${esc(doc.id)}" aria-label="Eliminar recurso"><i class="fa-solid fa-trash"></i></button>` : ''}</article>`).join('') : '<div class="empty-state"><i class="fa-solid fa-book-open"></i><h3>Biblioteca vacía</h3><p>Aquí aparecerán únicamente recursos institucionales generales.</p></div>';
}

function renderTrainingAdmin() {
  const rows = $('#trainingRows');
  if (!rows) return;
  rows.innerHTML = trainings.length ? trainings.map(item => {
    const committee = adminCommittees.find(x => x.id === item.committee_id);
    const start = item.start_date || item.training_date;
    const end = item.end_date || item.training_date || start;
    const sessions = Math.max(1, Number(item.sessions || 1));
    return `<tr><td><strong>${esc(item.title)}</strong><small>${esc(item.location || '')}</small></td><td><strong>${esc(formatDateRange(start, end))}</strong></td><td><span class="training-session-badge"><i class="fa-solid fa-calendar-check"></i>${sessions} ${sessions === 1 ? 'sesión' : 'sesiones'}</span></td><td>${esc(committee?.name || 'General')}</td><td>${Number(item.attendees || 0)}</td><td>${esc(item.status)}</td><td><button class="action-btn" data-edit-training="${esc(item.id)}"><i class="fa-solid fa-pen"></i></button>${isAdmin() ? `<button class="action-btn danger" data-delete-training="${esc(item.id)}" aria-label="Eliminar capacitación"><i class="fa-solid fa-trash"></i></button>` : ''}</td></tr>`;
  }).join('') : '<tr><td colspan="7">No hay capacitaciones registradas.</td></tr>';
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

function committeeDocuments(committeeId) {
  return adminDocuments.filter(doc => String(doc.committee_id || '') === String(committeeId || ''));
}

function committeeCoreDocument(committeeId, category) {
  return committeeDocuments(committeeId).filter(doc => doc.category === category).sort((a,b) => String(b.created_at||'').localeCompare(String(a.created_at||'')))[0] || null;
}

function renderCommitteeCoreDocsStatus(committeeId = '') {
  const wrap = $('#committeeCoreDocsStatus');
  if (!wrap) return;

  if (!committeeId) {
    wrap.innerHTML = `<div class="core-doc-empty"><i class="fa-solid fa-folder-plus"></i><div><strong>Nuevo expediente</strong><span>Los documentos que selecciones se asociarán a este comité al guardar.</span></div></div>`;
    return;
  }

  const docs = committeeDocuments(committeeId);
  const acta = committeeCoreDocument(committeeId,'Acta constitutiva');
  const attendance = committeeCoreDocument(committeeId,'Lista de asistencia');
  const extras = docs
    .filter(doc => !['Acta constitutiva','Lista de asistencia'].includes(doc.category))
    .sort((a,b) => String(b.created_at||'').localeCompare(String(a.created_at||'')));

  const fileName = doc => doc?.file_name || doc?.title || 'Archivo registrado';
  const dateText = doc => doc?.created_at ? new Date(doc.created_at).toLocaleDateString('es-MX', {day:'2-digit',month:'short',year:'numeric'}) : '';
  const visibility = doc => doc?.public ? 'Público' : 'No público';

  const coreCard = (doc,label,icon) => doc
    ? `<article class="core-existing-card ready">
        <div class="core-existing-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="core-existing-copy">
          <span>${esc(label)}</span>
          <strong title="${esc(fileName(doc))}">${esc(fileName(doc))}</strong>
          <small>${esc(dateText(doc))}${dateText(doc) ? ' · ' : ''}${esc(visibility(doc))}</small>
        </div>
        <div class="core-existing-actions">
          <button type="button" class="core-visibility-btn ${doc.public ? 'public' : 'private'}" data-toggle-document-public="${esc(doc.id)}" title="${doc.public ? 'Cambiar a no público' : 'Hacer público'}">
            <i class="fa-solid ${doc.public ? 'fa-eye' : 'fa-eye-slash'}"></i>
            <span>${doc.public ? 'Público' : 'No público'}</span>
            <small>${doc.public ? 'Cambiar a no público' : 'Hacer público'}</small>
          </button>
          <a class="core-existing-open" href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Abrir</a>
          ${isStaff() ? `<button type="button" class="core-existing-delete" data-delete-committee-file="${esc(doc.id)}" data-file-label="${esc(label)}" title="Eliminar ${esc(label)}"><i class="fa-solid fa-trash"></i> Eliminar</button>` : ''}
        </div>
      </article>`
    : `<article class="core-existing-card pending">
        <div class="core-existing-icon"><i class="fa-solid ${icon}"></i></div>
        <div class="core-existing-copy"><span>${esc(label)}</span><strong>No cargado</strong><small>Pendiente de integrar</small></div>
      </article>`;

  const extrasHtml = extras.length
    ? `<div class="existing-evidence-section">
        <div class="existing-evidence-head">
          <div><strong>Fotografías y evidencias adicionales</strong><small>La visibilidad se guarda inmediatamente. No necesitas pulsar “Guardar comité”.</small></div>
          <div class="evidence-head-actions">
            <span>${extras.length} adicional${extras.length === 1 ? '' : 'es'}</span>
            <button type="button" class="evidence-batch-btn" data-evidence-batch="public" data-committee-id="${esc(committeeId)}"><i class="fa-solid fa-eye"></i> Hacer todas públicas</button>
            <button type="button" class="evidence-batch-btn subtle" data-evidence-batch="private" data-committee-id="${esc(committeeId)}"><i class="fa-solid fa-eye-slash"></i> Hacer todas no públicas</button>
          </div>
        </div>
        <div class="existing-evidence-list">
          ${extras.map(doc => `
            <div class="existing-evidence-item">
              <i class="fa-solid ${isImageDocument(doc) ? 'fa-image' : 'fa-file-lines'}"></i>
              <div>
                <strong title="${esc(fileName(doc))}">${esc(fileName(doc))}</strong>
                <small>${esc(doc.category || 'Evidencia')} · ${esc(dateText(doc))} · ${esc(visibility(doc))}</small>
              </div>
              <div class="existing-evidence-actions">
                <button type="button" class="evidence-visibility-btn ${doc.public ? 'public' : 'private'}" data-toggle-evidence-public="${esc(doc.id)}" title="${doc.public ? 'Cambiar a no pública' : 'Hacer pública'}">
                  <i class="fa-solid ${doc.public ? 'fa-eye' : 'fa-eye-slash'}"></i>
                  <span>${doc.public ? 'Pública' : 'No pública'}</span>
                </button>
                <a class="evidence-open-btn" href="${esc(doc._url || doc.file_url || '#')}" target="_blank" rel="noopener" title="Abrir archivo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                ${isStaff() ? `<button type="button" class="evidence-delete-btn" data-delete-committee-file="${esc(doc.id)}" data-file-label="${esc(fileName(doc))}" title="Eliminar archivo"><i class="fa-solid fa-trash"></i></button>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>`
    : `<div class="existing-evidence-section empty"><i class="fa-regular fa-images"></i><span>No hay fotografías ni evidencias adicionales cargadas.</span></div>`;

  wrap.innerHTML = `
    <div class="core-existing-title">
      <div><strong>Archivos actualmente registrados</strong><span class="expedient-total"><b>${docs.length}</b> ${docs.length === 1 ? 'archivo registrado' : 'archivos registrados'} en total</span></div>
      <span>La visibilidad de cada archivo se guarda al instante en Supabase. El botón “Guardar comité” no es necesario para este cambio.</span>
    </div>
    <div class="core-existing-grid">${coreCard(acta,'Acta constitutiva','fa-file-signature')}${coreCard(attendance,'Lista de asistencia','fa-list-check')}</div>
    ${extrasHtml}
  `;
}

function renderSelectedEvidenceFiles() {
  const wrap = $('#evidenceSelectedPreview');
  const input = $('#committeeEvidenceFiles');
  if (!wrap || !input) return;
  const files = [...(input.files || [])];

  if (!files.length) {
    wrap.hidden = true;
    wrap.innerHTML = '';
    return;
  }

  const isPublic = $('#committeeEvidencePublic')?.checked !== false;
  wrap.hidden = false;
  wrap.innerHTML = `
    <div class="selected-evidence-head">
      <strong>${files.length} archivo${files.length === 1 ? '' : 's'} seleccionado${files.length === 1 ? '' : 's'}</strong>
      <span class="${isPublic ? 'public' : 'private'}">${isPublic ? 'Se publicarán' : 'Se guardarán como no públicos'}</span>
    </div>
    <div class="selected-evidence-list">
      ${files.map(file => `<span><i class="fa-solid ${String(file.type||'').startsWith('image/') ? 'fa-image' : 'fa-file'}"></i>${esc(file.name)}</span>`).join('')}
    </div>`;
}


async function deleteCommitteeFile(documentId, label = 'archivo') {
  if (!db || !isStaff()) return;

  const doc = adminDocuments.find(item => String(item.id) === String(documentId));
  if (!doc) {
    toast('No se encontró el archivo seleccionado.', 'error');
    return;
  }

  const displayName = doc.file_name || doc.title || label || 'archivo';
  const committeeId = doc.committee_id || $('#committeeId')?.value || '';

  if (!confirm(`¿Eliminar definitivamente "${displayName}" del expediente del comité?\n\nEsta acción no se puede deshacer.`)) return;

  // Primero eliminamos el registro para no dejar una referencia rota si Storage fallara.
  const { error: dbError } = await db.from('documents').delete().eq('id', doc.id);
  if (dbError) {
    console.error(dbError);
    toast('No se pudo eliminar el archivo del expediente.', 'error');
    return;
  }

  // Después limpiamos el archivo físico. Si falla, queda un objeto huérfano sin exposición en la plataforma.
  if (doc.storage_path) {
    const { error: storageError } = await db.storage.from('committee-documents').remove([doc.storage_path]);
    if (storageError) console.warn('El registro se eliminó, pero Storage no pudo limpiar el objeto:', storageError);
  }

  toast('Archivo eliminado del expediente.');
  await Promise.all([loadPublicData(), loadAdminData()]);
  if (committeeId) renderCommitteeCoreDocsStatus(committeeId);
  renderCommitteeAdmin();
}

async function setDocumentVisibility(documentId, nextPublic) {
  if (!db || !isStaff()) return false;
  const doc = adminDocuments.find(item => String(item.id) === String(documentId));
  if (!doc) {
    toast('No se encontró el archivo.', 'error');
    return false;
  }

  const { data, error } = await db.rpc('set_document_visibility', {
    p_document_id: doc.id,
    p_public: Boolean(nextPublic)
  });

  if (error) {
    console.error('set_document_visibility:', error);
    toast(`No se pudo guardar la visibilidad: ${error.message || 'error de Supabase'}`, 'error');
    return false;
  }

  const saved = Array.isArray(data) ? data[0] : data;
  if (!saved || Boolean(saved.public) !== Boolean(nextPublic)) {
    console.error('Respuesta inesperada al guardar visibilidad:', data);
    toast('Supabase no confirmó el cambio de visibilidad.', 'error');
    return false;
  }

  doc.public = Boolean(saved.public);
  const committeeId = $('#committeeId')?.value || doc.committee_id;

  toast(doc.public
    ? 'Guardado en Supabase: archivo público.'
    : 'Guardado en Supabase: archivo no público.');

  await Promise.all([loadPublicData(), loadAdminData()]);
  if (committeeId) renderCommitteeCoreDocsStatus(committeeId);
  renderCommitteeAdmin();
  return true;
}

async function toggleDocumentVisibility(documentId) {
  const doc = adminDocuments.find(item => String(item.id) === String(documentId));
  if (!doc) return;
  return setDocumentVisibility(documentId, !doc.public);
}

async function setCommitteeEvidenceVisibility(committeeId, makePublic) {
  if (!db || !isStaff()) return;
  const extras = committeeDocuments(committeeId)
    .filter(doc => !['Acta constitutiva','Lista de asistencia'].includes(doc.category));

  if (!extras.length) {
    toast('Este comité no tiene evidencias adicionales.', 'error');
    return;
  }

  const desired = Boolean(makePublic);
  const pending = extras.filter(doc => Boolean(doc.public) !== desired);
  if (!pending.length) {
    toast(desired ? 'Todas las evidencias ya son públicas.' : 'Todas las evidencias ya son no públicas.');
    return;
  }

  const { data, error } = await db.rpc('set_committee_evidence_visibility', {
    p_committee_id: committeeId,
    p_public: desired
  });

  if (error) {
    console.error('set_committee_evidence_visibility:', error);
    toast(`No se pudo guardar la visibilidad: ${error.message || 'error de Supabase'}`, 'error');
    return;
  }

  const changed = Number(data || 0);
  toast(desired
    ? `${changed} evidencia${changed === 1 ? '' : 's'} marcada${changed === 1 ? '' : 's'} como pública${changed === 1 ? '' : 's'}.`
    : `${changed} evidencia${changed === 1 ? '' : 's'} marcada${changed === 1 ? '' : 's'} como no pública${changed === 1 ? '' : 's'}.`);

  await Promise.all([loadPublicData(), loadAdminData()]);
  renderCommitteeCoreDocsStatus(committeeId);
  renderCommitteeAdmin();
}

async function uploadCommitteeDocumentFile(committeeId, file, category, title, isPublic, replaceExisting = false) {
  if (!file) return {ok:true,skipped:true};
  if (file.size > 15*1024*1024) return {ok:false,error:`${file.name} supera 15 MB.`};
  const existing = replaceExisting ? committeeCoreDocument(committeeId, category) : null;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g,'-');
  const storagePath = existing?.storage_path || `${committeeId}/${crypto.randomUUID()}-${safeName}`;
  const upload = await db.storage.from('committee-documents').upload(storagePath,file,{cacheControl:'3600',upsert:Boolean(existing?.storage_path),contentType:file.type||undefined});
  if (upload.error) { console.error(upload.error); return {ok:false,error:`No se pudo subir ${file.name}.`}; }
  const payload={committee_id:committeeId,title,category,description:'',storage_path:storagePath,file_url:'',file_name:file.name,mime_type:file.type||'',file_size:file.size,public:isPublic};
  const result = existing ? await db.from('documents').update(payload).eq('id',existing.id) : await db.from('documents').insert({...payload,created_by:currentSession.user.id});
  if (result.error) { console.error(result.error); if(!existing) await db.storage.from('committee-documents').remove([storagePath]); return {ok:false,error:`No se pudo registrar ${file.name}.`}; }
  return {ok:true};
}

async function saveCommitteeAttachedFiles(committeeId) {
  const errors=[];
  const actaExisting=committeeCoreDocument(committeeId,'Acta constitutiva');
  const listExisting=committeeCoreDocument(committeeId,'Lista de asistencia');
  const actaPublic=$('#committeeActaPublic')?.checked ?? true;
  const listPublic=$('#committeeAttendancePublic')?.checked ?? false;
  if (actaExisting && actaExisting.public !== actaPublic) { const {error}=await db.from('documents').update({public:actaPublic}).eq('id',actaExisting.id); if(error) errors.push('No se pudo actualizar la visibilidad del acta.'); }
  if (listExisting && listExisting.public !== listPublic) { const {error}=await db.from('documents').update({public:listPublic}).eq('id',listExisting.id); if(error) errors.push('No se pudo actualizar la visibilidad de la lista.'); }
  const acta=$('#committeeActaFile')?.files?.[0]||null;
  const list=$('#committeeAttendanceFile')?.files?.[0]||null;
  if (acta) { const r=await uploadCommitteeDocumentFile(committeeId,acta,'Acta constitutiva','Acta constitutiva',actaPublic,true); if(!r.ok) errors.push(r.error); }
  if (list) { const r=await uploadCommitteeDocumentFile(committeeId,list,'Lista de asistencia','Lista de asistencia',listPublic,true); if(!r.ok) errors.push(r.error); }
  const evidencePublic=$('#committeeEvidencePublic')?.checked ?? true;
  for (const file of [...($('#committeeEvidenceFiles')?.files||[])]) { const isImage=String(file.type||'').startsWith('image/'); const r=await uploadCommitteeDocumentFile(committeeId,file,isImage?'Fotografía':'Evidencia',isImage?'Evidencia fotográfica':'Evidencia',evidencePublic,false); if(!r.ok) errors.push(r.error); }
  return errors;
}

function newCommitteeForm() {
  $('#committeeForm').reset();
  $('#committeeId').value = '';
  $('#committeePublic').checked = true;
  $('#committeeActaPublic').checked = true;
  $('#committeeAttendancePublic').checked = false;
  $('#committeeEvidencePublic').checked = true;
  $('#committeeStatus').value = 'Activo';
  renderSelectedEvidenceFiles();
  $('#formTitle').textContent = 'Nuevo comité';
  renderCommitteeCoreDocsStatus('');
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
  const actaDoc = committeeCoreDocument(x.id,'Acta constitutiva');
  const listDoc = committeeCoreDocument(x.id,'Lista de asistencia');
  $('#committeeActaPublic').checked = actaDoc ? actaDoc.public !== false : true;
  $('#committeeAttendancePublic').checked = listDoc ? listDoc.public !== false : false;
  $('#committeeEvidencePublic').checked = true;
  $('#committeeActaFile').value = '';
  $('#committeeAttendanceFile').value = '';
  $('#committeeEvidenceFiles').value = '';
  renderSelectedEvidenceFiles();
  renderCommitteeCoreDocsStatus(x.id);
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
  let committeeId = id;
  if (id) result = await db.from('committees').update(payload).eq('id', id).select('id').single();
  else result = await db.from('committees').insert({ ...payload, created_by: currentSession.user.id }).select('id').single();
  if (result.error) { console.error(result.error); toast('No se pudo guardar el comité.', 'error'); return; }
  committeeId = result.data?.id || committeeId;
  const fileErrors = committeeId ? await saveCommitteeAttachedFiles(committeeId) : [];
  closeLayer('#formModal');
  if (fileErrors.length) toast(`Comité guardado, pero ${fileErrors.length} archivo(s) no pudieron actualizarse.`, 'error');
  else toast(id ? 'Comité y expediente actualizados.' : 'Comité y expediente creados.');
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
  const file = $('#documentFile').files?.[0];
  if (!file) return;
  if (file.size > 15*1024*1024) { toast('El archivo supera el límite de 15 MB.','error'); return; }
  const safeName=file.name.replace(/[^a-zA-Z0-9._-]+/g,'-');
  const path=`library/${crypto.randomUUID()}-${safeName}`;
  const upload=await db.storage.from('committee-documents').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type||undefined});
  if(upload.error){console.error(upload.error);toast('No se pudo subir el recurso.','error');return;}
  const insert=await db.from('documents').insert({title:$('#documentTitle').value.trim(),category:$('#documentCategory').value,committee_id:null,description:$('#documentDescription').value.trim(),storage_path:path,file_url:'',file_name:file.name,mime_type:file.type||'',file_size:file.size,public:$('#documentPublic').checked,created_by:currentSession.user.id});
  if(insert.error){console.error(insert.error);await db.storage.from('committee-documents').remove([path]);toast('No se pudo registrar el recurso.','error');return;}
  $('#documentForm').reset(); $('#documentPublic').checked=true; closeLayer('#documentModal'); toast('Recurso agregado a la biblioteca.'); await Promise.all([loadPublicData(),loadAdminData()]); setAdminTab('documentos');
}

async function deleteDocument(id) {
  if (!isAdmin()) return;
  const doc = adminDocuments.find(x => String(x.id) === String(id));
  if (!doc) return;
  if (!confirm(`¿Eliminar definitivamente "${doc.file_name || doc.title || 'este documento'}"?`)) return;

  const committeeId = doc.committee_id || '';
  const { error } = await db.from('documents').delete().eq('id', id);
  if (error) { console.error(error); toast('No se pudo eliminar el documento.', 'error'); return; }

  if (doc.storage_path) {
    const { error: storageError } = await db.storage.from('committee-documents').remove([doc.storage_path]);
    if (storageError) console.warn('No se pudo limpiar el archivo físico de Storage:', storageError);
  }

  toast('Documento eliminado.');
  await Promise.all([loadPublicData(), loadAdminData()]);
  if (committeeId && $('#committeeId')?.value === String(committeeId)) renderCommitteeCoreDocsStatus(committeeId);
  renderCommitteeAdmin();
}

function newTrainingForm() {
  $('#trainingForm').reset();
  $('#trainingId').value = '';
  $('#trainingAttendees').value = '0';
  $('#trainingSessions').value = '1';
  $('#trainingStatus').value = 'Programada';
  $('#trainingFormTitle').textContent = 'Nueva capacitación';
  const message = $('#trainingDateMessage');
  if (message) { message.hidden = true; message.textContent = ''; }
  openLayer('#trainingModal');
}

function editTraining(id) {
  const item = trainings.find(x => x.id === id);
  if (!item) return;
  $('#trainingFormTitle').textContent = 'Editar capacitación';
  $('#trainingId').value = item.id;
  $('#trainingTitle').value = item.title;
  $('#trainingCommittee').value = item.committee_id || '';
  $('#trainingStartDate').value = item.start_date || item.training_date || '';
  $('#trainingEndDate').value = item.end_date || item.training_date || item.start_date || '';
  $('#trainingSessions').value = Math.max(1, Number(item.sessions || 1));
  $('#trainingLocation').value = item.location || '';
  $('#trainingAttendees').value = item.attendees || 0;
  $('#trainingStatus').value = item.status;
  $('#trainingNotes').value = item.notes || '';
  const message = $('#trainingDateMessage');
  if (message) { message.hidden = true; message.textContent = ''; }
  openLayer('#trainingModal');
}

async function saveTraining(event) {
  event.preventDefault();
  if (!db || !isStaff()) return;
  const id = $('#trainingId').value;
  const startDate = $('#trainingStartDate').value;
  const endDate = $('#trainingEndDate').value;
  const sessions = Math.max(1, Number($('#trainingSessions').value || 1));
  const message = $('#trainingDateMessage');

  if (!startDate || !endDate) {
    if (message) { message.hidden = false; message.textContent = 'Indica la fecha de inicio y la fecha de término.'; }
    return;
  }
  if (endDate < startDate) {
    if (message) { message.hidden = false; message.textContent = 'La fecha de término no puede ser anterior a la fecha de inicio.'; }
    return;
  }
  if (message) { message.hidden = true; message.textContent = ''; }

  const payload = {
    title: $('#trainingTitle').value.trim(),
    committee_id: $('#trainingCommittee').value || null,
    training_date: startDate,
    start_date: startDate,
    end_date: endDate,
    sessions,
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
  toast(sessions > 1 ? `Capacitación guardada · ${sessions} sesiones.` : 'Capacitación guardada.');
  await Promise.all([loadPublicData(), loadAdminData()]);
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
  $('#showMoreResources')?.addEventListener('click', () => { resourceVisibleCount += 9; renderPublicResources(); });
  $('#mapFullscreenBtn')?.addEventListener('click', toggleMapFullscreen);
  document.addEventListener('fullscreenchange', syncMapFullscreenButton);
  document.addEventListener('webkitfullscreenchange', syncMapFullscreenButton);
  document.addEventListener('keydown', event => {
    const frame = $('#mapFrame');
    if (event.key === 'Escape' && frame?.classList.contains('map-pseudo-fullscreen')) {
      frame.classList.remove('map-pseudo-fullscreen');
      document.body.classList.remove('map-fullscreen-open');
      syncMapFullscreenButton();
    }
  });

  let mapSearchTimer;
  $('#mapSearch')?.addEventListener('input', () => {
    renderMap();
    clearTimeout(mapSearchTimer);
    mapSearchTimer = setTimeout(focusMapSearchResults, 220);
  });
  ['municipalityFilter','colonyFilter'].forEach(id => $(`#${id}`)?.addEventListener('input', renderMap));
  $$('.type-check').forEach(x => x.addEventListener('change', renderMap));
  $('#resetMap')?.addEventListener('click', () => {
    map?.setView([29.3,-110.7],6);
    $('#mapSearch').value = '';
    $('#municipalityFilter').value = '';
    $('#colonyFilter').value = '';
    $$('.type-check').forEach(x => x.checked = true);
    renderMap();
  });
  ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id => $(`#${id}`)?.addEventListener('input', () => {
    directoryVisibleCount = DIRECTORY_PAGE_SIZE;
    renderDirectory();
  }));

  $('#directoryLoadMore')?.addEventListener('click', () => {
    directoryVisibleCount += DIRECTORY_PAGE_SIZE;
    renderDirectory();
  });

  $('#clearFilters')?.addEventListener('click', () => {
    ['directorySearch','directoryType','directoryMunicipality','directoryColony'].forEach(id => $(`#${id}`).value = '');
    directoryVisibleCount = DIRECTORY_PAGE_SIZE;
    renderDirectory();
  });
  $$('[data-view]').forEach(btn => btn.addEventListener('click', () => {
    $$('[data-view]').forEach(x => x.classList.remove('active'));
    btn.classList.add('active');
    viewMode = btn.dataset.view;
    directoryVisibleCount = DIRECTORY_PAGE_SIZE;
    renderDirectory();
  }));
  $$('[data-type-jump]').forEach(btn => btn.addEventListener('click', () => {
    $('#directoryType').value = btn.dataset.typeJump;
    directoryVisibleCount = DIRECTORY_PAGE_SIZE;
    renderDirectory();
    location.hash = 'directorio';
  }));
  $$('[data-open-admin]').forEach(btn => btn.addEventListener('click', openAdmin));
  $$('[data-close-admin]').forEach(btn => btn.addEventListener('click', () => closeLayer('#adminDrawer')));
  $$('[data-close-login]').forEach(btn => btn.addEventListener('click', () => closeLayer('#loginModal')));
  $$('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => closeLayer('#detailModal')));
  $$('[data-close-form]').forEach(btn => btn.addEventListener('click', () => closeLayer('#formModal')));
  $$('[data-close-document]').forEach(btn => btn.addEventListener('click', () => closeLayer('#documentModal')));
  $$('[data-close-action]').forEach(btn => btn.addEventListener('click', () => closeLayer('#actionModal')));
  $$('[data-close-management]').forEach(btn => btn.addEventListener('click', () => closeLayer('#managementModal')));
  $$('[data-close-training]').forEach(btn => btn.addEventListener('click', () => closeLayer('#trainingModal')));
  $$('[data-close-user]').forEach(btn => btn.addEventListener('click', () => closeLayer('#userModal')));
  $$('.admin-tabs button').forEach(btn => btn.addEventListener('click', () => setAdminTab(btn.dataset.adminTab)));

  $('#loginForm')?.addEventListener('submit', login);
  $('#forgotPassword')?.addEventListener('click', forgotPassword);
  $('#passwordForm')?.addEventListener('submit', updatePassword);
  $$('[data-close-password]').forEach(btn => btn.addEventListener('click', () => closeLayer('#passwordModal')));
  $('#logoutBtn')?.addEventListener('click', logout);
  $('#refreshAdmin')?.addEventListener('click', async () => { await Promise.all([loadPublicData(), loadAdminData()]); toast('Información actualizada.'); });
  $('#adminCommitteeTypeFilter')?.addEventListener('change', renderCommitteeAdmin);
  $('#adminCommitteeSearch')?.addEventListener('input', renderCommitteeAdmin);
  $('#clearAdminCommitteeSearch')?.addEventListener('click', () => {
    const input = $('#adminCommitteeSearch');
    if (input) input.value = '';
    renderCommitteeAdmin();
    input?.focus();
  });

  $('#newCommittee')?.addEventListener('click', newCommitteeForm);
  $('#newAction')?.addEventListener('click', newActionForm);
  $('#newManagement')?.addEventListener('click', newManagementForm);
  $('#managementForm')?.addEventListener('submit', saveManagement);
  $('#managementStatusFilter')?.addEventListener('change', renderManagementAdmin);
  $('#managementSearch')?.addEventListener('input', renderManagementAdmin);
  $('#actionRecordType')?.addEventListener('change', toggleActionFields);
  $('#actionForm')?.addEventListener('submit', saveAction);
  $('#committeeType')?.addEventListener('change', toggleFormFields);
  $('#committeeForm')?.addEventListener('submit', saveCommittee);
  $('#committeeEvidenceFiles')?.addEventListener('change', renderSelectedEvidenceFiles);
  $('#committeeEvidencePublic')?.addEventListener('change', renderSelectedEvidenceFiles);
  $('#newDocument')?.addEventListener('click', () => { $('#documentForm').reset(); $('#documentPublic').checked = true; openLayer('#documentModal'); });
  $('#documentForm')?.addEventListener('submit', saveDocument);
  $('#newUser')?.addEventListener('click', () => { $('#userCreateForm').reset(); $('#newUserMessage').hidden = true; openLayer('#userModal'); });
  $('#userCreateForm')?.addEventListener('submit', createUserFromAdmin);
  $('#newTraining')?.addEventListener('click', newTrainingForm);
  $('#trainingForm')?.addEventListener('submit', saveTraining);
  $('#contentForm')?.addEventListener('submit', saveContent);
  $('#contactForm')?.addEventListener('submit', submitContact);
  $('#downloadCsv')?.addEventListener('click', downloadOpenCsv);
  $('#downloadJson')?.addEventListener('click', downloadOpenJson);
  $('#downloadDictionary')?.addEventListener('click', downloadDataDictionary);

  document.addEventListener('click', event => {
    const detail = event.target.closest('[data-detail-id], [data-popup-id]');
    if (detail) { event.preventDefault(); showDetail(detail.dataset.detailId || detail.dataset.popupId); return; }
    const edit = event.target.closest('[data-edit-id]');
    if (edit) { editCommittee(edit.dataset.editId); return; }
    const del = event.target.closest('[data-delete-id]');
    if (del) { deleteCommittee(del.dataset.deleteId); return; }
    const delDoc = event.target.closest('[data-delete-document]');
    if (delDoc) { deleteDocument(delDoc.dataset.deleteDocument); return; }
    const evidenceVisibility = event.target.closest('[data-toggle-evidence-public]');
    if (evidenceVisibility) { toggleDocumentVisibility(evidenceVisibility.dataset.toggleEvidencePublic); return; }
    const documentVisibility = event.target.closest('[data-toggle-document-public]');
    if (documentVisibility) { toggleDocumentVisibility(documentVisibility.dataset.toggleDocumentPublic); return; }
    const evidenceBatch = event.target.closest('[data-evidence-batch]');
    if (evidenceBatch) {
      setCommitteeEvidenceVisibility(
        evidenceBatch.dataset.committeeId,
        evidenceBatch.dataset.evidenceBatch === 'public'
      );
      return;
    }
    const deleteCommitteeFileBtn = event.target.closest('[data-delete-committee-file]');
    if (deleteCommitteeFileBtn) {
      deleteCommitteeFile(deleteCommitteeFileBtn.dataset.deleteCommitteeFile, deleteCommitteeFileBtn.dataset.fileLabel || 'archivo');
      return;
    }
    const editManagementBtn = event.target.closest('[data-edit-management]');
    if (editManagementBtn) { editManagement(editManagementBtn.dataset.editManagement); return; }
    const delManagementBtn = event.target.closest('[data-delete-management]');
    if (delManagementBtn) { deleteManagement(delManagementBtn.dataset.deleteManagement); return; }
    const editCommitmentBtn = event.target.closest('[data-edit-commitment]');
    if (editCommitmentBtn) { editCommitment(editCommitmentBtn.dataset.editCommitment); return; }
    const delCommitmentBtn = event.target.closest('[data-delete-commitment]');
    if (delCommitmentBtn) { deleteAction('commitment', delCommitmentBtn.dataset.deleteCommitment); return; }
    const editEventBtn = event.target.closest('[data-edit-event]');
    if (editEventBtn) { editEvent(editEventBtn.dataset.editEvent); return; }
    const delEventBtn = event.target.closest('[data-delete-event]');
    if (delEventBtn) { deleteAction('event', delEventBtn.dataset.deleteEvent); return; }
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
    if (event.key === 'Escape') ['#detailModal','#loginModal','#passwordModal','#formModal','#documentModal','#managementModal','#actionModal','#trainingModal','#userModal','#adminDrawer'].forEach(closeLayer);
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
