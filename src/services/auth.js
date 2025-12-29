// Mock Auth Service

const MOCK_USER = {
  uid: 'mock-user-123',
  displayName: 'VerbaPlayer',
  photoURL: '',
  email: 'player@verba.com'
};

export const login = async (email, password) => {
  console.log(`[Mock Auth] Logging in with ${email}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: MOCK_USER });
    }, 500);
  });
};

export const register = async (email, password, name) => {
  console.log(`[Mock Auth] Registering ${name} (${email})`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ user: { ...MOCK_USER, displayName: name, email } });
    }, 500);
  });
};

export const logout = async () => {
  console.log('[Mock Auth] Logging out');
  return Promise.resolve();
};

export const onAuthStateChanged = (callback) => {
  // Simulate checking local storage or session
  const user = localStorage.getItem('verba_user');
  if (user) {
    callback(JSON.parse(user));
  } else {
    callback(null);
  }
};
