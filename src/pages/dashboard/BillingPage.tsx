import { Link } from 'react-router-dom';
import { CreditCard, Receipt, HandCoins, ArrowRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from './SettingsTabs';

/** Empty state card — shared pattern for Payment Method, Transaction History, Credit Activity. */
function BillingEmptyState({
  icon: Icon,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  secondaryIcon: SecondaryIcon = ArrowRight,
  secondaryIconBefore = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  primaryLabel: string;
  primaryTo: string;
  secondaryLabel: string;
  secondaryTo: string;
  secondaryIcon?: React.ElementType;
  /** If true, render icon before label (e.g. "+ Add payment method"). */
  secondaryIconBefore?: boolean;
}) {
  return (
    <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] flex flex-col items-center justify-center py-16 w-full max-w-[676px]">
      <div className="flex flex-col gap-6 items-center w-full max-w-[442px] text-center">
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="shrink-0 size-12 flex items-center justify-center text-[#5e584b]">
            <Icon className="size-12" />
          </div>
          <div className="flex flex-col gap-2 items-center w-full">
            <h2 className="text-[24px] font-bold leading-8 text-[#5e584b] tracking-[-0.1px]">
              {title}
            </h2>
            <p className="text-sm text-[#7f7766] leading-5 tracking-[0.1px]">
              {description}
            </p>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button
            className="h-10 px-3 bg-[#161410] text-[#fffbf0] hover:bg-[#161410]/90 font-medium text-sm rounded-xs gap-1.5"
            asChild
          >
            <Link to={primaryTo}>
              {primaryLabel}
              <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="h-10 px-3 border-[#a49a84] text-[#161410] font-medium text-sm rounded-xs hover:bg-[#e8e2d2] gap-1.5"
            asChild
          >
            <Link to={secondaryTo}>
              {secondaryIconBefore ? (
                <>
                  <SecondaryIcon className="size-5" />
                  {secondaryLabel}
                </>
              ) : (
                <>
                  {secondaryLabel}
                  <SecondaryIcon className="size-5" />
                </>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-8">
        <SettingsTabs />

        <div className="flex flex-col gap-12 w-full">
          {/* Payment Method */}
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
              Payment Method
            </h1>
            <BillingEmptyState
              icon={CreditCard}
              title="No payment method"
              description="Add a payment method to subscribe or purchase credit packs."
              primaryLabel="Browse library"
              primaryTo="/dashboard/discover"
              secondaryLabel="Add payment method"
              secondaryTo="/pricing"
              secondaryIcon={Plus}
              secondaryIconBefore
            />
          </div>

          {/* Transaction History */}
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
              Transaction History
            </h1>
            <BillingEmptyState
              icon={Receipt}
              title="No transactions yet"
              description="Your subscription charges and credit purchases will appear here"
              primaryLabel="Browse library"
              primaryTo="/dashboard/discover"
              secondaryLabel="View plans"
              secondaryTo="/pricing"
            />
          </div>

          {/* Credit Activity */}
          <div className="flex flex-col gap-6 w-full">
            <h1 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
              Credit Activity
            </h1>
            <BillingEmptyState
              icon={HandCoins}
              title="No credit activity yet"
              description="Credits are used when you download samples or packs"
              primaryLabel="Browse library"
              primaryTo="/dashboard/discover"
              secondaryLabel="Browse library"
              secondaryTo="/dashboard/discover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
