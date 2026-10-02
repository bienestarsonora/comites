// Credenciales PUBLICABLES del frontend. La seguridad depende de RLS.
window.COMITES_SUPABASE = {
  url: 'https://kftmqgxiehfrsdpxckan.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdG1xZ3hpZWhmcnNkcHhja2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNjc2MTQsImV4cCI6MjEwMjY0MzYxNH0.DPf912zZc63eTXfBW6DNW4efNbLVIooA_B3MX2snGNs'
};

// Capa de homologación visual conforme a los lineamientos institucionales.
// Se carga de forma independiente para no alterar la lógica funcional de la plataforma.
(function loadOfficialIdentityLayer() {
  const head = document.head;
  if (!head) return;

  if (!document.querySelector('link[data-comites-identidad-oficial]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'styles-oficial.css?v=20260917';
    link.dataset.comitesIdentidadOficial = 'true';
    head.appendChild(link);
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) themeColor.setAttribute('content', '#410123');

  if (!document.querySelector('link[rel="icon"]')) {
    const favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = 'assets/logo-bienestar.png';
    head.appendChild(favicon);
  }
})();
