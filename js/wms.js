/**
 * wms.js — Módulo de visualización WMS
 * 4 capas: mpios_mm, DEM_Barrancabermeja, Curvas Hidrologicas, cortado
 */

const WMS = (() => {
  let map = null;
  let layers = {};
  let initialized = false;

  function createWMSLayer(key) {
    const cfg = CONFIG.LAYERS[key];
    return new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: `${CONFIG.GEOSERVER_URL}/${CONFIG.WORKSPACE}/wms`,
        params: {
          'LAYERS': `${CONFIG.WORKSPACE}:${cfg.name}`,
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

  function init() {
    if (initialized) return;
    initialized = true;

    const osmLayer = new ol.layer.Tile({ source: new ol.source.OSM() });

    layers.layer1 = createWMSLayer('layer1');
    layers.layer2 = createWMSLayer('layer2');
    layers.layer3 = createWMSLayer('layer3');
    layers.layer4 = createWMSLayer('layer4');

    map = new ol.Map({
      target: 'wms-map',
      layers: [osmLayer, layers.layer1, layers.layer2, layers.layer3, layers.layer4],
      view: new ol.View({
        center: ol.proj.fromLonLat(CONFIG.DEFAULT_CENTER),
        zoom: CONFIG.DEFAULT_ZOOM
      }),
      controls: ol.control.defaults.defaults({ zoom: true, attribution: false })
    });

    map.on('pointermove', (evt) => {
      const ll = ol.proj.toLonLat(evt.coordinate);
      document.getElementById('wmsCoords').textContent =
        `Lat ${ll[1].toFixed(5)} · Lng ${ll[0].toFixed(5)}`;
    });

    map.once('rendercomplete', () => document.getElementById('wmsLoader')?.classList.add('hidden'));
    setTimeout(() => document.getElementById('wmsLoader')?.classList.add('hidden'), 2000);
  }

  function toggleLayer(key, visible) {
    if (layers[key]) layers[key].setVisible(visible);
  }

  function setOpacity(key, value) {
    if (!layers[key]) return;
    layers[key].setOpacity(value / 100);
    const el = document.getElementById(`opval-${key}`);
    if (el) el.textContent = `${value}%`;
  }

  function showOnly(key) {
    Object.keys(layers).forEach(k => {
      const v = k === key;
      layers[k].setVisible(v);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = v;
    });
  }

  function showAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(true);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = true;
    });
  }

  function hideAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(false);
      const chk = document.getElementById(`chk-${k}`);
      if (chk) chk.checked = false;
    });
  }

  return { init, toggleLayer, setOpacity, showOnly, showAll, hideAll };
})();
