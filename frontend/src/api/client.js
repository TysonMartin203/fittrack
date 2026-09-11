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

async function uploadFile(path, formData, method = 'POST') {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, { method, headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

function workoutFormData(payload, photoFile) {
  const fd = new FormData();
  fd.append('data', JSON.stringify(payload));
  if (photoFile) fd.append('photo', photoFile);
  return fd;
}

export const api = {
  register:      (b) => request('POST', '/api/auth/register', b),
  login:         (b) => request('POST', '/api/auth/login', b),
  uploadAvatar:  (fd) => uploadFile('/api/auth/avatar', fd),

  logWorkout:    (payload, photoFile) => uploadFile('/api/workouts', workoutFormData(payload, photoFile)),
  updateWorkout: (id, payload, photoFile) => uploadFile(`/api/workouts/${id}`, workoutFormData(payload, photoFile), 'PUT'),
  getWorkouts:   ()   => request('GET',    '/api/workouts'),
  getWorkout:    (id) => request('GET',    `/api/workouts/${id}`),
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

  listMealPlans:    ()     => request('GET',    '/api/meals'),
  getMealPlan:      (id)   => request('GET',    `/api/meals/${id}`),
  renameMealPlan:   (id,b) => request('PUT',    `/api/meals/${id}/name`, b),
  toggleFavorite:   (id)   => request('PUT',    `/api/meals/${id}/favorite`, {}),
  deleteMealPlan:   (id)   => request('DELETE', `/api/meals/${id}`),
  generateMealPlan: (b)    => request('POST',   '/api/meals/generate', b),
  swapMeal:         (b)    => request('POST',   '/api/meals/swap', b),

  getAchievements: () => request('GET', '/api/achievements'),

  getMealTemplates:  ()      => request('GET',  '/api/meals/templates'),
  useMealTemplate:   (id, b) => request('POST', `/api/meals/templates/${id}`, b),
  getMealRecipe:     (b)     => request('POST', '/api/meals/recipe', b),

  fileUrl: (p) => p ? `${BASE}${p}` : null,
};
