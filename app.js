// Simulación de inventario de productos
let products = [
    { id: 1, name: "Laptop", price: 1200.00, stock: 10 },
    { id: 2, name: "Teléfono", price: 600.00, stock: 15 },
    { id: 3, name: "Tablet", price: 300.00, stock: 20 },
    { id: 4, name: "Auriculares", price: 50.00, stock: 50 }
];

// Carrito de compras vacío
let cart = [];

// Cuentas por cobrar vacías
let accounts = [];

// Cargar productos en la tabla de inventario
function loadInventory() {
    let productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
        productList.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td><button onclick="addToCart(${product.id})">Agregar</button></td>
            </tr>
        `;
    });
}

// Agregar un producto al carrito
function addToCart(productId) {
    let product = products.find(p => p.id === productId);

    if (product.stock > 0) {
        let cartItem = cart.find(item => item.id === productId);
        
        // Si el producto ya está en el carrito, aumenta la cantidad
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        // Reducir stock del inventario
        product.stock--;

        // Actualizar la vista del carrito y el inventario
        loadCart();
        loadInventory();
    } else {
        alert("Producto sin stock suficiente");
    }
}

// Eliminar un producto del carrito
function removeFromCart(productId) {
    let cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        // Devolver el stock al inventario
        let product = products.find(p => p.id === productId);
        product.stock += cartItem.quantity;

        // Eliminar el producto del carrito
        cart = cart.filter(item => item.id !== productId);

        // Actualizar la vista del carrito y el inventario
        loadCart();
        loadInventory();
    }
}

// Cargar el carrito de compras en la tabla
function loadCart() {
    let cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    let totalPrice = 0;

    cart.forEach(item => {
        let totalItemPrice = item.price * item.quantity;
        totalPrice += totalItemPrice;

        cartList.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${totalItemPrice.toFixed(2)}</td>
                <td><button onclick="removeFromCart(${item.id})">Eliminar</button></td> <!-- Botón de eliminar -->
            </tr>
        `;
    });

    // Mostrar el total
    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Cargar las cuentas por cobrar
function loadAccounts() {
    let accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = '';

    accounts.forEach(account => {
        accountsList.innerHTML += `
            <tr>
                <td>${account.id}</td>
                <td>$${account.total.toFixed(2)}</td>
                <td>${account.paid ? 'Pagado' : 'Pendiente'}</td>
                <td><button onclick="markAsPaid(${account.id})">${account.paid ? 'Pagado' : 'Marcar como pagado'}</button></td>
            </tr>
        `;
    });
}

// Generar factura y agregar a cuentas por cobrar
document.getElementById('checkout').addEventListener('click', function() {
    if (cart.length > 0) {
        let totalPrice = parseFloat(document.getElementById('total-price').textContent.split('$')[1]);
        let invoiceId = accounts.length + 1;

        // Agregar la factura a las cuentas por cobrar
        accounts.push({ id: invoiceId, total: totalPrice, paid: false });

        alert('Factura generada correctamente. Total a pagar: $' + totalPrice.toFixed(2));
        cart = []; // Vaciar el carrito
        loadCart(); // Actualizar la vista del carrito
        loadAccounts(); // Actualizar las cuentas por cobrar
    } else {
        alert('El carrito está vacío.');
    }
});

// Marcar una cuenta como pagada
function markAsPaid(invoiceId) {
    let account = accounts.find(acc => acc.id === invoiceId);
    if (account && !account.paid) {
        account.paid = true;
        alert('Cuenta marcada como pagada.');
        loadAccounts(); // Actualizar la vista de cuentas por cobrar
    }
}

// Inicializar la carga de inventario y carrito
loadInventory();
loadCart();
loadAccounts();
