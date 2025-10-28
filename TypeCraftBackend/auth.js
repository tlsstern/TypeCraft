const SUPABASE_URL = 'https://dvrszdvttojjtdzfapne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnN6ZHZ0dG9qanRkemZhcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjM1NTAsImV4cCI6MjA3Mjk5OTU1MH0.4TCKEgLSxASL1tmKzLb-wU1uCqm2ooK2vKLwuNMMKXg';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const themes = {
    dark: {
        '--bg-color': '#1a1a1a',
        '--text-color': '#fff',
        '--header-bg': '#2a2a2a',
        '--typing-area-bg': '#2a2a2a',
        '--char-color': '#666',
        '--correct-color': '#4caf50',
        '--incorrect-color': '#f44336',
        '--cursor-color': '#fff',
        '--button-bg': '#333',
        '--button-hover-bg': '#444'
    },
    light: {
        '--bg-color': '#f5f5f5',
        '--text-color': '#2a2a2a',
        '--header-bg': '#ffffff',
        '--typing-area-bg': '#ffffff',
        '--char-color': '#999999',
        '--correct-color': '#4caf50',
        '--incorrect-color': '#f44336',
        '--cursor-color': '#2196f3',
        '--button-bg': '#e0e0e0',
        '--button-hover-bg': '#d0d0d0'
    },
    pastel: {
        '--bg-color': '#fce4ec',
        '--text-color': '#5d4e60',
        '--header-bg': '#fff0f5',
        '--typing-area-bg': '#fff0f5',
        '--char-color': '#c9b2c7',
        '--correct-color': '#81c784',
        '--incorrect-color': '#ef5350',
        '--cursor-color': '#9c27b0',
        '--button-bg': '#f8bbd0',
        '--button-hover-bg': '#f48fb1'
    },
    mint: {
        '--bg-color': '#e8f5e9',
        '--text-color': '#1b5e20',
        '--header-bg': '#f1f8e9',
        '--typing-area-bg': '#f1f8e9',
        '--char-color': '#81c784',
        '--correct-color': '#43a047',
        '--incorrect-color': '#e53935',
        '--cursor-color': '#2e7d32',
        '--button-bg': '#c8e6c9',
        '--button-hover-bg': '#a5d6a7'
    },
    sunshine: {
        '--bg-color': '#fff8e1',
        '--text-color': '#f57c00',
        '--header-bg': '#fffde7',
        '--typing-area-bg': '#fffde7',
        '--char-color': '#ffb74d',
        '--correct-color': '#ffa726',
        '--incorrect-color': '#d32f2f',
        '--cursor-color': '#ff9800',
        '--button-bg': '#ffe0b2',
        '--button-hover-bg': '#ffcc80'
    },
    lavender: {
        '--bg-color': '#ede7f6',
        '--text-color': '#4527a0',
        '--header-bg': '#f3e5f5',
        '--typing-area-bg': '#f3e5f5',
        '--char-color': '#9575cd',
        '--correct-color': '#7e57c2',
        '--incorrect-color': '#e91e63',
        '--cursor-color': '#673ab7',
        '--button-bg': '#d1c4e9',
        '--button-hover-bg': '#b39ddb'
    },
    synthwave: {
        '--bg-color': '#1a1a2e',
        '--text-color': '#ff2d95',
        '--header-bg': '#16213e',
        '--typing-area-bg': '#16213e',
        '--char-color': '#4d4d8d',
        '--correct-color': '#00fff5',
        '--incorrect-color': '#ff124f',
        '--cursor-color': '#ff2d95',
        '--button-bg': '#16213e',
        '--button-hover-bg': '#1a1a2e'
    },
    matrix: {
        '--bg-color': '#0d0d0d',
        '--text-color': '#00ff41',
        '--header-bg': '#1a1a1a',
        '--typing-area-bg': '#1a1a1a',
        '--char-color': '#005f00',
        '--correct-color': '#00ff41',
        '--incorrect-color': '#ff0000',
        '--cursor-color': '#00ff41',
        '--button-bg': '#1a1a1a',
        '--button-hover-bg': '#2a2a2a'
    },
    sunset: {
        '--bg-color': '#1a1517',
        '--text-color': '#ff7b00',
        '--header-bg': '#2a1f20',
        '--typing-area-bg': '#2a1f20',
        '--char-color': '#664d4d',
        '--correct-color': '#ffd700',
        '--incorrect-color': '#ff3333',
        '--cursor-color': '#ff7b00',
        '--button-bg': '#2a1f20',
        '--button-hover-bg': '#3a2f30'
    },
    ocean: {
        '--bg-color': '#1a1a2e',
        '--text-color': '#00ffff',
        '--header-bg': '#1f2937',
        '--typing-area-bg': '#1f2937',
        '--char-color': '#4d4d8d',
        '--correct-color': '#00ffff',
        '--incorrect-color': '#ff6b6b',
        '--cursor-color': '#00ffff',
        '--button-bg': '#1f2937',
        '--button-hover-bg': '#2d3748'
    },
    coffee: {
        '--bg-color': '#1a1412',
        '--text-color': '#d4b483',
        '--header-bg': '#2a201c',
        '--typing-area-bg': '#2a201c',
        '--char-color': '#665c57',
        '--correct-color': '#d4b483',
        '--incorrect-color': '#854442',
        '--cursor-color': '#d4b483',
        '--button-bg': '#2a201c',
        '--button-hover-bg': '#3a302c'
    },
    terminal: {
        '--bg-color': '#0a0f14',
        '--text-color': '#98d1ce',
        '--header-bg': '#1a1f24',
        '--typing-area-bg': '#1a1f24',
        '--char-color': '#4d5a5e',
        '--correct-color': '#859900',
        '--incorrect-color': '#dc322f',
        '--cursor-color': '#98d1ce',
        '--button-bg': '#1a1f24',
        '--button-hover-bg': '#2a2f34'
    },
    neon: {
        '--bg-color': '#0a0a1f',
        '--text-color': '#00ffff',
        '--header-bg': '#1a1a3c',
        '--typing-area-bg': '#1a1a3c',
        '--char-color': '#4d4d99',
        '--correct-color': '#00ff00',
        '--incorrect-color': '#ff00ff',
        '--cursor-color': '#00ffff',
        '--button-bg': '#1a1a3c',
        '--button-hover-bg': '#2a2a4c'
    },
    forest: {
        '--bg-color': '#1a2213',
        '--text-color': '#90ee90',
        '--header-bg': '#2a321f',
        '--typing-area-bg': '#2a321f',
        '--char-color': '#5c6657',
        '--correct-color': '#90ee90',
        '--incorrect-color': '#ff6b6b',
        '--cursor-color': '#90ee90',
        '--button-bg': '#2a321f',
        '--button-hover-bg': '#3a422f'
    }
};

