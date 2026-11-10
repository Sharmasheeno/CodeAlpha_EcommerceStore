// Login page.
const form = document.getElementById('loginForm');
const msg = document.getElementById('formMsg');
const next = new URLSearchParams(window.location.search).get('next') || 'index.html';

// Keep the "next" destination when linking through to registration.
const regLink = document.getElementById('toRegister');
if (regLink && next !== 'index.html') regLink.href = `register.html?next=${encodeURIComponent(next)}`;

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg.textContent = '';
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
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
