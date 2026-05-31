import { login } from "./api.js";

const form = document.getElementById("loginForm");
const error = document.getElementById("error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  try {
    await login(email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    error.textContent = err.message;
  }
});
