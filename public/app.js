const API_URL = "/api/auth";

const authContainer = document.getElementById("authContainer");
const profileContainer = document.getElementById("profileContainer");
const regForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

async function apiRequest(endpoint, method = "GET", body) {
  const res = await fetch(API_URL + endpoint, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

async function checkAuth() {
  try {
    const user = await apiRequest("/profile");
    document.getElementById("userName").textContent = user.name;
    document.getElementById("userEmail").textContent = user.email;

    authContainer.classList.add("hidden");
    profileContainer.classList.remove("hidden");
  } catch (err) {
    authContainer.classList.remove("hidden");
    profileContainer.classList.add("hidden");
  }
}

regForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await apiRequest("/register", "POST", {
      name: regName.value,
      email: regEmail.value,
      password: regPass.value,
    });
    alert("Registration successful! Please login.");
    regForm.reset();
  } catch (err) {
    alert(err.message);
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    await apiRequest("/login", "POST", {
      email: loginEmail.value,
      password: loginPass.value,
    });
    checkAuth();
  } catch (err) {
    alert(err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await apiRequest("/logout", "POST");
    location.reload();
  } catch (err) {
    alert("Logout failed");
  }
});

function togglePassword(inputId) {
  const passwordInput = document.getElementById(inputId);
  const toggleBtn = passwordInput.nextElementSibling;

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Show";
  }
}
checkAuth();