function applyTheme(themeName) {
    const theme = themes[themeName] || themes.dark;
    Object.entries(theme).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
    });
    document.body.setAttribute('data-theme', themeName);
}
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    applyTheme(savedTheme);
});

const flipCard = document.getElementById('flipCard');
const showSignupLink = document.getElementById('showSignup');
const showLoginLink = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const alertContainerFront = document.getElementById('alertContainerFront');
const alertContainerBack = document.getElementById('alertContainerBack');

// Username validation state
let usernameCheckTimeout = null;
let isUsernameValid = false;

// Real-time username availability check
async function checkUsernameAvailability(username, hintElementId) {
    const hintElement = document.getElementById(hintElementId);

    if (!username || username.length < 3) {
        hintElement.style.color = 'var(--char-color)';
        hintElement.textContent = 'Username must be at least 3 characters';
        isUsernameValid = false;
        return;
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        hintElement.style.color = 'var(--incorrect-color)';
        hintElement.textContent = 'Only letters, numbers, underscores, and hyphens allowed';
        isUsernameValid = false;
        return;
    }

    hintElement.style.color = 'var(--char-color)';
    hintElement.textContent = 'Checking availability...';

    try {
        const { data: isAvailable, error } = await supabaseClient.rpc('is_username_available', {
            username_to_check: username
        });

        if (error) {
            hintElement.style.color = 'var(--incorrect-color)';
            hintElement.textContent = 'Error checking username';
            isUsernameValid = false;
            return;
        }

        if (isAvailable) {
            hintElement.style.color = 'var(--correct-color)';
            hintElement.textContent = '✓ Username is available!';
            isUsernameValid = true;
        } else {
            hintElement.style.color = 'var(--incorrect-color)';
            hintElement.textContent = '✗ Username is already taken';
            isUsernameValid = false;
        }
    } catch (error) {
        hintElement.style.color = 'var(--incorrect-color)';
        hintElement.textContent = 'Error checking username';
        isUsernameValid = false;
    }
}

