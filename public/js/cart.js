// Cart page: quantity controls, remove, totals, and checkout (login required).
const itemsHolder = document.getElementById('cartItems');
const summaryHolder = document.getElementById('cartSummary');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutMsg = document.getElementById('checkoutMsg');

function renderCart() {
  const cart = getCart();
  if (!cart.length) {
    itemsHolder.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
    summaryHolder.innerHTML = '';
    checkoutForm.style.display = 'none';
    return;
  }

  itemsHolder.innerHTML = cart.map((i) => `
    <div class="cart-row">
      <img src="${i.image}" alt="${i.name}">
      <div class="cart-row-info">
        <strong>${i.name}</strong>
        <span>${money(i.price)} each</span>
      </div>
      <div class="qty-controls">
        <button data-dec="${i.id}">−</button>
        <span>${i.qty}</span>
        <button data-inc="${i.id}">+</button>
      </div>
      <strong>${money(i.price * i.qty)}</strong>
      <button class="remove" data-remove="${i.id}" title="Remove">✕</button>
    </div>`).join('');

  summaryHolder.innerHTML = `
    <div class="summary-line"><span>Items</span><strong>${cartCount()}</strong></div>
    <div class="summary-line total"><span>Total</span><strong>${money(cartTotal())}</strong></div>`;

  itemsHolder.querySelectorAll('[data-inc]').forEach((b) => b.addEventListener('click', () => changeQty(b.dataset.inc, 1)));
  itemsHolder.querySelectorAll('[data-dec]').forEach((b) => b.addEventListener('click', () => changeQty(b.dataset.dec, -1)));
  itemsHolder.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => removeItem(b.dataset.remove)));
}

function changeQty(id, delta) {
  const cart = getCart();
  const line = cart.find((i) => i.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) saveCart(cart.filter((i) => i.id !== id));
  else saveCart(cart);
  renderCart();
}

function removeItem(id) {
  saveCart(getCart().filter((i) => i.id !== id));
  renderCart();
}

checkoutForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  checkoutMsg.textContent = '';

  // Checkout requires login.
  if (!getToken()) {
    window.location.href = 'login.html?next=cart.html';
    return;
  }

  const payload = {
    items: getCart().map((i) => ({ product: i.id, qty: i.qty })),
    shippingAddress: document.getElementById('address').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    paymentMethod: document.querySelector('input[name="pay"]:checked').value
  };

  try {
    const order = await api('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
    saveCart([]);
    checkoutMsg.innerHTML = `Order placed successfully! Order ID: <strong>${order._id}</strong> — see it under <a href="orders.html">My Orders</a>.`;
    renderCart();
  } catch (err) {
    checkoutMsg.textContent = err.message;
    checkoutMsg.classList.add('error');
  }
});

// If the visitor is not logged in, say so right away instead of at the end.
if (!getToken()) {
  checkoutMsg.innerHTML = 'You need to <a href="login.html?next=cart.html">log in</a> before checkout.';
}

renderCart();
