import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { checkNeedsOnboarding } from '@/lib/supabase/onboarding';

export default function PublicRoute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
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

  if (isAuthenticated) {
    // Redirect to onboarding if needed, otherwise to dashboard
    return <Navigate to={needsOnboarding ? "/onboarding" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
