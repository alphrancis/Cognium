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

    // Form Submissions
    document.getElementById('login-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Here you would typically make an API call to your backend
        console.log('Login attempt:', { email, password });
        
        // For demo purposes, simulate successful login
        simulateLogin('John Doe');
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
        
        // Here you would typically make an API call to your backend
        console.log('Signup attempt:', { name, email, password });
        
        // For demo purposes, simulate successful signup and login
        simulateLogin(name);
    });

    // User Menu Functions
    document.querySelector('.user-menu-button')?.addEventListener('click', () => {
        document.getElementById('user-menu').classList.toggle('active');
    });

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
        const userMenu = document.getElementById('user-menu');
        const userMenuButton = document.querySelector('.user-menu-button');
        
        if (userMenu?.classList.contains('active') && 
            !userMenu.contains(e.target) && 
            !userMenuButton?.contains(e.target)) {
            userMenu.classList.remove('active');
        }
    });

    // Initialize auth state
    checkAuth();
});

// Simulate login/logout (for demo purposes)
function simulateLogin(name) {
    document.getElementById('auth-buttons').style.display = 'none';
    const userMenu = document.getElementById('user-menu');
    userMenu.style.display = 'block';
    userMenu.querySelector('.user-name').textContent = name;
    hideAuthModal();
    
    // Store auth state (for demo purposes)
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', name);
}

function logout() {
    document.getElementById('auth-buttons').style.display = 'flex';
    document.getElementById('user-menu').style.display = 'none';
    document.getElementById('user-menu').classList.remove('active');
    
    // Clear auth state (for demo purposes)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
}

// Check if user is logged in (for demo purposes)
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        simulateLogin(localStorage.getItem('userName') || 'John Doe');
    }
} 