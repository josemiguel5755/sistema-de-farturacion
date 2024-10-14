// Arreglo para almacenar los productos en el inventario (cargado desde localStorage)
let inventory = JSON.parse(localStorage.getItem('inventory')) || [];

// Cargar productos en la tabla de inventario
function loadInventory() {
    const inventoryBody = document.getElementById('inventory-body');
    inventoryBody.innerHTML = ''; // Limpiar la tabla

    inventory.forEach((product, index) => {
        inventoryBody.innerHTML += `
            <tr>
                <td>${product.name}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td class="actions">
                    <button onclick="editProduct(${index})">Editar</button>
                    <button onclick="deleteProduct(${index})">Eliminar</button>
                    <button onclick="reduceStock(${index})">-</button>
                </td>
            </tr>
        `;
    });

    // Guardar el inventario actualizado en localStorage
    localStorage.setItem('inventory', JSON.stringify(inventory));
}

// Agregar un nuevo producto
document.getElementById('product-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const productName = document.getElementById('product-name').value;
    const productPrice = parseFloat(document.getElementById('product-price').value);
    const productStock = parseInt(document.getElementById('product-stock').value);

    // Agregar el nuevo producto al inventario
    inventory.push({ name: productName, price: productPrice, stock: productStock });

    // Limpiar los campos del formulario
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';

    // Actualizar la tabla de inventario
    loadInventory();
});

// Editar un producto del inventario
function editProduct(index) {
    const product = inventory[index];

    // Mostrar los datos del producto en el formulario
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;

    // Eliminar el producto para luego agregarlo como actualizado
    inventory.splice(index, 1);

    loadInventory(); // Volver a cargar el inventario para actualizar la tabla
}

// Eliminar un producto del inventario
function deleteProduct(index) {
    // Confirmar la eliminación
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        // Eliminar el producto del inventario
        inventory.splice(index, 1);

        // Volver a cargar el inventario
        loadInventory();
    }
}

// Reducir la cantidad de stock
function reduceStock(index) {
    if (inventory[index].stock > 0) {
        inventory[index].stock -= 1; // Restar uno al stock

        if (inventory[index].stock === 0) {
            // Si el stock llega a 0, eliminar el producto
            if (confirm('El stock es 0. ¿Quieres eliminar este producto?')) {
                inventory.splice(index, 1);
            }
        }
        loadInventory();
    } else {
        alert('El stock es 0, no se puede reducir más.');
    }
}

// Inicializar la tabla al cargar la página
loadInventory();
