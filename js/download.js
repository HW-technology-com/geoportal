/**
 * download.js — Descargas WFS (vectorial) y WCS (ráster)
 * Ráster: DEM_Barrancabermeja → WCS · Resto → WFS
 */
const Download = (() => {
  const RASTER = ['DEM_Barrancabermeja'];
  const FMTS = {
    shp: { out: 'SHAPE-ZIP',                              ext: '.zip', label: 'Shapefile' },
    kml: { out: 'application/vnd.google-earth.kml+xml',   ext: '.kml', label: 'KML'       },
    gml: { out: 'application/gml+xml; version=3.2',       ext: '.gml', label: 'GML'       }
  };

  function feedback(id, msg, type) {
    const el = document.getElementById('fb-' + id.replace(/\s+/g,'_'));
    if (!el) return;
    el.textContent = msg;
    el.className = 'dl-feedback ' + type;
    setTimeout(() => { el.textContent = ''; el.className = 'dl-feedback'; }, 4000);
  }

  function download(layerName, format) {
    const fbId = layerName.replace(/\s+/g,'_');
    const isRaster = RASTER.includes(layerName);
    if (isRaster && format !== 'shp') { feedback(fbId, 'Capa ráster: solo disponible como GeoTIFF', 'error'); return; }
    let url, filename;
    if (isRaster) {
      const p = new URLSearchParams({ service:'WCS', version:'2.0.1', request:'GetCoverage', coverageId: CONFIG.WORKSPACE+':'+layerName, format:'image/tiff' });
      url = CONFIG.GEOSERVER_URL+'/'+CONFIG.WORKSPACE+'/wcs?'+p.toString();
      filename = layerName + '.tif';
    } else {
      const f = FMTS[format]; if (!f) return;
      const p = new URLSearchParams({ service:'WFS', version:'2.0.0', request:'GetFeature', typeName: CONFIG.WORKSPACE+':'+layerName, outputFormat: f.out });
      url = CONFIG.GEOSERVER_URL+'/'+CONFIG.WORKSPACE+'/wfs?'+p.toString();
      filename = layerName + f.ext;
    }
    feedback(fbId, 'Preparando descarga...', 'success');
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.target = '_blank';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => feedback(fbId, 'Descarga iniciada: ' + filename, 'success'), 800);
  }

  return { download };
})();
