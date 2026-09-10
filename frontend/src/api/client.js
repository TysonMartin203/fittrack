// Base URL: reads from environment variable so it works both locally and deployed
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('fittrack_token');
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status });
  return data;
}

async function uploadPhoto(formData) {
  const token = getToken();
  const res = await fetch(`${BASE}/api/photos`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export const api = {
  // Auth
  register: (body) => request('POST', '/api/auth/register', body),
  login:    (body) => request('POST', '/api/auth/login',    body),

  // Workouts
  logWorkout:    (body) => request('POST',   '/api/workouts',     body),
  getWorkouts:   ()     => request('GET',    '/api/workouts'),
  deleteWorkout: (id)   => request('DELETE', `/api/workouts/${id}`),

  // PRs
  getPRs: () => request('GET', '/api/prs'),

  // Photos
  uploadPhoto,
  getPhotos:   ()   => request('GET',    '/api/photos'),
  deletePhoto: (id) => request('DELETE', `/api/photos/${id}`),

  // Friends
  addFriend:     (body)        => request('POST', '/api/friends',                         body),
  acceptFriend:  (requesterId) => request('PUT',  `/api/friends/${requesterId}/accept`,   {}),
  getFriends:    ()            => request('GET',  '/api/friends'),

  // Messages
  sendMessage:     (body)     => request('POST', '/api/messages',            body),
  getConversation: (friendId) => request('GET',  `/api/messages/${friendId}`),

  // Helpers
  photoUrl: (filePath) => `${BASE}${filePath}`,
};
