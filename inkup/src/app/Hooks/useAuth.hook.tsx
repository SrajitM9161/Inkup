// 'use client';

// import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
// import { getMe } from '../API/Api';

// interface AuthContextType {
//   authenticated: boolean;
//   loading: boolean;
//   refreshAuth: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   authenticated: false,
//   loading: true,
//   refreshAuth: async () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   const refreshAuth = async () => {
//     try {
//       const data = await getMe();
//       console.log('[Auth] Authenticated user:', data);
//       setAuthenticated(true);
//     } catch (err) {
//        console.log(err)
//        console.warn('[Auth] Not authenticated');
//       setAuthenticated(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     refreshAuth();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ authenticated, loading, refreshAuth }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);







'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getMe } from '../api/api';

interface AuthContextType {
  authenticated: boolean;
  allowedUser: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  allowedUser: false,
  loading: true,
  refreshAuth: async () => {},
});

// Define the 3 allowed emails here (lowercase for safety)
const allowedEmails = [
  "neetuuno123@gmail.com",
  "dikshabb74@gmail.com",
  "anustup.mukherjee99@gmail.com",
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [allowedUser, setAllowedUser] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    try {
      const data = await getMe();
      console.log('[Auth] Authenticated user:', data);
      setAuthenticated(true);

      // Check if email exists and is in whitelist
      if (data.email && allowedEmails.includes(data.email.toLowerCase())) {
        setAllowedUser(true);
      } else {
        setAllowedUser(false);
      }
    } catch (err) {
      console.warn('[Auth] Not authenticated or error fetching user:', err);
      setAuthenticated(false);
      setAllowedUser(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, allowedUser, loading, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
