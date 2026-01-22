(function ($) {
    "use strict";

    // Initiate the wowjs
    $(window).on('load', function () {
            if (typeof WOW === 'function') {
                setTimeout(function() {
                    new WOW().init();
                }, 100);
            }
        });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Sticky Navbar
    $(window).scroll(function () {
            if ($(this).scrollTop() > 90) {
                $('.nav-bar').addClass('nav-sticky');
                // Quitamos el .css() de aquí para moverlo a style.css
            } else {
                $('.nav-bar').removeClass('nav-sticky');
            }
    });


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
        $(window).resize(toggleNavbarMethod);
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


    // FIX: Testimonial Slider (Solo se ejecuta si existen los elementos)
    if ($('.testimonial-slider').length && $('.testimonial-slider-nav').length) {
        $('.testimonial-slider').slick({
            infinite: true,
            autoplay: true,
            arrows: true,
            dots: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.testimonial-slider-nav',
            prevArrow: '<button type="button" class="slick-prev" aria-label="Anterior"><i class="fas fa-chevron-left"></i></button>',
            nextArrow: '<button type="button" class="slick-next" aria-label="Siguiente"><i class="fas fa-chevron-right"></i></button>'
        });
        $('.testimonial-slider-nav').slick({
            arrows: false,
            dots: false,
            focusOnSelect: true,
            centerMode: true,
            centerPadding: '22px',
            slidesToShow: 5,
            asNavFor: '.testimonial-slider'
        });
        $('.testimonial .slider-nav').css({"position": "relative", "height": "160px"});
    }


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