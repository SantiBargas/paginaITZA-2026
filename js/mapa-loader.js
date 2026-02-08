document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapa-proyectos');
    if (!mapContainer) return;

    // Variable para evitar que la página "salte" al cerrar el mapa
    let posicionScrollOriginal = 0;

    // 1. Inicializar el mapa
    const mapa = L.map('mapa-proyectos', {
        scrollWheelZoom: true,
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' }
    }).setView([-31.74, -60.51], 7);

    // 2. Capa de fondo
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapa);

    const markersCluster = L.markerClusterGroup();

    // --- BLINDAJE FULLSCREEN + FIX DE SCROLL ---

    const activarFullscreenUI = () => {
        // Guardamos la posición exacta donde estaba el usuario
        posicionScrollOriginal = window.scrollY;
        document.body.classList.add('map-is-fullscreen');
        
        // Pequeño delay para que el mapa recalcule su nuevo tamaño gigante
        setTimeout(() => { mapa.invalidateSize(); }, 300);
    };

    const desactivarFullscreenUI = () => {
        document.body.classList.remove('map-is-fullscreen');
        
        // RESTAURAMOS EL SCROLL: Evita que el iPhone vuelva arriba de todo
        window.scrollTo(0, posicionScrollOriginal);
        
        setTimeout(() => { mapa.invalidateSize(); }, 300);
    };

    // Eventos nativos del plugin
    mapa.on('enterFullscreen', activarFullscreenUI);
    mapa.on('exitFullscreen', desactivarFullscreenUI);

    // Refuerzo para iOS y cambios de estado manuales
    mapa.on('fullscreenchange', () => {
        if (mapa.isFullscreen()) {
            activarFullscreenUI();
        } else {
            desactivarFullscreenUI();
        }
    });

    // 3. Crear el Panel Lateral Interno (Sidebar)
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

    // Función para limpiar etiquetas HTML
    const limpiarTexto = (html) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    };

    // 4. Cargar proyectos desde el JSON
    fetch('data/proyectos.json')
        .then(res => res.json())
        .then(proyectos => {
            const container = document.getElementById('lista-mapa-interna');
            
            proyectos.forEach(proy => {
                if (proy.coords) {
                    const tituloLimpio = limpiarTexto(proy.titulo);

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

                    const marker = L.marker([proy.coords.lat, proy.coords.lng]);
                    marker.bindPopup(popupContent);
                    markersCluster.addLayer(marker);

                    const item = document.createElement('div');
                    item.className = 'map-project-item';
                    item.innerHTML = `<h6>${tituloLimpio}</h6><span>${proy.ubicacion}</span>`;

                    item.onclick = () => {
                        mapa.flyTo([proy.coords.lat, proy.coords.lng], 15, {
                            duration: 1.5
                        });
                        setTimeout(() => marker.openPopup(), 1600);
                    };
                    
                    container.appendChild(item);
                }
            });
            mapa.addLayer(markersCluster);
        })
        .catch(err => console.error("Error cargando el mapa de proyectos:", err));
});