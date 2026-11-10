// Product details page: product.html?id=<productId>
const holder = document.getElementById('productDetail');
const id = new URLSearchParams(window.location.search).get('id');

async function loadProduct() {
  if (!id) {
    holder.innerHTML = '<p class="error">No product selected. <a href="index.html">Back to shop</a></p>';
    return;
  }
  try {
    const p = await api(`/api/products/${id}`);
    document.title = `${p.name} — ShopLite`;
    holder.innerHTML = `
      <div class="detail">
        <img src="${p.image}" alt="${p.name}">
        <div class="detail-info">
          <span class="tag">${p.category}</span>
          <h1>${p.name}</h1>
          <p class="rating">★ ${Number(p.rating || 0).toFixed(1)} &nbsp;•&nbsp; ${p.stock} in stock</p>
          <p class="desc">${p.description}</p>
          <p class="price big">${money(p.price)}</p>
          <label class="qty-label">Quantity
            <input type="number" id="qty" value="1" min="1" max="99">
          </label>
          <div class="detail-actions">
            <button class="btn" id="addBtn">Add to Cart</button>
            <a class="btn btn-outline" href="cart.html">View Cart</a>
          </div>
        </div>
      </div>`;
    document.getElementById('addBtn').addEventListener('click', () => {
      const qty = Math.max(1, parseInt(document.getElementById('qty').value, 10) || 1);
      addToCart(p, qty);
    });
  } catch (err) {
    holder.innerHTML = `<p class="error">${err.message} <a href="index.html">Back to shop</a></p>`;
  }
}

loadProduct();
