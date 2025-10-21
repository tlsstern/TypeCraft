const SUPABASE_URL = 'https://dvrszdvttojjtdzfapne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnN6ZHZ0dG9qanRkemZhcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjM1NTAsImV4cCI6MjA3Mjk5OTU1MH0.4TCKEgLSxASL1tmKzLb-wU1uCqm2ooK2vKLwuNMMKXg';

let currentUser = null;
let isGuest = false;

const { createClient } = window.supabase || {};
const supabaseClient = createClient ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

async function checkAuthStatus() {
    if (localStorage.getItem('skipAuth') === 'true') {
        isGuest = true;
        updateUIForGuest();
        return;
    }

    if (supabaseClient) {
        const { data: { session } } = await supabaseClient.auth.getSession();

        if (session) {
            currentUser = session.user;
            updateUIForUser(currentUser);
        } else {
            isGuest = true;
            updateUIForGuest();
        }
    } else {
        isGuest = true;
        updateUIForGuest();
    }
}

async function updateUIForUser(user) {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        // Fetch username from user_statistics
        let username = user.email;
        if (window.supabaseData) {
            const { data } = await window.supabaseData.getUserStats();
            if (data && data.username) {
                username = data.username;
            }
        }

        userDisplay.innerHTML = `
            <span>Welcome, <strong id="displayUsername">${username}</strong></span>
            <button onclick="openUsernameModal()" class="btn-username" title="Edit username">
                <span class="material-icons">edit</span>
            </button>
            <button onclick="logout()" class="btn-logout">Logout</button>
        `;
    }

    enableAuthFeatures();
}

function updateUIForGuest() {
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        userDisplay.innerHTML = `
            <span>Guest Mode</span>
            <a href="login.html" class="btn-login">Sign In</a>
        `;
    }

    limitGuestFeatures();
}

function enableAuthFeatures() {
    document.querySelectorAll('.auth-required').forEach(el => {
        el.classList.remove('disabled');
        el.removeAttribute('disabled');
    });
}

function limitGuestFeatures() {
    document.querySelectorAll('.auth-required').forEach(el => {
        el.classList.add('disabled');
        el.setAttribute('disabled', 'true');
        el.setAttribute('title', 'Sign in to use this feature');
    });
}

async function logout() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    localStorage.removeItem('skipAuth');
    window.location.href = 'login.html';
}

function requireAuth(callback) {
    if (currentUser) {
        callback();
    } else {
        if (confirm('This feature requires sign in. Would you like to sign in now?')) {
            localStorage.removeItem('skipAuth');
            window.location.href = 'login.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuthStatus();
});

if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            currentUser = session.user;
            isGuest = false;
            localStorage.removeItem('skipAuth');
            updateUIForUser(currentUser);
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            isGuest = true;
            updateUIForGuest();
        }
    });
}

function openUsernameModal() {
    const modal = document.getElementById('usernameModal');
    const input = document.getElementById('usernameInput');

    if (modal && input) {
        // Get current username
        const displayUsername = document.getElementById('displayUsername');
        if (displayUsername) {
            input.value = displayUsername.textContent;
            updateCharCount();
        }

        modal.style.display = 'flex';
        setTimeout(() => input.focus(), 100);
    }
}

function closeUsernameModal() {
    const modal = document.getElementById('usernameModal');
    const error = document.getElementById('usernameError');

    if (modal) {
        modal.style.display = 'none';
    }
    if (error) {
        error.textContent = '';
    }
}

function updateCharCount() {
    const input = document.getElementById('usernameInput');
    const charCount = document.getElementById('usernameCharCount');

    if (input && charCount) {
        charCount.textContent = `${input.value.length}/20`;
    }
}

async function saveUsername() {
    const input = document.getElementById('usernameInput');
    const error = document.getElementById('usernameError');
    const saveBtn = document.getElementById('saveUsernameBtn');

    if (!input || !error) return;

    const username = input.value.trim();

    // Validation
    if (username.length === 0) {
        error.textContent = 'Username cannot be empty';
        return;
    }

    if (username.length < 3) {
        error.textContent = 'Username must be at least 3 characters';
        return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        error.textContent = 'Username can only contain letters, numbers, _ and -';
        return;
    }

    error.textContent = '';

    if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
    }

    try {
        if (!window.supabaseData) {
            throw new Error('Service not available');
        }

        const result = await window.supabaseData.updateUsername(username);

        if (result.error) {
            throw new Error(result.error);
        }

        // Update the display
        const displayUsername = document.getElementById('displayUsername');
        if (displayUsername) {
            displayUsername.textContent = username;
        }

        closeUsernameModal();
    } catch (err) {
        error.textContent = 'Failed to save username: ' + err.message;
    } finally {
        if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save Username';
        }
    }
}

// Setup username modal event listeners
document.addEventListener('DOMContentLoaded', () => {
    const cancelBtn = document.getElementById('cancelUsernameBtn');
    const saveBtn = document.getElementById('saveUsernameBtn');
    const input = document.getElementById('usernameInput');
    const modal = document.getElementById('usernameModal');

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeUsernameModal);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveUsername);
    }

    if (input) {
        input.addEventListener('input', updateCharCount);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveUsername();
            }
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeUsernameModal();
            }
        });
    }
});

window.authCheck = {
    getCurrentUser: () => currentUser,
    isGuest: () => isGuest,
    requireAuth: requireAuth
};