import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gift, X, Coins, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/hooks/useSubscription';
import { getUserCredits } from '@/lib/supabase/subscriptions';
import { SettingsTabs } from './SettingsTabs';

function formatTrialEndDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatChargeDate(isoDate: string | null): string {
  if (!isoDate) return '—';
  try {
    const d = new Date(isoDate);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/** Plans & credits content when user is on a trial (Figma design). */
function TrialState({
  credits,
  trialEnd,
  bannerDismissed,
  onDismissBanner,
}: {
  credits: number | null;
  trialEnd: string | null;
  bannerDismissed: boolean;
  onDismissBanner: () => void;
}) {
  const chargeDate = trialEnd || '';
  return (
    <>
      {/* Special offer banner — only for trial users */}
      {!bannerDismissed && (
        <div className="bg-[#161410] flex flex-col min-h-[104px] p-4 rounded-[4px] w-full relative">
          <div className="flex gap-6 items-center w-full">
            <div className="bg-[#26231e] border border-white/10 rounded-[4px] size-[72px] shrink-0 flex items-center justify-center">
              <Gift className="size-12 text-[#f3c16c]" />
            </div>
            <div className="flex flex-1 flex-col gap-1 min-w-0">
              <p className="text-[14px] font-medium uppercase tracking-[0.9px] text-[#f3c16c]">
                Special offer
              </p>
              <p className="text-[20px] font-bold leading-7 text-[#fffbf0]">
                Skip the trial. Get 50 bonus credits.
              </p>
              <p className="text-xs text-[#d6ceb8] tracking-[0.2px]">
                Charged $19.99 today. Cancel anytime.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-10 px-3 border-[rgba(255,251,240,0.3)] text-[#fffbf0] hover:bg-white/10 hover:text-[#fffbf0] rounded-xs text-sm font-medium shrink-0"
              asChild
            >
              <Link to="/pricing">Claim offer</Link>
            </Button>
            <button
              type="button"
              onClick={onDismissBanner}
              className="shrink-0 size-6 flex items-center justify-center text-[#fffbf0]/80 hover:text-[#fffbf0]"
              aria-label="Dismiss banner"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            You're on a 3-day free trial
          </h1>
          <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
            Your trial will automatically convert to the{' '}
            <span className="font-bold">Pro plan</span> unless you change or
            cancel before it ends. Trial credits do{' '}
            <span className="font-bold">not</span> roll over
          </p>
        </div>

        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] p-8 flex flex-col gap-6 w-full">
          <div className="flex gap-8 items-start w-full">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">
                Trial credits remaining
              </p>
              <p className="text-base font-bold text-[#161410]">
                {credits != null ? `${credits} credits` : '—'}
              </p>
            </div>
            <div className="w-px self-stretch shrink-0 bg-[#e8e2d2]" />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">
                After trial
              </p>
              <p className="text-base font-bold text-[#161410]">$19/month</p>
              <p className="text-xs text-[#7f7766] tracking-[0.2px]">
                150 credits/month
              </p>
            </div>
            <div className="w-px self-stretch shrink-0 bg-[#e8e2d2]" />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">
                Trial ends on
              </p>
              <p className="text-base font-bold text-[#161410]">
                {formatTrialEndDate(trialEnd)}
              </p>
            </div>
          </div>
          <p className="text-xs text-[#7f7766] tracking-[0.2px] leading-4">
            You'll be charged{' '}
            <span className="font-bold">
              $19 on {formatChargeDate(chargeDate)}
            </span>{' '}
            if you keep this plan
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Button
            type="button"
            className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs"
            asChild
          >
            <Link to="/pricing">Skip trial & start Pro now</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 px-4 border-[#a49a84] text-[#161410] font-medium text-base rounded-xs hover:bg-[#e8e2d2]"
            asChild
          >
            <Link to="/pricing">Manage plan</Link>
          </Button>
        </div>
      </div>
    </>
  );
}

/** Top-up credit pack card — Figma 920-80417 / 920-80772 (selected). */
function TopUpCreditsCard({
  credits,
  price,
  selected,
  onSelect,
}: {
  credits: number;
  price: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-1 min-w-0 flex-col gap-1 items-center justify-center p-4 rounded-[4px] transition-colors text-left w-full ${
        selected
          ? 'border-2 border-[#161410]'
          : 'border border-[#d6ceb8] hover:border-[#a49a84]'
      } bg-transparent`}
    >
      <div className="flex gap-2 items-center justify-between w-full">
        <p className="text-sm text-[#5e584b] tracking-[0.1px]">
          {credits} credits
        </p>
        {selected && (
          <CheckCircle className="size-5 shrink-0 text-[#161410]" />
        )}
      </div>
      <p className="text-base font-bold text-[#161410] w-full">{price}</p>
    </button>
  );
}

const TOP_UP_PACKS = [
  { credits: 20, price: '$4.99' },
  { credits: 50, price: '$9.99' },
  { credits: 100, price: '$17.99' },
] as const;

/** Subscribed user (active, not in trial) — Figma 920-79694. */
function SubscribedState({
  credits,
  renewalDate,
  isCanceledAtPeriodEnd,
  chargeAmount = '$19',
}: {
  credits: number | null;
  renewalDate: string;
  isCanceledAtPeriodEnd: boolean;
  chargeAmount?: string;
}) {
  const [selectedPackIndex, setSelectedPackIndex] = useState(1); // 50 credits default

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Plan section */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            You're on the Pro plan
          </h1>
          <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
            {isCanceledAtPeriodEnd
              ? `Your plan will end on ${renewalDate}. You'll keep access until then.`
              : 'Credits roll over while subscription is active'}
          </p>
        </div>

        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] p-8 flex flex-col gap-6 w-full">
          <div className="flex gap-8 items-start w-full">
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">
                Credits remaining
              </p>
              <p className="text-base font-bold text-[#161410]">
                {credits != null ? `${credits} credits` : '—'}
              </p>
            </div>
            <div className="w-px self-stretch shrink-0 bg-[#e8e2d2]" />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">Billing</p>
              <p className="text-base font-bold text-[#161410]">$19/month</p>
              <p className="text-xs text-[#7f7766] tracking-[0.2px]">
                Billed monthly
              </p>
            </div>
            <div className="w-px self-stretch shrink-0 bg-[#e8e2d2]" />
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <p className="text-sm text-[#5e584b] tracking-[0.1px]">
                {isCanceledAtPeriodEnd ? 'Access until' : 'Renews on'}
              </p>
              <p className="text-base font-bold text-[#161410]">{renewalDate}</p>
            </div>
          </div>
          {!isCanceledAtPeriodEnd && (
            <p className="text-xs text-[#7f7766] tracking-[0.2px] leading-4">
              You'll be charged{' '}
              <span className="font-bold">
                {chargeAmount} on {renewalDate}
              </span>{' '}
              if you keep this plan
            </p>
          )}
          {isCanceledAtPeriodEnd && (
            <p className="text-xs text-[#7f7766] tracking-[0.2px] leading-4">
              Reactivate your plan on the pricing page to keep access after this
              date.
            </p>
          )}
        </div>

        <Button
          variant="outline"
          className="h-12 px-4 border-[#a49a84] text-[#161410] font-medium text-base rounded-xs hover:bg-[#e8e2d2] w-fit"
          asChild
        >
          <Link to="/pricing">Manage plan</Link>
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#e8e2d2]" />

      {/* Need more credits */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] font-bold leading-7 text-[#161410]">
            Need more credits?
          </h2>
          <p className="text-sm text-[#5e584b] leading-5 tracking-[0.1px]">
            Buy one-time credit packs. Credits never expire
          </p>
        </div>

        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] p-8 flex gap-4 w-full">
          {TOP_UP_PACKS.map((pack, index) => (
            <TopUpCreditsCard
              key={pack.credits}
              credits={pack.credits}
              price={pack.price}
              selected={selectedPackIndex === index}
              onSelect={() => setSelectedPackIndex(index)}
            />
          ))}
        </div>

        <Button
          type="button"
          className="h-12 px-4 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-base rounded-xs w-fit"
        >
          Buy credits
        </Button>
      </div>
    </div>
  );
}

/** No active subscription: free user — Figma empty state (node 900-97731). */
function FreeState() {
  return (
    <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] flex flex-col items-center justify-center py-16 w-full max-w-[676px]">
      <div className="flex flex-col gap-6 items-center w-full max-w-[442px] text-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="shrink-0 size-12 flex items-center justify-center text-[#5e584b]">
            <Coins className="size-12" />
          </div>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2 className="text-[24px] font-bold leading-8 text-[#5e584b] tracking-[-0.1px]">
              No active subscription
            </h2>
            <p className="text-sm text-[#7f7766] leading-5 tracking-[0.1px]">
              Subscribe to unlock downloads and get monthly credits
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            className="h-10 px-3 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-sm rounded-xs gap-1.5"
            asChild
          >
            <Link to="/dashboard/discover">
              Browse library
              <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-10 px-3 border-[#a49a84] text-[#161410] font-medium text-sm rounded-xs hover:bg-[#e8e2d2]"
            asChild
          >
            <Link to="/pricing">Start free trial</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PlansAndCreditsPage() {
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const { subscription, isActive, isTrialing, loading } = useSubscription();

  useEffect(() => {
    if (isActive || isTrialing) {
      getUserCredits().then(setCredits);
    }
  }, [isActive, isTrialing]);

  const renewalDate =
    subscription?.current_period_end != null
      ? (() => {
          try {
            return new Date(subscription.current_period_end).toLocaleDateString(
              'en-US',
              { month: 'short', day: 'numeric', year: 'numeric' }
            );
          } catch {
            return '—';
          }
        })()
      : '—';
  const isCanceledAtPeriodEnd = subscription?.cancel_at_period_end === true;

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-8">
        <SettingsTabs />

        {loading ? (
          <p className="text-[#7f7766]">Loading…</p>
        ) : isTrialing ? (
          <TrialState
            credits={credits}
            trialEnd={subscription?.trial_end ?? null}
            bannerDismissed={bannerDismissed}
            onDismissBanner={() => setBannerDismissed(true)}
          />
        ) : isActive ? (
          <SubscribedState
            credits={credits}
            renewalDate={renewalDate}
            isCanceledAtPeriodEnd={isCanceledAtPeriodEnd}
          />
        ) : (
          <FreeState />
        )}
      </div>
    </div>
  );
}
