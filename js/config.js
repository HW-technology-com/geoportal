/**
 * config.js — Configuración central del GeoPortal
 * Angelmiro Quiroz — Ing. Informático / Esp. Gestión Ambiental
 * GeoServer: geoserver-aqp.azurewebsites.net
 */

const CONFIG = {
  // URL base del GeoServer
  GEOSERVER_URL: 'https://geoserver-aqp.azurewebsites.net/geoserver',

  // Espacio de trabajo (workspace)
  WORKSPACE: 'aquiroz',

  // Capas publicadas en GeoServer (nombres exactos)
  LAYERS: {
    layer1: { name: 'mpios_mm',            label: 'Municipios MM',         color: '#3b82f6', tipo: 'Polígono' },
    layer2: { name: 'DEM_Barrancabermeja', label: 'DEM Barrancabermeja',   color: '#10b981', tipo: 'Ráster'   },
    layer3: { name: 'Curvas Hidrologicas', label: 'Curvas Hidrológicas',   color: '#f59e0b', tipo: 'Línea'    },
    layer4: { name: 'cortado',             label: 'Puntos Hidrológicos',   color: '#e879f9', tipo: 'Punto'    }
  },

  // Centro inicial del mapa — Barrancabermeja, Magdalena Medio
  DEFAULT_CENTER: [-73.85, 7.05],   // [lng, lat]
  DEFAULT_ZOOM:   9,

  // Extensión Colombia [minLng, minLat, maxLng, maxLat]
  COLOMBIA_EXTENT: [-81.7, -4.2, -66.8, 12.5]
};
