document.addEventListener("DOMContentLoaded", () => {
    const contenedor = document.getElementById('contenedor-proyectos');
    const botonesFiltro = document.querySelectorAll('#portfolio-flters li');
    const btnLoadMore = document.getElementById('btn-load-more');
    
    const LIMITE_INICIAL = 3; 
    let todosLosProyectos = [];
    let filtradosGlobal = [];
    let expandido = false;

    fetch('data/proyectos.json')
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el JSON");
            return response.json();
        })
        .then(proyectos => {
            todosLosProyectos = proyectos;
            filtradosGlobal = proyectos;
            renderizarProyectos(filtradosGlobal);
            activarFiltros();
            configurarBotonVerMas();
        })
        .catch(error => console.error('Error cargando proyectos:', error));

    function renderizarProyectos(lista) {
        contenedor.innerHTML = ''; 
        contenedor.style.opacity = '0';
        
        const filtroActivo = document.querySelector('#portfolio-flters .filter-active').getAttribute('data-filter');
        const listaParaDibujar = (filtroActivo === '*' && !expandido) 
            ? lista.slice(0, LIMITE_INICIAL) 
            : lista;

        listaParaDibujar.forEach((proy, index) => {
            const clasesCategorias = proy.categorias.join(' ');
            let htmlGaleriaOculta = '';
        
            if (proy.galeria && proy.galeria.length > 0) {
                proy.galeria.forEach(fotoExtra => {
                    htmlGaleriaOculta += `<a href="${fotoExtra}" data-lightbox="proyecto-${index}" data-title="${proy.titulo}" style="display:none"></a>`;
                });
            }

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

        if (filtroActivo === '*' && lista.length > LIMITE_INICIAL) {
            btnLoadMore.parentElement.style.display = 'block';
        } else {
            btnLoadMore.parentElement.style.display = 'none';
        }

        setTimeout(() => { contenedor.style.opacity = '1'; }, 200);
        
        if (typeof WOW === 'function') { new WOW().init(); }
    }

    function activarFiltros() {
        botonesFiltro.forEach(btn => {
            btn.addEventListener('click', () => {
                botonesFiltro.forEach(b => b.classList.remove('filter-active'));
                btn.classList.add('filter-active');
                
                const filtro = btn.getAttribute('data-filter');
                expandido = false; 
                btnLoadMore.innerText = 'Cargar más';

                if (filtro === '*') {
                    filtradosGlobal = todosLosProyectos;
                } else {
                    filtradosGlobal = todosLosProyectos.filter(p => p.categorias.includes(filtro));
                }
                renderizarProyectos(filtradosGlobal);
            });
        });
    }

    function configurarBotonVerMas() {
        if (!btnLoadMore) return;

        btnLoadMore.addEventListener('click', () => {
            // 1. Cambiamos el estado de expansión
            expandido = !expandido;
            
            // 2. Renderizamos los proyectos (esto actualiza las tarjetas visibles)
            renderizarProyectos(filtradosGlobal);
            
            // 3. Actualizamos el texto del botón según el estado
            btnLoadMore.innerText = expandido ? 'Ver menos' : 'Cargar más';
            
            // 4. LÓGICA DE SCROLL UNIFICADA:
            // Se ejecuta SIEMPRE que se hace clic en el botón.
            const seccionProyectos = document.querySelector('.portfolio');
            if (seccionProyectos) {
                const offset = seccionProyectos.offsetTop - 80; 
                
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    }
});