const API_BASE = "http://localhost:5000/api";

/* =====================
   TOKEN MANAGEMENT
===================== */

function saveToken(token) {
  localStorage.setItem("token", token);
}

function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

/* =====================
   AUTH REQUEST
===================== */

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Login failed");

  saveToken(data.token);
  return data;
}

/* =====================
   AUTH FETCH WRAPPER
===================== */

async function authFetch(url) {
  const token = getToken();

  const res = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (res.status === 401) {
    logout();
    throw new Error("Session expired");
  }

  return res;
}

/* =====================
   DATA APIS
===================== */

export async function getLatestData() {
  const res = await authFetch(`${API_BASE}/sensors/latest`);
  return res.json();
}

export async function getHistory() {
  const res = await authFetch(`${API_BASE}/sensors/history`);
  return res.json();
}

export async function getWeather(){
  const res = await fetch(`${API_BASE}/weather`);
  return res.json();
}
