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
        simulateLogin(data.user.name);
    } catch (err) {
        console.error('Login error:', err);
        alert(err.message);
    }
});


function simulateLogin(name) {
    document.getElementById('auth-buttons').style.display = 'none';
    document.getElementById('user-menu').classList.add('active');
    document.querySelector('.user-name').textContent = name;
    hideAuthModal();
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
}


function logout() {
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-menu').classList.remove('active');
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
}


function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');

    if (isLoggedIn === 'true' && userName) {
        simulateLogin(userName);
    } else {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
    }
}

document.addEventListener('DOMContentLoaded', checkAuth);
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.logout = logout;