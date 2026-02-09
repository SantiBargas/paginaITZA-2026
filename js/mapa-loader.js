document.addEventListener("DOMContentLoaded", () => {
    const mapContainer = document.getElementById('mapa-proyectos');
    if (!mapContainer) return;

    // Variable para evitar que la página "salte" en móviles
    let posicionScrollOriginal = 0;

    // 1. Inicializar el mapa - scrollWheelZoom: true para navegación fluida
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

    // --- BLINDAJE FULLSCREEN EXCLUSIVO PROYECTOS ---

    // Centralizamos el toggle para fullscreen (aplica clase + ocultamiento inline de elementos problemáticos)
    const toggleFS = (isEntering) => {
        posicionScrollOriginal = window.scrollY;
        if (isEntering) {
            document.body.classList.add('proyectos-fs-active');
        } else {
            document.body.classList.remove('proyectos-fs-active');
            // Restauramos el scroll en iPhone
            requestAnimationFrame(() => window.scrollTo(0, posicionScrollOriginal));
        }

        // Forzar ocultamiento de elementos que a veces quedan por encima en iOS
        const toHide = document.querySelectorAll('.btn-wsp, .nav-bar, .top-bar, #itza-footer, .page-header-area, .navbar-collapse, .navbar-collapse.show, .navbar-toggler, .navbar-nav, .collapse.show, .dropdown-menu.show');
        toHide.forEach(el => {
            if (isEntering) {
                el.dataset._prevDisplay = el.style.display || '';
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            } else {
                if (el.dataset._prevDisplay !== undefined) el.style.display = el.dataset._prevDisplay;
                el.style.visibility = '';
                delete el.dataset._prevDisplay;
            }
        });

        setTimeout(() => { mapa.invalidateSize(); }, 300);
    };

    mapa.on('enterFullscreen', () => toggleFS(true));
    mapa.on('exitFullscreen', () => toggleFS(false));

    // Observador de clase en el contenedor del mapa para detectar fullscreen cuando el plugin no dispara eventos (iOS)
    const mapContainerEl = mapa.getContainer();
    try {
        const mo = new MutationObserver(() => {
            const isFs = mapContainerEl.classList.contains('leaflet-fullscreen-on');
            if (isFs && !document.body.classList.contains('proyectos-fs-active')) toggleFS(true);
            if (!isFs && document.body.classList.contains('proyectos-fs-active')) toggleFS(false);
        });
        mo.observe(mapContainerEl, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {
        document.addEventListener('fullscreenchange', () => {
            const isFs = !!(document.fullscreenElement);
            if (isFs) toggleFS(true); else toggleFS(false);
        });
    }

    // Listener extra en el botón de fullscreen del control (si existe) para forzar toggle
    const fsBtn = mapContainerEl.querySelector('.leaflet-control-fullscreen-button, .leaflet-control-fullscreen a, .leaflet-control-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', () => {
            const active = document.body.classList.contains('proyectos-fs-active');
            toggleFS(!active);
            setTimeout(() => {
                const pluginOn = mapContainerEl.classList.contains('leaflet-fullscreen-on');
                if (pluginOn && !document.body.classList.contains('proyectos-fs-active')) toggleFS(true);
                if (!pluginOn && document.body.classList.contains('proyectos-fs-active')) toggleFS(false);
            }, 600);
        });
    }

    // 3. Crear el Panel Lateral Interno (Sidebar con prefijo pro-)
    const sidebar = L.control({ position: 'topright' });
    sidebar.onAdd = function() {
        const div = L.DomUtil.create('div', 'pro-sidebar-overlay');
        div.innerHTML = `
            <div class="pro-sidebar-header">
                <span>OBRAS Y PROYECTOS</span>
                <button id="btn-toggle-pro-list" class="pro-toggle-sidebar-btn">Ocultar</button>
            </div>
            <div id="lista-proyectos-interna" style="overflow-y: auto; flex-grow: 1;"></div>
        `;
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.disableClickPropagation(div);
        return div;
    };
    sidebar.addTo(mapa);

    // Lógica del botón Ocultar/Mostrar exclusiva
    setTimeout(() => {
        const btnToggle = document.getElementById('btn-toggle-pro-list');
        if (btnToggle) {
            btnToggle.onclick = function() {
                const panel = document.querySelector('.pro-sidebar-overlay');
                panel.classList.toggle('collapsed');
                this.innerText = panel.classList.contains('collapsed') ? 'Mostrar' : 'Ocultar';
            };
        }
    }, 100);

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
            const container = document.getElementById('lista-proyectos-interna');
            
            proyectos.forEach(proy => {
                if (proy.coords) {
                    const tituloLimpio = limpiarTexto(proy.titulo);

                    // Marcador con Tooltip Pro (Fix de desbordamiento)
                    const marker = L.marker([proy.coords.lat, proy.coords.lng]);
                    
                    // Tooltip multilínea con clase compartida itza-label-permanent
                    marker.bindTooltip(`<b>${tituloLimpio}</b><small>${proy.ubicacion}</small>`, { 
                        permanent: false, // En proyectos suele ser mejor que aparezca al pasar el mouse
                        direction: 'top', 
                        offset: [0, -32], 
                        className: 'itza-label-permanent' 
                    });

                    // Popup completo al hacer click
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
                    marker.bindPopup(popupContent);
                    markersCluster.addLayer(marker);

                    // Item en la lista lateral (Clase pro-project-item)
                    const item = document.createElement('div');
                    item.className = 'pro-project-item';
                    item.innerHTML = `<h6>${tituloLimpio}</h6><span>${proy.ubicacion}</span>`;

                    item.onclick = () => {
                        mapa.flyTo([proy.coords.lat, proy.coords.lng], 15, { duration: 1.5 });
                        setTimeout(() => marker.openPopup(), 1600);
                    };
                    
                    container.appendChild(item);
                }
            });
            mapa.addLayer(markersCluster);
        })
        .catch(err => console.error("Error cargando proyectos:", err));
});