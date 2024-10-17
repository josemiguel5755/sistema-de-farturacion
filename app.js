let products = [
    { code: '001', name: 'Producto A', priceDetail: 10.00, priceBulk: 8.00, stock: 100 },
    { code: '002', name: 'Producto B', priceDetail: 15.00, priceBulk: 12.00, stock: 50 },
    { code: '003', name: 'Producto C', priceDetail: 20.00, priceBulk: 18.00, stock: 30 },
];

let cart = []; // Variable para almacenar el carrito
let invoiceId = 1; // ID inicial para las facturas
let accounts = []; // Para almacenar cuentas por cobrar

window.onload = function() {
    displayProducts(products);
};

// Function to filter products based on input
function filterProducts() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchInput) || product.code.includes(searchInput)
    );
    displayProducts(filteredProducts);
}

function displayProducts(productList) {
    const productListElement = document.getElementById('product-list');
    productListElement.innerHTML = ''; // Limpiar la lista de productos antes de mostrar los filtrados
    productList.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.code}</td>
            <td>${product.name}</td>
            <td>${product.priceDetail.toFixed(2)}</td>
            <td>${product.priceBulk.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td><button onclick="addToCart('${product.code}')">Agregar</button></td>
        `;
        productListElement.appendChild(row);
    });
}

// Function to add product to cart
function addToCart(code) {
    const product = products.find(p => p.code === code);
    const cartItem = cart.find(item => item.product.code === code);

    if (product.stock > 0) { // Comprobar si hay stock disponible
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ product, quantity: 1 });
        }
        product.stock--; // Disminuir el stock
        updateCart();
    } else {
        alert('No hay suficiente stock para agregar este producto al carrito.');
    }
}

// Function to update the cart display
function updateCart() {
    const cartListElement = document.getElementById('cart-list');
    cartListElement.innerHTML = '';
    let totalPrice = 0;

    cart.forEach(item => {
        const totalItemPrice = item.product.priceDetail * item.quantity;
        totalPrice += totalItemPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.product.name}</td>
            <td>${item.product.priceDetail.toFixed(2)}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity('${item.product.code}', this.value)">
            </td>
            <td>${totalItemPrice.toFixed(2)}</td>
            <td><button onclick="removeFromCart('${item.product.code}')">Eliminar</button></td>
        `;
        cartListElement.appendChild(row);
    });

    document.getElementById('total-price').textContent = `Total: $${totalPrice.toFixed(2)}`;
}

// Function to update quantity of products in the cart
function updateQuantity(code, quantity) {
    const cartItem = cart.find(item => item.product.code === code);
    if (cartItem) {
        cartItem.quantity = parseInt(quantity);
        updateCart();
    }
}

// Function to remove a product from the cart
function removeFromCart(code) {
    const cartItem = cart.find(item => item.product.code === code);
    if (cartItem) {
        cartItem.product.stock += cartItem.quantity; // Devolver stock al producto
        cart = cart.filter(item => item.product.code !== code);
        updateCart();
    }
}

// Function to toggle credit client form visibility
function toggleCreditForm() {
    const paymentType = document.getElementById('payment-type').value;
    const creditForm = document.getElementById('credit-client-form');
    creditForm.style.display = paymentType === 'credito' ? 'block' : 'none';
}

// Function to generate invoice
function generateInvoice() {
    const clientName = document.getElementById('client-name').value;
    const paymentType = document.getElementById('payment-type').value;
    const total = parseFloat(document.getElementById('total-price').textContent.replace('Total: $', ''));

    if (clientName && total > 0) {
        const invoice = {
            id: invoiceId++,
            client: clientName,
            total: total,
            paymentType: paymentType,
            status: 'Pendiente'
        };
        accounts.push(invoice);
        displayAccounts();
        clearCart();
        alert('Factura generada con éxito!');
    } else {
        alert('Por favor, complete los campos necesarios.');
    }
}

// Function to display accounts receivable
function displayAccounts() {
    const accountsListElement = document.getElementById('accounts-list');
    accountsListElement.innerHTML = '';

    accounts.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.id}</td>
            <td>${account.client}</td>
            <td>${account.total.toFixed(2)}</td>
            <td>${account.paymentType}</td>
            <td>${account.status}</td>
            <td><button onclick="payInvoice(${account.id})">Marcar como Pagado</button></td>
        `;
        accountsListElement.appendChild(row);
    });
}

// Function to mark an invoice as paid
function payInvoice(invoiceId) {
    const account = accounts.find(a => a.id === invoiceId);
    if (account) {
        account.status = 'Pagado';
        displayAccounts();
    }
}

// Function to clear the cart after generating an invoice
function clearCart() {
    cart.forEach(item => item.product.stock += item.quantity); // Devolver stock a los productos
    cart = [];
    updateCart();
}
