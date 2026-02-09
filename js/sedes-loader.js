document.addEventListener("DOMContentLoaded", () => {
    const mapEl = document.getElementById('sedes-map-unificado');
    if (!mapEl) return;

    let posicionScrollOriginal = 0;

    // 1. Inicializar Mapa
    const mapa = L.map('sedes-map-unificado', {
        scrollWheelZoom: true,
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' }
    }).setView([-31.68, -60.60], 10); 

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(mapa);

    // 2. Sidebar con clases EXCLUSIVAS
    const sidebar = L.control({ position: 'topright' });
    sidebar.onAdd = function() {
        const div = L.DomUtil.create('div', 'sedes-sidebar-overlay');
        div.innerHTML = `
            <div class="sedes-sidebar-header">
                <span>NUESTRAS SEDES</span>
                <button id="btn-toggle-sedes" class="sedes-toggle-sidebar-btn">Ocultar</button>
            </div>
            <div id="lista-sedes-interna" style="overflow-y: auto; flex-grow: 1;"></div>
        `;
        L.DomEvent.disableScrollPropagation(div);
        L.DomEvent.disableClickPropagation(div);
        return div;
    };
    sidebar.addTo(mapa);

    // Lógica del botón Mostrar/Ocultar
    setTimeout(() => {
        const btnToggle = document.getElementById('btn-toggle-sedes');
        if (btnToggle) {
            btnToggle.onclick = function() {
                const panel = document.querySelector('.sedes-sidebar-overlay');
                panel.classList.toggle('collapsed');
                this.innerText = panel.classList.contains('collapsed') ? 'Mostrar' : 'Ocultar';
            };
        }
    }, 150);

    // 3. Cargar Datos y Marcadores
    fetch('data/sedes.json')
        .then(res => res.json())
        .then(sedes => {
            const listContainer = document.getElementById('lista-sedes-interna');
            const itzaIcon = L.icon({
                iconUrl: 'imagenes/logo/logo-tr-mapa.png',
                iconSize: [36, 36], iconAnchor: [18, 36]
            });

            sedes.forEach(s => {
                const marker = L.marker([s.coords.lat, s.coords.lng], { icon: itzaIcon }).addTo(mapa);
                
                marker.bindTooltip(`<b>${s.titulo}</b><small>${s.direccion}</small>`, { 
                    permanent: true, direction: 'top', offset: [0, -32], className: 'itza-label-permanent' 
                }).openTooltip();

                const item = document.createElement('div');
                item.className = 'sedes-item-link';
                item.innerHTML = `<h6>${s.titulo}</h6><span>${s.direccion}</span>`;
                item.onclick = () => {
                    mapa.flyTo([s.coords.lat, s.coords.lng], 16, { duration: 1.5 });
                    marker.openPopup();
                };
                listContainer.appendChild(item);
            });
        });

    // 4. Blindaje Fullscreen EXCLUSIVO Sedes
    const toggleFS = (isEntering) => {
        if (isEntering) {
            posicionScrollOriginal = window.scrollY;
            document.body.classList.add('sedes-is-fullscreen'); // Clase única
        } else {
            document.body.classList.remove('sedes-is-fullscreen');
            requestAnimationFrame(() => window.scrollTo(0, posicionScrollOriginal));
        }
            setTimeout(() => {
                // Forzar ocultamiento de elementos que a veces quedan por encima en iOS (botón WhatsApp, nav, footer)
                const toHide = document.querySelectorAll('.btn-wsp, .nav-bar, .top-bar, #itza-footer, .page-header-area, .navbar-collapse, .navbar-collapse.show, .navbar-toggler, .navbar-nav, .collapse.show, .dropdown-menu.show');
                toHide.forEach(el => {
                    if (isEntering) {
                        // guardamos el inline display previo para poder restaurarlo
                        el.dataset._prevDisplay = el.style.display || '';
                        el.style.display = 'none';
                        el.style.visibility = 'hidden';
                    } else {
                        // restauramos
                        if (el.dataset._prevDisplay !== undefined) el.style.display = el.dataset._prevDisplay;
                        el.style.visibility = '';
                        delete el.dataset._prevDisplay;
                    }
                });
                mapa.invalidateSize();
            }, 300);
    };

    mapa.on('enterFullscreen', () => toggleFS(true));
    mapa.on('exitFullscreen', () => toggleFS(false));

    // Algunos navegadores (iOS Safari) no disparan los eventos del plugin.
    // Observamos cambios en las clases del contenedor del mapa para detectar cuando
    // la clase `leaflet-fullscreen-on` aparece/desaparece y así ejecutar toggleFS.
    const mapContainer = mapa.getContainer();
    try {
        const mo = new MutationObserver(() => {
            const isFs = mapContainer.classList.contains('leaflet-fullscreen-on');
            // Evitamos llamadas repetidas innecesarias
            if (isFs && !document.body.classList.contains('sedes-is-fullscreen')) toggleFS(true);
            if (!isFs && document.body.classList.contains('sedes-is-fullscreen')) toggleFS(false);
        });
        mo.observe(mapContainer, { attributes: true, attributeFilter: ['class'] });
    } catch (e) {
        // si MutationObserver no está disponible (muy raro), fallback a escuchar fullscreenchange
        document.addEventListener('fullscreenchange', () => {
            const isFs = !!(document.fullscreenElement);
            if (isFs) toggleFS(true); else toggleFS(false);
        });
    }

    // Agregamos un listener al control de fullscreen del propio plugin (si existe)
    // para forzar el ocultamiento en navegadores móviles donde los eventos pueden fallar.
    const fsBtn = mapContainer.querySelector('.leaflet-control-fullscreen-button, .leaflet-control-fullscreen a, .leaflet-control-fullscreen');
    if (fsBtn) {
        fsBtn.addEventListener('click', (ev) => {
            const isActive = document.body.classList.contains('sedes-is-fullscreen');
            // invertimos estado esperado (algunas versiones del plugin aplican la clase después)
            toggleFS(!isActive);
            // aseguramos sincronía tras la animación del plugin
            setTimeout(() => {
                const pluginOn = mapContainer.classList.contains('leaflet-fullscreen-on');
                if (pluginOn && !document.body.classList.contains('sedes-is-fullscreen')) toggleFS(true);
                if (!pluginOn && document.body.classList.contains('sedes-is-fullscreen')) toggleFS(false);
            }, 600);
        });
    }
});