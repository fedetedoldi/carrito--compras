/* TIENDA DE BEBIDAS ONLINE */

class Bebida {
    constructor(id, nombre, precio, imagen) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
    }
}

/* CATÁLOGO */
const vinoTinto = new Bebida(1, "Vino Tinto", 1200, "recursos/tinto.jpg");
const vinoBlanco = new Bebida(2, "Vino Blanco", 900, "recursos/blanco.jpg");
const vinoRosado = new Bebida(3, "Vino Rosado", 750, "recursos/rosado.jpg");
const cerveza = new Bebida(4, "Cerveza", 220, "recursos/cerveza.jpg");
const gin = new Bebida(5, "Gin", 3400, "recursos/gin.jpg");
const vodka = new Bebida(6, "Vodka", 2100, "recursos/vodka.jpg");
const campari = new Bebida(7, "Campari", 1500, "recursos/campari.jpg");
const ron = new Bebida(8, "Ron", 3000, "recursos/ron.jpg");

/* ARRAY DEL CATÁLOGO */
const bebidas = [vinoTinto, vinoBlanco, vinoRosado, cerveza, gin, vodka, campari, ron];

/* ARRAY DEL CARRITO */
let carritoCompras = [];
if(localStorage.getItem("carritoCompras")) {
    carritoCompras = JSON.parse(localStorage.getItem("carritoCompras"));
}

//Modificación del DOM
const contenedorBebidas = document.getElementById("contenedorBebidas");

//Función para mostrar bebidas
const mostrarBebidas = () => {
    bebidas.forEach((bebida) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card text-center">
                <img src="${bebida.imagen}" class="card-img-top imgSize img-thumbnail" alt="${bebida.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${bebida.nombre}</h5>
                    <p class="card-text">$ ${bebida.precio}</p>
                    <button class="btn btn-light" id="botonMenos${bebida.id}"> - </button> <span class="card-text"> Cantidad: ${bebida.cantidad} </span> <button class="btn btn-light" id="botonMas${bebida.id}"> + </button>
                    <button class="btn btn-primary" id="boton${bebida.id}">Agregar al carrito</button>
                </div>
            </div>
        `
        contenedorBebidas.appendChild(card);
        
        //Agregar los productos al carrito
        const boton = document.getElementById(`boton${bebida.id}`);
        boton.addEventListener("click", () => {
            Toastify({
                text: "Producto agregado al carrito",
                duration: 3000,
                gravity: "bottom",
                position: "right",
                style:
                {
                    background: "linear-gradient(to right, #00b09b, #1B3A8C)",
                }
            }).showToast(),
            agregarAlCarrito(bebida.id)
        })
    })
}

//Función para agregar al carrito
const agregarAlCarrito = (id) => {
    const bebida = bebidas.find((bebida) => bebida.id === id);
    const bebidaEnCarrito = carritoCompras.find((bebida) => bebida.id === id);
    if(bebidaEnCarrito){
        bebidaEnCarrito.cantidad++;
    }else {
        carritoCompras.push(bebida);
        localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
    }
    calcularTotal();
}

mostrarBebidas();

//Mostrar el carrito
const contenedorCarrito = document.getElementById("contenedorCarrito");

const verCarrito = document.getElementById("verCarrito");

verCarrito.addEventListener("click", () => {
    mostrarCarrito();
});

//Función para mostrar el carrito
const mostrarCarrito = () => {
    contenedorCarrito.innerHTML="";
    carritoCompras.forEach((bebida) => {
        const card = document.createElement("div");
        card.classList.add("col-xl-3", "col-md-6", "col-xs-12");
        card.innerHTML = `
            <div class="card">
                <img src="${bebida.imagen}" class="card-img-top imgSize" alt="${bebida.nombre}">
                <div class="card-body">
                    <h5 class="card-title">${bebida.nombre}</h5>
                    <p class="card-text">${bebida.cantidad}</p>
                    <p class="card-text">$ ${bebida.precio}</p>
                    <button class="btn btn-primary" id="eliminar${bebida.id}">Eliminar bebida</button>
                </div>
            </div>
        `
        contenedorCarrito.appendChild(card);

        //Eliminar los productos del carrito
        const boton = document.getElementById(`eliminar${bebida.id}`);
        boton.addEventListener("click", () => {
            eliminarDelCarrito(bebida.id);
        })
    })
    calcularTotal();
}

//Función para eliminar del carrito
const eliminarDelCarrito = (id) => {
    const bebida = carritoCompras.find((bebida) => bebida.id === id);
    const indice = carritoCompras.indexOf(bebida);
    carritoCompras.splice(indice, 1);
    mostrarCarrito();
    localStorage.setItem("carritoCompras", JSON.stringify(carritoCompras));
}

//Vaciar carrito + función
const vaciarCarrito = document.getElementById("vaciarCarrito");
vaciarCarrito.addEventListener("click", () => {
    Swal.fire({
        title: "¿Estás seguro de vaciar el carrito?",
        text: "¡El carrito quedará vacío!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
    }).then((result) => {
        if(result.isConfirmed) {
            Swal.fire(
                "¡Perfecto!",
                "El carrito se ha vaciado correctamente.",
                "success"
            )
            eliminarTodo();
        }
    })
})

const eliminarTodo = () => {
    carritoCompras = [];
    mostrarCarrito();
    localStorage.clear();
}

//Total compra
const total = document.getElementById("total");
const calcularTotal = () => {
    let totalCompra = 0;
    carritoCompras.forEach((bebida) => {
        totalCompra += bebida.precio * bebida.cantidad;
    })
    total.innerHTML = `Total= $${totalCompra}`;
}