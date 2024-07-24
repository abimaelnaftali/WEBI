const productImage = document.getElementById('product-image');
const productTitle = document.getElementById('product-title');
const productPrice = document.getElementById('product-price');
const productDescription = document.getElementById('product-description');
const productParcels = document.getElementById('product-parcels');
//const productKey = "";

document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    productKey = params.get("key");
    searchProduct(productKey);
});

function searchProduct(){
    return fetch(`https://projeto-ii-c500a-default-rtdb.firebaseio.com/products/${productKey}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }
            return response.json();
        })
        .then(product => {
            productImage.src = product.photo;
            productTitle.innerHTML = product.name;
            productPrice.innerHTML = `R$ ${product.price}`;
            productDescription.innerHTML = product.description;
            productParcels.innerHTML = `Em ate ${product.parcels}x sem juros`
        })
        .catch(error => {
            console.error('Houve um problema ao recuperar informações do contato:', error);
        });
}