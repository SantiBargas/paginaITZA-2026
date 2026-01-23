document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('stats-container');
    if (!container) return;

    fetch('data/stats.json')
        .then(response => response.json())
        .then(stats => {
            const leftStats = stats.slice(0, 2);
            const rightStats = stats.slice(2, 4);

            // 1. ESCRITURA ÚNICA: Inyectamos todo el HTML de una vez
            container.innerHTML = `
                <div class="col-md-6 fact-left wow slideInLeft">
                    <div class="row">${renderStatItems(leftStats)}</div>
                </div>
                <div class="col-md-6 fact-right wow slideInRight">
                    <div class="row">${renderStatItems(rightStats)}</div>
                </div>`;

            // 2. ACTIVACIÓN EFICIENTE
            if (typeof WOW === 'function') { new WOW().init(); }
            
            // Reemplazamos CounterUp por nuestra lógica optimizada
            iniciarContadoresOptimizados();
        })
        .catch(error => console.error('Error cargando estadísticas:', error));

    function renderStatItems(items) {
        return items.map(item => `
            <div class="col-6">
                <div class="fact-icon"><i class="${item.icono}"></i></div>
                <div class="fact-text">
                    <h2 class="itza-counter" data-target="${item.numero}">0</h2>
                    <p>${item.texto}</p>
                </div>
            </div>`).join('');
    }

    function iniciarContadoresOptimizados() {
        // Usamos IntersectionObserver para evitar calcular posiciones manualmente (Reflow)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'));
                    animateValue(el, 0, target, 2000);
                    observer.unobserve(el); // Dejamos de observar una vez que animó
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.itza-counter').forEach(counter => observer.observe(counter));
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
});