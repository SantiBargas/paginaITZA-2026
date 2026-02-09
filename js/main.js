(function ($) {
    "use strict";

    // Iniciar WOW con configuración liviana para minimizar reflows
    $(window).on('load', function () {
        if (typeof WOW === 'function') {
            // Desactiva mutaciones en vivo y en móviles para reducir cálculos
            setTimeout(function () {
                new WOW({ mobile: false, live: false }).init();
            }, 100);
        }
    });

    // Back to top: evita animaciones jQuery; usa clase + CSS
    (function () {
        var ticking = false;
        function onScroll() {
            var y = window.pageYOffset || document.documentElement.scrollTop;
            var btn = document.querySelector('.back-to-top');
            if (btn) {
                if (y > 200) btn.classList.add('show'); else btn.classList.remove('show');
            }
            // Sticky navbar también aquí para leer scroll una sola vez
            var nav = document.querySelector('.nav-bar');
            if (nav) {
                if (y > 90) nav.classList.add('nav-sticky'); else nav.classList.remove('nav-sticky');
            }
            ticking = false;
        }
        window.addEventListener('scroll', function () {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(onScroll);
            }
        }, { passive: true });
        // Estado inicial
        onScroll();
    })();

    // Scroll reveal for contact blocks (appear and disappear)
    (function () {
        var elements = document.querySelectorAll('.scroll-reveal-left, .scroll-reveal-right');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('is-visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });

        elements.forEach(function (el) { observer.observe(el); });
    })();

    $('.back-to-top').on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 600, 'easeInOutExpo');
        return false;
    });


    // Sticky Navbar manejado junto al back-to-top (ver arriba)


    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        // Debounce de resize para evitar ejecuciones excesivas
        var resizeTimeout;
        $(window).on('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(toggleNavbarMethod, 150);
        });
    });


    // jQuery counterUp
    if ($('[data-toggle="counter-up"]').length) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });

   // Blogs carousel
    if ($(".related-slider").length) {
        $(".related-slider").owlCarousel({
            autoplay: true,
            dots: false,
            loop: true,
            nav : true,
            navText : [
                '<i class="fa fa-angle-left" aria-hidden="true"></i>',
                '<i class="fa fa-angle-right" aria-hidden="true"></i>'
            ],
            responsive: {
                0:{ items:1 },
                576:{ items:1 },
                768:{ items:2 }
            }
        });
    }


    // Portfolio isotope and filter
    if ($('.portfolio-container').length) {
        var portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        $('#portfolio-flters li').on('click', function () {
            $("#portfolio-flters li").removeClass('filter-active');
            $(this).addClass('filter-active');
            portfolioIsotope.isotope({filter: $(this).data('filter')});
        });
    }

    // --- GENERIC FIX PARA ACCESIBILIDAD Y SEO (Centralizado) ---
    $(document).ready(function() {
        const fixAccesibilidad = () => {
            // 1. Fix Lightbox: Evita el error de "Vínculos no rastreables"
            const lbLinks = $('.lb-close, .lb-prev, .lb-next');
            lbLinks.each(function() {
                if (!$(this).attr('href')) {
                    $(this).attr('href', 'javascript:void(0)');
                    $(this).attr('role', 'button');
                    if ($(this).hasClass('lb-close')) $(this).attr('aria-label', 'Cerrar galería');
                }
            });

            // 2. Fix Botones Vacíos: Asegura nombre accesible para botones de slider o iconos
            $('.slick-prev, .slick-next').each(function() {
                if (!$(this).attr('aria-label')) {
                    $(this).attr('aria-label', $(this).hasClass('slick-prev') ? 'Anterior' : 'Siguiente');
                }
            });
        };

        fixAccesibilidad();
        // Ejecutar de nuevo tras un delay por si Lightbox tarda en cargar su DOM
        setTimeout(fixAccesibilidad, 2000);
    });

})(jQuery);



function sendEmail() {
    var email = document.getElementById("email").value;
    if (email === "") {
        alert("Por favor, ingresa tu correo.");
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbyd5VuVx7fdWZAjmHmWkTSKACNqHsTv1YSeVijgjIHVz5cVZueXvVY6ZpI7R97opaXn/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "Success") {
            alert("¡Gracias! Te has suscrito al newsletter.");
            document.getElementById("email").value = ""; // Limpia el campo
        } else {
            alert("Hubo un error, intenta de nuevo.");
        }
    })
    .catch(error => console.error("Error:", error));
}


function sendForm() {
    var name = document.getElementById("name").value;
    var tel = document.getElementById("tel").value;
    var subject = document.getElementById("subject").value;
    var message = document.getElementById("message").value;

    if (name === "" || tel === "" || subject === "" || message === "") {
        alert("Por favor, completa todos los campos.");
        return;
    }

    fetch("https://script.google.com/macros/s/AKfycbwEWHw8qMQv2uKH4lua9xqR_J627yeAtuUgdJIeCuI6Pg1H2TtbDpGETjI1lhU25-z_/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name, tel: tel, subject: subject, message: message })
    })
    .then(response => response.text())
    .then(data => {
        if (data === "Success") {
            alert("¡Mensaje enviado con éxito!");
            document.getElementById("contactForm").reset();
        } else {
            alert("Error al enviar el mensaje, intenta nuevamente.");
        }
    })
    .catch(error => console.error("Error:", error));
}

function loadInstagram() {
    const container = document.getElementById('insta-embed-container');
    const facade = document.getElementById('insta-facade');
    
    // Inyectamos el iframe solo al hacer clic
    const iframeHtml = `
        <iframe 
            src="https://www.instagram.com/itzaingenieria/embed/"
            title="Publicaciones de Instagram de ITZA" 
            loading="lazy"
            scrolling="yes" 
            frameborder="0"
            sandbox="allow-scripts allow-same-origin allow-popups"
            style="width: 100%; height: 600px; display: block;">
        </iframe>`;
    
    container.innerHTML = iframeHtml;
    facade.style.display = 'none'; // Desaparece la fachada
}