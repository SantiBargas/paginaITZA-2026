document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('equipo-container');
    if (!container) return;

    // Variable para guardar la posición del usuario y evitar el salto al inicio
    let posicionScrollOriginal = 0;

    fetch('data/sedes.json')
        .then(res => res.json())
        .then(sedes => {
            sedes.forEach(sede => {
                // 1. CREACIÓN DE LA TARJETA
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
                        className: 'itza-label-permanent' 
                    }).openTooltip();

                // 4. FIX DE SCROLL Y PANTALLA COMPLETA
                const toggleFullscreenUI = (isEntering) => {
                    if (isEntering) {
                        // Guardamos la posición EXACTA antes de que el CSS bloquee el body
                        posicionScrollOriginal = window.pageYOffset || document.documentElement.scrollTop;
                        document.body.classList.add('map-is-fullscreen');
                        mapElement.classList.add('active-fullscreen');
                    } else {
                        // Quitamos las clases de bloqueo
                        document.body.classList.remove('map-is-fullscreen');
                        mapElement.classList.remove('active-fullscreen');

                        // EL SECRETO: Esperamos al siguiente cuadro de renderizado para devolver el scroll
                        requestAnimationFrame(() => {
                            window.scrollTo(0, posicionScrollOriginal);
                        });
                    }
                    
                    // Martillazo de refresco para evitar la pantalla blanca
                    setTimeout(() => { 
                        mapa.invalidateSize({animate: false}); 
                    }, 300);
                };

                // Eventos del plugin Fullscreen
                mapa.on('enterFullscreen', () => toggleFullscreenUI(true));
                mapa.on('exitFullscreen', () => toggleFullscreenUI(false));
                
                // Refuerzo para cierre con tecla ESC
                mapa.on('fullscreenchange', () => {
                    if (!mapa.isFullscreen()) {
                        toggleFullscreenUI(false);
                    }
                });
            });
        })
        .catch(err => console.error("Error cargando las sedes de ITZA:", err));
});