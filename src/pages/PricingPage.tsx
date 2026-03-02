import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/icons';
import { toast } from 'sonner';
import { getStripePlans, type PlanTierPublic } from '@/lib/supabase/plans';
import { createCheckoutSession } from '@/lib/supabase/subscriptions';

export default function PricingPage() {
  const [plans, setPlans] = useState<PlanTierPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    getStripePlans()
      .then((all) => {
        const paid = all.filter((p) => p.price > 0).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        setPlans(paid);
      })
      .finally(() => setLoading(false));
  }, []);

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
    <div className="min-h-screen bg-[#fffbf0]">
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex flex-col gap-3 text-center mb-12">
          <h1 className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
            Pricing
          </h1>
          <p className="text-base text-[#7f7766] leading-6 tracking-[0.1px]">
            Choose a plan and get full access to the library.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full max-w-[320px] bg-[#f6f2e6] rounded-lg border-2 border-[#e8e2d2] p-8 min-h-[320px] flex items-center justify-center"
              >
                <span className="text-sm text-[#5e584b]">Loading…</span>
              </div>
            ))}
          </div>
        ) : plans.length === 0 ? (
          <div className="rounded-lg border border-[#e8e2d2] bg-[#f6f2e6] p-12 text-center">
            <p className="text-[#7f7766]">No paid plans available at the moment.</p>
            <Link to="/dashboard" className="mt-4 inline-block text-[#161410] font-medium hover:underline">
              Back to dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {plans.map((plan) => {
              const cycleLabel = plan.billing_cycle === 'year' ? '/ year' : '/ month';
              const isSubmitting = submittingId === plan.id;
              return (
                <div
                  key={plan.id}
                  className="w-full max-w-[320px] bg-[#f6f2e6] rounded-lg p-8 flex flex-col gap-6 relative overflow-hidden border-2 border-[#e8e2d2]"
                >
                  {plan.is_popular && (
                    <div className="absolute inset-0 bg-gradient-to-b from-[#56b88d] via-[#f9d79d] via-50% to-[#f6f2e6] opacity-20 z-0" />
                  )}
                  <div className="flex flex-col gap-3 text-left z-10">
                    <div className="flex gap-2 items-center flex-wrap">
                      <p className="text-sm font-medium text-[#161410] uppercase tracking-[0.9px]">
                        {plan.display_name}
                      </p>
                      {plan.is_popular && (
                        <span className="bg-[rgba(46,159,111,0.2)] border border-[rgba(46,159,111,0.2)] text-[#1a6548] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                          Popular
                        </span>
                      )}
                      {plan.original_price != null && plan.original_price > plan.price && (
                        <span className="bg-[rgba(235,141,126,0.3)] border border-[rgba(235,141,126,0.3)] text-[#b3402d] text-[10px] font-medium px-1.5 py-0.5 rounded leading-3 tracking-[0.3px]">
                          Save {Math.round((1 - plan.price / plan.original_price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 items-end flex-wrap">
                      {plan.original_price != null && plan.original_price > plan.price && (
                        <span className="text-[32px] text-[#7f7766] leading-[40px] tracking-[-0.3px] line-through">
                          ${plan.original_price}
                        </span>
                      )}
                      <span className="text-[40px] font-bold text-[#161410] leading-[48px] tracking-[-0.4px]">
                        ${plan.price}
                      </span>
                      <span className="text-base font-medium text-[#7f7766] leading-6 pb-0.5">
                        {cycleLabel}
                      </span>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-[#7f7766] leading-5">{plan.description}</p>
                    )}
                  </div>
                  <ul className="flex flex-col gap-3 text-left z-10">
                    {(plan.features.length > 0 ? plan.features : ['Full library access', 'Unused credits roll over', 'Cancel anytime']).map(
                      (benefit) => (
                        <li key={benefit} className="flex gap-2 items-start">
                          <CheckIcon stroke="#161410" className="shrink-0 mt-0.5" />
                          <span className="text-sm text-[#161410] leading-5 tracking-[0.1px]">
                            {benefit}
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                  <div className="mt-auto z-10">
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={isSubmitting}
                      className="w-full h-12 rounded-sm font-medium bg-[#161410] text-white hover:bg-[#2a2620]"
                    >
                      {isSubmitting ? 'Redirecting…' : 'Subscribe'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/dashboard" className="text-sm text-[#7f7766] hover:text-[#161410] transition-colors">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
