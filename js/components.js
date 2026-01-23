/* =========================================
   GESTOR DE COMPONENTES (Footer y Menú)
   ========================================= */

// Usar requestIdleCallback para no bloquear el main thread
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", function() {
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(loadFooter);
        } else {
            setTimeout(loadFooter, 600);
        }
    });
} else {
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(loadFooter);
    } else {
        setTimeout(loadFooter, 600);
    }
}

function loadFooter() {
    const footerHTML = `
    <div class="footer wow fadeIn" data-wow-delay="0.3s">
        <div class="container">
            <div class="row">
                <div class="col-md-6 col-lg-3">
                    <div class="footer-contact">
                        <h2>Contacto</h2>
                        <p><i class="fa fa-map-marker-alt"></i>Pedro Balcar 233, Paraná </p>
                        <p><i class="fa fa-map-marker-alt"></i>Rivadavia 2774, Santa Fe</p>
                        <p><i class="fa fa-phone-alt"></i>+54 9 343 506-6172</p>
                        <p><i class="fa fa-envelope"></i>contacto@itza.com.ar</p>
                        <div class="footer-social">
                            <a href="https://www.instagram.com/itzaingenieria/"><i class="fab fa-instagram"></i></a>
                            <a href="https://www.linkedin.com/company/itza-ingenieria"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="footer-link">
                        <h2>Páginas Principales</h2>
                        <a href="index.html">Inicio</a>
                        <a href="about.html">Nosotros</a>
                        <a href="portfolio.html">Proyectos</a>
                        <a href="contact.html">Contacto</a>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="footer-link">
                        <h2>Áreas de ingeniería</h2>
                        <a href="Agrimensura.html">Agrimensura</a>
                        <a href="RecursosHidricos.html">Recursos Hídricos</a>
                        <a href="Topografia.html">Topografía</a>
                        <a href="Ambiental.html">Ambiental</a>
                        <a href="Civil.html">Ingeniría Civil</a>
                        <a href="Simulacion.html">Simulación Hidráulica</a>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="newsletter">
                        <h2>Newsletter</h2>
                        <p>Recibí periódicamente novedades sobre nuestros servicios</p>
                        <div class="form">
                            <input class="form-control" id="email" placeholder="Email">
                            <button class="btn" onclick="sendEmail()">Enviar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="container copyright">
            <div class="row">
                <div class="col-md-6">
                    <p>&copy; <a href="#">Itza Ingeniería</a>, All Right Reserved.</p>
                </div>
                <div class="col-md-6">
                    <p>Designed By Fabian Minotti</p>
                </div>
            </div>
        </div>
    </div>`;

    // Buscar si existe el contenedor del footer y pegarle el código
    const footerContainer = document.getElementById('itza-footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}