document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('equipo-container');
    if (!container) return;

    let posicionScrollOriginal = 0;

    fetch('data/sedes.json')
        .then(res => res.json())
        .then(sedes => {
            sedes.forEach(sede => {
                const col = document.createElement('div');
                col.className = 'col-lg-6 col-md-12 mb-4 d-flex';
                col.innerHTML = `
                    <div class="sede-card shadow-sm">
                        <div class="sede-card-header"><span>${sede.titulo}</span></div>
                        <div id="map-${sede.id}" class="sede-map-frame"></div>
                        <div class="sede-card-footer"><i class="fas fa-map-marker-alt"></i> ${sede.direccion}</div>
                    </div>`;
                container.appendChild(col);

                const mapId = `map-${sede.id}`;
                const mapElement = document.getElementById(mapId);
                const mapa = L.map(mapId, {
                    scrollWheelZoom: false,
                    fullscreenControl: true,
                    fullscreenControlOptions: { position: 'topleft' }
                }).setView([sede.coords.lat, sede.coords.lng], 16);

                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapa);

                const itzaIcon = L.icon({
                    iconUrl: 'imagenes/logo/logo-tr-mapa.png',
                    iconSize: [36, 36], iconAnchor: [18, 36]
                });

                L.marker([sede.coords.lat, sede.coords.lng], { icon: itzaIcon }).addTo(mapa)
                    .bindTooltip(sede.titulo, { permanent: true, direction: 'top', offset: [0, -32], className: 'itza-label-permanent' }).openTooltip();

                // CLONAMOS LA LÓGICA DEL MAPA DE PROYECTOS
                const toggleFullscreen = (isEntering) => {
                    if (isEntering) {
                        posicionScrollOriginal = window.scrollY;
                        document.body.classList.add('map-is-fullscreen');
                        mapElement.classList.add('active-fullscreen');
                    } else {
                        document.body.classList.remove('map-is-fullscreen');
                        mapElement.classList.remove('active-fullscreen');
                        window.scrollTo(0, posicionScrollOriginal);
                    }
                    
                    // Refresco de motor Leaflet
                    setTimeout(() => { mapa.invalidateSize(); }, 300);
                };

                mapa.on('enterFullscreen', () => toggleFullscreen(true));
                mapa.on('exitFullscreen', () => toggleFullscreen(false));
                
                // Refuerzo para PC
                mapa.on('fullscreenchange', () => {
                    if (!mapa.isFullscreen()) toggleFullscreen(false);
                });
            });
        });
});