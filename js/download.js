/**
 * download.js — Descargas WFS (vectorial) y WCS (ráster)
 * Capas vectoriales: mpios_mm, Curvas Hidrologicas, cortado → WFS
 * Capas ráster: DEM_Barrancabermeja → WCS
 */
const Download = (() => {

  // Capas ráster — usan WCS en lugar de WFS
  const RASTER_LAYERS = ['DEM_Barrancabermeja'];

  const WFS_FORMATS = {
    shp: { out: 'SHAPE-ZIP',                               ext: '.zip',  label: 'Shapefile' },
    kml: { out: 'application/vnd.google-earth.kml+xml',    ext: '.kml',  label: 'KML'       },
    gml: { out: 'application/gml+xml; version=3.2',        ext: '.gml',  label: 'GML'       }
  };

  // Construye URL WFS para capas vectoriales
  function buildWFSUrl(layerName, format) {
    const f = WFS_FORMATS[format];
    const p = new URLSearchParams({
      service: 'WFS', version: '2.0.0', request: 'GetFeature',
      typeName: CONFIG.WORKSPACE + ':' + layerName,
      outputFormat: f.out
    });
    return CONFIG.GEOSERVER_URL + '/' + CONFIG.WORKSPACE + '/wfs?' + p.toString();
  }

  // Construye URL WCS para capas ráster (descarga como GeoTIFF)
  function buildWCSUrl(layerName) {
    const p = new URLSearchParams({
      service: 'WCS', version: '2.0.1', request: 'GetCoverage',
      coverageId: CONFIG.WORKSPACE + ':' + layerName,
      format: 'image/tiff'
    });
    return CONFIG.GEOSERVER_URL + '/' + CONFIG.WORKSPACE + '/wcs?' + p.toString();
  }

  function feedback(id, msg, type) {
    const el = document.getElementById('fb-' + id);
    if (!el) return;
    el.textContent = msg;
    el.className = 'dl-feedback ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'dl-feedback'; }, 4000);
  }

  function download(layerName, format) {
    const fbId = layerName.replace(/\s+/g, '_');
    const isRaster = RASTER_LAYERS.includes(layerName);

    // Capas ráster solo soportan descarga como GeoTIFF vía WCS
    if (isRaster && format !== 'shp') {
      feedback(fbId, 'Capa ráster: solo disponible como GeoTIFF', 'error');
      return;
    }

    let url, filename;
    if (isRaster) {
      url = buildWCSUrl(layerName);
      filename = layerName + '.tif';
      feedback(fbId, 'Preparando descarga GeoTIFF...', 'success');
    } else {
      const f = WFS_FORMATS[format];
      if (!f) return;
      url = buildWFSUrl(layerName, format);
      filename = layerName + f.ext;
      feedback(fbId, 'Preparando descarga ' + f.label + '...', 'success');
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => feedback(fbId, 'Descarga iniciada: ' + filename, 'success'), 800);
  }

  return { download };
})();
