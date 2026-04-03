/**
 * config.js — Configuración central del GeoPortal
 * Angelmiro Quiroz — Ing. Informático / Esp. Gestión Ambiental
 * GeoServer: geoserver-aqp.azurewebsites.net
 */
const CONFIG = {
  GEOSERVER_URL: 'https://geoserver-aqp.azurewebsites.net/geoserver',
  WORKSPACE: 'aquiroz',
  LAYERS: {
    layer1: { name: 'mpios_mm',            label: 'Municipios MM',       color: '#3b82f6' },
    layer2: { name: 'DEM_Barrancabermeja', label: 'DEM Barrancabermeja', color: '#10b981' },
    layer3: { name: 'Curvas Hidrologicas', label: 'Curvas Hidrológicas', color: '#f59e0b' },
    layer4: { name: 'cortado',             label: 'Puntos Hidrológicos', color: '#e879f9' }
  },
  DEFAULT_CENTER: [-73.85, 7.05],
  DEFAULT_ZOOM: 9,
  COLOMBIA_EXTENT: [-81.7, -4.2, -66.8, 12.5]
};
