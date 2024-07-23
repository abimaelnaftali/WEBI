/*class Product {
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
}*/

// Função para criar o "card" de produto, ou seja, como o produto vai ser exibido na listagem
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('col')

    const card = document.createElement('div');
    card.classList.add('card')

    const link_page = document.createElement('a');
    link_page.classList.add('card')
    link_page.href = "";
    link_page.target = '_blank';

    const image = document.createElement('img');
    image.classList.add('card-img-top')
    image.src = product.photo;
    image.alt = product.name;

    const card_body = document.createElement('div');
    card_body.classList.add('card-body')

    const name = document.createElement('h5');
    name.classList.add('card-title')
    name.innerHTML = `${product.name}`;

    const price = document.createElement('p');
    price.classList.add('card-text')
    price.innerHTML = `R$ ${product.price},00`;

    const parcels = document.createElement('p');
    parcels.classList.add('card-text')
    parcels.innerHTML = `Em até ${product.parcels}x`;

    card_body.append(name, price, parcels);
    link_page.appendChild(image);
    card.append(link_page, card_body);
    productCard.appendChild(card);

    return productCard;
}