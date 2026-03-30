/**
 * wms.js — Módulo de visualización WMS
 * Gestiona el mapa del módulo Capas WMS con OpenLayers.
 */

const WMS = (() => {
  let map = null;
  let layers = {};
  let initialized = false;

  // Construye la URL WMS para una capa
  function buildWMSUrl(layerName) {
    return `${CONFIG.GEOSERVER_URL}/${CONFIG.WORKSPACE}/wms`;
  }

  // Crea una capa WMS de OpenLayers
  function createWMSLayer(key) {
    const cfg = CONFIG.LAYERS[key];
    return new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: buildWMSUrl(cfg.name),
        params: {
          'LAYERS': `${CONFIG.WORKSPACE}:${cfg.name}`,
          'TILED': true,
          'FORMAT': 'image/png',
          'TRANSPARENT': true
        },
        serverType: 'geoserver',
        crossOrigin: 'anonymous'
      }),
      visible: false,
      opacity: 1
    });
  }

  // Inicializa el mapa WMS
  function init() {
    if (initialized) return;
    initialized = true;

    // Capa base OSM
    const osmLayer = new ol.layer.Tile({
      source: new ol.source.OSM()
    });

    // Crear capas WMS
    layers.layer1 = createWMSLayer('layer1');
    layers.layer2 = createWMSLayer('layer2');
    layers.layer3 = createWMSLayer('layer3');

    map = new ol.Map({
      target: 'wms-map',
      layers: [osmLayer, layers.layer1, layers.layer2, layers.layer3],
      view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.DEFAULT_CENTER),
        zoom: CONFIG.DEFAULT_ZOOM
      }),
      controls: ol.control.defaults.defaults({ zoom: true, attribution: false })
    });

    // Mostrar coordenadas al mover el ratón
    map.on('pointermove', (evt) => {
      const lonLat = ol.proj.toLonLat(evt.coordinate);
      const lat = lonLat[1].toFixed(5);
      const lng = lonLat[0].toFixed(5);
      document.getElementById('wmsCoords').textContent = `Lat ${lat} · Lng ${lng}`;
    });

    // Ocultar loader cuando el mapa esté listo
    map.once('rendercomplete', () => {
      const loader = document.getElementById('wmsLoader');
      if (loader) loader.classList.add('hidden');
    });

    setTimeout(() => {
      const loader = document.getElementById('wmsLoader');
      if (loader) loader.classList.add('hidden');
    }, 2000);
  }

  // Activa o desactiva una capa
  function toggleLayer(key, visible) {
    if (!layers[key]) return;
    layers[key].setVisible(visible);
  }

  // Ajusta la opacidad de una capa
  function setOpacity(key, value) {
    if (!layers[key]) return;
    layers[key].setOpacity(value / 100);
    const el = document.getElementById(`opval-${key}`);
    if (el) el.textContent = `${value}%`;
  }

  // Muestra solo una capa
  function showOnly(key) {
    Object.keys(layers).forEach(k => {
      const visible = (k === key);
      layers[k].setVisible(visible);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = visible;
    });
  }

  // Muestra todas las capas
  function showAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(true);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = true;
    });
  }

  // Oculta todas las capas
  function hideAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(false);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = false;
    });
  }

  return { init, toggleLayer, setOpacity, showOnly, showAll, hideAll };
})();
