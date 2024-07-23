document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = '../Login/index.html'; // Redireciona para a página de login se o usuário não estiver logado
    }

    const userName = document.getElementById('user-name');
    const userSurname = document.getElementById('user-surname');
    const userEmail = document.getElementById('user-email');

    userName.textContent = user.name;
    userSurname.textContent = user.surname;
    userEmail.textContent = user.email;

    const editBtn = document.getElementById('edit-btn');
    const editForm = document.getElementById('edit-form');
    const editName = document.getElementById('edit-name');
    const editSurname = document.getElementById('edit-surname');
    const editEmail = document.getElementById('edit-email');
    const editPassword = document.getElementById('edit-password');
    const newPassword = document.getElementById('new-password');
    const confirmNewPassword = document.getElementById('confirm-new-password');
    const cancelBtn = document.getElementById('cancel-btn');
    const userDetails = document.getElementById('user-details');
    const messageContainer = document.getElementById('message-container');

    editBtn.addEventListener('click', () => {
        editForm.style.display = 'block';
        userDetails.style.display = 'none';

        editName.value = user.name;
        editSurname.value = user.surname;
        editEmail.value = user.email;
    });

    cancelBtn.addEventListener('click', () => {
        editForm.style.display = 'none';
        userDetails.style.display = 'block';
    });

    editForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const password = editPassword.value;
        const encryptedPassword = encryptPassword(password);

        if (newPassword.value && newPassword.value !== confirmNewPassword.value) {
            displayMessage('As novas senhas não coincidem', 'error');
            return;
        }

        try {
            const response = await fetch('https://projeto-ii-c500a-default-rtdb.firebaseio.com/users.json');
            const users = await response.json();
            const loggedInUser = Object.entries(users).find(([key, user]) => user.email === user.email && user.password === encryptedPassword);

            if (!loggedInUser) {
                displayMessage('Senha incorreta', 'error');
                return;
            }

            const updatedUser = {
                ...loggedInUser[1],
                ...(editName.value && { name: editName.value }),
                ...(editSurname.value && { surname: editSurname.value }),
                ...(editEmail.value && { email: editEmail.value }),
                ...(newPassword.value && { password: encryptPassword(newPassword.value) }),
            };

            const updateResponse = await fetch(`https://projeto-ii-c500a-default-rtdb.firebaseio.com/users/${loggedInUser[0]}.json`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser),
            });

            if (!updateResponse.ok) {
                throw new Error('Erro ao atualizar usuário');
            }

            localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

            userName.textContent = updatedUser.name;
            userSurname.textContent = updatedUser.surname;
            userEmail.textContent = updatedUser.email;

            editForm.style.display = 'none';
            userDetails.style.display = 'block';
            displayMessage('Dados atualizados com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            displayMessage('Erro ao atualizar usuário. Tente novamente mais tarde.', 'error');
        }
    });

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = '../Cadastro/index.html'; // Redireciona para a página de cadastro
    });

    function displayMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.style.color = type === 'success' ? 'green' : 'red';
        messageContainer.style.display = 'block';

        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.style.display = 'none';
        }, 3000);
    }

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
});