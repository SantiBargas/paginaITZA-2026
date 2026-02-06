document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapa-proyectos');
    if (!mapContainer) return;

    // 1. Inicializar el mapa con scroll activo y control de pantalla completa
    const mapa = L.map('mapa-proyectos', {
        scrollWheelZoom: true,
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' }
    }).setView([-31.74, -60.51], 7);

    // 2. Capa de fondo (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    const markersCluster = L.markerClusterGroup();

    // Función para limpiar etiquetas HTML de los títulos del JSON
    const limpiarTexto = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // 3. Crear el Panel Lateral Interno
    const sidebar = L.control({ position: 'topright' });
    sidebar.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-sidebar-overlay');
        div.innerHTML = `
            <div class="map-sidebar-header">
                <span>OBRAS Y PROYECTOS</span>
                <button id="btn-toggle-list" class="toggle-sidebar-btn">Ocultar</button>
            </div>
            <div id="lista-mapa-interna" style="overflow-y: auto; flex-grow: 1;"></div>
        `;
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.disableClickPropagation(div);
        return div;
    };
    sidebar.addTo(mapa);

    // Lógica del botón Ocultar/Mostrar
    document.getElementById('btn-toggle-list').onclick = function() {
        const panel = document.querySelector('.map-sidebar-overlay');
        panel.classList.toggle('collapsed');
        this.innerText = panel.classList.contains('collapsed') ? 'Mostrar' : 'Ocultar';
    };

    // 4. Cargar proyectos y generar interacción
    fetch('data/proyectos.json')
        .then(res => res.json())
        .then(proyectos => {
            const container = document.getElementById('lista-mapa-interna');
            
            proyectos.forEach(proy => {
                if (proy.coords) {
                    const tituloLimpio = limpiarTexto(proy.titulo);

                    // Diseño de la Tarjeta Detallada (Popup)
                    const popupContent = `
                        <div style="width: 220px; font-family: 'Poppins', sans-serif; padding: 5px;">
                            <img src="${proy.imagen}" style="width:100%; border-radius:8px; margin-bottom:10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                            <h6 style="margin:0; font-weight:700; color:#003366; text-transform: uppercase; font-size: 13px;">${tituloLimpio}</h6>
                            <div style="display: flex; align-items: center; margin: 8px 0; color: #666; font-size: 11px;">
                                <i class="fas fa-map-marker-alt" style="color: #ffce00; margin-right: 5px;"></i>
                                <span>${proy.ubicacion}</span>
                            </div>
                            <p style="font-size: 11px; line-height: 1.4; color: #444; margin-bottom: 5px;">
                                ${proy.descripcion.substring(0, 90)}...
                            </p>
                        </div>
                    `;

                    // Crear marcador y vincular popup
                    const marker = L.marker([proy.coords.lat, proy.coords.lng]);
                    marker.bindPopup(popupContent);
                    markersCluster.addLayer(marker);

                    // Crear ítem en la lista lateral
                    const item = document.createElement('div');
                    item.className = 'map-project-item';
                    item.innerHTML = `<h6>${tituloLimpio}</h6><span>${proy.ubicacion}</span>`;

                    // Acción al hacer clic: Vuelo suave + Apertura de tarjeta
                    item.onclick = () => {
                        mapa.flyTo([proy.coords.lat, proy.coords.lng], 15, {
                            duration: 1.5
                        });
                        // Esperar a que termine el movimiento para abrir la tarjeta
                        setTimeout(() => marker.openPopup(), 1600);
                    };
                    
                    container.appendChild(item);
                }
            });
            mapa.addLayer(markersCluster);
        })
        .catch(err => console.error("Error cargando el mapa de proyectos:", err));
});