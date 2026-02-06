document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('equipo-container');
    if (!container) return;

    fetch('data/sedes.json')
        .then(res => res.json())
        .then(sedes => {
            sedes.forEach(sede => {
                const col = document.createElement('div');
                col.className = 'col-lg-6 col-md-12 mb-4';
                
       
                col.innerHTML = `
                    <div class="sede-card shadow-sm">
                        <div class="sede-card-header">
                            <i class="fas fa-building mr-2"></i> ${sede.titulo}
                        </div>
                        <div id="map-${sede.id}" class="sede-map-frame"></div>
                        <div class="sede-card-footer">
                            <i class="fas fa-map-marker-alt"></i> ${sede.direccion}
                        </div>
                    </div>
                `;
                container.appendChild(col);

                // Inicializar mapa con Fullscreen
                const mapa = L.map(`map-${sede.id}`, {
                    scrollWheelZoom: false,
                    fullscreenControl: true,
                    fullscreenControlOptions: { position: 'topleft' }
                }).setView([sede.coords.lat, sede.coords.lng], 16);

                // Capa técnica CARTO
                L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; OpenStreetMap'
                }).addTo(mapa);

                // Icono ITZA
                const itzaIcon = L.icon({
                    iconUrl: 'imagenes/logo/logo-tr-mapa.png',
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -36]
                });

                L.marker([sede.coords.lat, sede.coords.lng], { icon: itzaIcon })
                    .addTo(mapa)
                    .bindPopup(`<b>${sede.titulo}</b>`)
                    .openPopup();
            });
        });
});