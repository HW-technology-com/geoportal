/**
 * config.js — Configuración central del GeoPortal ACVC
 * Modifica estas variables para apuntar a tu GeoServer.
 */

const CONFIG = {
  // URL base del GeoServer
  GEOSERVER_URL: 'https://geoserver-aqp.azurewebsites.net/geoserver',

  // Espacio de trabajo (workspace)
  WORKSPACE: 'aquiroz',

  // Capas disponibles (nombre exacto en GeoServer)
  LAYERS: {
    layer1: { name: 'capa_predios',    label: 'Predios Rurales',   color: '#3b82f6' },
    layer2: { name: 'capa_cobertura',  label: 'Cobertura Vegetal', color: '#10b981' },
    layer3: { name: 'capa_rios',       label: 'Red Hídrica',       color: '#f59e0b' }
  },

  // Extensión inicial del mapa (Colombia — Magdalena Medio)
  DEFAULT_CENTER: [-73.85, 7.05],   // [lng, lat]
  DEFAULT_ZOOM:   9,

  // Extensión Colombia completa [minLng, minLat, maxLng, maxLat]
  COLOMBIA_EXTENT: [-81.7, -4.2, -66.8, 12.5]
};
