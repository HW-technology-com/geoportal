# GeoPortal ACVC

Geoportal web profesional para la Asociación Campesina del Valle del Río Cimitarra.
Construido con HTML, CSS y JavaScript puro + OpenLayers. Listo para GitHub Pages.

---

## Estructura del proyecto

```
geoportal/
├── index.html          ← Entrada principal (SPA)
├── css/
│   └── styles.css      ← Estilos globales
├── js/
│   ├── config.js       ← ⚙️  Configuración central (URLs, capas)
│   ├── app.js          ← Controlador de navegación
│   ├── wms.js          ← Módulo visualización WMS
│   ├── download.js     ← Módulo descarga WFS
│   ├── viewer.js       ← Visor geográfico OpenLayers
│   └── contact.js      ← Formulario de contacto
└── assets/             ← Imágenes y recursos estáticos
```

---

## Configuración inicial

Abre `js/config.js` y ajusta:

```javascript
GEOSERVER_URL: 'https://geoserver-aqp.azurewebsites.net/geoserver',
WORKSPACE:     'aquiroz',
LAYERS: {
  layer1: { name: 'NOMBRE_REAL_CAPA_1', ... },
  layer2: { name: 'NOMBRE_REAL_CAPA_2', ... },
  layer3: { name: 'NOMBRE_REAL_CAPA_3', ... }
}
```

Reemplaza `NOMBRE_REAL_CAPA_X` con los nombres exactos de tus capas en GeoServer.

---

## Despliegue en GitHub Pages — paso a paso

### 1. Crear repositorio en GitHub

1. Ve a https://github.com y haz clic en **New repository**
2. Nombre: `geoportal-acvc`
3. Visibilidad: **Public** (requerido para GitHub Pages gratis)
4. Haz clic en **Create repository**

### 2. Subir los archivos

**Opción A — Desde el navegador (sin instalar nada):**
1. En el repositorio haz clic en **Add file → Upload files**
2. Arrastra toda la carpeta `geoportal/` o los archivos individualmente
3. Escribe un mensaje de commit: `"Geoportal ACVC v1.0"`
4. Haz clic en **Commit changes**

**Opción B — Con Git (más profesional):**
```bash
git init
git add .
git commit -m "Geoportal ACVC v1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/geoportal-acvc.git
git push -u origin main
```

### 3. Activar GitHub Pages

1. En tu repositorio ve a **Settings → Pages**
2. En "Source" selecciona: **Deploy from a branch**
3. Branch: **main** · Folder: **/ (root)**
4. Haz clic en **Save**
5. Espera 2-3 minutos

Tu geoportal estará disponible en:
```
https://TU_USUARIO.github.io/geoportal-acvc/
```

---

## URLs WMS y WFS configuradas

### WMS — Visualización
```
https://geoserver-aqp.azurewebsites.net/geoserver/aquiroz/wms?
  service=WMS&version=1.1.1&request=GetMap
  &layers=aquiroz:NOMBRE_CAPA
  &format=image/png&transparent=true
```

### WFS — Descarga Shapefile
```
https://geoserver-aqp.azurewebsites.net/geoserver/aquiroz/wfs?
  service=WFS&version=2.0.0&request=GetFeature
  &typeName=aquiroz:NOMBRE_CAPA
  &outputFormat=SHAPE-ZIP
```

### WFS — Descarga KML
```
https://geoserver-aqp.azurewebsites.net/geoserver/aquiroz/wfs?
  service=WFS&version=2.0.0&request=GetFeature
  &typeName=aquiroz:NOMBRE_CAPA
  &outputFormat=application/vnd.google-earth.kml+xml
```

---

## CORS — Configuración requerida en GeoServer

Para que el geoportal pueda consumir las capas WMS/WFS desde GitHub Pages,
debes habilitar CORS en GeoServer:

1. En GeoServer → **Security → Service Security**
2. También en **Settings → Global** busca la opción de CORS
3. O agrega la variable de entorno en Azure App Service:
   ```
   GEOSERVER_CSRF_WHITELIST = TU_USUARIO.github.io
   ```

---

## Recomendaciones de escalabilidad

| Mejora futura | Tecnología sugerida |
|---|---|
| Dashboard de análisis | Power BI Embedded o Observable |
| Búsqueda de features | GeoServer REST API + fetch |
| Autenticación usuarios | Azure AD B2C |
| Tiles de alto rendimiento | GeoWebCache (ya incluido en GeoServer) |
| Análisis espacial online | Turf.js (librería JS sin servidor) |
| Integración ArcGIS Online | ArcGIS JS API 4.x |
| Base de datos geoespacial | PostGIS en Azure |
| CI/CD automático | GitHub Actions → deploy a Azure Static Web Apps |

---

## Tecnologías utilizadas

- **OpenLayers 8** — Visor de mapas
- **GeoServer 2.24** — Servidor de mapas (WMS/WFS)
- **HTML5 / CSS3 / JS ES6** — Sin frameworks pesados
- **GitHub Pages** — Hosting estático gratuito
- **Syne + DM Sans** — Tipografía Google Fonts
