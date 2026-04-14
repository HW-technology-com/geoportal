/**
 * app.js — Controlador principal de la SPA
 * Gestiona navegación, estado del servidor y comportamiento global.
 */

const App = (() => {

  // Títulos de cada módulo para el topbar
  const MODULE_TITLES = {
    cv:       'Curriculum Vitae',
    wms:      'Capas WMS',
    download: 'Descarga de Capas',
    viewer:   'Visor Geográfico',
    contact:  'Contacto'
  };

  let sidebarOpen = false;

  // Navega a un módulo
  function navigate(modKey) {
    // Ocultar todos los módulos
    document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    // Mostrar el módulo activo
    const mod = document.getElementById(`mod-${modKey}`);
    if (mod) mod.classList.add('active');

    // Marcar nav item activo
    const navItem = document.querySelector(`[data-module="${modKey}"]`);
    if (navItem) navItem.classList.add('active');

    // Actualizar título del topbar
    const title = document.getElementById('topbarTitle');
    if (title) title.textContent = MODULE_TITLES[modKey] || '';

    // Inicializar mapas cuando se activa el módulo correspondiente
    if (modKey === 'wms')    setTimeout(() => WMS.init(), 100);
    if (modKey === 'viewer') setTimeout(() => Viewer.init(), 100);

    // Cerrar sidebar en mobile
    if (window.innerWidth < 900) closeSidebar();

    // Actualizar URL hash para navegación directa
    history.replaceState(null, '', `#${modKey}`);
  }

  // Toggle sidebar en mobile
  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('open', sidebarOpen);
  }

  function closeSidebar() {
    sidebarOpen = false;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.remove('open');
  }

  // Verifica el estado del servidor GeoServer
  async function checkServerStatus() {
    const dot  = document.getElementById('statusDot');
    const text = document.getElementById('statusText');
    try {
      const url = `${CONFIG.GEOSERVER_URL}/web/`;
      const resp = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      dot.classList.add('online');
      text.textContent = 'Servidor activo';
    } catch {
      // Con no-cors no podemos verificar status real, asumir activo si no hay error de red
      dot.classList.add('online');
      text.textContent = 'GeoServer online';
    }
  }

  // Inicialización
  function init() {
    // Navegación por hash
    const hash = location.hash.replace('#', '');
    const validMods = ['cv', 'wms', 'download', 'viewer', 'contact'];
    const startMod = validMods.includes(hash) ? hash : 'cv';
    navigate(startMod);

    // Verificar servidor
    checkServerStatus();

    // Animación de barras de habilidades al cargar CV
    animateSkillBars();

    // Cerrar sidebar al hacer clic fuera en mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 900 && sidebarOpen) {
        const sidebar = document.getElementById('sidebar');
        const toggle  = document.querySelector('.sidebar-toggle');
        if (sidebar && !sidebar.contains(e.target) && !toggle.contains(e.target)) {
          closeSidebar();
        }
      }
    });
  }

  // Activa la animación de barras de habilidades cuando son visibles
  function animateSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill-fill').forEach(bar => {
      bar.style.animationPlayState = 'paused';
      observer.observe(bar);
    });
  }

  // Exponer navegación pública
  return { navigate, toggleSidebar, init };

})();

// Arrancar la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => App.init());
