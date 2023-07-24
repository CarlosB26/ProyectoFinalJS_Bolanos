//selectores para indexar con HTML
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotal = document.querySelector("#totalCarrito");
const formBuscar = document.querySelector("#formBuscar");
const inputBuscar = document.querySelector("#inputBuscar");
const carritoCont = document.querySelector("#cart-count");

// Simulador de base de BaseDeDatos, se cargaran los productos del ecoomerce en esta seccion
class BaseDeDatos {
    //llamo el constructor y agrego los registros aqui
    constructor() {
        this.productos = [];

    }

    //devuelve el registro de los productos
    async returnRegistros() {
      const response = await fetch("json/productos.json");
      this.productos = await response.json();
      return this.productos;
    }
    //devuelve un producto buscado por id
    registroId(id) {
        return this.productos.find((producto) => producto.id === id);
    }

    registroPorNombre(palabra){
      return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra))
    }
}

class Carrito{
  constructor(){
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;
    this.listar();
  }

  inCarrito({ id }){
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto){
    let productoCarrito = this.inCarrito(producto);
    if(productoCarrito){
      //sumar
      productoCarrito.cantidad++;
    }else{
      //agregar al carrito
      this.carrito.push({...producto, cantidad: 1});

    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  quitar(id){
    const ind = this.carrito.findIndex((producto) => producto.id === id);

    if(this.carrito[ind].cantidad > 1){
      this.carrito[ind].cantidad--;
    }else{
      this.carrito.splice(ind, 1);
    }
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    this.listar();
  }

  listar(){
    this.total = 0;
    this.totalProductos = 0;
    divCarrito.innerHTML = "";
    for(const producto of this.carrito){
      divCarrito.innerHTML += `
        <div class="container producto card mb-2" id="carritoFondo" >
          <h2>${producto.nombre}</h2>
          <p>${producto.precio} COP</p>
          <p>Cantidad: ${producto.cantidad}</p>
          <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar</a>
        </div>
      `;
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }

    //boton quitar
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const botonDelete of botonesQuitar){
        botonDelete.addEventListener("click", (event) => {
        event.preventDefault();
        Toastify({
          text: "Quitado del carrito",
          duration: 2000,
          newWindow: true,
          close: true,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
          style: {
            background: "linear-gradient(to right, #FE2C55, #25F4EE)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
        this.quitar(Number(botonDelete.dataset.id));
        } )
      }
      //Actualizar variables
      spanCantidadProductos.innerText =`(` + this.totalProductos + `)`;
      spanTotal.innerText = `$` + this.total + ` COP`;
      carritoCont.innerText = this.totalProductos;

    }
  }


// Molde para los productos
class Producto {
    constructor(id, nombre, precio, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
    }
}

// inicio de la base de datos
const bdd = new BaseDeDatos();

bdd.returnRegistros().then((productos) => cargarProductos(productos));

// muestra los registros de la BDD simualda en el index
function cargarProductos(productos) {
  let productosHTML = '';

  for (const producto of productos) {
    productosHTML += `
      <div class="producto card mb-3" style="width: 500px"
      id="cardFondo">
        <div class="container-fluid d-flex flex-column align-items-center">
          <h2>${producto.nombre}</h2>
          <img id="imgPro-${producto.id}" src="multimedia/${producto.imagen}" width="250" height="350"/>
          <p>$${producto.precio} COP</p>
          <p><a href="#" class="btnBuy m-3" data-id="${producto.id}">Buy</a><a class="btnSee" href="#">See TikTok</a></p>
        </div>
      </div>
    `;


  divProductos.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="flex-column">
        ${productosHTML}
      </div>
    </div>
  `;
  }

  // botones buy
  const botonBuy = document.querySelectorAll(".btnBuy");
  for(const boton of botonBuy){
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      const id = Number(boton.dataset.id);
      const producto = bdd.registroId(id);
      carrito.agregar(producto)
      Toastify({
        text: "Agregado al carrito",
        duration: 2000,
        close: false,
        newWindow: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #FE2C55, #25F4EE)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    } )
  }
}

// buscador
inputBuscar.addEventListener("keyup", (event)=>{
  event.preventDefault();
  const palabra = inputBuscar.value;
  cargarProductos(bdd.registroPorNombre(palabra.toLowerCase()))
})

//objeto carrito
const carrito = new Carrito();

const cartIcon = document.getElementById('cart-icon');
const cartContent = document.getElementById('cart-content');

// Agregar evento de clic al ícono del carrito
cartIcon.addEventListener('click', function() {
  // Alternar la clase 'hidden' para mostrar o ocultar el contenido del carrito
  cartContent.classList.toggle('hidden');
});




