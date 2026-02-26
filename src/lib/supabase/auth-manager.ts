import { Session } from '@supabase/supabase-js';
import { supabase } from './client';
import { checkNeedsOnboarding } from './onboarding';

type AuthState = {
  session: Session | null;
  isLoading: boolean;
  needsOnboarding: boolean;
};

type Listener = (state: AuthState) => void;

/**
 * Singleton auth manager that exists outside React lifecycle
 * Prevents multiple subscriptions and lock contention
 */
class AuthManager {
  private state: AuthState = {
    session: null,
    isLoading: true,
    needsOnboarding: false,
  };

  private listeners = new Set<Listener>();
  private subscription: ReturnType<typeof supabase.auth.onAuthStateChange> | null = null;
  private isInitialized = false;
  private isInitializing = false; // Prevent race condition during initialization

  /**
   * Initialize the auth subscription (only called once)
   */
  initialize() {
    // Check if already initialized OR currently initializing
    if (this.isInitialized || this.isInitializing) {
      console.log('AuthManager already initialized or initializing');
      return;
    }

    console.log('Initializing AuthManager');
    this.isInitializing = true; // Set flag immediately to block concurrent calls

    // Single auth subscription for entire app lifetime
    this.subscription = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('AuthManager event:', event, !!currentSession);

      // Pass session directly to avoid additional getUser() call that causes lock contention
      const needsOnboarding = currentSession ? await checkNeedsOnboarding(currentSession) : false;

      this.state = {
        session: currentSession,
        isLoading: false,
        needsOnboarding,
      };

      // Notify all listeners
      this.notifyListeners();
    });

    // Mark as fully initialized
    this.isInitialized = true;
    this.isInitializing = false;
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.state);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get current auth state
   */
  getState() {
    return this.state;
  }

  /**
   * Force refresh user session and metadata
   * Useful after webhook updates or payment completion
   */
  async refreshUserData() {
    try {
      console.log('🔄 Refreshing user data...');
      
      // Refresh session to get latest metadata
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Error refreshing session:', error);
        return false;
      }

      if (session) {
        await this.updateStateWithSession(session);
        console.log('✅ User data refreshed successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Exception refreshing user data:', error);
      return false;
    }
  }

  /**
   * Update internal state with a session and notify listeners
   */
  async updateStateWithSession(session: Session) {
    const needsOnboarding = await checkNeedsOnboarding(session);
    
    this.state = {
      session,
      isLoading: false,
      needsOnboarding,
    };

    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Cleanup (only call when app is truly shutting down)
   */
  destroy() {
    if (this.subscription) {
      console.log('Destroying AuthManager');
      this.subscription.data.subscription.unsubscribe();
      this.subscription = null;
      this.isInitialized = false;
      this.isInitializing = false;
    }
  }
}

// Export singleton instance
export const authManager = new AuthManager();

/**
 * Poll user metadata until a condition is met
 * Useful for waiting for webhook to update user metadata
 * @param condition - Function that returns true when metadata is ready
 * @param maxAttempts - Maximum number of polling attempts (default: 10)
 * @param delayMs - Delay between attempts in milliseconds (default: 1000)
 */
export async function pollUserMetadata(
  condition: (metadata: any) => boolean,
  maxAttempts: number = 10,
  delayMs: number = 1000
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // Refresh session to get latest data
      const { data: { session } } = await supabase.auth.refreshSession();
      
      if (session?.user?.user_metadata) {
        console.log(`Polling attempt ${attempt + 1}: Checking metadata`, session.user.user_metadata);
        
        if (condition(session.user.user_metadata)) {
          console.log('✅ Metadata condition met, updating auth state');
          
          // Update auth manager state with refreshed session and recalculate needsOnboarding
          await authManager.updateStateWithSession(session);
          
          return true;
        }
      }

      // Wait before next attempt
      if (attempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      console.error(`Polling attempt ${attempt + 1} failed:`, error);
    }
  }

  console.warn('❌ Metadata polling timed out');
  return false;
}
