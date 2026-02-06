document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapa-proyectos');
    if (!mapContainer) return;

    // 1. Inicializar el mapa
    // fullscreenControl: true permite ampliar el mapa a pantalla completa
    const mapa = L.map('mapa-proyectos', {
        scrollWheelZoom: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([-31.74, -60.51], 7); // Centrado en la región de Entre Ríos y Santa Fe

    // 2. Capa de fondo (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // 3. Configuración de Iconos (Opcional: Corregir rutas si no cargan los pines)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // 4. Grupo de Clústeres (Agrupa marcadores cercanos)
    const markersCluster = L.markerClusterGroup();

    // 5. Cargar proyectos desde el JSON
    fetch('data/proyectos.json')
        .then(response => {
            if (!response.ok) throw new Error("Error al cargar proyectos.json");
            return response.json();
        })
        .then(proyectos => {
            proyectos.forEach(proy => {
                if (proy.coords) {
                    
                    // Definición del contenido de la tarjeta (Popup)
                    const popupContent = `
                        <div style="width: 220px; font-family: 'Poppins', sans-serif; padding: 5px;">
                            <img src="${proy.imagen}" style="width:100%; border-radius:8px; margin-bottom:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">
                            <h6 style="margin:0; font-weight:700; color:#003366; text-transform: uppercase; font-size: 13px;">${proy.titulo}</h6>
                            <div style="display: flex; align-items: center; margin: 8px 0; color: #666; font-size: 11px;">
                                <i class="fas fa-map-marker-alt" style="color: #ffce00; margin-right: 5px;"></i>
                                <span>${proy.ubicacion}</span>
                            </div>
                            <p style="font-size: 11px; line-height: 1.4; color: #444; margin-bottom: 10px;">
                                ${proy.descripcion.substring(0, 85)}...
                            </p>
                            <a href="portfolio.html" style="display: block; text-align: center; background: #003366; color: #fff; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 11px; font-weight: 600;">
                                VER DETALLES
                            </a>
                        </div>
                    `;

                    // Crear el marcador individual
                    const marker = L.marker([proy.coords.lat, proy.coords.lng]);
                    marker.bindPopup(popupContent);

                    // Añadir el marcador al grupo de clústeres
                    markersCluster.addLayer(marker);
                }
            });

            // Añadir el grupo completo al mapa
            mapa.addLayer(markersCluster);
        })
        .catch(err => console.error("Error cargando el mapa de proyectos ITZA:", err));
});