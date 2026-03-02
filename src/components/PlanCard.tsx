import { Button } from '@/components/ui/button';
import { CheckIcon } from '@/components/icons';
import type { PlanTierPublic } from '@/lib/supabase/plans';

const DEFAULT_FEATURES = ['Full library access', 'Unused credits roll over', 'Cancel anytime'];

export interface PlanCardProps {
  plan: PlanTierPublic;
  /** Whether this card represents the user's current subscription */
  isCurrentPlan?: boolean;
  /** Price cycle label, e.g. "/ month" or "/ year" */
  cycleLabel: string;
  /** Feature list; defaults to plan.features or DEFAULT_FEATURES */
  features?: string[];
  /** Main CTA label, e.g. "Start free trial", "Upgrade to Pro" */
  ctaLabel: string;
  /** Whether the subscribe/upgrade action is in progress */
  isSubmitting?: boolean;
  /** Called when user clicks the main subscribe/upgrade/downgrade button */
  onSubscribe: () => void;
  /** When set, shows "Cancel plan" button (current plan, not yet canceled) */
  onCancelPlan?: () => void;
  cancelPlanLoading?: boolean;
  /** When set, shows "Reactivate" button (current plan, canceled at period end) */
  onReactivatePlan?: () => void;
  reactivatePlanLoading?: boolean;
}

export function PlanCard({
  plan,
  isCurrentPlan = false,
  cycleLabel,
  features = plan.features?.length ? plan.features : DEFAULT_FEATURES,
  ctaLabel,
  isSubmitting = false,
  onSubscribe,
  onCancelPlan,
  cancelPlanLoading = false,
  onReactivatePlan,
  reactivatePlanLoading = false,
}: PlanCardProps) {
  const isPopular = plan.is_popular ?? false;
  const showCancelButton = isCurrentPlan && onCancelPlan != null;
  const showReactivateButton = isCurrentPlan && onReactivatePlan != null;

  return (
    <div
      className={`w-[300px] shrink-0 border-2 rounded p-8 flex flex-col gap-8 relative overflow-hidden isolate ${
        isCurrentPlan ? 'bg-[#ebe6d9] border-[#161410]' : 'bg-[#f6f2e6] border-[#e8e2d2]'
      }`}
    >
      {isCurrentPlan && (
        <div className="absolute top-0 right-0 z-20 bg-[#161410] text-[#fffbf0] text-xs font-medium leading-4 py-1.5 px-3 rounded-bl tracking-[0.3px]">
          Current plan
        </div>
      )}
      {isPopular && (
        <div
          className="absolute inset-0 z-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, #56b88d, #f9d79d 50%, #f6f2e6)',
          }}
        />
      )}

      <div className="flex flex-col gap-4 relative z-10">
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
            {(Array.isArray(features) ? features : DEFAULT_FEATURES).map((benefit) => (
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

      <div className="mt-auto relative z-10 flex flex-col gap-3">
        {!isCurrentPlan && (
          <Button
            onClick={onSubscribe}
            disabled={isSubmitting}
            className={
              isPopular
                ? 'w-full h-12 rounded-sm font-medium bg-[#161410] text-[#fffbf0] hover:bg-[#2a2620]'
                : 'w-full h-12 rounded-sm font-medium bg-transparent border-2 border-[#a49a84] text-[#161410] hover:bg-[#e8e2d2]'
            }
          >
            {isSubmitting ? 'Redirecting…' : ctaLabel}
          </Button>
        )}
        {showCancelButton && (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={onCancelPlan}
              disabled={cancelPlanLoading}
              className={`w-full h-10 rounded-sm font-medium text-[#7f7766] hover:text-[#b3402d] hover:bg-transparent ${!cancelPlanLoading ? 'underline' : ''}`}
            >
              {cancelPlanLoading ? 'Cancelling…' : 'Cancel plan'}
            </Button>
            <p className="text-[#7f7766] text-sm leading-5 text-center tracking-[0.1px]">
              Takes effect next billing cycle
            </p>
          </>
        )}
        {showReactivateButton && (
          <Button
            type="button"
            onClick={onReactivatePlan}
            disabled={reactivatePlanLoading}
            className="w-full h-12 rounded-sm font-medium bg-[#161410] text-[#fffbf0] hover:bg-[#2a2620]"
          >
            {reactivatePlanLoading ? 'Updating…' : 'Reactivate immediately'}
          </Button>
        )}
      </div>
    </div>
  );
}
