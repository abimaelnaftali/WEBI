class Product {
    constructor({ id, name, description, quantity, price, photo, parcels, size }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.photo = photo;
        this.parcels = parcels;
        this.size = size;
    }
}

const productList = document.getElementById('product-list');

document.addEventListener('DOMContentLoaded', function () {
    listProducts();
});

function listProducts() {
    // Busca produtos no Firebase
    fetchProducts()
        .then(products => {
            renderProducts(products);
        })
        .catch(error => {
            console.error('Houve um problema ao buscar os produtos:', error);
        });
}

// Função para buscar produtos no Firebase
function fetchProducts() {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(products => {
            const productsList = [];
            for (let key in products) {
                const product = new Product({
                    id: key,
                    name: products[key].name,
                    description: products[key].description,
                    quantity: products[key].quantity,
                    price: products[key].price,
                    photo: products[key].photo,
                    parcels: products[key].parcels,
                    //size: products[key].size
                });

                productsList.push(product);
            }
            return productsList;
        });
}

// Função para renderizar produtos na página
function renderProducts(products) {
    // Limpa os produtos existentes
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard); // adiciona o produto no elemento pai
    });
}