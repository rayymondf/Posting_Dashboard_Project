export const API = {
  register: (username, password) => post('/api/auth/register', { username, password }),
  login: (username, password) => post('/api/auth/login', { username, password }),
  guestLogin: () => post('/api/auth/guest-login'),
  logout: () => post('/api/auth/logout'),
  me: async () => {
    const res = await fetch('/api/auth/me');
    if (res.status === 401) return null;
    return res.json();
  },
  getPosts: () => get('/api/posts'),
  createPost: (content) => post('/api/posts', { content }),
  toggleLike: (id) => post(`/api/posts/${id}/like`),
  getUsers: (search='') => get(`/api/users${search ? `?search=${encodeURIComponent(search)}`:''}`),
  getUser: (id) => get(`/api/users/${id}`),
};

async function get(url) {
  const res = await fetch(url);
  return res.json();
}

async function post(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}
