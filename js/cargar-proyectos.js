document.addEventListener("DOMContentLoaded", () => {
    // 1. Elementos del DOM
    const contenedor = document.getElementById('contenedor-proyectos');
    const botonesFiltro = document.querySelectorAll('#portfolio-flters li');

    // 2. Cargar datos del JSON
    fetch('data/proyectos.json')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el JSON");
            return response.json();
        })
        .then(proyectos => {
            renderizarProyectos(proyectos);
            activarFiltros(proyectos);
        })
        .catch(error => console.error('Error cargando proyectos:', error));

    // 3. Función para dibujar las tarjetas
    function renderizarProyectos(lista) {
        contenedor.innerHTML = ''; 
        contenedor.style.opacity = '0';
        
        lista.forEach((proy, index) => {
            const clasesCategorias = proy.categorias.join(' ');
            let htmlGaleriaOculta = '';
        
            if (proy.galeria && proy.galeria.length > 0) {
                proy.galeria.forEach(fotoExtra => {
                    // Importante: Usamos el MISMO data-lightbox que el botón principal
                    htmlGaleriaOculta += `<a href="${fotoExtra}" data-lightbox="proyecto-${index}" data-title="${proy.titulo}" style="display:none"></a>`;
                });
            }
            // ------------------------------------------------------------------

        const html = `
                <div class="col-lg-4 col-md-6 col-sm-12 portfolio-item wow fadeInUp ${clasesCategorias}" data-wow-delay="0.1s">
                    <div class="portfolio-wrap">
                        <div class="portfolio-img">
                            <img src="${proy.imagen}" alt="${proy.titulo}" loading="lazy">
                            <div class="portfolio-overlay">
                                
                                <div class="overlay-content">
                                    <p style="margin-bottom: 15px;">${proy.descripcion}</p>
                                    
                                    <div style="border-top: 1px solid rgba(255,255,255,0.4); padding-top: 10px; width: 80%; margin: 0 auto;">
                                        <p style="font-size: 13px; color: #ffce00; margin: 0; font-weight: 600;">
                                            <i class="fas fa-map-marker-alt"></i> ${proy.ubicacion}
                                        </p>
                                    </div>
                                    
                                </div>

                            </div>
                        </div>
                        <div class="portfolio-text">
                            <h3>${proy.titulo}</h3>
                            
                            <a class="btn" href="${proy.imagen}" data-lightbox="proyecto-${index}" title="${proy.titulo}">+</a>
                            
                            ${htmlGaleriaOculta}
                            
                        </div>
                    </div>
                </div>
            `;
            contenedor.innerHTML += html;
        });

        setTimeout(() => { contenedor.style.opacity = '1'; }, 200);
    }

    // 4. Filtros
    function activarFiltros(todosLosProyectos) {
        botonesFiltro.forEach(btn => {
            btn.addEventListener('click', () => {
                botonesFiltro.forEach(b => b.classList.remove('filter-active'));
                btn.classList.add('filter-active');
                const filtro = btn.getAttribute('data-filter');
                
                if (filtro === '*') {
                    renderizarProyectos(todosLosProyectos);
                } else {
                    const filtrados = todosLosProyectos.filter(p => p.categorias.includes(filtro));
                    renderizarProyectos(filtrados);
                }
            });
        });
    }
});