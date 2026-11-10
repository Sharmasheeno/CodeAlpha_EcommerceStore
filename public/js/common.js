// Shared helpers: API calls, login state (localStorage), and the cart.
const API = ''; // same origin — the Express server hosts both API and frontend

// ---------- Auth ----------
function getToken() { return localStorage.getItem('ca_token'); }
function getUser() {
  try { return JSON.parse(localStorage.getItem('ca_user')); } catch { return null; }
}
function setSession(token, user) {
  localStorage.setItem('ca_token', token);
  localStorage.setItem('ca_user', JSON.stringify(user));
}
function logout() {
  localStorage.removeItem('ca_token');
  localStorage.removeItem('ca_user');
  window.location.href = 'index.html';
}

// ---------- API ----------
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

// ---------- Cart (stored client-side in localStorage) ----------
function getCart() {
  try { return JSON.parse(localStorage.getItem('ca_cart')) || []; } catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem('ca_cart', JSON.stringify(cart));
  renderCartBadge();
}
function addToCart(product, qty = 1) {
  const cart = getCart();
  const line = cart.find((i) => i.id === product._id);
  if (line) line.qty += qty;
  else cart.push({ id: product._id, name: product.name, price: product.price, image: product.image, qty });
  saveCart(cart);
  toast(`Added "${product.name}" to cart.`);
}
function cartCount() { return getCart().reduce((sum, i) => sum + i.qty, 0); }
function cartTotal() { return getCart().reduce((sum, i) => sum + i.price * i.qty, 0); }
function renderCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = cartCount();
}

// ---------- UI ----------
function money(n) { return `$${Number(n).toFixed(2)}`; }
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}
function renderAuthLinks() {
  const holder = document.getElementById('authLinks');
  if (!holder) return;
  const user = getUser();
  holder.innerHTML = user
    ? `<span class="hello">Hi, ${user.name.split(' ')[0]}</span>
       <a href="orders.html">My Orders</a>
       <a href="#" id="logoutLink">Logout</a>`
    : `<a href="login.html">Login</a><a href="register.html" class="btn-small">Register</a>`;
  const link = document.getElementById('logoutLink');
  if (link) link.addEventListener('click', (e) => { e.preventDefault(); logout(); });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCartBadge();
  renderAuthLinks();
});
