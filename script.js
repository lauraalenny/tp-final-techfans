// ==========================================
// 1. ESTADO DEL CARRITO (localStorage)
// ==========================================
let carrito = [];
try {
    const guardado = JSON.parse(localStorage.getItem('carritoTechFans'));
    if (Array.isArray(guardado)) {
        // Filtramos cualquier item corrupto de pruebas anteriores
        carrito = guardado.filter(item => item && item.id && !isNaN(Number(item.price)));
    }
} catch (e) {
    carrito = [];
}

function guardarCarrito() {
    localStorage.setItem('carritoTechFans', JSON.stringify(carrito));
    actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        const totalItems = carrito.reduce((acc, item) => acc + (Number(item.cantidad) || 1), 0);
        contador.textContent = totalItems;
    }
}

function mostrarNotificacion(mensaje, tipo = 'exito') {
    const notif = document.createElement('div');
    notif.className = `notificacion ${tipo}`;
    notif.textContent = mensaje;
    notif.setAttribute('role', 'status');
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}

// ==========================================
// 2. FETCH API: CONSUMIR PRODUCTOS DE TECNOLOGÍA
// ==========================================
const fotosSeguras = [
    'img/jl-cabrera-4GzqVNX0TCQ-unsplash_teclado.jpg',
    'img/andrey-matveev-TfxQ1k9Ecpw-unsplash_mouse.jpg',
    'img/qasim-malick-LIVF4WE1LZQ-unsplash_auriculares.jpg',
    'img/kitai-zhvaeh-R9rA-unsplash.jpg'
];

const productosRespaldo = [
    {
        id: 101,
        title: "Teclado Mecánico RGB Pastel",
        price: 45.00,
        description: "Switches silenciosos, diseño compacto 65% y retroiluminación regulable."
    },
    {
        id: 102,
        title: "Mouse Ergonómico Inalámbrico",
        price: 22.50,
        description: "Conexión dual Bluetooth/USB, sensor óptico de alta precisión y batería recargable."
    },
    {
        id: 103,
        title: "Auriculares Vincha Noise Cancelling",
        price: 60.00,
        description: "Cancelación activa de ruido, sonido envolvente y almohadillas ultra suaves."
    },
    {
        id: 104,
        title: "Monitor Gamer 24'' Full HD",
        price: 180.00,
        description: "Panel IPS con colores vibrantes, 144Hz de tasa de refresco y bordes ultrafinos."
    }
];

