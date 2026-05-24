function formatApiUrl(url: string | undefined): string {
  if (!url) return 'http://localhost:4000';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
}

const API_URL = formatApiUrl(process.env.NEXT_PUBLIC_API_URL);

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: any = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, name: string, password: string) =>
    apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, name, password }) }),
  getSession: () =>
    apiFetch('/api/auth/session'),
};

// Registration APIs
export const registerApi = {
  createRegistration: (data: any) =>
    apiFetch('/api/register', { method: 'POST', body: JSON.stringify(data) }),
};

// Payment APIs
export const paymentApi = {
  verifyPayment: (data: any) =>
    Promise.reject(new Error('Payments are handled externally by SUN; this endpoint has been removed.')),
  getPaymentStatus: (teamId: string) =>
    Promise.reject(new Error('Payments are handled externally by SUN; this endpoint has been removed.')),
};

// Team APIs
export const teamApi = {
  getTeam: (teamId: string) =>
    apiFetch(`/api/teams/${teamId}`),
  getTeamByUserId: (userId: string) =>
    apiFetch(`/api/teams/user/${userId}`),
  updateTeam: (teamId: string, data: any) =>
    apiFetch(`/api/teams/${teamId}`, { method: 'PUT', body: JSON.stringify(data) }),
  submitProject: (teamId: string, data: any) =>
    apiFetch(`/api/teams/${teamId}/submit`, { method: 'POST', body: JSON.stringify(data) }),
};

// Admin APIs
export const adminApi = {
  getAnalytics: () =>
    apiFetch('/api/admin/analytics'),
  getParticipants: (page = 1, limit = 20) =>
    apiFetch(`/api/admin/participants?page=${page}&limit=${limit}`),
  approveTeam: (teamId: string) =>
    apiFetch(`/api/admin/participants/${teamId}/approve`, { method: 'PUT' }),
  rejectTeam: (teamId: string) =>
    apiFetch(`/api/admin/participants/${teamId}/reject`, { method: 'PUT' }),
  createAnnouncement: (data: any) =>
    apiFetch('/api/admin/announcements', { method: 'POST', body: JSON.stringify(data) }),
  getAnnouncements: () =>
    apiFetch('/api/admin/announcements'),
};

// Chat API
export const chatApi = {
  sendMessage: (message: string) =>
    apiFetch('/api/chat/message', { method: 'POST', body: JSON.stringify({ message }) }),
};