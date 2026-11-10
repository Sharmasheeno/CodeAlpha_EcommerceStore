// My Orders page: lists the logged-in user's orders.
const holder = document.getElementById('ordersList');

async function loadOrders() {
  if (!getToken()) {
    window.location.href = 'login.html?next=orders.html';
    return;
  }
  try {
    const orders = await api('/api/orders/my');
    if (!orders.length) {
      holder.innerHTML = '<p>You have no orders yet. <a href="index.html">Start shopping</a></p>';
      return;
    }
    holder.innerHTML = orders.map((o) => `
      <article class="order-card">
        <div class="order-head">
          <div><strong>Order</strong> ${o._id}<br><small>${new Date(o.createdAt).toLocaleString()}</small></div>
          <span class="status">${o.status}</span>
        </div>
        <ul class="order-items">
          ${o.items.map((i) => `<li>${i.name} × ${i.qty} — ${money(i.price * i.qty)}</li>`).join('')}
        </ul>
        <div class="order-foot">
          <span>Deliver to: ${o.shippingAddress} • ${o.phone} • ${o.paymentMethod}</span>
          <strong>Total: ${money(o.total)}</strong>
        </div>
      </article>`).join('');
  } catch (err) {
    holder.innerHTML = `<p class="error">${err.message}</p>`;
  }
}

loadOrders();
