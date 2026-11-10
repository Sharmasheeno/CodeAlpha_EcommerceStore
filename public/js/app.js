// Home page: product grid with live search + category filter.
const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const statusMsg = document.getElementById('statusMsg');

async function loadCategories() {
  try {
    const categories = await api('/api/products/categories');
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      categorySelect.appendChild(opt);
    });
  } catch { /* the dropdown simply keeps "All categories" if the API is down */ }
}

async function loadProducts() {
  const params = new URLSearchParams();
  if (searchInput.value.trim()) params.set('search', searchInput.value.trim());
  if (categorySelect.value) params.set('category', categorySelect.value);

  statusMsg.textContent = 'Loading products…';
  grid.innerHTML = '';
  try {
    const products = await api(`/api/products?${params.toString()}`);
    statusMsg.textContent = products.length ? '' : 'No products match your search.';
    grid.innerHTML = products.map(cardHtml).join('');
    grid.querySelectorAll('[data-add]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const p = products.find((x) => x._id === btn.dataset.add);
        if (p) addToCart(p, 1);
      });
    });
  } catch (err) {
    statusMsg.textContent = err.message;
  }
}

function cardHtml(p) {
  return `
    <article class="card">
      <a href="product.html?id=${p._id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <div class="card-body">
        <span class="tag">${p.category}</span>
        <h3><a href="product.html?id=${p._id}">${p.name}</a></h3>
        <p class="rating">★ ${Number(p.rating || 0).toFixed(1)}</p>
        <div class="card-foot">
          <span class="price">${money(p.price)}</span>
          <button class="btn" data-add="${p._id}">Add to Cart</button>
        </div>
      </div>
    </article>`;
}

let debounce;
searchInput.addEventListener('input', () => {
  clearTimeout(debounce);
  debounce = setTimeout(loadProducts, 300);
});
categorySelect.addEventListener('change', loadProducts);

loadCategories().then(loadProducts);
