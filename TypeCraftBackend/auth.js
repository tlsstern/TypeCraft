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

    const username = document.getElementById('signupUsername').value.trim();
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Validate username
    if (username.length < 3) {
        showAlert('Username must be at least 3 characters long!', 'danger', false);
        return;
    }

    if (username.length > 20) {
        showAlert('Username must be 20 characters or less!', 'danger', false);
        return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showAlert('Username can only contain letters, numbers, _ and -', 'danger', false);
        return;
    }

    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long!', 'danger', false);
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            showAlert(error.message, 'danger', false);
        } else {
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                showAlert('A user with this email already exists.', 'warning', false);
            } else {
                // Save username to user_statistics table
                if (data.user) {
                    try {
                        const { error: statsError } = await supabaseClient
                            .from('user_statistics')
                            .insert({
                                user_id: data.user.id,
                                username: username
                            });

                        if (statsError) {
                            console.error('Error saving username:', statsError);
                        }
                    } catch (statsErr) {
                        console.error('Failed to save username:', statsErr);
                    }
                }

                showAlert('Sign up successful! Please check your email to verify your account.', 'success', false);
                setTimeout(() => {
                    flipCard.classList.remove('flipped');
                    signupForm.reset();
                }, 3000);
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
        window.location.href = 'index.html';
    }
}

const urlParams = new URLSearchParams(window.location.search);
if (!urlParams.get('skip')) {
    checkSession();
}

supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
        window.location.href = 'index.html';
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