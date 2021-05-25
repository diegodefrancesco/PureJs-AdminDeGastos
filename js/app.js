// Variables y selectores

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();

    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total, gasto) => total += gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo, duracion=1){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        if (duracion){
            setTimeout(() => {
                divMensaje.remove();
            }, 2000);
        }
    }

    imprimirListadoGastos(gastos){
        //console.log(gastos);
        // Iterar sobre los gastos
        gastoListado.textContent = "";
        gastos.forEach(gasto => {
            const {nombre, cantidad, id} = gasto;

            // Crear un LI
            const liGasto = document.createElement('li');
            liGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //liGasto.setAttribute('data-id', id);
            liGasto.dataset.id = id;

            // Agregar el HTML del gasto
            liGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> $ ${cantidad} </span>`;

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML = `Borrar &times`
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            liGasto.appendChild(btnBorrar);

            // Agregar al HTML
            gastoListado.appendChild(liGasto);
        })
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if( (presupuesto / 4) > restante ){
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ( (presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success','alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        formulario.querySelector('button[type="submit"]').disabled = false;

        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error')
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }

}

// Eventos

(function (){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
})(); // funcion eventListeners autoejecutable

// Instanciar

const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = 500; //prompt('¿Cúal es tu presupuesto?');
    
    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto (e){
    e.preventDefault();
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }

    // Generar un objeto con los datos del gasto
    const gasto = {nombre, cantidad, id: Date.now()};

    // Agregar el gasto al presupuesto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado correctamente');

    // Imprimir los gastos
    const {gastos, restante} = presupuesto;

    ui.imprimirListadoGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    // Reinicia el formulario
    formulario.reset();
}

function eliminarGasto(id){
    // Elimina los gastos en la clase
    presupuesto.eliminarGasto(id);

    // Elimina los gastos en el HTML
    const { gastos, restante } = presupuesto;
    ui.imprimirListadoGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}