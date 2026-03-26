import { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_USERS } from '../data/demoData';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecore_user')) || null; }
    catch { return null; }
  });

  const login = useCallback(async (creds) => {
    // Check admin login first (parth / parth123)
    if (creds.email === 'parth' && creds.password === 'parth123') {
      const adminUser = { ...DEMO_USERS.admin };
      delete adminUser.password;
      localStorage.setItem('ecore_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }

    // Try backend first, fallback to demo data
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await authService.login(creds);
      localStorage.setItem('ecore_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch {
      // Demo login fallback — match by email
      const demoUser = Object.values(DEMO_USERS).find(u => u.email === creds.email);
      if (demoUser) {
        const safeUser = { ...demoUser };
        delete safeUser.password;
        localStorage.setItem('ecore_user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
      }
      // Auto-create demo user for any email/password
      const newUser = { ...DEMO_USERS.buyer, _id: 'u_' + Date.now(), name: creds.email.split('@')[0], email: creds.email };
      localStorage.setItem('ecore_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await authService.register(userData);
      localStorage.setItem('ecore_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch {
      // Demo register fallback
      const newUser = {
        _id: 'u_' + Date.now(),
        name: userData.name,
        email: userData.email,
        role: 'buyer',
        isEmailVerified: true,
        token: 'demo_token_' + Date.now(),
      };
      localStorage.setItem('ecore_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ecore_user');
    setUser(null);
    toast.success('Logged out');
  }, []);

  const updateUser = useCallback((data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('ecore_user', JSON.stringify(updated));
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isAdmin: user?.role === 'admin',
      isVerified: user?.isEmailVerified,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
