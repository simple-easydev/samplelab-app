import { useEffect, useMemo, useState } from 'react';
import { Coins, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from './SettingsTabs';
import { useSubscription } from '@/hooks/useSubscription';
import { useCredits } from '@/contexts/CreditsContext';
import { getStripePlans, type PlanTierPublic } from '@/lib/supabase/plans';
import { toast } from 'sonner';

function NoActiveSubscriptionState({
  onBrowseLibrary,
  onStartFreeTrial,
}: {
  onBrowseLibrary: () => void;
  onStartFreeTrial: () => void;
}) {
  return (
    <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex flex-col items-center justify-center">
      <div className="w-full max-w-[442px] flex flex-col items-center gap-6 px-4 text-center">
        <Coins className="size-12 text-[#7f7766]" aria-hidden />

        <div className="flex flex-col items-center gap-2">
          <p className="text-[#5e584b] text-2xl font-bold leading-8 tracking-[-0.1px]">
            No active subscription
          </p>
          <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
            Subscribe to unlock downloads and get monthly credits
          </p>
        </div>

        <div className="flex items-start gap-3 flex-wrap justify-center">
          <Button
            type="button"
            onClick={onBrowseLibrary}
            className="h-10 rounded-xs bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 px-3 gap-2"
          >
            <span className="px-1.5">Browse library</span>
            <ArrowRight className="size-5" aria-hidden />
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onStartFreeTrial}
            className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3"
          >
            <span className="px-1.5">Start free trial</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PlansCreditsPage() {
  const navigate = useNavigate();
  const { isActive, loading, subscription } = useSubscription();
  const { credits } = useCredits();
  const [plans, setPlans] = useState<PlanTierPublic[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedTopUpCredits, setSelectedTopUpCredits] = useState(50);

  useEffect(() => {
    let cancelled = false;
    getStripePlans()
      .then((p) => {
        if (cancelled) return;
        setPlans(p ?? []);
      })
      .catch((e) => {
        console.error('Failed to load plans:', e);
        if (!cancelled) setPlans([]);
      })
      .finally(() => {
        if (!cancelled) setPlansLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const currentPlan = useMemo(() => {
    const priceId = subscription?.stripe_price_id ?? null;
    if (!priceId) return null;
    return plans.find((p) => p.stripe_price_id === priceId) ?? null;
  }, [plans, subscription?.stripe_price_id]);

  const planDisplayName = currentPlan?.display_name ?? subscription?.tier ?? 'Your';
  const billingCycle = (currentPlan?.billing_cycle ?? '').toLowerCase();
  const billingCycleLabel = billingCycle === 'year' ? 'year' : 'month';
  const billingSubtext = billingCycle === 'year' ? 'Billed yearly' : 'Billed monthly';
  const priceLabel =
    typeof currentPlan?.price === 'number'
      ? `$${currentPlan.price}/${billingCycleLabel}`
      : '—';

  const renewsOnLabel = useMemo(() => {
    const input = subscription?.current_period_end;
    if (!input) return '—';
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(d);
  }, [subscription?.current_period_end]);

  const topUpOptions = useMemo(
    () => [
      { credits: 20, price: 4.99 },
      { credits: 50, price: 9.99 },
      { credits: 100, price: 17.99 },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-8">
        <SettingsTabs />

        {loading || plansLoading ? (
            <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
              <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
                Loading…
              </p>
            </div>
          ) : !isActive ? (
          <div className="flex flex-col gap-6">
            <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
              Plans & credits
            </h1>
            <NoActiveSubscriptionState
              onBrowseLibrary={() => navigate('/dashboard/discover')}
              onStartFreeTrial={() => navigate('/pricing')}
            />
          </div>
        ) : (
            <div className="flex flex-col gap-12">
            {/* Plan */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-[20px] md:text-[28px] font-bold leading-7 md:leading-9 text-[#161410] tracking-[-0.2px]">
                  You’re on the {planDisplayName} plan
                </h1>
                <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                  Credits roll over while subscription is active
                </p>
              </div>

              <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full p-6 md:p-8 flex flex-col gap-6">
                <div className="w-full flex flex-col md:flex-row items-start md:items-start gap-6 md:gap-8">
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                      Credits remaining
                    </p>
                    <p className="text-[#161410] text-base font-bold leading-6">
                      {credits != null ? `${credits} credits` : '—'}
                    </p>
                  </div>

                  <div className="hidden md:block w-px self-stretch bg-[#d6ceb8]" />
                  <div className="md:hidden h-px w-full bg-[#d6ceb8]" />

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                      Billing
                    </p>
                    <p className="text-[#161410] text-base font-bold leading-6">
                      {priceLabel}
                    </p>
                    <p className="text-[#7f7766] text-xs leading-4 tracking-[0.2px]">
                      {billingSubtext}
                    </p>
                  </div>

                  <div className="hidden md:block w-px self-stretch bg-[#d6ceb8]" />
                  <div className="md:hidden h-px w-full bg-[#d6ceb8]" />

                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-[#5e584b] text-sm leading-5 tracking-[0.1px]">
                      Renews on
                    </p>
                    <p className="text-[#161410] text-base font-bold leading-6">
                      {renewsOnLabel}
                    </p>
                  </div>
                </div>

                <p className="text-[#7f7766] text-xs leading-4 tracking-[0.2px]">
                  You’ll be charged{' '}
                  <span className="font-bold text-[#7f7766]">
                    {typeof currentPlan?.price === 'number'
                      ? `$${currentPlan.price} on ${renewsOnLabel}`
                      : `— on ${renewsOnLabel}`}
                  </span>{' '}
                  if you keep this plan
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/settings/bill')}
                className="h-12 w-full md:w-auto rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-4 self-start md:self-start"
              >
                <span className="px-2">Manage plan</span>
              </Button>
            </div>

            <div className="h-px w-full bg-[#e8e2d2]" />
          </div>
        )}
      </div>
    </div>
  );
}

