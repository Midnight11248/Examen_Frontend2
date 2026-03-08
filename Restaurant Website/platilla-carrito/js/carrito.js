const API_PRODUCTOS = "http://localhost:3000/api/productos";
const API_PEDIDOS = "http://localhost:3000/api/pedidos";

/* =========================
ESTADO DEL CARRITO
========================= */

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


/* =========================
ACTUALIZAR CONTADOR
========================= */

function actualizarContadorCarrito(){

let cantidad = 0;

carrito.forEach(p=>{
cantidad += p.cantidad;
});

const contador = document.querySelector(".contar-pro");

if(contador){
contador.innerText = cantidad;
}

}

actualizarContadorCarrito();


/* =========================
CARGAR PRODUCTOS (INDEX)
========================= */

async function cargarProductos(){

const contenedor = document.getElementById("productos");

if(!contenedor) return;

const res = await fetch(API_PRODUCTOS);
const productos = await res.json();

contenedor.innerHTML = "";

productos.forEach(p=>{

contenedor.innerHTML += `
<div class="col-md-3 mb-4">

<div class="card h-100 text-center">

<img src="${p.imagen}" class="card-img-top">

<div class="card-body">

<h5>${p.nombre}</h5>

<p>$${p.precio}</p>

<button class="btn btn-primary"
onclick="agregarCarrito(${p.id},'${p.nombre}',${p.precio},'${p.imagen}')">
Agregar
</button>

</div>

</div>

</div>
`;

});

}

cargarProductos();


/* =========================
AGREGAR AL CARRITO
========================= */

function agregarCarrito(id,nombre,precio,imagen){

const producto = carrito.find(p=>p.id===id);

if(producto){

producto.cantidad++;

}else{

carrito.push({
id,
nombre,
precio,
imagen,
cantidad:1
});

}

localStorage.setItem("carrito",JSON.stringify(carrito));

actualizarContadorCarrito();

}

window.agregarCarrito = agregarCarrito;


/* =========================
MOSTRAR CARRITO (cart.html)
========================= */

function mostrarCarrito(){

const tabla = document.getElementById("carrito-items");

if(!tabla) return;

tabla.innerHTML = "";

let total = 0;

carrito.forEach((p,index)=>{

const subtotal = p.precio * p.cantidad;

total += subtotal;

tabla.innerHTML += `
<tr>

<td>${p.nombre}</td>

<td>$${p.precio}</td>

<td>${p.cantidad}</td>

<td>$${subtotal}</td>

<td>
<button class="btn btn-danger btn-sm"
onclick="eliminarProducto(${index})">
Eliminar
</button>
</td>

</tr>
`;

});

const totalResumen = document.getElementById("total-resumen");

if(totalResumen){
totalResumen.innerText = "$" + total;
}

}

mostrarCarrito();


/* =========================
ELIMINAR PRODUCTO
========================= */

function eliminarProducto(index){

carrito.splice(index,1);

localStorage.setItem("carrito",JSON.stringify(carrito));

mostrarCarrito();

actualizarContadorCarrito();

}

window.eliminarProducto = eliminarProducto;


/* =========================
CREAR PEDIDO
========================= */

async function realizarPedido(){

if(carrito.length===0){

alert("Carrito vacío");

return;

}

const pedido = {
productos: carrito
};

await fetch(API_PEDIDOS,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(pedido)
});

localStorage.removeItem("carrito");

alert("Pedido realizado");

window.location="index.html";

}

window.realizarPedido = realizarPedido;