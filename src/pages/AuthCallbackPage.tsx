import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

declare global {
  interface Window {
    _learnq?: any[];
  }
}


function ensureKlaviyoLoaded(companyId: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  window._learnq = window._learnq ?? [];

  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-klaviyo-company-id="${companyId}"]`
  );
  if (existing) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${encodeURIComponent(companyId)}`;
  s.setAttribute('data-klaviyo-company-id', companyId);
  document.head.appendChild(s);
}

function isGoogleProvider(user: any) {
  const provider = user?.app_metadata?.provider;
  const providers: unknown = user?.app_metadata?.providers;
  return (
    provider === 'google' ||
    (Array.isArray(providers) && providers.includes('google'))
  );
}

function isLikelyFirstSignIn(user: any) {
  // Supabase user often exposes both of these ISO strings.
  const createdAt = user?.created_at ? Date.parse(user.created_at) : NaN;
  const lastSignInAt = user?.last_sign_in_at ? Date.parse(user.last_sign_in_at) : NaN;
  if (!Number.isFinite(createdAt) || !Number.isFinite(lastSignInAt)) return false;

  // Heuristic: first sign-in tends to have near-identical timestamps.
  return Math.abs(lastSignInAt - createdAt) <= 10_000;
}

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const { session, isLoading, needsOnboarding } = useAuth();

  useEffect(() => {
    // Wait for auth context to initialize
    if (isLoading) return;

    if (session) {
      // Client-side Klaviyo: fire once for Google first-time sign-ups
      try {
        const user = session.user as any;
        const email: string | undefined = user?.email ?? undefined;
        const shouldTrack =
          !!email && isGoogleProvider(user) && isLikelyFirstSignIn(user);

        if (shouldTrack) {
          const dedupeKey = `klaviyo:google-signup:${user.id}`;
          if (!window.localStorage.getItem(dedupeKey)) {
            ensureKlaviyoLoaded("WYxquu");
            window._learnq?.push([
              'identify',
              {
                $id: user.id,
                $email: email,
              },
            ]);
            window._learnq?.push([
              'track',
              'Google Sign Up',
              {
                provider: 'google',
              },
            ]);
            window.localStorage.setItem(dedupeKey, '1');
          }
        }
      } catch (e) {
        // Never block login redirects on analytics.
        console.warn('Klaviyo tracking skipped:', e);
      }

      // Redirect based on onboarding status
      navigate(needsOnboarding ? '/onboarding' : '/dashboard/discover', { replace: true });
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
