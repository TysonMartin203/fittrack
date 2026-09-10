const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
function getToken() { return localStorage.getItem('fittrack_token'); }

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { method, headers, body: body != null ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

async function uploadFile(path, formData) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const api = {
  register:      (b) => request('POST', '/api/auth/register', b),
  login:         (b) => request('POST', '/api/auth/login', b),
  uploadAvatar:  (fd) => uploadFile('/api/auth/avatar', fd),

  logWorkout:    (b)  => request('POST',   '/api/workouts', b),
  getWorkouts:   ()   => request('GET',    '/api/workouts'),
  deleteWorkout: (id) => request('DELETE', `/api/workouts/${id}`),

  getPRs: () => request('GET', '/api/prs'),

  uploadPhoto: (fd) => uploadFile('/api/photos', fd),
  getPhotos:   ()   => request('GET',    '/api/photos'),
  deletePhoto: (id) => request('DELETE', `/api/photos/${id}`),

  addFriend:    (b)   => request('POST', '/api/friends', b),
  acceptFriend: (rid) => request('PUT',  `/api/friends/${rid}/accept`, {}),
  getFriends:   ()    => request('GET',  '/api/friends'),

  sendMessage:     (b)   => request('POST', '/api/messages', b),
  getConversation: (fid) => request('GET',  `/api/messages/${fid}`),

  getMealPlan:      ()  => request('GET',  '/api/meals'),
  saveMealProfile:  (b) => request('PUT',  '/api/meals/profile', b),
  generateMealPlan: (b) => request('POST', '/api/meals/generate', b),
  swapMeal:         (b) => request('POST', '/api/meals/swap', b),

  fileUrl: (p) => p ? `${BASE}${p}` : null,
};
