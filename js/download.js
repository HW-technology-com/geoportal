/**
 * download.js — Descargas WFS con nombres reales de capas
 */
const Download = (() => {
  const FORMATS = {
    shp: { out: 'SHAPE-ZIP',                                          ext: '.zip',  label: 'Shapefile' },
    kml: { out: 'application/vnd.google-earth.kml+xml',              ext: '.kml',  label: 'KML'       },
    gml: { out: 'application/gml+xml; version=3.2',                  ext: '.gml',  label: 'GML'       }
  };

  function buildUrl(layerName, format) {
    const f = FORMATS[format];
    const p = new URLSearchParams({
      service: 'WFS', version: '2.0.0', request: 'GetFeature',
      typeName: CONFIG.WORKSPACE + ':' + layerName,
      outputFormat: f.out
    });
    return CONFIG.GEOSERVER_URL + '/' + CONFIG.WORKSPACE + '/wfs?' + p.toString();
  }

  function feedback(id, msg, type) {
    const el = document.getElementById('fb-' + id);
    if (!el) return;
    el.textContent = msg;
    el.className = 'dl-feedback ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'dl-feedback'; }, 4000);
  }

  function download(layerName, format) {
    const f = FORMATS[format];
    if (!f) return;
    const fbId = layerName.replace(/\s+/g, '_');
    feedback(fbId, 'Preparando descarga ' + f.label + '...', 'success');
    const a = document.createElement('a');
    a.href = buildUrl(layerName, format);
    a.download = layerName + f.ext;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => feedback(fbId, 'Descarga iniciada: ' + layerName + f.ext, 'success'), 800);
  }

  return { download };
})();
