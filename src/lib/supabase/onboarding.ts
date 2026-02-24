import { supabase } from './client';
import { Session } from '@supabase/supabase-js';

/**
 * Check if user needs onboarding
 * @param session Optional session to avoid additional auth call
 */
export async function checkNeedsOnboarding(session?: Session | null): Promise<boolean> {
  try {
    // Use provided session or fetch user
    let user = session?.user;
    
    if (!user) {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      user = fetchedUser;
    }
    
    if (!user) {
      return false;
    }

    // Check if onboarding is completed in user metadata
    const onboardingCompleted = user.user_metadata?.onboarding_completed;
    
    return !onboardingCompleted;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}

export async function completeOnboarding(profileData: {
  fullName?: string;
  companyName?: string;
  role?: string;
}) {
  try {
    const { error } = await supabase.auth.updateUser({
      data: {
        ...profileData,
        onboarding_completed: true,
      }
    });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error };
  }
}
