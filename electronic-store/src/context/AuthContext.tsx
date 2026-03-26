import { createContext, useContext, useState, useCallback } from 'react';
import { DEMO_USERS } from '../data/demoData';
import toast from 'react-hot-toast';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(() => {
    try { return JSON.parse(localStorage.getItem('ecore_user') || 'null') || null; }
    catch { return null; }
  });

  const login = useCallback(async (creds: any) => {
    // Check admin login first (parth / parth123)
    if (creds.email === 'parth' && creds.password === 'parth123') {
      const adminUser: any = { ...(DEMO_USERS as any).admin };
      delete adminUser.password;
      localStorage.setItem('ecore_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return adminUser;
    }

    // Try backend first, fallback to demo data
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await (authService as any).login(creds);
      localStorage.setItem('ecore_user', JSON.stringify(data));
      setUser(data);
      return data;
    } catch {
      // Demo login fallback — match by email
      const demoUser: any = Object.values(DEMO_USERS as any).find((u: any) => u.email === creds.email);
      if (demoUser) {
        const safeUser: any = { ...demoUser };
        delete safeUser.password;
        localStorage.setItem('ecore_user', JSON.stringify(safeUser));
        setUser(safeUser);
        return safeUser;
      }
      // Auto-create demo user for any email/password
      const newUser = { ...(DEMO_USERS as any).buyer, _id: 'u_' + Date.now(), name: creds.email.split('@')[0], email: creds.email };
      localStorage.setItem('ecore_user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await (authService as any).register(userData);
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

  const updateUser = useCallback((data: any) => {
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

export const useAuth = (): any => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
