class Product {
    constructor({ id, name, description, quantity, price, photo, size }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = quantity;
        this.price = price;
        this.photo = photo;
        this.size = size;
    }
}

const addProductForm = document.getElementById('add-product-form');
const registerProductBtn = document.getElementById('confirm-register');
const editProductBtn = document.getElementById('confirm-edition');
const productList = document.getElementById('product-list'); // <<< AQUI

const nameField = document.getElementById('name');
const descriptionField = document.getElementById('description');
const quantityField = document.getElementById('quantity');
const priceField = document.getElementById('price');
const photoField = document.getElementById('photo');
//const sizeField = document.getElementById('size');

document.addEventListener('DOMContentLoaded', function () {
    listProducts();
});

// Event listener para o envio do formulário
registerProductBtn.addEventListener('click', submitProduct);

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

function getFormData(){
    const productData = {
        name: nameField.value,
        description: descriptionField.value,
        quantity: quantityField.value,
        price: priceField.value,
        photo: photoField.value || 'https://via.placeholder.com/100', // Foto padrão
        //size: sizeField.value
    };
    console.log(productData);

    return productData;
}

function submitProduct(event) {
    event.preventDefault(); // Evita o envio padrão do formulário

    addProduct(getFormData())
        .then(() => {
            return fetchProducts();
        })
        .then(products => {
            renderProducts(products);
            addProductForm.reset(); // Limpa os campos do formulário
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar o produto:', error);
        });
}

// Função para adicionar produto no Firebase
function addProduct(productData) {
    return fetch('https://web01-miniprojeto04-default-rtdb.firebaseio.com/products.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            alert("Produto adicionado com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao adicionar o produto:', error);
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
                    //size: products[key].size
                });

                productsList.push(product);
            }
            return productsList;
        });
}

function removeProduct(productId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/products/${productId}.json`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            listProducts();
            alert("Remoção realizada com sucesso!");
        })
        .catch(error => {
            console.error('Houve um problema ao remover o produto:', error);
        });
}

function changeForm(productId) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/products/${productId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(product => {
            nameField.value = product.name;
            descriptionField.value = product.description;
            quantityField.value = product.quantity;
            priceField.value = product.price;
            photoField.value = product.photo;
            //sizeField.value = product.size;

            registerProductBtn.style.display = 'none';
            editProductBtn.removeAttribute('style');
            editProductBtn.setAttribute('onclick', `submitEdition('${productId}')`);
        })
        .catch(error => {
            console.error('Houve um problema ao recuperar informações do produto:', error);
        });
}

function submitEdition(productId) {
    updateProduct(productId, getFormData())
        .then(() => {
            editProductBtn.style.display = 'none';
            registerProductBtn.removeAttribute('style');

            listProducts();
            addProductForm.reset(); // Limpa os campos do formulário
            alert("Edição realizada com sucesso!");
        });
}

function updateProduct(productId, productData) {
    return fetch(`https://web01-miniprojeto04-default-rtdb.firebaseio.com/products/${productId}.json`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
        })
        .catch(error => {
            console.error('Houve um problema ao editar o produto:', error);
        });
}

// Função para renderizar produtos na página
function renderProducts(products) {
    // Limpa os produtos existentes
    // Tem que pegar esse elemento aqui antes pelo id, que é o elemento pai. Veja lá no começo do código
    productList.innerHTML = '';

    products.forEach(product => {
        const productCard = createProductCard(product);
        productList.appendChild(productCard); // adiciona o produto no elemento pai
    });
}

// Função para criar o "card" de produto, ou seja, como o produto vai ser exibido na listagem
function createProductCard(product) {
    // Essa parte aqui fica pra quem criou a página...
    // ...porque eu vou demorar a entender como tá feito ali a visualização
    const productCard = document.createElement('div');

    // Criação do elemento aki, tipo adicionar a imagem, o texto, etc.
    // tô fazendo de forma simples assim só pra testar
    const name = document.createElement('p');
    name.textContent = product.name;
    
    const btn_remove = document.createElement('button');
    btn_remove.setAttribute('type', 'button');
    btn_remove.setAttribute('onclick', `removeProduct('${product.id}')`);
    btn_remove.innerHTML = "Remover";

    const btn_update = document.createElement('button');
    btn_update.setAttribute('type', 'button');
    btn_update.setAttribute('onclick', `changeForm('${product.id}')`);
    btn_update.innerHTML = "Editar";

    productCard.append(name, btn_remove, btn_update);

    return productCard; // e retorna o "card" do produto pra ser listado e aparecer na página
}

// URL's
// https://projeto-ii-c500a-default-rtdb.firebaseio.com/
// https://web01-miniprojeto04-default-rtdb.firebaseio.com/