const API_URL = `${import.meta.env.VITE_BASE_URL}/${import.meta.env.VITE_API_BASE_URL}/auth`;

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

export const checkAuth = async () => {
  const token = localStorage.getItem('auth_token'); // Ensure we have a token before asking, or maybe the cookie is HttpOnly?
  // The user said "redirect to base_url + /login". This usually implies a cookie-based SSO or similar, OR we get a token back in URL.
  // BUT, usually if we redirect, we return with a token or code.
  // HOWEVER, the instruction "check the authorization from the base url" might mean fetch /me with credentials.
  // Given current `auth.js` uses Bearer tokens in localStorage, I will assume the external login sets the cookie or we need to fetch /me.
  // Actually, if we redirect to `base_url/login`, we might expect to be redirected BACK with a token?
  // User instruction is vague: "check the authorization from the base url".
  // If I look at the `register` and `login` functions, they expect JSON response with token.
  // If I redirect to a page, I'm not getting a JSON response directly in JS.
  // Use case: User clicks login -> goes to external site -> logs in -> redirects back to app (implied) -> App checks "Am I logged in?".
  // So `checkAuth` should probably hit an endpoint that returns the user if the session (cookie) is valid OR if the URL param has a token.
  // Since I don't see URL param parsing in the plan, I'll stick to hitting the API.
  // Use `handleResponse` which is already defined.

  try {
    // If we are relying on a browser session (cookies) shared with the API domain:
    // const response = await fetch(`${API_URL}/me`, { headers: { ... } });

    // But `gvPixel.js` and `auth.js` use `localStorage` token.
    // Maybe the "Authorization" check IS the way to get the token?
    // Or maybe the external login sets the cookie?
    // Let's assume we just hit /me. If it fails, we are not logged in.
    const response = await fetch(`${API_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // existing logic uses token from local storage, but if we just logged in externally, we might not have it yet?
        // Unless the external login writes to localStorage (impossible across domains) or sets a cookie.
        // I will verify if I should include 'Authorization': `Bearer ...`
        // If the redirect flow happens, the user comes back.
        // If the user said "check authorization from base url", it likely means "call the API to see if we are authorized".
        // I will try to use the token if it exists, or credentials include if cookie based.
        // Safe bet: Try to get current token.
        ...(localStorage.getItem('auth_token') ? { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` } : {})
      }
    });

    // If response is 401, handleResponse throws.
    const data = await handleResponse(response);
    return data;
  } catch (e) {
    // clear local storage if invalid?
    // localStorage.removeItem('auth_token');
    // localStorage.removeItem('user_data');
    throw e;
  }
};
