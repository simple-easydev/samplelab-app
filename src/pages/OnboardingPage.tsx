import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

const GENRES = [
  'Hip-Hop',
  'Trap',
  'Drill',
  'Lo-Fi',
  'Soul Chops',
  'Boom Bap',
  'Drums',
  'Pop',
  'Electronic',
];

const SAMPLE_TYPES = [
  'Full sample packs',
  'Loops / compositions',
  'One-shots',
  'Stems',
  'Genre-specific packs',
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    genres: [] as string[],
    sampleTypes: [] as string[],
    fullName: '',
    companyName: '',
    role: '',
  });

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handleSampleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      sampleTypes: prev.sampleTypes.includes(type)
        ? prev.sampleTypes.filter(t => t !== type)
        : [...prev.sampleTypes, type],
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1 && formData.genres.length === 0) {
      toast.error('Please select at least one genre');
      return;
    }
    if (step === 2 && formData.sampleTypes.length === 0) {
      toast.error('Please select at least one sample type');
      return;
    }
    if (step === 3 && !formData.fullName.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (step === 4 && !formData.role.trim()) {
      toast.error('Please select your role');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (formData.genres.length === 0) {
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
          genres: formData.genres,
          sample_types: formData.sampleTypes,
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
    <div className="min-h-screen flex flex-col bg-[#fffbf0]">
      {/* Header */}
      <div className="flex flex-col gap-8 items-center pt-6 pb-16 px-4">
        {/* Logo */}
        <div className="h-12 w-36 relative">
          <img
            src="/logo.svg"
            alt="The Sample Lab"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Stepper */}
        <div className="flex gap-2 w-full max-w-[676px]">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`flex-1 h-[2px] rounded-full transition-colors ${
                s <= step ? 'bg-[#161410]' : 'bg-[#d6ceb8]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-[676px]">
          {/* Step 1: Genre Selection */}
          {step === 1 && (
            <div className="flex flex-col gap-12">
              {/* Title */}
              <div className="flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  Welcome to The Sample Lab
                </p>
                <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-tight">
                  What genres inspire you?
                </h1>
                <p className="text-sm text-[#5e584b] leading-5">
                  Select all that apply. We&apos;ll tailor your feed to match your style.
                </p>
              </div>

              {/* Genre Selection Grid */}
              <div className="grid grid-cols-3 gap-4">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`h-12 px-4 flex items-center justify-center rounded-sm border transition-all ${
                      formData.genres.includes(genre)
                        ? 'border-[#161410] bg-[#161410] text-white'
                        : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:border-[#161410]'
                    }`}
                  >
                    <span className="text-base font-medium">{genre}</span>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleNext}
                disabled={formData.genres.length === 0 || isSubmitting}
                className={`h-14 w-full rounded-sm text-lg font-medium ${
                  formData.genres.length === 0
                    ? 'bg-[#bfb6a1] text-white cursor-not-allowed hover:bg-[#bfb6a1]'
                    : 'bg-[#161410] text-white hover:bg-[#2a2620]'
                }`}
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Sample Type Selection */}
          {step === 2 && (
            <div className="flex flex-col gap-12">
              {/* Title */}
              <div className="flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  Make it yours
                </p>
                <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-tight">
                  What do you usually create with?
                </h1>
                <p className="text-sm text-[#5e584b] leading-5">
                  This helps us surface the right sounds faster.
                </p>
              </div>

              {/* Sample Type Selection Grid - 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                {SAMPLE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSampleTypeToggle(type)}
                    className={`h-12 px-4 flex items-center justify-center rounded-sm border transition-all ${
                      formData.sampleTypes.includes(type)
                        ? 'border-[#161410] bg-[#161410] text-white'
                        : 'border-[#d6ceb8] bg-transparent text-[#161410] hover:border-[#161410]'
                    }`}
                  >
                    <span className="text-base font-medium">{type}</span>
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-sm text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                >
                  <svg className="w-7 h-7 mr-2" viewBox="0 0 28 28" fill="none">
                    <path d="M17.5 21L10.5 14L17.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={formData.sampleTypes.length === 0 || isSubmitting}
                  className={`flex-1 h-14 rounded-sm text-lg font-medium ${
                    formData.sampleTypes.length === 0
                      ? 'bg-[#bfb6a1] text-white cursor-not-allowed hover:bg-[#bfb6a1]'
                      : 'bg-[#161410] text-white hover:bg-[#2a2620]'
                  }`}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Basic Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome! Let&apos;s get you started
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
                    onClick={() => setStep(2)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Back
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
          {/* Step 4: Role */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  What&apos;s your role?
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
                  onClick={() => setStep(3)}
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

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">
                  All set! 🎉
                </h1>
                <p className="text-muted-foreground">
                  You&apos;re ready to explore amazing sounds
                </p>
              </div>

              <div className="bg-muted rounded-lg p-6 space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Selected Genres</p>
                  <p className="font-medium">{formData.genres.join(', ') || 'None'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sample Types</p>
                  <p className="font-medium">{formData.sampleTypes.join(', ') || 'None'}</p>
                </div>
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
                  onClick={() => setStep(4)}
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
    </div>
  );
}
