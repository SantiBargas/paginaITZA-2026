document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('stats-container');
    if (!container) return;

    fetch('data/stats.json')
        .then(response => response.json())
        .then(stats => {
            // Dividimos las estadísticas en dos bloques (izquierdo y derecho) 
            // para mantener tu diseño original de 2 y 2
            const leftStats = stats.slice(0, 2);
            const rightStats = stats.slice(2, 4);

            let html = `
                <div class="col-md-6 fact-left wow slideInLeft">
                    <div class="row">
                        ${renderStatItems(leftStats)}
                    </div>
                </div>
                <div class="col-md-6 fact-right wow slideInRight">
                    <div class="row">
                        ${renderStatItems(rightStats)}
                    </div>
                </div>`;

            container.innerHTML = html;

            // ACTIVACIÓN DE ANIMACIONES
            // 1. Iniciamos WOW para el deslizamiento lateral
            if (typeof WOW === 'function') { new WOW().init(); }

            // 2. Iniciamos CounterUp para el conteo de números
            $('[data-toggle="counter-up"]').counterUp({
                delay: 10,
                time: 2000
            });
        })
        .catch(error => console.error('Error cargando estadísticas:', error));

    function renderStatItems(items) {
        return items.map(item => `
            <div class="col-6">
                <div class="fact-icon"><i class="${item.icono}"></i></div>
                <div class="fact-text">
                    <h2 data-toggle="counter-up">${item.numero}</h2>
                    <p>${item.texto}</p>
                </div>
            </div>
        `).join('');
    }
});