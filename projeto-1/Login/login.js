document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginMessage = document.getElementById('login-message');

    loginForm.addEventListener('submit', loginUser);

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

    async function loginUser(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const encryptedPassword = encryptPassword(password);

        try {
            const response = await fetch('https://projeto-ii-c500a-default-rtdb.firebaseio.com/users.json');
            if (!response.ok) {
                throw new Error('Resposta de rede não foi ok');
            }

            const users = await response.json();
            let userFound = false;

            for (const key in users) {
                if (users[key].email === email && users[key].password === encryptedPassword) {
                    userFound = true;
                    localStorage.setItem('loggedInUser', JSON.stringify(users[key]));
                    displayLoginMessage('Login realizado com sucesso!', 'success');
                    // Redirecione para a página de conta do usuário
                    window.location.href = '../Conta/conta.html';
                    break;
                }
            }

            if (!userFound) {
                displayLoginMessage('Email ou senha incorretos.', 'error');
            }
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            displayLoginMessage('Erro ao realizar login. Tente novamente mais tarde.', 'error');
        }
    }

    function displayLoginMessage(message, type) {
        loginMessage.textContent = message;
        loginMessage.style.display = 'block';
        loginMessage.style.color = type === 'success' ? 'green' : 'red';

        setTimeout(() => {
            loginMessage.textContent = '';
            loginMessage.style.display = 'none';
        }, 3000);
    }
});