// ── TOKEN HELPERS ──
const Auth = {
  getToken:   () => localStorage.getItem('parking_token'),
  getUser:    () => JSON.parse(localStorage.getItem('parking_user') || 'null'),
  setSession: (token, user) => {
    localStorage.setItem('parking_token', token);
    localStorage.setItem('parking_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('parking_token');
    localStorage.removeItem('parking_user');
  },
  isLoggedIn: () => !!localStorage.getItem('parking_token'),
  requireAuth: () => {
    if (!localStorage.getItem('parking_token')) {
      window.location.href = '/index.html';
      return false;
    }
    return true;
  },
};

// ── API HELPER ──
const API = {
  base: '/api',

  async request(method, path, body = null) {
    const headers = { 'Content-Type': 'application/json' };
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(this.base + path, opts);
    const data = await res.json();

    if (res.status === 401) {
      Auth.clear();
      window.location.href = '/index.html';
      return;
    }

    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
  },

  get:  (path)        => API.request('GET',  path),
  post: (path, body)  => API.request('POST', path, body),
};

// ── TOAST NOTIFICATIONS ──
function ensureToastContainer() {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    c.className = 'toast-container';
    document.body.appendChild(c);
  }
  return c;
}

function showToast(message, type = 'info', duration = 3500) {
  const container = ensureToastContainer();
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 280);
  }, duration);
}

// ── NAV USER INFO ──
function renderNavUser() {
  const user = Auth.getUser();
  const el = document.getElementById('nav-user-name');
  if (el && user) el.textContent = user.name;
}

function logout() {
  Auth.clear();
  window.location.href = '/index.html';
}
