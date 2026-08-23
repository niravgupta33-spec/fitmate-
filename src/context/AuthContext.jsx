// AuthContext — Authentication State (Lectures 49-54)
import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser, removeUser] = useLocalStorage('fitmate-user', null);

  const login = useCallback((email, password) => {
    // Simulated auth — check stored users
    const users = JSON.parse(localStorage.getItem('fitmate-users') || '[]');
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  }, [setUser]);

  const register = useCallback((name, email, password) => {
    const users = JSON.parse(localStorage.getItem('fitmate-users') || '[]');
    if (users.find((u) => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }
    const newUser = { id: Date.now().toString(), name, email, password, joinedAt: new Date().toISOString() };
    users.push(newUser);
    localStorage.setItem('fitmate-users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    return { success: true };
  }, [setUser]);

  const logout = useCallback(() => {
    removeUser();
  }, [removeUser]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
