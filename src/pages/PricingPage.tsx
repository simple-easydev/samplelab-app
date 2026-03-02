import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/icons';
import { toast } from 'sonner';
import { getStripePlans, type PlanTierPublic } from '@/lib/supabase/plans';
import { createCheckoutSession } from '@/lib/supabase/subscriptions';

type BillingCycle = 'monthly' | 'yearly';

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanTierPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    getStripePlans()
      .then((all) => {
        const paid = (all ?? [])
          .filter((p) => p && typeof p.price === 'number' && p.price > 0)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setPlans(paid);
      })
      .catch((err) => {
        console.error('Failed to load plans:', err);
        setPlans([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredPlans = plans.filter((p) => {
    const cycle = p.billing_cycle?.toLowerCase() ?? '';
    const isMonthly = cycle === 'month' || cycle === 'monthly';
    const isYearly = cycle === 'year' || cycle === 'yearly';
    return billingCycle === 'monthly' ? isMonthly : isYearly;
  });

  const handleSubscribe = async (plan: PlanTierPublic) => {
    const priceId = plan.stripe_price_id;
    if (!priceId) {
      toast.error('This plan is not available for checkout.');
      return;
    }
    setSubmittingId(plan.id);
    try {
      const result = await createCheckoutSession(priceId, true);
      if ('error' in result) {
        toast.error(result.error);
        return;
      }
      if (result.url) window.location.assign(result.url);
    } catch (e) {
      toast.error('Something went wrong');
      setSubmittingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center px-8 py-16 md:py-32">
      <div className="w-full max-w-[676px] flex flex-col gap-5 text-center">
        {/* Overline + Title - Figma pricing header */}
        <div className="flex flex-col gap-4">
          <p className="text-[#b3402d] text-lg font-semibold uppercase tracking-[0.8px] leading-6">
            Pricing
          </p>
          <h1 className="text-[#161410] text-[48px] font-bold leading-[56px] tracking-[-0.6px]">
            Start a 3-day free trial
          </h1>
        </div>
        <p className="text-[#5e584b] text-base leading-6">
          You can change or cancel your plan anytime
        </p>
      </div>

      {/* Billing toggle - Figma Toggle/BillingToggle */}
      <div className="flex flex-col gap-5 items-center w-full max-w-[676px] mt-8">
        <div className="bg-[#e8e2d2] rounded-[24px] p-1 flex gap-1">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`h-10 px-4 rounded-[20px] min-w-[186px] text-sm font-medium leading-5 tracking-[0.1px] transition-colors ${
              billingCycle === 'monthly'
                ? 'bg-[#fffbf0] text-[#161410]'
                : 'text-[#7f7766] hover:text-[#161410]'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`h-10 px-4 rounded-[20px] min-w-[186px] flex items-center justify-center gap-1.5 text-sm font-medium leading-5 tracking-[0.1px] transition-colors ${
              billingCycle === 'yearly'
                ? 'bg-[#fffbf0] text-[#161410]'
                : 'text-[#7f7766] hover:text-[#161410]'
            }`}
          >
            Yearly
            <span className="bg-[rgba(235,141,126,0.3)] border border-[rgba(235,141,126,0.3)] text-[#b3402d] text-[10px] font-medium px-1.5 py-0.5 rounded-md leading-3 tracking-[0.3px]">
              Save up to 17%
            </span>
          </button>
        </div>
        <p className="text-[#7f7766] text-sm leading-5 text-center tracking-[0.1px]">
          {billingCycle === 'monthly'
            ? 'Monthly is billed once per month'
            : 'Yearly is billed once per year'}
        </p>
      </div>

      {/* Plan cards */}
      {loading ? (
        <div className="flex gap-6 mt-12 flex-wrap justify-center">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[300px] bg-[#f6f2e6] rounded border-2 border-[#e8e2d2] p-8 min-h-[400px] flex items-center justify-center"
            >
              <span className="text-sm text-[#5e584b]">Loading…</span>
            </div>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="mt-12 rounded border border-[#e8e2d2] bg-[#f6f2e6] p-12 text-center max-w-md">
          <p className="text-[#7f7766]">
            No {billingCycle === 'monthly' ? 'monthly' : 'yearly'} plans available.
          </p>
          <Link to="/dashboard" className="mt-4 inline-block text-[#161410] font-medium hover:underline">
            Back to dashboard
          </Link>
        </div>
      ) : (
        <div className="flex gap-6 mt-12 flex-wrap justify-center max-w-[1142px]">
          {filteredPlans.map((plan) => {
            const isPopular = plan.is_popular;
            const cycleLabel = plan.billing_cycle === 'year' ? '/ year' : '/ month';
            const isSubmitting = submittingId === plan.id;
            const features =
              Array.isArray(plan.features) && plan.features.length > 0
                ? plan.features
                : ['Full library access', 'Unused credits roll over', 'Cancel anytime'];

            return (
              <div
                key={plan.id}
                className="w-[300px] shrink-0 bg-[#f6f2e6] border-2 border-[#e8e2d2] rounded p-8 flex flex-col gap-8 relative overflow-hidden isolate"
              >
                {isPopular && (
                  <div
                    className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(to bottom, #56b88d, #f9d79d 50%, #f6f2e6)',
                    }}
                  />
                )}

                <div className="flex flex-col gap-4 relative z-10">
                  {/* Header: name + price */}
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 items-center flex-wrap">
                      <p className="text-[#161410] text-sm font-medium uppercase tracking-[0.9px] leading-5">
                        {plan.display_name}
                      </p>
                      {isPopular && (
                        <span className="bg-[rgba(46,159,111,0.2)] border border-[rgba(46,159,111,0.2)] text-[#1a6548] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 items-end flex-wrap">
                      <span className="text-[#161410] text-[40px] font-bold leading-[48px] tracking-[-0.4px]">
                        ${plan.price}
                      </span>
                      <span className="text-[#7f7766] text-base font-medium leading-6 pb-0.5">
                        {cycleLabel}
                      </span>
                    </div>
                  </div>

                  {/* Credits + benefits */}
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#161410] text-base font-medium leading-6">
                        {plan.credits_monthly ?? 0} credits / month
                      </p>
                      <p className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
                        Unused credits roll over
                      </p>
                    </div>
                    <div className="h-px w-full bg-[#e8e2d2]" />
                    <ul className="flex flex-col gap-3">
                      {features.map((benefit) => (
                        <li key={benefit} className="flex gap-2 items-start">
                          <CheckIcon stroke="#161410" className="shrink-0 mt-0.5 size-5" />
                          <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto relative z-10">
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isSubmitting}
                    className={
                      isPopular
                        ? 'w-full h-12 rounded-sm font-medium bg-[#161410] text-[#fffbf0] hover:bg-[#2a2620]'
                        : 'w-full h-12 rounded-sm font-medium bg-transparent border-2 border-[#a49a84] text-[#161410] hover:bg-[#e8e2d2]'
                    }
                  >
                    {isSubmitting ? 'Redirecting…' : 'Start free trial'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          to="/dashboard"
          className="text-sm text-[#7f7766] hover:text-[#161410] transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
