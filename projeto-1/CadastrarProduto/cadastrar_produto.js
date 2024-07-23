const addProductForm = document.getElementById('add-product-form');
const registerProductBtn = document.getElementById('confirm-register');
const editProductBtn = document.getElementById('confirm-edition');

const nameField = document.getElementById('name');
const descriptionField = document.getElementById('description');
const quantityField = document.getElementById('quantity');
const priceField = document.getElementById('price');
const photoField = document.getElementById('photo');
const parcelsField = document.getElementById('parcels');
//const sizeField = document.getElementById('size');

// Event listener para o envio do formulário
registerProductBtn.addEventListener('click', submitProduct);

function getFormData(){
    const productData = {
        name: nameField.value,
        description: descriptionField.value,
        quantity: quantityField.value,
        price: priceField.value,
        parcels: parcelsField.value,
        photo: photoField.value || 'https://via.placeholder.com/100', // Foto padrão
        //size: sizeField.value
    };
    console.log(`Quantidade de parcelas: ${parcelsField.value}`);
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
            parcelsField.value = product.parcels;
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


// Função para criar o "card" de produto, ou seja, como o produto vai ser exibido na listagem
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.style.display = 'flex';
    productCard.style.justifyContent = 'space-between';
    productCard.style.borderBottom = '1px solid #E6E5E5';
    productCard.style.marginBottom = '1.5rem';
    productCard.style.paddingBottom = '1.5rem';
    productCard.style.alignItems = 'top';

    // Criação do elemento aki, tipo adicionar a imagem, o texto, etc.
    const productImage = document.createElement('img');
    productImage.style.maxWidth = '4rem';
    productImage.style.maxHeight = '4rem';

    productImage.src = product.photo;

    productCard.appendChild(productImage);

    const divBox = document.createElement('div');
    divBox.style.display = 'column';
    divBox.style.alignItems = 'left';
    divBox.style.justifyContent = 'left';
    divBox.style.maxWidth = '50rem';

    productCard.appendChild(divBox);

    const divBtn = document.createElement('div');
    divBtn.style.display = 'flex';
    divBtn.style.justifyContent = 'space-between';
    divBtn.style.alignItems = 'center';

    const name = document.createElement('p');
    name.style.color = '#403937';
    name.style.fontWeight = 'bold';
    name.style.textAlign = 'top';

    name.textContent = product.name;

    divBox.appendChild(name);

    divBox.appendChild(divBtn);

    
    const btn_remove = document.createElement('button');
    btn_remove.style.border = 'none';
    btn_remove.style.borderRadius = '6px';
    btn_remove.style.backgroundColor = 'red';
    btn_remove.style.color = '#fff';
    btn_remove.style.fontSize = '0.75rem';
    btn_remove.style.textTransform = 'uppercase';
    btn_remove.style.maxWidth = '6rem';
    btn_remove.style.maxHeight = '2.5rem';
    btn_remove.style.padding = '0.5rem 0.8rem';
    btn_remove.style.display = 'flex';
    btn_remove.style.alignItems = 'center';
    btn_remove.style.transition = 'background-color 0.3s';
    btn_remove.style.marginTop = '1rem';
    btn_remove.style.marginRight = '1rem';


    btn_remove.addEventListener('mouseover', function() {
        btn_remove.style.backgroundColor = '#dc2626';
        btn_remove.style.cursor = 'pointer';
    });

    btn_remove.addEventListener('mouseout', function() {
        btn_remove.style.backgroundColor = 'red';
    });

    divBtn.appendChild(btn_remove);

    btn_remove.setAttribute('type', 'button');
    btn_remove.setAttribute('onclick', `removeProduct('${product.id}')`);
    btn_remove.innerHTML = "Remover";

    const btn_update = document.createElement('button');

    btn_update.style.border = 'none';
    btn_update.style.borderRadius = '6px';
    btn_update.style.backgroundColor = '#E6E5E5';
    btn_update.style.color = '#574F4D';
    btn_update.style.fontSize = '0.75rem';
    btn_update.style.textTransform = 'uppercase';
    btn_update.style.maxWidth = '6rem';
    btn_update.style.maxHeight = '2.5rem';
    btn_update.style.padding = '0.5rem 0.5rem';
    btn_update.style.display = 'flex';
    btn_update.style.alignItems = 'center';
    btn_update.style.gap = '0.3rem';
    btn_update.style.transition = 'background-color 0.3s';
    btn_update.style.marginTop = '1rem';

    btn_update.addEventListener('mouseover', function() {
        btn_update.style.backgroundColor = '#D7D5D5';
        btn_update.style.cursor = 'pointer';
    });

    btn_update.addEventListener('mouseout', function() {
        btn_update.style.backgroundColor = '#E6E5E5';
    });

    divBtn.appendChild(btn_update);

    btn_update.setAttribute('type', 'button');
    btn_update.setAttribute('onclick', `changeForm('${product.id}')`);
    btn_update.innerHTML = "Editar";

    return productCard;
}

// URL's
// https://projeto-ii-c500a-default-rtdb.firebaseio.com/
// https://web01-miniprojeto04-default-rtdb.firebaseio.com/