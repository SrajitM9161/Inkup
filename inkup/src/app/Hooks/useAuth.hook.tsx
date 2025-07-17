
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe } from '../API/Api'; 

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  loading: true,
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('[Auth] Refreshing... Token:', token);

    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      const data = await getMe();
      console.log('[Auth] Me endpoint success:', data);
      setAuthenticated(true);
    } catch (err: any) {
      console.error('[Auth] Me endpoint error:', err?.response?.status, err?.response?.data);
      setAuthenticated(false);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
