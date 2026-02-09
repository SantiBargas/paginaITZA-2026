document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('equipo-container');
    if (!container) return;

    const sedesSection = document.querySelector('.sedes-mapas-section');

    fetch('data/sedes.json')
        .then(res => res.json())
        .then(sedes => {
            sedes.forEach(sede => {
                // 1. CREACIÓN DE LA TARJETA
                const col = document.createElement('div');
                col.className = 'col-lg-6 col-md-12 mb-4 d-flex';
                col.innerHTML = `
                    <div class="sedes-card shadow-sm">
                        <div class="sedes-card-header"><span>${sede.titulo}</span></div>
                        <div id="map-${sede.id}" class="sedes-map-frame"></div>
                        <div class="sedes-card-footer"><i class="fas fa-map-marker-alt"></i> ${sede.direccion}</div>
                    </div>`;
                container.appendChild(col);

                const mapId = `map-${sede.id}`;
                const mapElement = document.getElementById(mapId);

                // 2. INICIALIZACIÓN DEL MAPA
                const mapa = L.map(mapId, {
                    scrollWheelZoom: false,
                    fullscreenControl: true,
                    fullscreenControlOptions: { position: 'topleft' }
                }).setView([sede.coords.lat, sede.coords.lng], 16);

                // Capa de mapa (Carto Light)
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapa);

                // 3. ICONO ITZA Y MARCADOR
                const itzaIcon = L.icon({
                    iconUrl: 'imagenes/logo/logo-tr-mapa.png',
                    iconSize: [36, 36], 
                    iconAnchor: [18, 36]
                });

                L.marker([sede.coords.lat, sede.coords.lng], { icon: itzaIcon }).addTo(mapa)
                    .bindTooltip(sede.titulo, { 
                        permanent: true, 
                        direction: 'top', 
                        offset: [0, -32], 
                        className: 'sedes-label-permanent' 
                    }).openTooltip();

                // 4. FIX DE SCROLL Y PANTALLA COMPLETA
                let fullscreenActivo = false;

                const activarFullscreenUI = () => {
                    if (fullscreenActivo) return;
                    fullscreenActivo = true;
                    document.body.classList.add('sedes-is-fullscreen');
                    mapElement.classList.add('active-fullscreen');

                    // Pequeño delay para que el mapa recalcule su nuevo tamaño
                    setTimeout(() => { mapa.invalidateSize({ animate: false }); }, 300);
                };

                const desactivarFullscreenUI = () => {
                    if (!fullscreenActivo) return;
                    fullscreenActivo = false;
                    document.body.classList.remove('sedes-is-fullscreen');
                    mapElement.classList.remove('active-fullscreen');

                    // Volvemos al inicio de la seccion de sedes
                    if (sedesSection) {
                        sedesSection.scrollIntoView({ block: 'start' });
                    }

                    setTimeout(() => { mapa.invalidateSize({ animate: false }); }, 300);
                };

                // Evento único para evitar dobles llamadas
                mapa.on('fullscreenchange', () => {
                    if (mapa.isFullscreen()) {
                        activarFullscreenUI();
                    } else {
                        desactivarFullscreenUI();
                    }
                });
            });
        })
        .catch(err => console.error("Error cargando las sedes de ITZA:", err));
});