function showAlert(message, type = 'danger', isFront = true) {
    const container = isFront ? alertContainerFront : alertContainerBack;
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible">
            ${message}
            <button type="button" class="close" onclick="this.parentElement.remove()">
                <span>&times;</span>
            </button>
        </div>
    `;
    container.innerHTML = alertHtml;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    flipCard.classList.add('flipped');
    alertContainerFront.innerHTML = '';
    alertContainerBack.innerHTML = '';
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    flipCard.classList.remove('flipped');
    alertContainerFront.innerHTML = '';
    alertContainerBack.innerHTML = '';
});

// No need for signup username checking anymore since it's removed from the form

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            showAlert(error.message, 'danger', true);
        } else {
            showAlert('Login successful! Redirecting...', 'success', true);
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    } catch (error) {
        showAlert('An unexpected error occurred. Please try again.', 'danger', true);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'danger', false);
        return;
    }

    try {
        // Sign up the user
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            showAlert(error.message, 'danger', false);
        } else {
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showAlert('A user with this email already exists.', 'warning', false);
            } else if (data.user) {
                showAlert('Account created! Please check your email to verify your account.', 'success', false);

                // Wait 2 seconds then show username modal
                setTimeout(() => {
                    // Hide the flip card
                    document.querySelector('.container').style.display = 'none';
                    // Show username modal
                    showUsernameModal();
                }, 2000);
            }
        }
    } catch (error) {
        showAlert('An unexpected error occurred. Please try again.', 'danger', false);
    }
});

document.getElementById('googleLogin').addEventListener('click', async () => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) {
            showAlert(error.message, 'danger', true);
        }
    } catch (error) {
        showAlert('Failed to initialize Google login. Please try again.', 'danger', true);
    }
});

document.getElementById('googleSignup').addEventListener('click', async () => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) {
            showAlert(error.message, 'danger', false);
        }
    } catch (error) {
        showAlert('Failed to initialize Google signup. Please try again.', 'danger', false);
    }
});

document.getElementById('githubLogin').addEventListener('click', async () => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) {
            showAlert(error.message, 'danger', true);
        }
    } catch (error) {
        showAlert('Failed to initialize GitHub login. Please try again.', 'danger', true);
    }
});

document.getElementById('githubSignup').addEventListener('click', async () => {
    try {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin + '/index.html'
            }
        });

        if (error) {
            showAlert(error.message, 'danger', false);
        }
    } catch (error) {
        showAlert('Failed to initialize GitHub signup. Please try again.', 'danger', false);
    }
});

async function checkSession() {
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session) {
        // Check if user has a username
        await checkAndPromptUsername(session.user);
    }
}

async function checkAndPromptUsername(user) {
    try {
        // Check if user already has a username
        const { data, error } = await supabaseClient
            .from('usernames')
            .select('username')
            .eq('user_id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') {
            // PGRST116 is "not found" error, which is expected for new users
            console.error('Error checking username:', error);
        }

        if (!data) {
            // User doesn't have a username, show modal
            showUsernameModal();
        } else {
            // User has a username, redirect to main app
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('Error in checkAndPromptUsername:', error);
        window.location.href = 'index.html';
    }
}

let usernameModalInitialized = false;

function handleUsernameInput(e) {
    clearTimeout(usernameCheckTimeout);
    const username = e.target.value;

    usernameCheckTimeout = setTimeout(() => {
        checkUsernameAvailability(username, 'oauthUsernameHint');
    }, 500);
}

async function handleSetUsername() {
    const oauthUsernameInput = document.getElementById('oauthUsername');
    const setUsernameBtn = document.getElementById('setUsernameBtn');
    const username = oauthUsernameInput.value;

    if (!isUsernameValid) {
        document.getElementById('oauthUsernameHint').style.color = 'var(--incorrect-color)';
        document.getElementById('oauthUsernameHint').textContent = 'Please choose a valid, available username';
        return;
    }

    setUsernameBtn.disabled = true;
    setUsernameBtn.textContent = 'Setting up...';

    // Wait 1.5 seconds before setting username
    setTimeout(async () => {
        try {
            const { error } = await supabaseClient.rpc('set_username', {
                new_username: username
            });

            if (error) {
                document.getElementById('oauthUsernameHint').style.color = 'var(--incorrect-color)';
                document.getElementById('oauthUsernameHint').textContent = 'Failed to set username: ' + error.message;
                setUsernameBtn.disabled = false;
                setUsernameBtn.textContent = 'Continue';
            } else {
                document.getElementById('oauthUsernameHint').style.color = 'var(--correct-color)';
                document.getElementById('oauthUsernameHint').textContent = 'Username set successfully! Redirecting...';
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }
        } catch (error) {
            document.getElementById('oauthUsernameHint').style.color = 'var(--incorrect-color)';
            document.getElementById('oauthUsernameHint').textContent = 'An error occurred. Please try again.';
            setUsernameBtn.disabled = false;
            setUsernameBtn.textContent = 'Continue';
        }
    }, 1500);
}

function showUsernameModal() {
    const modal = document.getElementById('usernameModal');
    const oauthUsernameInput = document.getElementById('oauthUsername');
    const setUsernameBtn = document.getElementById('setUsernameBtn');

    modal.style.display = 'flex';

    // Initialize event listeners only once
    if (!usernameModalInitialized) {
        oauthUsernameInput.addEventListener('input', handleUsernameInput);
        setUsernameBtn.addEventListener('click', handleSetUsername);
        usernameModalInitialized = true;
    }

    // Reset the input and button state
    oauthUsernameInput.value = '';
    setUsernameBtn.disabled = false;
    setUsernameBtn.textContent = 'Continue';
    document.getElementById('oauthUsernameHint').style.color = 'var(--char-color)';
    document.getElementById('oauthUsernameHint').textContent = 'Username can only contain letters, numbers, underscores, and hyphens';
    isUsernameValid = false;
}

const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.get('skip')) {
    checkSession();
}

supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        await checkAndPromptUsername(session.user);
    }
});

function skipAuth() {
    localStorage.setItem('skipAuth', 'true');
    window.location.href = 'index.html';
}
window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
    applyTheme(savedTheme);
});