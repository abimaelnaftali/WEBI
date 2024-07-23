// Função para criar o "card" de produto, ou seja, como o produto vai ser exibido na listagem
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('col')

    const card = document.createElement('div');
    card.classList.add('card')

    const link_page = document.createElement('a');
    link_page.classList.add('card')
    link_page.href = `../Produto/index.html?key=${product.id}`;
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