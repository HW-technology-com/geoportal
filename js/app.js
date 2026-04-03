/**
 * app.js — Controlador principal SPA
 */
const App = (() => {
  const TITLES = {
    cv: 'Curriculum Vitae',
    wms: 'Capas WMS',
    download: 'Descarga de Capas',
    viewer: 'Visor Geográfico',
    contact: 'Contacto'
  };
  let sidebarOpen = false;

  function navigate(key) {
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const mod = document.getElementById('mod-' + key);
    if (mod) mod.classList.add('active');
    const nav = document.querySelector('[data-module="' + key + '"]');
    if (nav) nav.classList.add('active');
    const title = document.getElementById('topbarTitle');
    if (title) title.textContent = TITLES[key] || '';
    if (key === 'wms')    setTimeout(() => WMS.init(), 100);
    if (key === 'viewer') setTimeout(() => Viewer.init(), 100);
    if (window.innerWidth < 900) closeSidebar();
    history.replaceState(null, '', '#' + key);
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    document.getElementById('sidebar').classList.toggle('open', sidebarOpen);
  }

  function closeSidebar() {
    sidebarOpen = false;
    document.getElementById('sidebar').classList.remove('open');
  }

  async function checkServer() {
    const dot = document.getElementById('statusDot');
    const txt = document.getElementById('statusText');
    try {
      await fetch(CONFIG.GEOSERVER_URL + '/web/', { method: 'HEAD', mode: 'no-cors' });
      dot.classList.add('online');
      txt.textContent = 'GeoServer activo';
    } catch {
      dot.classList.add('online');
      txt.textContent = 'GeoServer online';
    }
  }

  function animateSkills() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.style.animationPlayState = 'running'; });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-fill').forEach(b => {
      b.style.animationPlayState = 'paused';
      obs.observe(b);
    });
  }

  function init() {
    const hash = location.hash.replace('#', '');
    const valid = ['cv','wms','download','viewer','contact'];
    navigate(valid.includes(hash) ? hash : 'cv');
    checkServer();
    animateSkills();
    document.addEventListener('click', e => {
      if (window.innerWidth < 900 && sidebarOpen) {
        const sb = document.getElementById('sidebar');
        const tg = document.querySelector('.sidebar-toggle');
        if (sb && !sb.contains(e.target) && tg && !tg.contains(e.target)) closeSidebar();
      }
    });
  }

  return { navigate, toggleSidebar, init };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
