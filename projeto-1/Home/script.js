class News {
    constructor ({id, name, email, tel, wp}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.tel = tel;
        this.wp = wp;
    }
}

var newForm = document.getElementById("div-4");
newText.onclick = function () {
    newForm.style.display = "block";
    var button = document.getElementById("newText");
    var buttonEdit = document.getElementById("editNews");
    buttonEdit.style.display = "none";
    button.style.display = "none";
};
var editForm = document.getElementById("div-5");
var editButton = document.getElementById("editNews");
editButton.onclick = function () {
    editForm.style.display = "block";
    var button = document.getElementById("newText");
    var buttonEdit = document.getElementById("editNews");
    buttonEdit.style.display = "none";
    button.style.display = "none";
};

var submitConsult = document.getElementById("submit-consult");
submitConsult.onclick = function () {
    var newForm = document.getElementById("div-4");
    newForm.style.display = "block";

    var buttonSubmit = document.getElementById("submit");
    var createAccount = document.getElementById("createAccount");
    var editButton = document.getElementById("editButton");
    var deleteButton = document.getElementById("deleteBottun");
    buttonSubmit.style.display = "none";
    createAccount.style.display = "none";
    submitConsult.style.display = "none";
    editButton.style.display = "block";
    deleteButton.style.display = "inline-block";
};

const formNews = document.getElementById('formNews');

const createAccount = document.getElementById('createAccount');
const submit = document.getElementById('submit');


createAccount.addEventListener('click', () => {
    window.location.href = '../Cadastro/index.html';
});


formNews.addEventListener('submit', submitNews);

function submitNews(event) {
    event.preventDefault();

    const formData = new FormData(formNews);

    const newsData = {
        name: formData.get('name'),
        email: formData.get('email'),
        tel: formData.get('tel'),
        wp: formData.get('wp'),
    };

    addNews(newsData)
        .then(() => {
            formNews.reset();
        })
        .catch(error => {
            console.error('Algo deu errado...:', error);
        });
}

function addNews(newsData) {
    return fetch('https://projeto-ii-c500a-default-rtdb.firebaseio.com/news.json', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(newsData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        } else {
            alert("Tudo certo " + newsData.name + "! Em breve você receberá uma mensagem no endereço de email " + newsData.email + "!");
        }
    });
}