function renderizarTarjetas(productos, contenedor) {
    contenedor.innerHTML = '';

    productos.forEach((prod, index) => {
        // Si la API trae su propia foto la usamos; si no, usamos una segura
        const fotoFinal = prod.image || fotosSeguras[index % fotosSeguras.length];
        const precioNumerico = Number(prod.price) || 25.00;

        const productoListo = {
            id: prod.id,
            title: prod.title,
            price: precioNumerico,
            image: fotoFinal
        };

        const card = document.createElement('article');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${productoListo.image}" alt="${productoListo.title}">
            <h3>${productoListo.title}</h3>
            <p class="product-desc">${(prod.description || '').substring(0, 75)}...</p>
            <span class="price">$${productoListo.price.toFixed(2)}</span>
            <button class="btn-add-cart" aria-label="Agregar ${productoListo.title} al carrito">
                Agregar al Carrito
            </button>
        `;

        const boton = card.querySelector('.btn-add-cart');
        boton.addEventListener('click', () => agregarAlCarrito(productoListo));

        contenedor.appendChild(card);
    });
}

async function cargarProductosAPI() {
    const contenedor = document.getElementById('api-products-container');
    if (!contenedor) return;

    contenedor.innerHTML = '<p class="loading-text">Cargando catálogo tecnológico...</p>';

    try {
        const respuesta = await fetch('https://fakestoreapi.com');
        if (!respuesta.ok) throw new Error('Error en la respuesta de la API');
        
        const productos = await respuesta.json();
        renderizarTarjetas(productos, contenedor);

    } catch (error) {
        console.warn('Usando catálogo de respaldo:', error);
        renderizarTarjetas(productosRespaldo, contenedor);
    }
}


// ==========================================
// 3. FUNCIONES DEL CARRITO DE COMPRAS
// ==========================================
function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad = Number(existe.cantidad) + 1;
    } else {
        carrito.push({
            id: producto.id,
            title: producto.title,
            price: Number(producto.price),
            image: producto.image,
            cantidad: 1
        });
    }
    guardarCarrito();
    mostrarNotificacion(`¡"${producto.title.substring(0, 22)}..." agregado al carrito!`);
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('cart-items-container');
    const totalElemento = document.getElementById('cart-total');
    if (!listaCarrito || !totalElemento) return;

    listaCarrito.innerHTML = '';

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="empty-cart">Tu carrito está vacío. ¡Mirá nuestros productos!</p>';
        totalElemento.textContent = '0.00';
        return;
    }

    let totalGeneral = 0;

    carrito.forEach((item, index) => {
        const precio = Number(item.price) || 0;
        const cantidad = Number(item.cantidad) || 1;
        const subtotal = precio * cantidad;
        totalGeneral += subtotal;

        const fotoMostrar = item.image || fotosSeguras[index % fotosSeguras.length];


        const fila = document.createElement('div');
        fila.className = 'cart-item';
        fila.innerHTML = `
            <img src="${fotoMostrar}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>Precio unitario: $${precio.toFixed(2)}</p>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, -1)" aria-label="Disminuir cantidad">-</button>
                <span>${cantidad}</span>
                <button class="btn-qty" onclick="cambiarCantidad(${item.id}, 1)" aria-label="Aumentar cantidad">+</button>
            </div>
            <div class="cart-item-subtotal">
                <strong>$${subtotal.toFixed(2)}</strong>
                <button class="btn-remove" onclick="eliminarDelCarrito(${item.id})" aria-label="Eliminar producto">Eliminar</button>
            </div>
        `;
        listaCarrito.appendChild(fila);
    });

    totalElemento.textContent = totalGeneral.toFixed(2);
}

window.cambiarCantidad = function(id, delta) {
    const item = carrito.find(p => p.id === id);
    if (!item) return;

    item.cantidad = Number(item.cantidad) + delta;
    if (item.cantidad <= 0) {
        eliminarDelCarrito(id);
    } else {
        guardarCarrito();
        renderizarCarrito();
    }
};

window.eliminarDelCarrito = function(id) {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
    renderizarCarrito();
    mostrarNotificacion('Producto eliminado del carrito', 'aviso');
};

function configurarBotonVaciar() {
    const btnVaciar = document.getElementById('btn-clear-cart');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (carrito.length === 0) return;
            carrito = [];
            guardarCarrito();
            renderizarCarrito();
            mostrarNotificacion('Se vació el carrito', 'aviso');
        });
    }
}

// ==========================================
// 4. VALIDACIÓN DE FORMULARIO (contacto.html)
// ==========================================
function configurarValidacionFormulario() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(evento) {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        const feedback = document.getElementById('form-feedback');

        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (nombre.length < 2) {
            evento.preventDefault();
            feedback.textContent = 'Por favor, ingresá un nombre válido (mínimo 2 caracteres).';
            feedback.className = 'feedback-error';
            return;
        }

        if (!emailValido) {
            evento.preventDefault();
            feedback.textContent = 'Por favor, ingresá un correo electrónico con formato válido.';
            feedback.className = 'feedback-error';
            return;
        }

        if (mensaje.length < 10) {
            evento.preventDefault();
            feedback.textContent = 'El mensaje es muy corto (escribí al menos 10 caracteres).';
            feedback.className = 'feedback-error';
            return;
        }

        feedback.textContent = 'Validación correcta. Enviando consulta...';
        feedback.className = 'feedback-ok';
    });
}

// ==========================================
// 5. INICIALIZAR TODO AL CARGAR LA PÁGINA
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    cargarProductosAPI();
    renderizarCarrito();
    configurarBotonVaciar();
    configurarValidacionFormulario();
});
