document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('equipo-container');
    if (!contenedor) return;

    fetch('data/equipo.json')
        .then(response => response.json())
        .then(equipo => {
            let html = '';
            equipo.forEach(p => {
                const tieneLink = p.linkedin && p.linkedin !== "#";
                
                // Si p.ubicacion está vacío en el JSON, htmlUbicacion será un string vacío
                const htmlUbicacion = p.ubicacion ? `
                    <span class="team-location">
                        <i class="fas fa-map-marker-alt"></i> ${p.ubicacion}
                    </span>` : '';
                
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
                                ${htmlUbicacion}
                            </div>
                        </div>
                    </div>`;
            });
            contenedor.innerHTML = html;

            if (typeof WOW === 'function') {
                new WOW().init();
            }
        })
        .catch(error => console.error('Error cargando equipo:', error));
});