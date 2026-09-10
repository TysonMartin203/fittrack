import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fittrack_user');
    return stored ? JSON.parse(stored) : null;
  });

  function login(data) {
    localStorage.setItem('fittrack_token', data.token);
    localStorage.setItem('fittrack_user',  JSON.stringify({ id: data.userId, username: data.username }));
    setUser({ id: data.userId, username: data.username });
  }

  function logout() {
    localStorage.removeItem('fittrack_token');
    localStorage.removeItem('fittrack_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
