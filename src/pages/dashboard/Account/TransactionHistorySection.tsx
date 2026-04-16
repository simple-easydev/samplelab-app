import { ArrowRight, ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Transaction = {
  id: string;
  kind: 'invoice' | 'payment_intent' | string;
  created: number;
  currency: string;
  status: string;
  amount: number;
  amountPaid?: number;
  amountReceived?: number;
  hostedInvoiceUrl?: string | null;
  invoicePdf?: string | null;
  description?: string | null;
  receiptEmail?: string | null;
  stripeUrl?: string | null;
};

function formatMoney(amountMinor: number, currency: string) {
  const major = (amountMinor ?? 0) / 100;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: (currency || 'usd').toUpperCase(),
    }).format(major);
  } catch {
    return `${major.toFixed(2)} ${currency?.toUpperCase?.() ?? ''}`.trim();
  }
}

function formatDateFromUnixSeconds(seconds: number) {
  const d = new Date((seconds ?? 0) * 1000);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

export function TransactionHistorySection({
  onBrowseLibrary,
  onViewPlans,
  transactions = [],
  loading = false,
}: {
  onBrowseLibrary: () => void;
  onViewPlans: () => void;
  transactions?: Transaction[];
  loading?: boolean;
}) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const hasTransactions = txs.length > 0;

  return (
    <section className="w-full flex flex-col gap-6" aria-label="Transaction history">
      <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
        Transaction History
      </h2>

      {loading ? (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
          <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
            Loading…
          </p>
        </div>
      ) : hasTransactions ? (
        <div className="bg-white border border-[#e8e2d2] rounded-[4px] w-full overflow-hidden">
          <div className="flex flex-col divide-y divide-[#e8e2d2]">
            {txs.map((t) => {
              const primaryUrl =
                t.hostedInvoiceUrl ?? t.stripeUrl ?? t.invoicePdf ?? null;
              return (
                <div
                  key={t.id}
                  className="px-4 py-3 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0 flex flex-col gap-1">
                    <p className="text-[#161410] text-sm font-medium leading-5 tracking-[0.1px] truncate">
                      {t.description ||
                        (t.kind === 'invoice' ? 'Invoice' : 'Payment')}
                    </p>
                    <p className="text-[#7f7766] text-xs leading-4 tracking-[0.1px]">
                      {formatDateFromUnixSeconds(t.created)} ·{' '}
                      {String(t.status ?? '—')}
                      {t.kind ? ` · ${t.kind}` : ''}
                    </p>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-1">
                    <p className="text-[#161410] text-sm font-semibold leading-5 tracking-[0.1px]">
                      {formatMoney(t.amount, t.currency)}
                    </p>
                    {primaryUrl ? (
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs leading-4 tracking-[0.1px] text-[#161410] underline underline-offset-2 hover:opacity-80"
                      >
                        View
                      </a>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
        <div className="w-full max-w-[442px] flex flex-col items-center gap-6 px-4 text-center">
          <ReceiptText className="size-12 text-[#7f7766]" aria-hidden />

          <div className="flex flex-col items-center gap-2">
            <p className="text-[#5e584b] text-2xl font-bold leading-8 tracking-[-0.1px]">
              No transactions yet
            </p>
            <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
              Your subscription charges and credit purchases will appear here
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
              onClick={onViewPlans}
              className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3 gap-2"
            >
              <span className="px-1.5">View plans</span>
              <ArrowRight className="size-5" aria-hidden />
            </Button>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

