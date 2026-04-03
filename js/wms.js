/**
 * wms.js — Módulo visualización WMS — 4 capas reales
 */
const WMS = (() => {
  let map = null, layers = {}, initialized = false;

  function makeLayer(key) {
    const cfg = CONFIG.LAYERS[key];
    return new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: CONFIG.GEOSERVER_URL + '/' + CONFIG.WORKSPACE + '/wms',
        params: { LAYERS: CONFIG.WORKSPACE + ':' + cfg.name, FORMAT: 'image/png', TRANSPARENT: true },
        serverType: 'geoserver', crossOrigin: 'anonymous'
      }),
      visible: false, opacity: 1
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;
    const base = new ol.layer.Tile({ source: new ol.source.OSM() });
    Object.keys(CONFIG.LAYERS).forEach(k => { layers[k] = makeLayer(k); });
    map = new ol.Map({
      target: 'wms-map',
      layers: [base, layers.layer1, layers.layer2, layers.layer3, layers.layer4],
      view: new ol.View({ center: ol.proj.fromLonLat(CONFIG.DEFAULT_CENTER), zoom: CONFIG.DEFAULT_ZOOM }),
      controls: ol.control.defaults.defaults({ zoom: true, attribution: false })
    });
    map.on('pointermove', evt => {
      const ll = ol.proj.toLonLat(evt.coordinate);
      const el = document.getElementById('wmsCoords');
      if (el) el.textContent = 'Lat ' + ll[1].toFixed(5) + ' · Lng ' + ll[0].toFixed(5);
    });
    const hide = () => document.getElementById('wmsLoader')?.classList.add('hidden');
    map.once('rendercomplete', hide);
    setTimeout(hide, 2500);
  }

  function toggleLayer(key, visible) { if (layers[key]) layers[key].setVisible(visible); }

  function setOpacity(key, val) {
    if (!layers[key]) return;
    layers[key].setOpacity(val / 100);
    const el = document.getElementById('opval-' + key);
    if (el) el.textContent = val + '%';
  }

  function showOnly(key) {
    Object.keys(layers).forEach(k => {
      const v = k === key;
      layers[k].setVisible(v);
      const c = document.getElementById('chk-' + k);
      if (c) c.checked = v;
    });
  }

  function showAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(true);
      const c = document.getElementById('chk-' + k);
      if (c) c.checked = true;
    });
  }

  function hideAll() {
    Object.keys(layers).forEach(k => {
      layers[k].setVisible(false);
      const c = document.getElementById('chk-' + k);
      if (c) c.checked = false;
    });
  }

  return { init, toggleLayer, setOpacity, showOnly, showAll, hideAll };
})();
