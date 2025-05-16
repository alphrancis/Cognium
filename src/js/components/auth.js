// Auth Modal Functions
function showAuthModal(tab) {
    const modal = document.getElementById('auth-modal');
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    modal.classList.add('active');
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    if (tab === 'login') {
        document.querySelector('[data-tab="login"]').classList.add('active');
        document.getElementById('login-form').classList.add('active');
    } else if (tab === 'signup') {
        document.querySelector('[data-tab="signup"]').classList.add('active');
        document.getElementById('signup-form').classList.add('active');
    }
}

function hideAuthModal() {
    document.getElementById('auth-modal').classList.remove('active');
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-form`).classList.add('active');
        });
    });


    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        

        console.log('Login attempt:', { email, password });
    });

    document.getElementById('signup-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirm = document.getElementById('signup-confirm').value;
        
        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }
        
        console.log('Signup attempt:', { name, email, password });
        
    });

    document.querySelector('.user-menu-button')?.addEventListener('click', () => {
        document.getElementById('user-menu').classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('user-menu');
        const userMenuButton = document.querySelector('.user-menu-button');
        
        if (userMenu?.classList.contains('active') && 
            !userMenu.contains(e.target) && 
            !userMenuButton?.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });


    checkAuth();
});


function simulateLogin(name) {
    document.getElementById('auth-buttons').style.display = 'none';
    const userMenu = document.getElementById('user-menu');
    userMenu.style.display = 'block';
    userMenu.querySelector('.user-name').textContent = name;
    hideAuthModal();
    

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
}

function logout() {
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('user-menu').classList.remove('active');
    
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
}


function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    if (isLoggedIn && userName) {
        simulateLogin(userName);
    }
}

// Signup form handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('signup-name');
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');
        const confirm = document.getElementById('signup-confirm');
        if (password.value !== confirm.value) {
            alert('Passwords do not match!');
            return;
        }
        try {
            const res = await fetch('http://localhost:5000/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.value, email: email.value, password: password.value })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Signup successful! You can now log in.');
                name.value = '';
                email.value = '';
                password.value = '';
                confirm.value = '';
                hideAuthModal();
            } else {
                alert(data.error || 'Signup failed');
            }
        } catch (err) {
            alert('Signup failed. Please try again.');
        }
    });
}


const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        try {
            const res = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value, password: password.value })
            });
            const data = await res.json();
            if (res.ok) {
                alert('Login successful!');
                email.value = '';
                password.value = '';
                
                simulateLogin(data.user.name);
            } else {
                alert(data.error || 'Login failed');
            }
        } catch (err) {
            alert('Login failed. Please try again.');
        }
    });
}