/* =========================================
   CARGA DINÁMICA DE CLIENTES (ITZA)
========================================= */

// Defer the loading of clients until page is idle
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", () => {
        if (typeof requestIdleCallback !== 'undefined') {
            requestIdleCallback(cargarSeccionClientes);
        } else {
            setTimeout(cargarSeccionClientes, 1000);
        }
    });
} else {
    if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(cargarSeccionClientes);
    } else {
        setTimeout(cargarSeccionClientes, 1000);
    }
}

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

        // Usar requestAnimationFrame para evitar forced reflow
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                iniciarSlidersClientes();
            });
        });

    } catch (error) {
        console.error("Error técnico en la carga de clientes:", error);
    }
}

function iniciarSlidersClientes() {
    // Evitar forced reflow: verificar que elementos existan y tengan contenido
    const $textSlider = $('.testimonial-slider');
    const $navSlider = $('.testimonial-slider-nav');
    
    if (!$textSlider.length || !$navSlider.length) return;
    if (!$textSlider.children().length || !$navSlider.children().length) return;
    
    // 1. Slider de textos (Principal)
    $textSlider.slick({
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
        pauseOnHover: true,
        waitForAnimate: false // Mejora el performance
    });

    // 2. Slider de logos (Navegación con Adaptación Móvil)
    $navSlider.slick({
        slidesToShow: 1, 
        centerMode: true,
        centerPadding: '0px',
        focusOnSelect: true,
        asNavFor: '.testimonial-slider',
        arrows: false,
        infinite: true,
        speed: 900,
        cssEase: 'cubic-bezier(0.77, 0, 0.175, 1)',
        waitForAnimate: false, // Mejora el performance
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerPadding: '0px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    speed: 600,
                    centerPadding: '0px'
                }
            }
        ]
    });
}

$(document).ready(function() {
    cargarSeccionClientes();
});