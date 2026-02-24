import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { checkNeedsOnboarding } from '@/lib/supabase/onboarding';

export default function ProtectedRoute() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {

    console.log(" checking auth...")
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        const onboardingNeeded = await checkNeedsOnboarding();
        setNeedsOnboarding(onboardingNeeded);
      }
      
      setIsLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsAuthenticated(!!session);
      
      if (session) {
        const onboardingNeeded = await checkNeedsOnboarding();
        setNeedsOnboarding(onboardingNeeded);
      } else {
        setNeedsOnboarding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user needs onboarding and is not on the onboarding page, redirect there
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user doesn't need onboarding and is on the onboarding page, redirect to dashboard
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
