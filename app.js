let products = [
    { name: 'Laptop', price: 1200, stock: 10 },
    { name: 'Mouse', price: 25, stock: 50 },
    { name: 'Teclado', price: 45, stock: 30 },
    { name: 'Monitor', price: 300, stock: 15 }
];

let cart = [];
let totalPrice = 0;
let facturaId = 1;

// Cargar productos en el inventario
function loadInventory(productsToShow = products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToShow.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td><button onclick="addToCart(${index})">Agregar</button></td>
        `;
        productList.appendChild(row);
    });
}

// Agregar producto al carrito
function addToCart(index) {
    const product = products[index];
    if (product.stock > 0) {
        product.stock--;
        const cartItem = cart.find(item => item.name === product.name);
        if (cartItem) {
            cartItem.quantity++;
            cartItem.total += product.price;
        } else {
            cart.push({ ...product, quantity: 1, total: product.price });
        }
        updateCart();
        loadInventory(); // Recargar inventario para actualizar el stock
    } else {
        alert('Producto sin stock');
    }
}

// Actualizar el carrito
function updateCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    totalPrice = 0;

    cart.forEach((item, index) => {
        totalPrice += item.total;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td><button onclick="removeFromCart(${index})">Eliminar</button></td>
        `;
        cartList.appendChild(row);
    });

    document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Eliminar producto del carrito
function removeFromCart(index) {
    const item = cart[index];
    const product = products.find(p => p.name === item.name);

    if (item.quantity > 1) {
        item.quantity--;
        item.total -= item.price;
    } else {
        cart.splice(index, 1);
    }

    product.stock++;
    updateCart();
    loadInventory(); // Recargar inventario para actualizar el stock
}

// Generar factura
document.getElementById('checkout').addEventListener('click', function() {
    const clientName = document.getElementById('client-name').value.trim();

    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    
    if (!clientName) {
        alert('Debe ingresar el nombre del cliente.');
        return;
    }

    const accountsList = document.getElementById('accounts-list');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${facturaId}</td>
        <td>${clientName}</td>
        <td>$${totalPrice.toFixed(2)}</td>
        <td>Pendiente</td>
        <td><button onclick="markAsPaid(${facturaId})">Marcar como Pagado</button></td>
    `;

    accountsList.appendChild(newRow);
    facturaId++;

    // Vaciar el carrito después de generar la factura
    cart = [];
    updateCart();
    document.getElementById('client-name').value = ''; // Limpiar campo cliente
});

// Marcar factura como pagada
function markAsPaid(id) {
    alert(`Factura #${id} ha sido marcada como pagada.`);
}

// Búsqueda de productos en el inventario
document.getElementById('search-input').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    loadInventory(filteredProducts);
});

// Inicializar inventario
loadInventory();
