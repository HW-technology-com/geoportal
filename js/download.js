/**
 * download.js — Módulo de descarga de capas WFS
 * Genera URLs WFS y gestiona la descarga en múltiples formatos.
 */

const Download = (() => {

  // Mapeo de formato a outputFormat de GeoServer
  const FORMATS = {
    shp: { outputFormat: 'SHAPE-ZIP',                                    ext: '.zip',  label: 'Shapefile' },
    kml: { outputFormat: 'application/vnd.google-earth.kml+xml',         ext: '.kml',  label: 'KML' },
    gml: { outputFormat: 'application/gml+xml; version=3.2',             ext: '.gml',  label: 'GML' }
  };

  // Construye la URL de descarga WFS
  function buildWFSUrl(layerName, format) {
    const fmt = FORMATS[format];
    const params = new URLSearchParams({
      service:      'WFS',
      version:      '2.0.0',
      request:      'GetFeature',
      typeName:     `${CONFIG.WORKSPACE}:${layerName}`,
      outputFormat: fmt.outputFormat
    });
    return `${CONFIG.GEOSERVER_URL}/${CONFIG.WORKSPACE}/wfs?${params.toString()}`;
  }

  // Muestra feedback al usuario
  function showFeedback(layerKey, message, type) {
    const el = document.getElementById(`fb-${layerKey}`);
    if (!el) return;
    el.textContent = message;
    el.className = `dl-feedback ${type}`;
    setTimeout(() => {
      el.textContent = '';
      el.className = 'dl-feedback';
    }, 4000);
  }

  // Ejecuta la descarga
  function download(layerName, format) {
    // Obtener la clave del layer para el feedback
    const layerKey = Object.entries(CONFIG.LAYERS)
      .find(([, v]) => v.name === layerName)?.[0];
    const feedbackKey = layerKey
      ? { capa_predios: 'predios', capa_cobertura: 'cobertura', capa_rios: 'rios' }[layerName] || layerName
      : layerName;

    const fmt = FORMATS[format];
    if (!fmt) return;

    const url = buildWFSUrl(layerName, format);
    showFeedback(feedbackKey, `Preparando descarga ${fmt.label}...`, 'success');

    // Crear enlace temporal y simular clic
    const a = document.createElement('a');
    a.href = url;
    a.download = `${layerName}${fmt.ext}`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      showFeedback(feedbackKey, `Descarga iniciada: ${layerName}${fmt.ext}`, 'success');
    }, 800);
  }

  return { download };
})();
