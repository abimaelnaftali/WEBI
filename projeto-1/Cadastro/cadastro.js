class User {
    constructor ({id, name, surname, email, password}) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.password = password;
    }
}

const cep = document.querySelector('#zip');
const estado = document.querySelector('#state');
const cidade = document.querySelector('#city');
const endereco = document.querySelector('#address');

const addUserForm = document.getElementById('add-user-form');

const cancelButton = document.getElementById('cancel-bttn');
const submitButton = document.getElementById('submit-bttn');

const confirmPasswordField = document.getElementById('confirmPassword');
const passwordField = document.getElementById('password');
const passwordError = document.getElementById('password-error');

cancelButton.addEventListener('click', () => {
    window.location.href = '../Home/index.html';
});

confirmPasswordField.addEventListener('input', validatePasswords);
passwordField.addEventListener('input', validatePasswords);

function validatePasswords() {
    const password = passwordField.value;
    const confirmPassword = confirmPasswordField.value;

    if (password !== confirmPassword) {
        passwordError.style.display = 'block';
        submitButton.disabled = true;
    } else {
        passwordError.style.display = 'none';
        submitButton.disabled = false;
    }
}

addUserForm.addEventListener('submit', submitUser);

function encryptPassword(password) {
    const key = CryptoJS.enc.Utf8.parse('sua-chave-secreta-muito-longa-e-segura');
    const iv = CryptoJS.enc.Utf8.parse('1234567890123456');

    const encrypted = CryptoJS.AES.encrypt(password, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
}

function submitUser(event) {
    event.preventDefault();

    const formData = new FormData(addUserForm);
    const password = formData.get('password');
    const encryptedPassword = encryptPassword(password);

    const userData = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        password: encryptedPassword,
    };

    addUser(userData)
        .then(() => {
            addUserForm.reset();
        })
        .catch(error => {
            console.error('Erro ao adicionar usuário:', error);
        });
}

function addUser(userData) {
    return fetch('https://projeto-ii-c500a-default-rtdb.firebaseio.com/users.json', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(userData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Resposta de rede não foi ok');
        } else {
            displayMessage('Usuário adicionado com sucesso!');
        }
    });
}

cep.addEventListener('focusout', async () => {
    try {
        const onlyNumbers = /^[0-9-]+$/;
        const cepValid = /^[0-9]{5}-[0-9]{3}$/;

        if(!onlyNumbers.test(cep.value) || !cepValid.test(cep.value)) {
            throw {cep_error:'Cep Invalido'};
        }

        const cepValue = cep.value.replace('-', '');
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);

        if (!response.ok) {
            throw await response.json();
        }

        const responseCep = await response.json();

        if (responseCep.erro) {
            throw {cep_error: 'CEP não encontrado.'};
        }

        estado.value = responseCep.uf;
        cidade.value = responseCep.localidade;
        endereco.value = responseCep.logradouro;

    } catch (error) {
        alert("CEP não encontrado.");
    }
})

function displayMessage(message) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.textContent = message;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.textContent = '';
        messageContainer.style.display = 'none';
    }, 3000);
}