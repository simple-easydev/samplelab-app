import { CreditCard, Plus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PaymentMethodSection({
  onBrowseLibrary,
  onAddPaymentMethod,
}: {
  onBrowseLibrary: () => void;
  onAddPaymentMethod: () => void;
}) {
  return (
    <section className="w-full flex flex-col gap-6" aria-label="Payment method">
      <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
        Payment Method
      </h2>

      <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
        <div className="w-full max-w-[442px] flex flex-col items-center gap-6 px-4 text-center">
          <CreditCard className="size-12 text-[#7f7766]" aria-hidden />

          <div className="flex flex-col items-center gap-2">
            <p className="text-[#5e584b] text-2xl font-bold leading-8 tracking-[-0.1px]">
              No payment method
            </p>
            <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
              Add a payment method to subscribe or purchase credit packs.
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
              onClick={onAddPaymentMethod}
              className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3 gap-2"
            >
              <Plus className="size-5" aria-hidden />
              <span className="px-1.5">Add payment method</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

