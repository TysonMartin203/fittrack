import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('fittrack_user') || 'null'); }
    catch { return null; }
  });

  function login(data) {
    const u = { id: data.userId, username: data.username, email: data.email, avatarUrl: data.avatarUrl || null };
    localStorage.setItem('fittrack_token', data.token);
    localStorage.setItem('fittrack_user', JSON.stringify(u));
    setUser(u);
  }

  function updateUser(updates) {
    const u = { ...user, ...updates };
    localStorage.setItem('fittrack_user', JSON.stringify(u));
    setUser(u);
  }

  function logout() {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
