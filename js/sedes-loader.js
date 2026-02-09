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
                <button id="btn-toggle-sedes" class="toggle-sidebar-btn" style="background:none; border:1px solid white; color:white; font-size:10px; padding:2px 5px; cursor:pointer;">Ocultar</button>
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
        setTimeout(() => mapa.invalidateSize(), 300);
    };

    mapa.on('enterFullscreen', () => toggleFS(true));
    mapa.on('exitFullscreen', () => toggleFS(false));
});