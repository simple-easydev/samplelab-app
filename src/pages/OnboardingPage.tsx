import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
    selectedPlan: 'pro-monthly' as 'pro-monthly' | 'pro-yearly' | 'free',
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
    // Steps 3 and 4 are informational, no validation needed
    setStep(step + 1);
  };

  const handleComplete = async () => {
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
          selected_plan: formData.selectedPlan,
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
        <div className={`w-full ${(step === 3 || step === 4) ? 'max-w-[1376px]' : 'max-w-[676px]'}`}>
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

          {/* Step 3: Feature Showcase */}
          {step === 3 && (
            <div className="flex flex-col gap-12 items-center w-full">
              {/* Title */}
              <div className="flex flex-col gap-3 text-center max-w-[676px]">
                <p className="text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  What you get
                </p>
                <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-tight">
                  Everything you need to create without limits
                </h1>
              </div>

              {/* Feature Cards Grid - Wider container */}
              <div className="grid grid-cols-4 gap-4 w-full max-w-[1376px]">
                {/* Card 1 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-6 gap-6">
                  <div className="w-16 h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-3xl">💿</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-bold text-[#161410] leading-[28px]">
                      10,000+ curated samples
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Packs, loops, stems & one-shots
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-6 gap-6">
                  <div className="w-16 h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-3xl">📜</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-bold text-[#161410] leading-[28px]">
                      Royalty-Free & Cleared
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Release anywhere with confidence
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-6 gap-6">
                  <div className="w-16 h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-3xl">🎧</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-bold text-[#161410] leading-[28px]">
                      New sounds every week
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Fresh drops and exclusive content
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-6 gap-6">
                  <div className="w-16 h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-3xl">🪙</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[20px] font-bold text-[#161410] leading-[28px]">
                      Credits roll over
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Your unused credits stay with you
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 w-full max-w-[676px]">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
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
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-sm text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Testimonials */}
          {step === 4 && (
            <div className="flex flex-col gap-12">
              {/* Title */}
              <div className="flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-[#b3402d] uppercase tracking-[0.9px]">
                  BUILT FOR MODERN PRODUCERS
                </p>
                <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                  Used by creators at every level
                </h1>
              </div>

              {/* Testimonial Cards */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  {
                    quote: "Finally a sample platform that actually feels curated and thoughtfully selected.",
                    name: "Creator Name"
                  },
                  {
                    quote: "Clear licensing, no confusion, no headaches — just download and create.",
                    name: "Creator Name"
                  },
                  {
                    quote: "Exclusive packs with a unique sound that I genuinely can't find anywhere else.",
                    name: "Creator Name"
                  },
                  {
                    quote: "The quality is consistently high — I can trust every sample and pack I download.",
                    name: "Creator Name"
                  }
                ].map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="bg-[#f6f2e6] border border-[#e8e2d2] rounded p-6 flex flex-col gap-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-[#dde1e6] overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-base leading-6 text-[#161410]">
                        &ldquo;{testimonial.quote}&rdquo;
                      </p>
                      <p className="text-sm font-bold leading-5 tracking-[0.1px] text-[#161410]">
                        {testimonial.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 w-full max-w-[676px] mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
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
                  disabled={isSubmitting}
                  className="flex-1 h-14 rounded-sm text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {/* Step 5: Pricing Selection */}
          {step === 5 && (
            <div className="flex flex-col gap-12 items-center">
              {/* Title */}
              <div className="flex flex-col gap-3 text-center">
                <p className="text-sm font-semibold text-[#b3402d] uppercase tracking-[0.9px]">
                  START CREATING
                </p>
                <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                  Choose how you want to start
                </h1>
                <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
                  Start free, or unlock full access with a 3-day Pro trial
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="flex gap-4 w-[910px]">
                {/* PRO MONTHLY */}
                <button
                  onClick={() => handleInputChange('selectedPlan', 'pro-monthly')}
                  className={`flex-1 bg-[#f6f2e6] rounded p-8 flex flex-col gap-8 relative overflow-hidden border-2 ${
                    formData.selectedPlan === 'pro-monthly'
                      ? 'border-[#161410]'
                      : 'border-[#e8e2d2]'
                  }`}
                >
                  {formData.selectedPlan === 'pro-monthly' && (
                    <>
                      <div className="absolute top-[10px] right-[10px] w-6 h-6 z-10">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                          <circle cx="12" cy="12" r="10" fill="#161410"/>
                          <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="absolute inset-[-2px,-2px,94px,-2px] bg-gradient-to-b from-[#56b88d] via-[#f9d79d] via-50% to-[#f6f2e6] opacity-20 z-0" />
                    </>
                  )}
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'pro-monthly' ? 'z-10' : ''}`}>
                    <div className="flex gap-2 items-center">
                      <p className="text-sm font-medium text-[#161410] uppercase tracking-[0.9px]">
                        PRO MONTHLY
                      </p>
                      <span className="bg-[rgba(46,159,111,0.2)] border border-[rgba(46,159,111,0.2)] text-[#1a6548] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                        Popular
                      </span>
                    </div>
                    <div className="flex gap-1 items-end">
                      <span className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                        $19.99
                      </span>
                      <span className="text-base font-medium text-[#7f7766] leading-6 pb-0.5">
                        / month
                      </span>
                    </div>
                  </div>
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'pro-monthly' ? 'z-10' : ''}`}>
                    {['150 credits / month', 'Full library access', 'Unused credits roll over', 'Cancel anytime'].map((benefit) => (
                      <div key={benefit} className="flex gap-2 items-start">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
                          <path d="M5.83 10L8.99 13.17L14.17 8" stroke="#161410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm text-[#161410] leading-5 tracking-[0.1px]">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* PRO YEARLY */}
                <button
                  onClick={() => handleInputChange('selectedPlan', 'pro-yearly')}
                  className={`flex-1 bg-[#f6f2e6] rounded p-8 flex flex-col gap-8 relative overflow-hidden border-2 ${
                    formData.selectedPlan === 'pro-yearly'
                      ? 'border-[#161410]'
                      : 'border-[#e8e2d2]'
                  }`}
                >
                  {formData.selectedPlan === 'pro-yearly' && (
                    <>
                      <div className="absolute top-[10px] right-[10px] w-6 h-6 z-10">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                          <circle cx="12" cy="12" r="10" fill="#161410"/>
                          <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="absolute inset-[-2px,-2px,94px,-2px] bg-gradient-to-b from-[#56b88d] via-[#f9d79d] via-50% to-[#f6f2e6] opacity-20 z-0" />
                    </>
                  )}
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'pro-yearly' ? 'z-10' : ''}`}>
                    <div className="flex gap-2 items-center">
                      <p className="text-sm font-medium text-[#161410] uppercase tracking-[0.9px]">
                        PRO YEARLY
                      </p>
                      <span className="bg-[rgba(235,141,126,0.3)] border border-[rgba(235,141,126,0.3)] text-[#b3402d] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                        Save up to 17%
                      </span>
                    </div>
                    <div className="flex gap-1 items-end">
                      <span className="text-[32px] text-[#7f7766] leading-[40px] tracking-[-0.3px] line-through">
                        $239
                      </span>
                      <span className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                        $199
                      </span>
                      <span className="text-base font-medium text-[#7f7766] leading-6 pb-0.5">
                        / year
                      </span>
                    </div>
                  </div>
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'pro-yearly' ? 'z-10' : ''}`}>
                    {['150 credits / month', 'Full library access', 'Unused credits roll over', 'Cancel anytime'].map((benefit) => (
                      <div key={benefit} className="flex gap-2 items-start">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
                          <path d="M5.83 10L8.99 13.17L14.17 8" stroke="#161410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm text-[#161410] leading-5 tracking-[0.1px]">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>

                {/* FREE */}
                <button
                  onClick={() => handleInputChange('selectedPlan', 'free')}
                  className={`flex-1 bg-[#f6f2e6] rounded p-8 flex flex-col gap-8 relative overflow-hidden border-2 ${
                    formData.selectedPlan === 'free'
                      ? 'border-[#161410]'
                      : 'border-[#e8e2d2]'
                  }`}
                >
                  {formData.selectedPlan === 'free' && (
                    <>
                      <div className="absolute top-[10px] right-[10px] w-6 h-6 z-10">
                        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                          <circle cx="12" cy="12" r="10" fill="#161410"/>
                          <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="absolute inset-[-2px,-2px,94px,-2px] bg-gradient-to-b from-[#56b88d] via-[#f9d79d] via-50% to-[#f6f2e6] opacity-20 z-0" />
                    </>
                  )}
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'free' ? 'z-10' : ''}`}>
                    <p className="text-sm font-medium text-[#161410] uppercase tracking-[0.9px]">
                      FREE
                    </p>
                    <span className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                      $0
                    </span>
                  </div>
                  <div className={`flex flex-col gap-3 text-left ${formData.selectedPlan === 'free' ? 'z-10' : ''}`}>
                    {['Explore the library', 'Preview samples', 'Save favorites', 'Upgrade anytime'].map((benefit) => (
                      <div key={benefit} className="flex gap-2 items-start">
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="none">
                          <path d="M5.83 10L8.99 13.17L14.17 8" stroke="#161410" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-sm text-[#161410] leading-5 tracking-[0.1px]">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </button>
              </div>

              {/* Buttons and disclaimer */}
              <div className="flex flex-col gap-6 w-full max-w-[676px]">
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setStep(4)}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-sm text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                  >
                    <svg className="w-7 h-7 mr-2" viewBox="0 0 28 28" fill="none">
                      <path d="M17.5 21L10.5 14L17.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Back
                  </Button>
                  <Button
                    onClick={handleComplete}
                    disabled={isSubmitting}
                    className="flex-1 h-14 rounded-sm text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                  >
                    {isSubmitting ? 'Completing...' : 'Start free trial'}
                  </Button>
                </div>
                <p className="text-sm text-[#5e584b] text-center leading-5 tracking-[0.1px]">
                  No charge today. Cancel anytime during your 3-day trial.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
