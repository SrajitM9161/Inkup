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
    try {
      const data = await getMe();
      console.log('[Auth] Authenticated user:', data);
      setAuthenticated(true);
    } catch (err) {
       console.warn('[Auth] Not authenticated');
      setAuthenticated(false);
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
