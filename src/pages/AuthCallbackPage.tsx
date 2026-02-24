import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { session, isLoading, needsOnboarding } = useAuth();

  useEffect(() => {
    // Wait for auth context to initialize
    if (isLoading) return;

    if (session) {
      // Redirect based on onboarding status
      navigate(needsOnboarding ? '/onboarding' : '/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [session, isLoading, needsOnboarding, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Processing authentication...</p>
      </div>
    </div>
  );
}
