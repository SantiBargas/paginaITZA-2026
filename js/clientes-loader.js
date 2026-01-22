/* =========================================
   CARGA DINÁMICA DE CLIENTES (ITZA)
========================================= */
async function cargarSeccionClientes() {
    try {
        const response = await fetch('data/clientes.json');
        const clientes = await response.json();

        const $navContainer = $('.testimonial-slider-nav');
        const $textContainer = $('.testimonial-slider');

        if (!$navContainer.length || !$textContainer.length) return;

        $navContainer.empty();
        $textContainer.empty();

        clientes.forEach(cliente => {
            $navContainer.append(`
                <div class="slider-nav">
                    <img src="${cliente.img}" alt="${cliente.alt}" loading="lazy" decoding="async">
                </div>
            `);

            $textContainer.append(`
                <div class="slider-item">
                    <h3>${cliente.nombre}</h3>
                    <h4>${cliente.lugar}</h4>
                </div>
            `);
        });

        setTimeout(iniciarSlidersClientes, 150);

    } catch (error) {
        console.error("Error técnico en la carga de clientes:", error);
    }
}

function iniciarSlidersClientes() {
    // 1. Slider de textos (Principal)
    $('.testimonial-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 900,
        slidesToShow: 1,
        asNavFor: '.testimonial-slider-nav',
        dots: true,
        arrows: true,
        fade: true,
        cssEase: 'ease-in-out',
        pauseOnHover: true // Detiene el giro si el usuario lee un testimonio
    });

    // 2. Slider de logos (Navegación con Adaptación Móvil)
    $('.testimonial-slider-nav').slick({
        slidesToShow: 1, 
        centerMode: true,
        centerPadding: '0px',
        focusOnSelect: true,
        asNavFor: '.testimonial-slider',
        arrows: false,
        infinite: true,
        speed: 900,
        cssEase: 'cubic-bezier(0.77, 0, 0.175, 1)',
        responsive: [
            {
                breakpoint: 768, // Tablets y celulares grandes
                settings: {
                    centerPadding: '0px',
                    slidesToShow: 1 // Mantenemos el foco central
                }
            },
            {
                breakpoint: 480, // Celulares pequeños
                settings: {
                    speed: 600, // Un poco más rápido en móvil para mayor agilidad
                    centerPadding: '0px'
                }
            }
        ]
    });
}

$(document).ready(function() {
    cargarSeccionClientes();
});