import { CreditCard, Plus, ArrowRight, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const VISA_LOGO_URL =
  'https://www.figma.com/api/mcp/asset/4bf08588-0ed1-4288-9d08-78e30eb6c226';

type PaymentMethod = {
  id: string;
  type: string;
  isDefault?: boolean;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  billingDetails?: {
    name?: string | null;
    email?: string | null;
  };
  created: number;
};

function formatCardBrandLabel(input: string | undefined) {
  if (!input) return 'Card';
  return input.toUpperCase();
}

export function PaymentMethodSection({
  onBrowseLibrary,
  onAddPaymentMethod,
  onUpdatePaymentMethod,
  onDeletePaymentMethod,
  paymentMethods = [],
  loading = false,
}: {
  onBrowseLibrary: () => void;
  onAddPaymentMethod: () => void;
  onUpdatePaymentMethod?: (paymentMethodId: string) => void | Promise<void>;
  onDeletePaymentMethod?: (paymentMethodId: string) => void | Promise<void>;
  paymentMethods?: PaymentMethod[];
  loading?: boolean;
}) {
  const methods = Array.isArray(paymentMethods) ? paymentMethods : [];
  const defaultMethod =
    methods.find((m) => m.isDefault) ?? (methods.length ? methods[0] : null);
  const maskedCardNumber =
    defaultMethod?.type === 'card'
      ? `${formatCardBrandLabel(defaultMethod.card?.brand)} **** **** **** ${
          defaultMethod.card?.last4 ?? '—'
        }`
      : null;

  const brand = defaultMethod?.card?.brand?.toLowerCase?.() ?? '';
  const hasVisaLogo = defaultMethod?.type === 'card' && brand === 'visa';

  return (
    <section className="w-full flex flex-col gap-6" aria-label="Payment method">
      <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
        Payment Method
      </h2>

      {loading ? (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
          <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
            Loading…
          </p>
        </div>
      ) : defaultMethod ? (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0">
            <div className="bg-white border border-[#e8e2d2] rounded-xs w-14 h-10 shrink-0 overflow-hidden flex items-center justify-center">
              {hasVisaLogo ? (
                <img
                  src={VISA_LOGO_URL}
                  alt="Visa"
                  className="h-3 w-auto object-contain"
                />
              ) : (
                <span className="text-xs font-semibold tracking-[0.4px] text-[#161410]">
                  {formatCardBrandLabel(defaultMethod.card?.brand)}
                </span>
              )}
            </div>

            <p className="text-[#161410] text-base font-bold leading-6 truncate">
              {maskedCardNumber ?? defaultMethod.type}
            </p>
          </div>

          <button
            type="button"
            className="text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] underline underline-offset-2 hover:opacity-80 shrink-0"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className="cursor-pointer">Edit</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="rounded-[4px] border-[#d6ceb8] bg-white p-1 shadow-[0px_6px_20px_0px_rgba(0,0,0,0.14),0px_1px_3px_0px_rgba(0,0,0,0.08)]"
              >
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    void onUpdatePaymentMethod?.(defaultMethod.id);
                    if (!onUpdatePaymentMethod) onAddPaymentMethod();
                  }}
                  className="h-10 px-3 gap-1.5 rounded-[4px] text-[#5e584b] focus:bg-[#f6f2e6] focus:text-[#161410]"
                >
                  <Download className="size-5 shrink-0" aria-hidden />
                  <span className="text-sm font-medium leading-5 tracking-[0.1px]">
                    Update payment method
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    const ok = window.confirm(
                      'Delete this payment method? This cannot be undone.'
                    );
                    if (!ok) return;
                    void onDeletePaymentMethod?.(defaultMethod.id);
                  }}
                  disabled={!onDeletePaymentMethod}
                  className="h-10 px-3 gap-1.5 rounded-[4px] text-[#b3402d] data-disabled:opacity-50 data-disabled:pointer-events-none focus:bg-[#f6f2e6] focus:text-[#b3402d]"
                >
                  <Trash2 className="size-5 shrink-0" aria-hidden />
                  <span className="text-sm font-medium leading-5 tracking-[0.1px]">
                    Delete payment method
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </button>
        </div>
      ) : (
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
      )}
    </section>
  );
}

