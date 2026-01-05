const API_URL = import.meta.env.DEV ? 'https://gvpixel_app.ddev.site/api/v1/auth' : 'https://gvpixel.app/api/v1/auth';

/**
 * Helper to handle fetch responses
 */
async function handleResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const error = (data && data.message) || response.statusText;
    throw new Error(error);
  }
  return data;
}

export const register = async ({ email, password, name, client_id, locale = 'en' }) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, client_id, locale })
  });
  return handleResponse(response);
};

export const login = async ({ email, password, client_id }) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, client_id })
  });
  const data = await handleResponse(response);
  if (data.access_token || data.token) {
    localStorage.setItem('auth_token', data.access_token || data.token);
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_data', JSON.stringify(data.user));
  }
  return data;
};

export const logout = async () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
  return Promise.resolve();
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) throw new Error('No refresh token available');

  const response = await fetch(`${API_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  });

  const data = await handleResponse(response);
  if (data.access_token) {
    localStorage.setItem('auth_token', data.access_token);
  }
  return data;
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user_data');
  return userStr ? JSON.parse(userStr) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};
