// Clase Carta
class Carta {
    constructor(emoji) {
        this.emoji = emoji;
        this.estado = 'oculta'; // 'oculta', 'revelada', 'descubierta'
        this.elemento = null;
    }

    revelar() {
        this.estado = 'revelada';
        if (this.elemento) {
            this.elemento.classList.add('revelada');
        }
    }

    ocultar() {
        this.estado = 'oculta';
        if (this.elemento) {
            this.elemento.classList.remove('revelada');
        }
    }

    descubrir() {
        this.estado = 'descubierta';
        if (this.elemento) {
            this.elemento.classList.add('coincidencia');
        }
    }

    estaDescubierta() {
        return this.estado === 'descubierta';
    }

    estaOculta() {
        return this.estado === 'oculta';
    }

    crearElemento(indice) {
        const button = document.createElement('button');
        button.className = 'carta';
        button.dataset.indice = indice;
        
        
        const front = document.createElement('div');
        front.className = 'carta-face carta-front';
        front.textContent = this.emoji;

        const back = document.createElement('div');
        back.className = 'carta-face carta-back';

        button.appendChild(front);
        button.appendChild(back);

        button.addEventListener('click', () => this.onClickCarta(indice));
        this.elemento = button;
        return button;
    }

    onClickCarta(indice) {
        juego.seleccionarCarta(indice);
    }
}

// Clase Juego 
class Juego {
    constructor() {
        this.cartas = [];
        this.cartasSeleccionadas = [];
        this.paresEncontrados = 0;
        this.movimientos = 0;
        this.tiempoSegundos = 0;
        this.bloqueado = false;
        this.intervaloTiempo = null;
        this.totalPares = 12; 
        this.emojis = this.obtenerDiccionarioEmojis();
    }

    obtenerDiccionarioEmojis() {
        
        return [
            '🚀', '🎨', '🎮', '🍕', '🌮', '🎸', '🌈', '🍦', '🦁', '🦉',
            '🥑', '⚽', '🔭', '💎', '💡', '🔥', '🌊', '🍀', '🍓', '🍩',
            '🎭', '🛸', '🐘', '🐧', '🍄', '🌻', '🚲', '⚓', '🎬', '🧩',
            '🦁', '🐯', '🦊', '🐱', '🐶', '🐭', '🐹', '🐰', '🐻', '🐼',
            '🐨', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅'
        ];
    }

    inicializar(numPares = this.totalPares) {
        this.detenerCronometro();
        this.totalPares = parseInt(numPares);
        this.cartas = [];
        this.cartasSeleccionadas = [];
        this.paresEncontrados = 0;
        this.movimientos = 0;
        this.tiempoSegundos = 0;
        this.bloqueado = false;

        // Ocultar modal de dificultad si esta abierto
        document.getElementById('modalDificultad').classList.add('hidden');
        document.getElementById('modalFinJuego').classList.add('hidden');

        // Limitar totalPares al numero de emojis disponibles
        if (this.totalPares > this.emojis.length) {
            this.totalPares = this.emojis.length;
        }

        // Crear pares de emojis
        const paresEmojis = [];
        for (let i = 0; i < this.totalPares; i++) {
            paresEmojis.push(this.emojis[i], this.emojis[i]);
        }

        // Mezclar los emojis
        this.mezclarArray(paresEmojis);

        // Crear cartas
        this.cartas = paresEmojis.map(emoji => new Carta(emoji));

        this.renderizarTablero();
        this.actualizarEstadisticas();
        this.iniciarCronometro();
    }

    mezclarArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    renderizarTablero() {
        const tablero = document.getElementById('tablero');
        tablero.innerHTML = '';
        this.cartas.forEach((carta, i) => {
            tablero.appendChild(carta.crearElemento(i));
        });
    }

    seleccionarCarta(indice) {
        const carta = this.cartas[indice];

        if (
            this.bloqueado || 
            !carta.estaOculta() || 
            this.cartasSeleccionadas.some(c => c.indice === indice)
        ) {
            return;
        }

        carta.revelar();
        this.cartasSeleccionadas.push({ indice, carta });

        if (this.cartasSeleccionadas.length === 2) {
            this.movimientos++;
            this.verificarCoincidencia();
        }
    }

    verificarCoincidencia() {
        this.bloqueado = true;
        this.actualizarEstadisticas();

        const [obj1, obj2] = this.cartasSeleccionadas;

        if (obj1.carta.emoji === obj2.carta.emoji) {
            setTimeout(() => {
                obj1.carta.descubrir();
                obj2.carta.descubrir();
                this.paresEncontrados++;
                this.actualizarEstadisticas();
                this.cartasSeleccionadas = [];
                this.bloqueado = false;

                if (this.paresEncontrados === this.totalPares) {
                    this.terminarJuego();
                }
            }, 600);
        } else {
            setTimeout(() => {
                obj1.carta.ocultar();
                obj2.carta.ocultar();
                this.cartasSeleccionadas = [];
                this.bloqueado = false;
            }, 1000);
        }
    }

    actualizarEstadisticas() {
        document.getElementById('paresEncontrados').textContent = this.paresEncontrados;
        document.getElementById('totalPares').textContent = this.totalPares;
        document.getElementById('movimientos').textContent = this.movimientos;
        document.getElementById('tiempo').textContent = this.formatearTiempo(this.tiempoSegundos);
    }

    iniciarCronometro() {
        this.intervaloTiempo = setInterval(() => {
            this.tiempoSegundos++;
            document.getElementById('tiempo').textContent = this.formatearTiempo(this.tiempoSegundos);
        }, 1000);
    }

    detenerCronometro() {
        if (this.intervaloTiempo) {
            clearInterval(this.intervaloTiempo);
        }
    }

    formatearTiempo(totalSegundos) {
        const minutos = Math.floor(totalSegundos / 60);
        const segundos = totalSegundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    terminarJuego() {
        this.detenerCronometro();
        const modal = document.getElementById('modalFinJuego');
        modal.classList.remove('hidden');
    }

    mostrarSeleccionDificultad() {
        this.detenerCronometro();
        document.getElementById('modalFinJuego').classList.add('hidden');
        document.getElementById('modalDificultad').classList.remove('hidden');
    }

    reiniciar() {
        this.inicializar(this.totalPares);
    }
}

let juego;

document.addEventListener('DOMContentLoaded', () => {
    juego = new Juego();
    
    // botones de dificultad
    const botonesDiff = document.querySelectorAll('.btn-diff');
    botonesDiff.forEach(btn => {
        btn.addEventListener('click', () => {
            const pares = btn.dataset.pares;
            juego.inicializar(pares);
        });
    });

    document.getElementById('botonReiniciar').addEventListener('click', () => {
        juego.reiniciar();
    });

    document.getElementById('botonCambiarDificultad').addEventListener('click', () => {
        juego.mostrarSeleccionDificultad();
    });
});
