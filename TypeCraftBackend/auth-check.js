const SUPABASE_URL = "https://dvrszdvttojjtdzfapne.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2cnN6ZHZ0dG9qanRkemZhcG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0MjM1NTAsImV4cCI6MjA3Mjk5OTU1MH0.4TCKEgLSxASL1tmKzLb-wU1uCqm2ooK2vKLwuNMMKXg";

let currentUser = null;
let isGuest = false;

const { createClient } = window.supabase || {};
const supabaseClient = createClient
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

async function checkAuthStatus() {
  if (localStorage.getItem("skipAuth") === "true") {
    isGuest = true;
    updateUIForGuest();
    return;
  }

  if (supabaseClient) {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

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

function updateUIForUser(user) {
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    userDisplay.innerHTML = `
            <span>Welcome, ${user.email}</span>
        `;
  }

  const accountSection = document.getElementById("accountSection");
  const userEmailDisplay = document.getElementById("userEmailDisplay");
  if (accountSection && userEmailDisplay) {
    accountSection.style.display = "block";
    userEmailDisplay.textContent = user.email;
  }

  enableAuthFeatures();
}

function updateUIForGuest() {
  const userDisplay = document.getElementById("userDisplay");
  if (userDisplay) {
    userDisplay.innerHTML = `
            <a href="login.html" class="btn-login">Sign In</a>
            <span>Guest Mode</span>
        `;
  }

  limitGuestFeatures();
}

function enableAuthFeatures() {
  document.querySelectorAll(".auth-required").forEach((el) => {
    el.classList.remove("disabled");
    el.removeAttribute("disabled");
  });
}

function limitGuestFeatures() {
  document.querySelectorAll(".auth-required").forEach((el) => {
    el.classList.add("disabled");
    el.setAttribute("disabled", "true");
    el.setAttribute("title", "Sign in to use this feature");
  });
}

async function logout() {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }
  localStorage.removeItem("skipAuth");
  window.location.href = "login.html";
}

function requireAuth(callback) {
  if (currentUser) {
    callback();
  } else {
    if (
      confirm("This feature requires sign in. Would you like to sign in now?")
    ) {
      localStorage.removeItem("skipAuth");
      window.location.href = "login.html";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus();
});

if (supabaseClient) {
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session) {
      currentUser = session.user;
      isGuest = false;
      localStorage.removeItem("skipAuth");
      updateUIForUser(currentUser);
    } else if (event === "SIGNED_OUT") {
      currentUser = null;
      isGuest = true;
      updateUIForGuest();
    }
  });
}

window.authCheck = {
  getCurrentUser: () => currentUser,
  isGuest: () => isGuest,
  requireAuth: requireAuth,
};
