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
