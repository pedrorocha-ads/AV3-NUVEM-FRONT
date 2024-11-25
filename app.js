const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductDescription = document.querySelector('#update-description');
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
        li.innerHTML = `${product.name} - ${product.description} - $${product.price}`;

        // Adicionar botão de atualização para cada produto
        const updateButton = document.createElement('button');
        updateButton.innerHTML = 'Update';
        updateButton.classList.add('update-button');
        updateButton.addEventListener('click', () => {
            updateProductId.value = product.id;
            updateProductName.value = product.name;
            updateProductDescription.value = product.description;
            updateProductPrice.value = product.price;
            updateProductForm.style.display = 'block';
        });
        li.appendChild(updateButton);

        // Adicionar botão de exclusão para cada produto
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', async () => {
            await deleteProduct(product.id);
            await fetchProducts();
        });
        li.appendChild(deleteButton);

        productList.appendChild(li);
    });
}

// Listener de evento para o formulário de adicionar produto
addProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const name = addProductForm.elements['name'].value;
    const description = addProductForm.elements['description'].value;
    const price = addProductForm.elements['price'].value;
    await addProduct(name, description, price);
    addProductForm.reset();
    await fetchProducts();
});

// Função para adicionar um novo produto
async function addProduct(name, description, price) {
    const response = await fetch('http://backend_server_ip:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    });
    return response.json();
}

// Listener de evento para o formulário de atualização de produto
updateProductForm.addEventListener('submit', async event => {
    event.preventDefault();
    const id = updateProductId.value;
    const name = updateProductName.value;
    const description = updateProductDescription.value;
    const price = updateProductPrice.value;
    await updateProduct(id, name, description, price);
    updateProductForm.style.display = 'none';
    await fetchProducts();
});

// Função para atualizar um produto
async function updateProduct(id, name, description, price) {
    const response = await fetch('http://backend_server_ip:3000/products/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    });
    return response.json();
}

// Função para excluir um produto
async function deleteProduct(id) {
    const response = await fetch('http://backend_server_ip:3000/products/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

// Buscar todos os produtos ao carregar a página
fetchProducts();
