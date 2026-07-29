const screens = [...document.querySelectorAll('.screen')];
const courseNav = document.getElementById('courseNav');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const screenCounter = document.getElementById('screenCounter');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');
const COURSE_KEY = 'cursoCS_state_v2';

function readState() {
  const fallback = {
    current: Number(localStorage.getItem('cursoCS_current') || 0),
    bestScore: Number(localStorage.getItem('cursoCS_score') || 0),
    passed: Number(localStorage.getItem('cursoCS_score') || 0) >= 80,
    completed: false,
    participantName: ''
  };
  try {
    const saved = JSON.parse(localStorage.getItem(COURSE_KEY) || 'null');
    return saved && typeof saved === 'object' ? {...fallback, ...saved} : fallback;
  } catch (_) {
    return fallback;
  }
}

let state = readState();
state.current = Math.max(0, Math.min(Number(state.current) || 0, screens.length - 1));
state.bestScore = Math.max(0, Math.min(Number(state.bestScore) || 0, 100));
state.passed = Boolean(state.passed || state.bestScore >= 80);

function saveState() {
  localStorage.setItem(COURSE_KEY, JSON.stringify(state));
  localStorage.setItem('cursoCS_current', String(state.current));
  localStorage.setItem('cursoCS_score', String(state.bestScore));
}

const titles = screens.map((screen, index) => ({
  title: screen.dataset.title,
  icon: screen.dataset.icon,
  index
}));

titles.forEach(item => {
  const button = document.createElement('button');
  button.type = 'button';
  button.innerHTML = `<i class="fa-solid ${item.icon}"></i><span>${item.title}</span><small>${item.index + 1}</small>`;
  button.addEventListener('click', () => showScreen(item.index));
  courseNav.appendChild(button);
});

function refreshCertificateAccess() {
  const status = document.getElementById('certificateStatus');
  const eligibility = document.getElementById('certificateEligibility');
  const generate = document.getElementById('generateCertificate');
  const goToEvaluation = document.getElementById('goToEvaluation');
  if (!status || !generate) return;

  if (state.passed) {
    status.className = 'certificate-status eligible';
    status.innerHTML = `<i class="fa-solid fa-circle-check"></i><span><strong>Evaluación aprobada.</strong> Mejor resultado: ${state.bestScore}%.</span>`;
    eligibility.textContent = 'Captura tu nombre tal como deseas que aparezca.';
    generate.disabled = false;
    goToEvaluation.hidden = true;
  } else {
    status.className = 'certificate-status locked';
    status.innerHTML = '<i class="fa-solid fa-lock"></i><span><strong>Reconocimiento bloqueado.</strong> Primero presenta y aprueba la evaluación final.</span>';
    eligibility.textContent = 'Necesitas al menos 80% en la evaluación para generar tu reconocimiento.';
    generate.disabled = true;
    goToEvaluation.hidden = false;
  }
}

