import { supabase } from './client';

export async function checkNeedsOnboarding(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
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
