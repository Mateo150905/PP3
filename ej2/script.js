
// API: https://dolarapi.com/v1/dolares

document.addEventListener('DOMContentLoaded', () => {
    const arsInput = document.getElementById('ars-amount');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultsGrid = document.getElementById('results-grid');
    const errorMessage = document.getElementById('error-message');
    const lastUpdateElement = document.getElementById('last-update');

    let currentRates = [];

    // 1. fetch
    async function fetchRates() {
        showLoading(true);
        hideError();

        try {
            const response = await fetch('https://dolarapi.com/v1/dolares');
            if (!response.ok) throw new Error('Error al conectar con la API');
            
            const data = await response.json();
            
            // dolares
            currentRates = data.filter(dolar => 
                ['oficial', 'blue', 'bolsa'].includes(dolar.casa)
            );

            // reordenar
            const order = ['oficial', 'blue', 'bolsa'];
            currentRates.sort((a, b) => order.indexOf(a.casa) - order.indexOf(b.casa));

            renderCards(currentRates);
            updateLastUpdateTime(currentRates[0].fechaActualizacion);
            
        } catch (error) {
            console.error('Fetch Error:', error);
            showError('No se pudo obtener la cotización. Intente más tarde.');
            resultsGrid.innerHTML = ''; // Clear loading state
        } finally {
            showLoading(false);
        }
    }

    // 2. render cards
    function renderCards(rates) {
        resultsGrid.innerHTML = '';
        
        rates.forEach(rate => {
            const card = document.createElement('div');
            card.className = 'dollar-card';
            card.dataset.casa = rate.casa;
            
            const badgeClass = `badge-${rate.casa}`;
            const displayName = rate.casa === 'bolsa' ? 'MEP' : rate.nombre;

            card.innerHTML = `
                <div class="card-header">
                    <h3>Dólar ${displayName}</h3>
                    <span class="badge ${badgeClass}">${displayName}</span>
                </div>
                <div class="rates-row">
                    <div class="rate-item">
                        <span class="rate-label">Compra</span>
                        <div class="rate-value">$${formatNumber(rate.compra)}</div>
                    </div>
                    <div class="rate-item">
                        <span class="rate-label">Venta</span>
                        <div class="rate-value">$${formatNumber(rate.venta)}</div>
                    </div>
                </div>
                <div class="calculated-row">
                    <div class="calc-box">
                        <span class="calc-label">Comprás (al valor venta):</span>
                        <div class="calc-result" id="result-venta-${rate.casa}">- <span>USD</span></div>
                    </div>
                    <div class="calc-box">
                        <span class="calc-label">Vendes (al valor compra):</span>
                        <div class="calc-result" id="result-compra-${rate.casa}">- <span>USD</span></div>
                    </div>
                </div>
            `;
            resultsGrid.appendChild(card);
        });
    }

    // 3. logica
    function performCalculation() {
        const amount = parseFloat(arsInput.value);
        
        // validaciones
        if (!arsInput.value.trim()) {
            showError('Por favor, ingrese un monto en pesos.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            showError('Por favor, ingrese un monto válido mayor a cero.');
            return;
        }

        hideError();

        currentRates.forEach(rate => {
            // formula: dolares = pesos / cotizacion
            const resultCompra = amount / rate.compra;
            const resultVenta = amount / rate.venta;

            const resCompraEl = document.getElementById(`result-compra-${rate.casa}`);
            const resVentaEl = document.getElementById(`result-venta-${rate.casa}`);

            if (resCompraEl) resCompraEl.innerHTML = `${formatUSD(resultCompra)} <span>USD</span>`;
            if (resVentaEl) resVentaEl.innerHTML = `${formatUSD(resultVenta)} <span>USD</span>`;
        });
    }

    // helpers
    function formatNumber(num) {
        return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatUSD(num) {
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateLastUpdateTime(isoDate) {
        const date = new Date(isoDate);
        const options = { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' };
        lastUpdateElement.textContent = `Última actualización: ${date.toLocaleString('es-AR', options)}hs`;
    }

    function showLoading(isLoading) {
        if (isLoading) {
            calculateBtn.disabled = true;
            calculateBtn.style.opacity = '0.7';
            calculateBtn.querySelector('span').textContent = 'Cargando...';
        } else {
            calculateBtn.disabled = false;
            calculateBtn.style.opacity = '1';
            calculateBtn.querySelector('span').textContent = 'Calcular Conversión';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        arsInput.classList.add('error-border'); // Optional highlight if we add it to CSS
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    // event
    calculateBtn.addEventListener('click', performCalculation);
    
    // calcular con enter
    arsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performCalculation();
    });

    // inicializar
    fetchRates();
});