function showScreen(index) {
  state.current = Math.max(0, Math.min(index, screens.length - 1));
  screens.forEach((screen, i) => screen.classList.toggle('active', i === state.current));
  [...courseNav.children].forEach((button, i) => {
    button.classList.toggle('active', i === state.current);
    button.classList.toggle('done', i < state.current || (i === 9 && state.passed));
  });

  const percent = Math.round((state.current / (screens.length - 1)) * 100);
  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${percent}% completado`;
  screenCounter.textContent = `${state.current + 1} de ${screens.length}`;
  prevButton.disabled = state.current === 0;
  nextButton.style.display = state.current === screens.length - 1 ? 'none' : 'inline-flex';
  refreshCertificateAccess();
  saveState();
  document.getElementById('courseStage').focus({preventScroll: true});
  window.scrollTo({top: 0, behavior: 'smooth'});
}

prevButton.addEventListener('click', () => showScreen(state.current - 1));
nextButton.addEventListener('click', () => showScreen(state.current + 1));
document.querySelectorAll('[data-next]').forEach(button => button.addEventListener('click', () => showScreen(state.current + 1)));
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight' && state.current < screens.length - 1) showScreen(state.current + 1);
  if (event.key === 'ArrowLeft' && state.current > 0) showScreen(state.current - 1);
});

document.querySelectorAll('.flip-card').forEach(card => card.addEventListener('click', () => card.classList.toggle('flipped')));

const roles = {
  beneficiarios: {icon: 'fa-people-group', title: 'Personas beneficiarias', text: 'Reciben información del programa, observan su desarrollo y pueden integrar el comité.'},
  comite: {icon: 'fa-people-roof', title: 'Comité de Contraloría Social', text: 'Organiza el seguimiento ciudadano, registra observaciones y mantiene comunicación con la dependencia.'},
  dependencia: {icon: 'fa-building-columns', title: 'Dependencia responsable', text: 'Proporciona información, orientación y canales para atender dudas, observaciones o propuestas.'},
  ciudadania: {icon: 'fa-person-circle-question', title: 'Ciudadanía', text: 'Puede informarse, conocer los resultados y contribuir a una cultura de participación y cuidado de lo público.'}
};

function setRole(key) {
  const role = roles[key];
  document.getElementById('roleDetail').innerHTML = `<i class="fa-solid ${role.icon}"></i><h3>${role.title}</h3><p>${role.text}</p><div class="callout"><i class="fa-solid fa-circle-info"></i><p>Cada actor tiene una responsabilidad distinta, pero todos contribuyen a fortalecer la confianza.</p></div>`;
  document.querySelectorAll('.role-button').forEach(button => button.classList.toggle('active', button.dataset.role === key));
}
document.querySelectorAll('.role-button').forEach(button => button.addEventListener('click', () => setRole(button.dataset.role)));
setRole('beneficiarios');

const myths = [
  {q: 'La Contraloría Social busca sancionar directamente a servidores públicos.', a: false, why: 'Falso. Su función principal es preventiva, participativa y de acompañamiento; no sustituye a las autoridades competentes.'},
  {q: 'Las personas beneficiarias pueden participar en el seguimiento de un programa.', a: true, why: 'Verdadero. Su experiencia es clave para observar y comunicar cómo se desarrolla el programa.'},
  {q: 'Un comité necesita recibir información clara para realizar su función.', a: true, why: 'Verdadero. La información comprensible permite una participación informada.'}
];
let mythIndex = 0;
const mythAnswerButtons = [...document.querySelectorAll('[data-myth-answer]')];
const nextMythButton = document.getElementById('nextMythButton');

function renderMyth() {
  document.getElementById('mythCount').textContent = `Pregunta ${mythIndex + 1} de ${myths.length}`;
  document.getElementById('mythStatement').textContent = myths[mythIndex].q;
  const feedback = document.getElementById('mythFeedback');
  feedback.className = 'feedback';
  feedback.textContent = '';
  mythAnswerButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove('selected');
  });
  nextMythButton.hidden = true;
  nextMythButton.innerHTML = mythIndex < myths.length - 1
    ? 'Siguiente pregunta <i class="fa-solid fa-arrow-right"></i>'
    : 'Continuar con el curso <i class="fa-solid fa-arrow-right"></i>';
}

renderMyth();
mythAnswerButtons.forEach(button => button.addEventListener('click', () => {
  const answer = button.dataset.mythAnswer === 'true';
  const myth = myths[mythIndex];
  const feedback = document.getElementById('mythFeedback');
  feedback.className = `feedback show ${answer === myth.a ? 'correct' : 'wrong'}`;
  feedback.innerHTML = `<strong>${answer === myth.a ? '¡Correcto!' : 'Revisa esta idea.'}</strong> ${myth.why}`;
  mythAnswerButtons.forEach(item => item.disabled = true);
  button.classList.add('selected');
  nextMythButton.hidden = false;
  nextMythButton.focus();
}));

nextMythButton.addEventListener('click', () => {
  if (mythIndex < myths.length - 1) {
    mythIndex += 1;
    renderMyth();
    document.getElementById('mythStatement').focus?.();
  } else {
    showScreen(state.current + 1);
  }
});

document.getElementById('checkObservations').addEventListener('click', () => {
  const items = [...document.querySelectorAll('#observationActivity input')];
  const isCorrect = items.every(input => input.checked === (input.dataset.correct === 'true'));
  const feedback = document.getElementById('observationFeedback');
  feedback.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect ? '¡Muy bien! Seleccionaste las acciones que sí corresponden al comité.' : 'Revisa tus respuestas: el comité observa, solicita información y comunica; no sanciona ni investiga datos personales.';
});

document.querySelectorAll('[data-case]').forEach(button => button.addEventListener('click', () => {
  const isCorrect = button.dataset.case === 'right';
  const feedback = document.getElementById('caseFeedback');
  feedback.className = `feedback show ${isCorrect ? 'correct' : 'wrong'}`;
  feedback.textContent = isCorrect ? '¡Correcto! El comité puede solicitar claridad y ayudar a que la información llegue de forma adecuada.' : 'Esa acción no corresponde al comité. Su papel es observar, comunicar y proponer, respetando atribuciones y datos personales.';
}));

const questions = [
  ['¿Qué es la Contraloría Social?', ['Una auditoría privada', 'Participación organizada para dar seguimiento a programas públicos', 'Una campaña electoral'], 1],
  ['¿Quiénes pueden integrar un comité?', ['Personas beneficiarias', 'Únicamente servidores públicos', 'Solamente proveedores'], 0],
  ['¿Qué necesita un comité para participar mejor?', ['Información clara', 'Datos secretos', 'Autorización de empresas'], 0],
  ['¿Cuál es una función del comité?', ['Imponer sanciones', 'Observar y comunicar', 'Cancelar programas'], 1],
  ['¿Qué fortalece la Contraloría Social?', ['La transparencia y participación', 'La publicidad comercial', 'La competencia partidista'], 0],
  ['¿Qué puede hacer ante una duda?', ['Solicitar información por los canales establecidos', 'Publicar datos personales', 'Ignorarla'], 0],
  ['¿El comité sustituye a las autoridades?', ['Sí', 'No', 'Solo algunas veces'], 1],
  ['¿Qué tipo de participación promueve?', ['Informada y organizada', 'Secreta', 'Obligatoria'], 0],
  ['¿Para qué sirven las observaciones ciudadanas?', ['Para mejorar la atención y seguimiento', 'Para reemplazar expedientes', 'Para definir sanciones directamente'], 0],
  ['¿Cuál es la actitud más útil?', ['Colaborar, observar y comunicar', 'Confrontar sin información', 'Difundir rumores'], 0]
];

const quiz = document.getElementById('quizContainer');
questions.forEach((question, index) => {
  const article = document.createElement('article');
  article.className = 'quiz-question';
  article.innerHTML = `<h3>${index + 1}. ${question[0]}</h3>${question[1].map((option, optionIndex) => `<label><input type="radio" name="q${index}" value="${optionIndex}"> ${option}</label>`).join('')}`;
  quiz.appendChild(article);
});

document.getElementById('submitQuiz').addEventListener('click', () => {
  let score = 0;
  let answered = 0;
  questions.forEach((question, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    if (selected) {
      answered += 1;
      if (Number(selected.value) === question[2]) score += 1;
    }
  });

  const result = document.getElementById('quizResult');
  if (answered < questions.length) {
    result.className = 'quiz-result show feedback wrong';
    result.textContent = `Te faltan ${questions.length - answered} preguntas por responder.`;
    result.scrollIntoView({behavior: 'smooth', block: 'center'});
    return;
  }

  const percent = Math.round((score / questions.length) * 100);
  state.bestScore = Math.max(state.bestScore, percent);
  state.passed = state.bestScore >= 80;
  state.completed = state.passed;
  saveState();
  refreshCertificateAccess();
  result.className = `quiz-result show feedback ${percent >= 80 ? 'correct' : 'wrong'}`;
  result.innerHTML = `<strong>Resultado: ${percent}%</strong><br>${percent >= 80 ? '¡Aprobaste! Lee con calma tu resultado y, cuando estés listo, haz clic en “Continuar al reconocimiento”.' : 'Repasa los temas e inténtalo nuevamente. Necesitas 80%.'}`;
  const continueButton = document.getElementById('continueToCertificate');
  continueButton.hidden = percent < 80;
  result.scrollIntoView({behavior: 'smooth', block: 'center'});
  if (percent >= 80) continueButton.focus({preventScroll: true});
});

document.getElementById('continueToCertificate').addEventListener('click', () => showScreen(10));

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, character => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character]));
}

function formatDate() {
  return new Intl.DateTimeFormat('es-MX', {dateStyle: 'long'}).format(new Date());
}

function populateCertificate(name) {
  const date = formatDate();
  document.getElementById('certificateName').textContent = name;
  document.getElementById('certificateDate').textContent = date;
  document.getElementById('certificateScore').textContent = `${state.bestScore}%`;
  document.getElementById('certificate').hidden = false;
  document.getElementById('certificate').scrollIntoView({behavior: 'smooth', block: 'start'});
  state.participantName = name;
  state.completed = true;
  saveState();
}

document.getElementById('generateCertificate').addEventListener('click', () => {
  const name = document.getElementById('participantName').value.trim();
  if (!state.passed) {
    refreshCertificateAccess();
    document.getElementById('certificateStatus').scrollIntoView({behavior: 'smooth', block: 'center'});
    return;
  }
  if (name.length < 3) {
    const input = document.getElementById('participantName');
    input.setCustomValidity('Escribe tu nombre completo.');
    input.reportValidity();
    input.addEventListener('input', () => input.setCustomValidity(''), {once: true});
    return;
  }
  populateCertificate(name);
});

document.getElementById('goToEvaluation').addEventListener('click', () => showScreen(9));

function printCertificateInSamePage() {
  const name = document.getElementById('certificateName').textContent.trim();
  if (!name || !state.passed) {
    refreshCertificateAccess();
    return;
  }

  // La impresión se ejecuta en la misma página y directamente desde el clic
  // de la persona usuaria, por lo que el navegador no bloquea ventanas emergentes.
  document.body.classList.add('certificate-print-mode');
  window.print();
}

window.addEventListener('afterprint', () => {
  document.body.classList.remove('certificate-print-mode');
});

document.getElementById('printCertificate').addEventListener('click', printCertificateInSamePage);
document.getElementById('fontToggle').addEventListener('click', () => document.body.classList.toggle('large-text'));
document.getElementById('contrastToggle').addEventListener('click', () => document.body.classList.toggle('high-contrast'));

if (state.participantName) document.getElementById('participantName').value = state.participantName;
refreshCertificateAccess();
showScreen(state.current);
