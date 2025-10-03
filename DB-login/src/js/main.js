document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginSubmit = document.getElementById('login');
    const registerSubmit = document.getElementById('register');
    const logoutBtn = document.getElementById('logoutBtn');

    window.toggleForm = () => {
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
    };

    registerSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch('http://localhost:8829/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                toggleForm();
                registerSubmit.reset();
            }
        } catch (err) {
            alert('Erro ao registrar. Tente novamente.');
        }
    });

    loginSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const response = await fetch('http://localhost:8829/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Bem-vindo, ${data.username}!`);
                window.location.href = 'homePage.html';
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('Erro ao fazer login. Tente novamente.');
        }
    });

    logoutBtn.addEventListener('click', () => {
        alert('Você foi desconectado.');
        window.location.href = 'login.html';
    });

    window.toggleAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.toggle('active');
    };

    window.fecharAside = () => {
        const aside = document.getElementById('asside');
        aside.classList.remove('active');
    };
});
