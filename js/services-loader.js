document.addEventListener("DOMContentLoaded", async function() {
    const container = document.getElementById('services-container');
    if (!container) return;

    const categoria = container.getAttribute('data-categoria');

    try {
        const response = await fetch('data/servicios.json');
        const data = await response.json();
        const servicios = data[categoria];
        if (!servicios || servicios.length === 0) return;

        let htmlContent = '';

        servicios.forEach(s => {
            const imgCard = s.imagen || "";
            const esEnlaceExterno = s.enlace && s.enlace !== "";
            const galleryGroup = s.id; 
            
            // Limpiamos el título de etiquetas HTML para los atributos alt y title
            const cleanTitle = s.titulo.replace(/<[^>]*>?/gm, '');

            let extraPhotosHtml = '';
            // Solo armamos la galería si NO es un enlace externo (como el blog)
            if (s.fotos && s.fotos.length > 0 && !esEnlaceExterno) {
                s.fotos.forEach(foto => {
                    // IMPORTANTE: Solo agregamos el enlace oculto si la foto es DISTINTA 
                    // a la imagen de la tarjeta para evitar duplicados en el Lightbox.
                    if (foto !== imgCard) {
                        extraPhotosHtml += `
                            <a href="${foto}" 
                               data-lightbox="${galleryGroup}" 
                               title="${cleanTitle}" 
                               style="display:none;"></a>`;
                    }
                });
            }

            htmlContent += `
                <div id="${s.id}" class="col-lg-4 col-md-6 col-sm-12 portfolio-item wow fadeInUp" data-wow-delay="${s.delay || '0.1s'}">
                    <div class="portfolio-wrap">
                        <div class="portfolio-img">
                            <img src="${imgCard}" alt="${cleanTitle}" loading="lazy">
                            <div class="portfolio-overlay">
                                <div class="overlay-content" style="padding: 20px; color: white;">
                                    <p>${s.descripcion}</p>
                                </div>
                            </div>
                        </div>
                        <div class="portfolio-text">
                            <h3>${s.titulo}</h3>
                            <div class="actions">
                                <a class="btn" 
                                   href="${esEnlaceExterno ? s.enlace : imgCard}" 
                                   ${esEnlaceExterno ? '' : `data-lightbox="${galleryGroup}"`} 
                                   title="${cleanTitle}" 
                                   aria-label="Ver más sobre ${cleanTitle}">+</a>
                                ${extraPhotosHtml}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        container.innerHTML = htmlContent;

        // Usar requestIdleCallback para inicializar WOW sin bloquear
        if (typeof WOW === 'function') {
            if (typeof requestIdleCallback !== 'undefined') {
                requestIdleCallback(() => new WOW().init());
            } else {
                setTimeout(() => new WOW().init(), 500);
            }
        }
    } catch (error) {
        console.error("Error cargando servicios:", error);
    }
});