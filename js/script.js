document.addEventListener('DOMContentLoaded', () => {

    // Referencias del DOM
    const form = document.getElementById('form-carburante');
    const btnCalcular = document.getElementById('btn-calcular');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const sectionResultados = document.getElementById('resultados');
    const alertaStatus = document.getElementById('alerta-status');

    // Escuchador de eventos para el cálculo
    btnCalcular.addEventListener('click', () => {
        // Capturar y convertir valores
        const reservaInicial = parseFloat(document.getElementById('reserva-inicial').value);
        const consumoDiario = parseFloat(document.getElementById('consumo-diario').value);
        const reabastecimiento = parseFloat(document.getElementById('reabastecimiento').value);
        const nivelCritico = parseFloat(document.getElementById('nivel-critico').value);

        // Validación de campos vacíos o incorrectos
        if (isNaN(reservaInicial) || isNaN(consumoDiario) || isNaN(reabastecimiento) || isNaN(nivelCritico)) {
            alert('Por favor, complete todos los campos numéricos.');
            return;
        }

        if (reservaInicial < 0 || consumoDiario < 0 || reabastecimiento < 0 || nivelCritico < 0) {
            alert('Los valores no pueden ser negativos.');
            return;
        }

        if (nivelCritico >= reservaInicial) {
            alert('El nivel crítico no puede ser igual o mayor a la reserva inicial.');
            return;
        }

        // Cálculos matemáticos
        const consumoNeto = consumoDiario - reabastecimiento;
        const volumenUtil = reservaInicial - nivelCritico;

        let diasRestantes = 0;
        let estadoMensaje = "";
        let colorClase = "";
        let fondoAlerta = "";
        let textoAlerta = "";

        // Análisis lógico según el balance de fluidos
        if (consumoNeto <= 0) {
            // El reabastecimiento es igual o mayor al consumo: la reserva nunca se acaba
            diasRestantes = Infinity;
            document.getElementById('res-dias-restantes').textContent = "Infinitos";
            estadoMensaje = "Sostenible / Seguro";
            fondoAlerta = "#c6f6d5"; // Verde
            textoAlerta = "#22543d";
            colorClase = "#48bb78";
        } else {
            // El consumo es mayor al reabastecimiento: se va a agotar
            diasRestantes = volumenUtil / consumoNeto;
            document.getElementById('res-dias-restantes').textContent = `${diasRestantes.toFixed(1)} días`;

            // Determinación del nivel de riesgo dinámico
            if (diasRestantes > 7) {
                estadoMensaje = "ESTABLE (Más de una semana)";
                fondoAlerta = "#c6f6d5"; // Verde pastel
                textoAlerta = "#22543d";
                colorClase = "#48bb78";
            } else if (diasRestantes <= 7 && diasRestantes > 3) {
                estadoMensaje = "ALERTA (Abastecimiento comprometido)";
                fondoAlerta = "#feebc8"; // Amarillo pastel
                textoAlerta = "#744210";
                colorClase = "#ecc94b";
            } else {
                estadoMensaje = "CRÍTICO (Desabastecimiento inminente)";
                fondoAlerta = "#fed7d7"; // Rojo pastel
                textoAlerta = "#742a2a";
                colorClase = "#f56565";
            }
        }

        // Mostrar resultados en la interfaz
        document.getElementById('res-consumo-neto').textContent = `${consumoNeto} L/día`;
        document.getElementById('res-volumen-util').textContent = `${volumenUtil} L`;
        
        // Modificación de estilos dinámicos del DOM
        alertaStatus.textContent = `DIAGNÓSTICO: El sistema operará en régimen de balance negativo.`;
        if (consumoNeto <= 0) alertaStatus.textContent = `DIAGNÓSTICO: El sistema se encuentra en superávit de reserva.`;
        
        alertaStatus.style.backgroundColor = fondoAlerta;
        alertaStatus.style.color = textoAlerta;

        const totalBox = document.querySelector('.total-box');
        totalBox.style.backgroundColor = fondoAlerta;
        document.getElementById('res-estado-final').textContent = estadoMensaje;
        document.getElementById('res-estado-final').style.color = textoAlerta;

        // Mostrar sección oculta
        sectionResultados.classList.remove('hidden');
        sectionResultados.scrollIntoView({ behavior: 'smooth' });
    });

    // Evento para limpiar el formulario
    btnLimpiar.addEventListener('click', () => {
        form.reset();
        sectionResultados.classList.add('hidden');
    });
});