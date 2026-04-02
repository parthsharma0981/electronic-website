import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Initialize Auth state entirely from backend based on the auth_token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setUser(null);
        setLoadingInitial(false);
        return;
      }

      try {
        const { authService } = await import('../services/authService.js');
        const { data: profile } = await authService.getProfile();
        // Construct the expected user object from profile data + token
        setUser({ ...profile, token });
      } catch (err) {
        console.error('Failed to restore session from backend:', err);
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setLoadingInitial(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (creds: any) => {
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await (authService as any).login(creds);
      
      // Store ONLY the token in localStorage
      localStorage.setItem('auth_token', data.token);
      setUser(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      toast.error(message);
      throw err;
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      const { authService } = await import('../services/authService.js');
      const { data } = await (authService as any).register(userData);
      
      // Some register endpoints auto-login, if so store token
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        setUser(data);
      }
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    // Remove only the token
    localStorage.removeItem('auth_token');
    setUser(null);
    import('../services/authService.js').then(({ authService }) => {
       // Optional: call backend logout API if it exists
    });
    toast.success('Logged out');
  }, []);

  const updateUser = useCallback(async (updateData: any) => {
    try {
      const { authService } = await import('../services/authService.js');
      const { data: updatedData } = await authService.updateProfile(updateData);
      
      setUser((prev: any) => ({ ...prev, ...updatedData }));
      return updatedData;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      isAdmin: user?.role === 'admin',
      isVerified: user?.isEmailVerified,
      loadingInitial, 
    }}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): any => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
