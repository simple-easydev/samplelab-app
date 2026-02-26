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
      user = fetchedUser ?? undefined;
    }
    
    if (!user) {
      return false;
    }

    // Check if onboarding is completed
    // Supabase returns user_metadata (processed) which includes recent updates
    // raw_user_meta_data is the raw database column (may have sync delay)
    const userMetadata = user.user_metadata;
    console.log('Onboarding check - User metadata:', {
      userId: user.id,
      email: user.email,
      userMetadata,
      hasOnboardingFlag: !!userMetadata?.onboarding_completed
    });
    
    const onboardingCompleted = userMetadata?.onboarding_completed;
    
    console.log('Onboarding status result:', {
      onboardingCompleted,
      needsOnboarding: !onboardingCompleted
    });
    
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
    console.log('Completing onboarding with data:', profileData);
    
    const { error } = await supabase.auth.updateUser({
      data: {
        ...profileData,
        onboarding_completed: true,
      }
    });

    if (error) {
      console.error('Error updating user metadata:', error);
      throw error;
    }
    
    console.log('Onboarding completed successfully, metadata updated');
    return { success: true };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error };
  }
}
