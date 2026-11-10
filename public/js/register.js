// Registration page.
const form = document.getElementById('registerForm');
const msg = document.getElementById('formMsg');
const next = new URLSearchParams(window.location.search).get('next') || 'index.html';

const loginLink = document.getElementById('toLogin');
if (loginLink && next !== 'index.html') loginLink.href = `login.html?next=${encodeURIComponent(next)}`;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      })
    });
    setSession(data.token, data.user);
    window.location.href = next;
  } catch (err) {
    msg.textContent = err.message;
  }
});
