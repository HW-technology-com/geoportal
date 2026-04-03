/**
 * viewer.js — Visor geográfico OpenLayers
 */
const Viewer = (() => {
  let map = null, baseOSM, baseSat, baseTopo, wmsLayer;
  let wmsOn = false, initialized = false;

  function init() {
    if (initialized) return;
    initialized = true;

    baseOSM  = new ol.layer.Tile({ source: new ol.source.OSM(), visible: true });
    baseSat  = new ol.layer.Tile({ source: new ol.source.XYZ({ url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attributions: '© Esri' }), visible: false });
    baseTopo = new ol.layer.Tile({ source: new ol.source.XYZ({ url: 'https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png', attributions: '© OpenTopoMap' }), visible: false });

    const allLayers = Object.values(CONFIG.LAYERS).map(l => CONFIG.WORKSPACE + ':' + l.name).join(',');
    wmsLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: CONFIG.GEOSERVER_URL + '/' + CONFIG.WORKSPACE + '/wms',
        params: { LAYERS: allLayers, FORMAT: 'image/png', TRANSPARENT: true },
        serverType: 'geoserver', crossOrigin: 'anonymous'
      }),
      visible: false, opacity: 0.85
    });

    map = new ol.Map({
      target: 'viewer-map',
      layers: [baseOSM, baseSat, baseTopo, wmsLayer],
      view: new ol.View({ center: ol.proj.fromLonLat(CONFIG.DEFAULT_CENTER), zoom: CONFIG.DEFAULT_ZOOM, minZoom: 4, maxZoom: 20 }),
      controls: ol.control.defaults.defaults({ zoom: false, attribution: true }).extend([
        new ol.control.ScaleLine({ units: 'metric', target: 'viewerScale' }),
        new ol.control.Zoom()
      ])
    });

    map.on('pointermove', evt => {
      const ll = ol.proj.toLonLat(evt.coordinate);
      const el = document.getElementById('viewerCoords');
      if (el) el.textContent = 'Lat: ' + ll[1].toFixed(6) + '° | Lng: ' + ll[0].toFixed(6) + '°';
    });

    const hide = () => document.getElementById('viewerLoader')?.classList.add('hidden');
    map.once('rendercomplete', hide);
    setTimeout(hide, 2500);
  }

  function setBase(type) {
    baseOSM.setVisible(type === 'osm');
    baseSat.setVisible(type === 'sat');
    baseTopo.setVisible(type === 'topo');
    ['osm','sat','topo'].forEach(t => {
      const b = document.getElementById('btn-' + t);
      if (b) b.classList.toggle('active', t === type);
    });
  }

  function zoomToExtent() {
    if (!map) return;
    map.getView().fit(ol.proj.transformExtent(CONFIG.COLOMBIA_EXTENT, 'EPSG:4326', 'EPSG:3857'), { duration: 800, padding: [40,40,40,40] });
  }

  function toggleWMS() {
    wmsOn = !wmsOn;
    if (wmsLayer) wmsLayer.setVisible(wmsOn);
    const b = document.getElementById('btnToggleWMS');
    if (b) b.classList.toggle('active', wmsOn);
  }

  return { init, setBase, zoomToExtent, toggleWMS };
})();
