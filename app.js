const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');

// Função para buscar todos os produtos do servidor
async function fetchProducts() {
    const response = await fetch('http://backend_server_ip:3000/products');
    const products = await response.json();

    // Limpar a lista de produtos
    productList.innerHTML = '';

    // Adicionar cada produto à lista
    products.forEach(product => {
        const li = document.createElement('li');
        li.classList.add('product-item');
        li.innerHTML = `${product.name} - $${product.price} 
                        <button class="edit-button" onclick="showUpdateForm(${product.id}, '${product.name}', ${product.price})">Edit</button>`;
        productList.appendChild(li);
    });
}

// Listener de evento para o formulário de adicionar produto
addProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = addProductForm.elements['name'].value;
    const price = addProductForm.elements['price'].value;
    await addProduct(name, price);
    addProductForm.reset();
    await fetchProducts();
});

// Função para adicionar um novo produto
async function addProduct(name, price) {
    const response = await fetch('http://backend_server_ip:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price })
    });
    return response.json();
}

// Mostrar o formulário de atualização com os dados do produto
function showUpdateForm(id, name, price) {
    updateProductId.value = id;
    updateProductName.value = name;
    updateProductPrice.value = price;
    updateProductForm.style.display = 'block';
}

// Listener de evento para o formulário de atualização de produto
updateProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = updateProductId.value;
    const name = updateProductName.value;
    const price = updateProductPrice.value;
    await updateProduct(id, name, price);
    updateProductForm.style.display = 'none'; // Esconde o formulário após a atualização
    await fetchProducts();
});

// Função para atualizar um produto
async function updateProduct(id, name, price) {
    const response = await fetch('http://backend_server_ip:3000/products/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, price })
    });
    return response.json();
}

// Buscar todos os produtos ao carregar a página
fetchProducts();