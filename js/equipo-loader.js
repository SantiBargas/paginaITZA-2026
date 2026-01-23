document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('equipo-container');
    let equipoGlobal = [];
    let expandido = false;

    if (!contenedor) return;

    // 1. Carga de datos
    fetch('data/equipo.json')
        .then(response => response.json())
        .then(data => {
            equipoGlobal = data;
            renderizarEquipo();
        })
        .catch(error => console.error('Error cargando equipo:', error));

    // 2. Función de Renderizado (Igual a tu lógica de Portfolio)
    function renderizarEquipo() {
        const limite = 8;
        const visible = expandido ? equipoGlobal : equipoGlobal.slice(0, limite);
        
        let html = '';
        visible.forEach(p => {
            const tieneLink = p.linkedin && p.linkedin !== "#";
            html += `
                <div class="col-lg-3 col-md-6 col-6 wow fadeInUp" data-wow-delay="${p.delay}">
                    <div class="team-item">
                        <div class="team-img">
                            <img src="${p.foto}" alt="${p.nombre}" loading="lazy">
                            <div class="team-social">
                                <a href="${tieneLink ? p.linkedin : '#'}" target="_blank">
                                    <i class="fab fa-linkedin-in"></i>
                                </a>
                            </div>
                        </div>
                        <div class="team-text">
                            <h2>${p.nombre}</h2>
                            <p>${p.cargo}</p>
                            ${p.ubicacion ? `<span class="team-location"><i class="fas fa-map-marker-alt"></i> ${p.ubicacion}</span>` : ''}
                        </div>
                    </div>
                </div>`;
        });

        // Insertamos el botón si hay más de 8 personas
        if (equipoGlobal.length > 8) {
            html += `
                <div class="col-12 text-center mt-4">
                    <button id="btn-team-load" class="btn-load-more-style">
                        ${expandido ? 'Ver menos' : 'Cargar más'}
                    </button>
                </div>`;
        }

        contenedor.innerHTML = html;
        configurarBotonEquipo();
        
        if (typeof WOW === 'function') new WOW().init();
    }

    // 3. Lógica de Botón y Scroll (Tu referencia de Proyecto)
    function configurarBotonEquipo() {
        const btn = document.getElementById('btn-team-load');
        if (!btn) return;

        btn.addEventListener('click', () => {
            expandido = !expandido;
            renderizarEquipo();

            // Lógica de scroll unificada
            const seccionTeam = document.querySelector('.team');
            if (seccionTeam) {
                const offset = seccionTeam.offsetTop - 80; 
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    }
});