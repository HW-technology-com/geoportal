/**
 * viewer.js — Módulo Visor Geográfico
 * OpenLayers con OSM, capas WMS de GeoServer e IDESINDE, escala y coordenadas.
 */

const Viewer = (() => {
  let map = null;
  let baseOSM, baseSat, baseTopo, wmsLayer;
  let wmsVisible = false;
  let initialized = false;
  let currentBase = 'osm';

  function init() {
    if (initialized) return;
    initialized = true;

    // ── Capas base ────────────────────────────────────────
    baseOSM = new ol.layer.Tile({
      source: new ol.source.OSM(),
      visible: true
    });

    baseSat = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attributions: '© Esri'
      }),
      visible: false
    });

    baseTopo = new ol.layer.Tile({
      source: new ol.source.XYZ({
        url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attributions: '© OpenTopoMap'
      }),
      visible: false
    });

    // ── Capa WMS composición GeoServer ───────────────────
    const allLayers = Object.values(CONFIG.LAYERS)
      .map(l => `${CONFIG.WORKSPACE}:${l.name}`)
      .join(',');

    wmsLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: `${CONFIG.GEOSERVER_URL}/${CONFIG.WORKSPACE}/wms`,
        params: {
          'LAYERS': allLayers,
          'FORMAT': 'image/png',
          'TRANSPARENT': true
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      }),
      visible: false,
      opacity: 0.85
    });

    // ── Controles ─────────────────────────────────────────
    const scaleControl = new ol.control.ScaleLine({
      units: 'metric',
      target: 'viewerScale'
    });

    const zoomControl = new ol.control.Zoom();

    // ── Mapa ──────────────────────────────────────────────
    map = new ol.Map({
      target: 'viewer-map',
      layers: [baseOSM, baseSat, baseTopo, wmsLayer],
      view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.DEFAULT_CENTER),
        zoom: CONFIG.DEFAULT_ZOOM,
        minZoom: 4,
        maxZoom: 20
      }),
      controls: ol.control.defaults.defaults({
        zoom: false,
        attribution: true
      }).extend([scaleControl, zoomControl])
    });

    // ── Coordenadas en tiempo real ────────────────────────
    map.on('pointermove', (evt) => {
      const lonLat = ol.proj.toLonLat(evt.coordinate);
      const lat = lonLat[1].toFixed(6);
      const lng = lonLat[0].toFixed(6);
      const el = document.getElementById('viewerCoords');
      if (el) el.textContent = `Lat: ${lat}° | Lng: ${lng}°`;
    });

    // Ocultar loader
    map.once('rendercomplete', () => {
      const loader = document.getElementById('viewerLoader');
      if (loader) loader.classList.add('hidden');
    });
    setTimeout(() => {
      const loader = document.getElementById('viewerLoader');
      if (loader) loader.classList.add('hidden');
    }, 2500);
  }

  // Cambia la capa base
  function setBase(type) {
    currentBase = type;
    baseOSM.setVisible(type === 'osm');
    baseSat.setVisible(type === 'sat');
    baseTopo.setVisible(type === 'topo');

    // Actualizar botones activos
    ['osm', 'sat', 'topo'].forEach(t => {
      const btn = document.getElementById(`btn-${t}`);
      if (btn) btn.classList.toggle('active', t === type);
    });
  }

  // Zoom a extensión Colombia
  function zoomToExtent() {
    if (!map) return;
    const extent = ol.proj.transformExtent(
      CONFIG.COLOMBIA_EXTENT,
      'EPSG:4326',
      'EPSG:3857'
    );
    map.getView().fit(extent, { duration: 800, padding: [40, 40, 40, 40] });
  }

  // Activa/desactiva la capa WMS compuesta
  function toggleWMS() {
    wmsVisible = !wmsVisible;
    if (wmsLayer) wmsLayer.setVisible(wmsVisible);
    const btn = document.getElementById('btnToggleWMS');
    if (btn) btn.classList.toggle('active', wmsVisible);
  }

  return { init, setBase, zoomToExtent, toggleWMS };
})();
