function showAuthModal(tab) {
    const modal = document.getElementById('auth-modal');
    modal.classList.add('active');

    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));

    if (tab) {
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        document.getElementById(`${tab}-form`).classList.add('active');
    }
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}


document.getElementById('signup-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (!name || !email || !password || !confirm) {
        alert('All fields are required!');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }

    try {
        const res = await fetch('/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');

        alert('Signup successful! You can now log in.');
        clearAuthFields(); 
        hideAuthModal();
    } catch (err) {
        console.error('Signup error:', err);
        alert(err.message);
    }
});


document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert('Email and password are required!');
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');

        alert('Login successful!');
        clearAuthFields(); 
        simulateLogin(data.user.name);
    } catch (err) {
        console.error('Login error:', err);
        alert(err.message);
    }
});


function simulateLogin(name) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    const userMenu = document.getElementById('user-menu');
    
    if (!authButtons || !userMenu) {
        console.error("UI elements missing!");
        return;
    }

    authButtons.style.display = 'none';
    userMenu.style.display = 'block';
    userMenu.classList.add('active');

    const userNameElement = document.querySelector('.user-name');
    if (userNameElement) {
        userNameElement.textContent = name;
    } else {
        console.error("User name element not found!");
    }

    hideAuthModal();
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);

    if (userMenuDropdown) {
        userMenuDropdown.style.display = 'none';
    }

}


function logout() {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) {
        userMenu.classList.remove('active');
        userMenu.style.display = 'none'; 
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
}


function checkAuth() {
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    if (userMenuDropdown) {
        userMenuDropdown.style.display = 'none'; 
    }

    if (isLoggedIn === 'true' && userName) {
        simulateLogin(userName);
    } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
    }
}

function clearAuthFields() {
    const signupFields = ['signup-name', 'signup-email', 'signup-password', 'signup-confirm'];
    const loginFields = ['login-email', 'login-password'];
    signupFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    loginFields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();

    const userMenuButton = document.querySelector('.user-menu-button');
    const userMenu = document.getElementById('user-menu');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');

    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', function(e) {
            e.stopPropagation();

            if (userMenu.classList.contains('active')) {
                userMenu.classList.remove('active');
                userMenuDropdown.style.display = 'none';
            } else {
                userMenu.classList.add('active');
                userMenuDropdown.style.display = 'block';
            }
        });

        document.addEventListener('click', function(e) {
            if (userMenu.classList.contains('active') &&
                !userMenu.contains(e.target) &&
                !userMenuButton.contains(e.target)
            ) {
                userMenu.classList.remove('active');
                userMenuDropdown.style.display = 'none';
            }
        });
    }
});
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.logout = logout;