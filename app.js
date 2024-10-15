let products = [
    { code: 'P001', name: 'Laptop', price: 1200, stock: 10 },
    { code: 'P002', name: 'Mouse', price: 25, stock: 50 },
    { code: 'P003', name: 'Teclado', price: 45, stock: 30 },
    { code: 'P004', name: 'Monitor', price: 300, stock: 15 }
];

let cart = [];
let totalPrice = 0;
let facturaId = 1;
let accountsReceivable = [];

// Cargar productos en el inventario
function loadInventory(productsToShow = products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    productsToShow.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
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

// Mostrar/ocultar formulario de crédito según el tipo de pago seleccionado
document.getElementById('payment-type').addEventListener('change', function(event) {
    const paymentType = event.target.value;
    const creditForm = document.getElementById('credit-client-form');
    if (paymentType === 'credito') {
        creditForm.style.display = 'block';
    } else {
        creditForm.style.display = 'none';
    }
});

// Generar factura
document.getElementById('checkout').addEventListener('click', function() {
    const clientName = document.getElementById('client-name').value.trim();
    const paymentType = document.getElementById('payment-type').value;

    if (cart.length === 0) {
        alert('El carrito está vacío.');
        return;
    }
    
    if (!clientName) {
        alert('Debe ingresar el nombre del cliente.');
        return;
    }

    // Si el pago es a crédito, obtener más datos del cliente
    if (paymentType === 'credito') {
        const clientId = document.getElementById('client-id').value.trim();
        const clientAddress = document.getElementById('client-address').value.trim();
        const clientPhone = document.getElementById('client-phone').value.trim();

        if (!clientId || !clientAddress || !clientPhone) {
            alert('Debe completar todos los campos del cliente para el pago a crédito.');
            return;
        }

        // Agregar el cliente a cuentas por cobrar
        accountsReceivable.push({
            facturaId: facturaId,
            clientName: clientName,
            total: totalPrice,
            paymentType: 'Crédito',
            clientId: clientId,
            clientAddress: clientAddress,
            clientPhone: clientPhone,
            status: 'Pendiente'
        });
    } else {
        // Si es al contado
        accountsReceivable.push({
            facturaId: facturaId,
            clientName: clientName,
            total: totalPrice,
            paymentType: 'Contado',
            status: 'Pagado'
        });
    }

    facturaId++;
    cart = [];
    updateCart();
    updateAccountsReceivable();
});

// Actualizar la lista de cuentas por cobrar
function updateAccountsReceivable() {
    const accountsList = document.getElementById('accounts-list');
    accountsList.innerHTML = '';

    accountsReceivable.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.facturaId}</td>
            <td>${account.clientName}</td>
            <td>$${account.total.toFixed(2)}</td>
            <td>${account.paymentType}</td>
            <td>${account.status}</td>
            <td><button onclick="markAsPaid(${account.facturaId})">Marcar como pagado</button></td>
        `;
        accountsList.appendChild(row);
    });
}

// Marcar como pagado en cuentas por cobrar
function markAsPaid(facturaId) {
    const account = accountsReceivable.find(a => a.facturaId === facturaId);
    if (account) {
        account.status = 'Pagado';
        updateAccountsReceivable();
    }
}

// Filtrar productos por búsqueda
document.getElementById('search-input').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) || product.code.toLowerCase().includes(searchTerm)
    );
    loadInventory(filteredProducts);
});

loadInventory();
