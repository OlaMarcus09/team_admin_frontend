import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Team API methods
export const teamAPI = {
  // Dashboard
  getDashboard: () => api.get('/api/team/dashboard/'),
  
  // Members
  getMembers: () => api.get('/api/team/members/'),
  inviteMember: (email) => api.post('/api/team/invites/', { email }),
  removeMember: (id) => api.delete(`/api/team/members/${id}/`),
  
  // Invites
  getInvites: () => api.get('/api/team/invites/'),
  revokeInvite: (id) => api.delete(`/api/team/invites/${id}/`),
  
  // Billing
  getBilling: () => api.get('/api/team/billing/'),
  updateSubscription: (planId) => api.post('/api/team/billing/update-plan/', { plan_id: planId }),
  
  // Settings
  getSettings: () => api.get('/api/team/settings/'),
  updateSettings: (data) => api.put('/api/team/settings/', data),
};

export default api;
