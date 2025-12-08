import api from '../lib/api';

// Authentication API calls
export const authService = {
  // Register new user
  register: async (email, password, fullName) => {
    const response = await api.post('/auth/register', {
      email,
      password,
      fullName,
    });
    
    // Save token and user to localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    
    // Save token and user to localStorage
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  // Logout user
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    
    // Update user in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },

  // Update profile
  updateProfile: async (fullName, avatarUrl) => {
    const response = await api.put('/auth/profile', {
      fullName,
      avatarUrl,
    });
    
    // Update user in localStorage
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return await api.put('/auth/password', {
      currentPassword,
      newPassword,
    });
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Check if user is admin
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'ADMIN';
  },
};

export default authService;