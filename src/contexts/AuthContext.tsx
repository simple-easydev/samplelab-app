import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { authManager } from '@/lib/supabase/auth-manager';

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
  needsOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
  needsOnboarding: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState(authManager.getState());

  useEffect(() => {
    // Initialize auth manager once (singleton handles multiple calls)
    authManager.initialize();

    // Subscribe to auth state changes
    const unsubscribe = authManager.subscribe((state) => {
      setAuthState(state);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
