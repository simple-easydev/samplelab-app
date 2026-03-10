import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, CheckIcon, CheckCircleIcon, MusicRecordIcon, LayerIcon, HeadsetIcon, CoinsIcon } from '@/components/icons';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { BonusCreditsModal } from '@/components/bonus-credits-modal';
import { createCheckoutSession } from '@/lib/supabase/subscriptions';
import { getStripePlans, type PlanTierPublic } from '@/lib/supabase/plans';

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

  const [plans, setPlans] = useState<PlanTierPublic[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [formData, setFormData] = useState<{
    genres: string[];
    sampleTypes: string[];
    selectedPlan: string;
  }>({
    genres: [],
    sampleTypes: [],
    selectedPlan: 'free',
  });

  useEffect(() => {
    getStripePlans({ visible_onboarding: true }).then((p) => {
      setPlans(p);
      setPlansLoading(false);
    });
  }, []);

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

  const selectedPlanObj = plans.find((p) => p.id === formData.selectedPlan);
  const isFreeSelection =
    formData.selectedPlan === 'free' || selectedPlanObj?.stripe_price_id == null;

  const handleButtonClick = () => {
    if (isFreeSelection) {
      handleComplete();
    } else {
      setShowBonusModal(true);
    }
  };

  const handleComplete = async (isTrial = true) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('User not found');
        return;
      }

      console.log('Saving onboarding data:', {
        genres: formData.genres,
        sample_types: formData.sampleTypes,
        selected_plan: formData.selectedPlan,
        is_trial: isTrial
      });

      // Save preferences and mark onboarding complete only for free plan
      const selectedPlanForCompletion = plans.find((p) => p.id === formData.selectedPlan);
      const isFree = formData.selectedPlan === 'free' || selectedPlanForCompletion?.stripe_price_id == null;

      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          genres: formData.genres,
          sample_types: formData.sampleTypes,
          selected_plan: formData.selectedPlan,
          onboarding_completed: isFree,
        }
      });

      if (updateError) {
        console.error('Failed to save profile:', updateError);
        toast.error('Failed to save profile');
        return;
      }

      console.log('Onboarding data saved successfully');

      if (isFree) {
        toast.success('Welcome! Your profile is set up.');
        navigate('/dashboard/discover', { replace: true });
        return;
      }

      const priceId = selectedPlanForCompletion?.stripe_price_id ?? null;

      if (!priceId) {
        toast.error('Please select a plan or try again.');
        return;
      }

      console.log('Creating checkout session for price:', priceId);

      // Create checkout session with isTrial boolean
      const result = await createCheckoutSession(priceId, isTrial);

      console.log('Checkout session result:', result);

      if ('error' in result) {
        console.error('❌ Checkout session failed:', result.error);
        toast.error(result.error);
        return;
      }

      console.log('✅ Redirecting to Stripe Checkout URL:', result.url);
      
      // Redirect to Stripe Checkout
      window.location.href = result.url;
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error('Something went wrong');
      setIsSubmitting(false);
    }
    // Don't set isSubmitting to false here - we're redirecting to Stripe
  };

  const handleContinueTrial = () => {
    handleComplete(true);
    setShowBonusModal(false);
  };

  const handleStartProWithBonus = () => {
    handleComplete(false);
    setShowBonusModal(false);
  };


  return (
    <div className="min-h-screen flex flex-col bg-[#fffbf0]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:gap-8 items-center pt-4 pb-8 sm:pt-6 sm:pb-16 px-4">
        {/* Logo */}
        <div className="h-10 w-28 sm:h-12 sm:w-36 relative">
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
      <div className="flex-1 flex items-start justify-center px-4 pb-8 sm:pb-0">
        <div className={`w-full max-w-[676px]`}>
          {/* Step 1: Genre Selection */}
          {step === 1 && (
            <div className="flex flex-col gap-8 sm:gap-12">
              {/* Title */}
              <div className="flex flex-col gap-2 sm:gap-3 text-center">
                <p className="text-xs sm:text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  Welcome to The Sample Lab
                </p>
                <h1 className="text-2xl sm:text-[40px] font-bold text-[#161410] leading-tight sm:leading-[48px] tracking-tight">
                  What genres inspire you?
                </h1>
                <p className="text-sm text-[#5e584b] leading-5">
                  Select all that apply. We&apos;ll tailor your feed to match your style.
                </p>
              </div>

              {/* Genre Selection Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {GENRES.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleGenreToggle(genre)}
                    className={`h-11 sm:h-12 px-3 sm:px-4 flex items-center justify-center rounded-[2px] border transition-all ${
                      formData.genres.includes(genre)
                        ? 'border-[#161410] bg-[#e8e2d2] text-[#161410]'
                        : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:border-[#161410]'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-medium truncate">{genre}</span>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleNext}
                disabled={formData.genres.length === 0 || isSubmitting}
                className={`h-12 sm:h-14 w-full rounded-sm text-base sm:text-lg font-medium ${
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
            <div className="flex flex-col gap-8 sm:gap-12">
              {/* Title */}
              <div className="flex flex-col gap-2 sm:gap-3 text-center">
                <p className="text-xs sm:text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  Make it yours
                </p>
                <h1 className="text-2xl sm:text-[40px] font-bold text-[#161410] leading-tight sm:leading-[48px] tracking-tight">
                  What do you usually create with?
                </h1>
                <p className="text-sm text-[#5e584b] leading-5">
                  This helps us surface the right sounds faster.
                </p>
              </div>

              {/* Sample Type Selection Grid - 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {SAMPLE_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSampleTypeToggle(type)}
                    className={`h-11 sm:h-12 px-4 flex items-center justify-center rounded-[2px] border transition-all text-left sm:text-center ${
                      formData.sampleTypes.includes(type)
                        ? 'border-[#161410] bg-[#e8e2d2] text-[#161410]'
                        : 'border-[#d6ceb8] bg-transparent text-[#5e584b] hover:border-[#161410]'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-medium">{type}</span>
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                >
                  <ArrowLeftIcon className="mr-2 shrink-0" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={formData.sampleTypes.length === 0 || isSubmitting}
                  className={`flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium ${
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
            <div className="flex flex-col gap-8 sm:gap-12 items-center w-full">
              {/* Title */}
              <div className="flex flex-col gap-2 sm:gap-3 text-center max-w-[676px]">
                <p className="text-xs sm:text-sm font-semibold text-[#b3402d] uppercase tracking-wide">
                  What you get
                </p>
                <h1 className="text-2xl sm:text-[40px] font-bold text-[#161410] leading-tight sm:leading-[48px] tracking-tight">
                  Everything you need to create without limits
                </h1>
              </div>

              {/* Feature Cards Grid - Wider container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                {/* Card 1 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-2xl sm:text-3xl">
                      <MusicRecordIcon />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base sm:text-[20px] font-bold text-[#161410] leading-snug sm:leading-[28px]">
                      10,000+ curated samples
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Packs, loops, stems & one-shots
                    </p>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-2xl sm:text-3xl">
                      <LayerIcon />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base sm:text-[20px] font-bold text-[#161410] leading-snug sm:leading-[28px]">
                      No Clearance Headaches
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Release anywhere with confidence
                    </p>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-2xl sm:text-3xl">
                      <HeadsetIcon />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base sm:text-[20px] font-bold text-[#161410] leading-snug sm:leading-[28px]">
                      New sounds every week
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Fresh drops and exclusive content
                    </p>
                  </div>
                </div>

                {/* Card 4 */}
                <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col p-4 sm:p-6 gap-4 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8e2d2] border border-[#d6ceb8] rounded flex items-center justify-center shadow-[0px_6px_18px_0px_rgba(0,0,0,0.1),0px_2px_6px_0px_rgba(0,0,0,0.06)]">
                    <span className="text-2xl sm:text-3xl">
                      <CoinsIcon />
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-base sm:text-[20px] font-bold text-[#161410] leading-snug sm:leading-[28px]">
                      Credits roll over
                    </h3>
                    <p className="text-[14px] text-[#5e584b] leading-5">
                      Your unused credits stay with you
                    </p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 sm:gap-4 w-full max-w-[676px]">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                >
                  <ArrowLeftIcon className="mr-2 shrink-0" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Testimonials */}
          {step === 4 && (
            <div className="flex flex-col gap-8 sm:gap-12">
              {/* Title */}
              <div className="flex flex-col gap-2 sm:gap-3 text-center">
                <p className="text-xs sm:text-sm font-semibold text-[#b3402d] uppercase tracking-[0.9px]">
                  BUILT FOR MODERN PRODUCERS
                </p>
                <h1 className="text-2xl sm:text-[40px] font-bold text-[#161410] leading-tight sm:leading-[48px] tracking-[-0.4px]">
                  Used by creators at every level
                </h1>
              </div>

              {/* Testimonial Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    className="bg-[#f6f2e6] border border-[#e8e2d2] rounded p-4 sm:p-6 flex flex-col gap-4 sm:gap-5"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#dde1e6] overflow-hidden shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500" />
                    </div>
                    <div className="flex flex-col gap-3 min-w-0">
                      <p className="text-sm sm:text-base leading-6 text-[#161410]">
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
              <div className="flex gap-3 sm:gap-4 w-full max-w-[676px] mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setStep(3)}
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                >
                  <ArrowLeftIcon className="mr-2 shrink-0" />
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          {/* Step 5: Pricing Selection */}
          {step === 5 && (
            <div className="flex flex-col gap-8 sm:gap-12 items-center w-full">
              {/* Title */}
              <div className="flex flex-col gap-2 sm:gap-3 text-center">
                <p className="text-xs sm:text-sm font-semibold text-[#b3402d] uppercase tracking-[0.9px]">
                  START CREATING
                </p>
                <h1 className="text-2xl sm:text-[40px] font-bold text-[#161410] leading-tight sm:leading-[48px] tracking-[-0.4px]">
                  Choose how you want to start
                </h1>
                <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
                  Start free, or unlock full access with a 3-day Pro trial
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-[910px] flex-wrap">
                {/* Paid plans from API */}
                {plansLoading ? (
                  <div className="w-full sm:flex-1 sm:min-w-[280px] bg-[#f6f2e6] rounded p-6 sm:p-8 border-2 border-[#e8e2d2] flex items-center justify-center min-h-[200px] sm:min-h-[280px]">
                    <span className="text-sm text-[#5e584b]">Loading plans…</span>
                  </div>
                ) : (
                  plans.map((plan) => {
                    const isSelected = formData.selectedPlan === plan.id;
                    const isFreePlan = plan.stripe_price_id == null;
                    const cycleLabel = plan.billing_cycle === 'year' ? '/ year' : '/ month';
                    return (
                      <div
                        key={plan.id}
                        onClick={() => handleInputChange('selectedPlan', plan.id)}
                        className={`w-full sm:flex-1 sm:min-w-[280px] bg-[#f6f2e6] rounded p-5 sm:p-8 flex flex-col gap-6 sm:gap-8 relative overflow-hidden border-2 cursor-pointer ${
                          isSelected ? 'border-[#161410]' : 'border-[#e8e2d2]'
                        }`}
                      >
                        {plan.is_popular && !isFreePlan && (
                          <div className="absolute w-full h-full left-0 top-0 bg-gradient-to-b from-[#56b88d] via-[#f9d79d] via-50% to-[#f6f2e6] opacity-20 z-0" />
                        )}
                        {isSelected && (
                          <div className="absolute top-[10px] right-[10px] w-6 h-6 z-10">
                            <CheckCircleIcon />
                          </div>
                        )}
                        <div className="flex flex-col gap-3 text-left z-10">
                          <div className="flex gap-2 items-center flex-wrap">
                            <p className="text-sm font-medium text-[#161410] uppercase tracking-[0.9px]">
                              {plan.display_name}
                            </p>
                            {plan.is_popular && !isFreePlan && (
                              <span className="bg-[rgba(46,159,111,0.2)] border border-[rgba(46,159,111,0.2)] text-[#1a6548] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                                Popular
                              </span>
                            )}
                            {!isFreePlan && plan.original_price != null && plan.original_price > plan.price && (
                              <span className="bg-[rgba(235,141,126,0.3)] border border-[rgba(235,141,126,0.3)] text-[#b3402d] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                                Save {Math.round((1 - plan.price / plan.original_price) * 100)}%
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1 items-end flex-wrap">
                            {!isFreePlan && plan.original_price != null && plan.original_price > plan.price && (
                              <span className="text-2xl sm:text-[32px] text-[#7f7766] leading-[40px] tracking-[-0.3px] line-through">
                                ${plan.original_price}
                              </span>
                            )}
                            <span className="text-3xl sm:text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                              ${plan.price}
                            </span>
                            {!isFreePlan && (
                              <span className="text-base font-medium text-[#7f7766] leading-6 pb-0.5">
                                {cycleLabel}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 text-left z-10">
                          {(plan.features.length > 0 ? plan.features : isFreePlan ? ['Explore the library', 'Preview samples', 'Save favorites', 'Upgrade anytime'] : ['Full library access', 'Unused credits roll over', 'Cancel anytime']).map((benefit) => (
                            <div key={benefit} className="flex gap-2 items-start">
                              <CheckIcon stroke="#161410" />
                              <span className="text-sm text-[#161410] leading-5 tracking-[0.1px]">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Buttons and disclaimer */}
              <div className="flex flex-col gap-6 w-full max-w-[676px]">
                <div className="flex gap-3 sm:gap-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => setStep(4)}
                    disabled={isSubmitting}
                    className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium border-[#a49a84] text-[#161410] hover:bg-[#f5f0e5]"
                  >
                    <ArrowLeftIcon className="mr-2 shrink-0" />
                    Back
                  </Button>
                  <Button
                    onClick={handleButtonClick}
                    disabled={isSubmitting}
                    className="flex-1 h-12 sm:h-14 rounded-sm text-base sm:text-lg font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                  >
                    {isSubmitting 
                      ? 'Completing...' 
                      : isFreeSelection 
                        ? 'Continue' 
                        : 'Start free trial'}
                  </Button>
                </div>                
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bonus Credits Modal */}
      <BonusCreditsModal
        open={showBonusModal}
        onOpenChange={setShowBonusModal}
        onContinueTrial={handleContinueTrial}
        onStartProWithBonus={handleStartProWithBonus}
      />
    </div>
  );
}
