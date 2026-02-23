import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    role: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (step === 2 && !formData.role.trim()) {
      toast.error('Please select your role');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (!formData.fullName.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not found');
        return;
      }

      // Update user metadata to mark onboarding as complete
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          company_name: formData.companyName,
          role: formData.role,
          onboarding_completed: true,
        }
      });

      if (updateError) {
        toast.error('Failed to save profile');
        return;
      }

      toast.success('Welcome! Your profile is set up.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      // Mark onboarding as completed even if skipped
      await supabase.auth.updateUser({
        data: { onboarding_completed: true }
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Skip error:', error);
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-12 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Welcome! Let's get you started
              </h1>
              <p className="text-muted-foreground">
                Tell us a bit about yourself
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name (Optional)</Label>
                <Input
                  id="companyName"
                  placeholder="Your company or organization"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Role */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                What's your role?
              </h1>
              <p className="text-muted-foreground">
                Help us personalize your experience
              </p>
            </div>

            <div className="space-y-3">
              {['Music Producer', 'Sound Designer', 'DJ', 'Musician', 'Hobbyist', 'Other'].map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    handleInputChange('role', role);
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all hover:border-primary ${
                    formData.role === role
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  }`}
                >
                  <span className="font-medium">{role}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                variant="outline"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="flex-1"
              >
                Skip
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                All set! 🎉
              </h1>
              <p className="text-muted-foreground">
                You're ready to explore amazing sounds
              </p>
            </div>

            <div className="bg-muted rounded-lg p-6 space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{formData.fullName || 'Not provided'}</p>
              </div>
              {formData.companyName && (
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{formData.companyName}</p>
                </div>
              )}
              {formData.role && (
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <p className="font-medium">{formData.role}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleComplete}
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Completing...' : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
