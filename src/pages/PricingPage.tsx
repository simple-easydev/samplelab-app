import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getStripePlans, type PlanTierPublic } from '@/lib/supabase/plans';
import { PlanCard } from '@/components/PlanCard';
import { createCheckoutSession, cancelSubscription, upgradeSubscription, reactivateSubscription, invalidateBillingInfoCache } from '@/lib/supabase/subscriptions';
import { useSubscription } from '@/hooks/useSubscription';
import { capitalizeFirstLetter } from '@/lib/utils';

type BillingCycle = 'monthly' | 'yearly';

function formatRenewalDate(isoDate: string | null): string {
  if (!isoDate) return '';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return '';
  }
}

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanTierPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const { subscription, loading: subscriptionLoading, refresh: refreshSubscription } = useSubscription();
  const [cancelling, setCancelling] = useState(false);
  const [reactivating, setReactivating] = useState(false);

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

  const filteredPlans = plans
    .filter((p) => {
      const cycle = p.billing_cycle?.toLowerCase() ?? '';
      const isMonthly = cycle === 'month' || cycle === 'monthly';
      const isYearly = cycle === 'year' || cycle === 'yearly';
      return billingCycle === 'monthly' ? isMonthly : isYearly;
    })
    .sort((a, b) => (a.credits_monthly ?? 0) - (b.credits_monthly ?? 0));

  const currentPlanInAll = subscription?.stripe_price_id
    ? plans.find((p) => p.stripe_price_id === subscription.stripe_price_id) ?? null
    : null;
  const currentPlan = currentPlanInAll
    ? filteredPlans.find((p) => p.stripe_price_id === currentPlanInAll.stripe_price_id) ?? null
    : null;

  const subscriptionBillingCycle =
    currentPlanInAll?.billing_cycle?.toLowerCase() === 'year' ||
    currentPlanInAll?.billing_cycle?.toLowerCase() === 'yearly'
      ? 'yearly'
      : 'monthly';
  const renewalDate = formatRenewalDate(subscription?.current_period_end ?? null);
  const isCanceledAtPeriodEnd = subscription?.cancel_at_period_end === true;
  const hasPlanUntilPeriodEnd = subscription != null && currentPlanInAll != null;

  const handleSubscribe = async (plan: PlanTierPublic) => {
    const priceId = plan.stripe_price_id;
    if (!priceId) {
      toast.error('This plan is not available for checkout.');
      return;
    }
    const isPlanChange =
      currentPlanInAll != null &&
      plan.stripe_price_id !== currentPlanInAll.stripe_price_id;

    setSubmittingId(plan.id);
    try {
      if (isPlanChange) {
        const result = await upgradeSubscription(priceId);
        if ('error' in result) {
          toast.error(result.error);
          return;
        }
        invalidateBillingInfoCache();
        refreshSubscription();
        toast.success('Plan updated.');
      } else {
        const result = await createCheckoutSession(priceId, true);
        if ('error' in result) {
          toast.error(result.error);
          return;
        }
        if (result.url) window.location.assign(result.url);
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setSubmittingId(null);
    }
  };

  const handleCancelPlan = async () => {
    if (!subscription?.id) return;
    setCancelling(true);
    try {
      const { success, error } = await cancelSubscription(subscription.id);
      if (success) {
        toast.success('Plan will cancel at the end of the billing period.');
        invalidateBillingInfoCache();
        refreshSubscription();
      } else {
        toast.error(error ?? 'Failed to cancel plan');
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivatePlan = async () => {
    if (!subscription?.id) return;
    setReactivating(true);
    try {
      const { success, error } = await reactivateSubscription(subscription.id);
      if (success) {
        toast.success('Your plan will continue. You will be charged at the next renewal.');
        invalidateBillingInfoCache();
        refreshSubscription();
      } else {
        toast.error(error ?? 'Failed to keep plan');
      }
    } catch (e) {
      toast.error('Something went wrong');
    } finally {
      setReactivating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center px-8 py-16 md:py-32">
      <div className="w-full max-w-[676px] flex flex-col gap-5 text-center">
        {/* Overline + Title - Figma: when subscribed show "You're on the X plan" */}
        <div className="flex flex-col gap-4">
          <p className="text-[#b3402d] text-lg font-semibold uppercase tracking-[0.8px] leading-6">
            Pricing
          </p>
          {!subscriptionLoading && hasPlanUntilPeriodEnd ? (
            <>
              <h1 className="text-[#161410] text-[48px] font-bold leading-[56px] tracking-[-0.6px]">
                You're on the {currentPlanInAll!.display_name} plan
              </h1>
              {renewalDate && (
                <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                  {isCanceledAtPeriodEnd
                    ? `Your plan is active until ${renewalDate}. It will not renew.`
                    : `You're currently on a ${subscriptionBillingCycle} billing cycle. Your next renewal is ${renewalDate}.`}
                </p>
              )}
            </>
          ) : (
            <h1 className="text-[#161410] text-[48px] font-bold leading-[56px] tracking-[-0.6px]">
              Start a 3-day free trial
            </h1>
          )}
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
            const isCurrentPlan = currentPlan?.id === plan.id;
            const cycleLabel = plan.billing_cycle === 'year' ? '/ year' : '/ month';
            const planCycleName =
              plan.billing_cycle?.toLowerCase() === 'year' || plan.billing_cycle?.toLowerCase() === 'yearly'
                ? 'yearly'
                : 'monthly';
            const planCredits = plan.credits_monthly ?? 0;
            const currentCredits = currentPlanInAll?.credits_monthly ?? 0;
            const ctaLabel = currentPlanInAll
              ? planCredits > currentCredits
                ? `Upgrade to ${plan.display_name}`
                : planCredits < currentCredits
                  ? `Downgrade to ${plan.display_name}`
                  : `Switch to ${plan.display_name} ${capitalizeFirstLetter(planCycleName)}`
              : 'Start free trial';

            return (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                cycleLabel={cycleLabel}
                ctaLabel={ctaLabel}
                isSubmitting={submittingId === plan.id}
                onSubscribe={() => handleSubscribe(plan)}
                onCancelPlan={
                  isCurrentPlan && subscription?.id && !isCanceledAtPeriodEnd
                    ? handleCancelPlan
                    : undefined
                }
                cancelPlanLoading={cancelling}
                onReactivatePlan={
                  isCurrentPlan && subscription?.id && isCanceledAtPeriodEnd
                    ? handleReactivatePlan
                    : undefined
                }
                reactivatePlanLoading={reactivating}
              />
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
