import {
  ArrowRight,
  ReceiptText,
  ChevronDown,
  MoreHorizontal,
  CheckCircle2,
  Hourglass,
  XCircle,
  RotateCcw,
  Mail,
} from 'lucide-react';
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

function inferSubtext(t: Transaction) {
  const desc = (t.description ?? '').toLowerCase();
  if (desc.includes('credit pack')) return 'One-time purchase';
  if (desc.includes('plan') || desc.includes('subscription')) return 'Billed monthly';
  if (t.kind === 'invoice') return 'Billed monthly';
  if (t.kind === 'payment_intent') return 'One-time purchase';
  return '';
}

function mapStatusTag(statusRaw: string | null | undefined) {
  const status = String(statusRaw ?? '').toLowerCase();

  if (status === 'paid' || status === 'succeeded') {
    return {
      label: 'Paid',
      icon: CheckCircle2,
      wrapperClass:
        'bg-[rgba(46,159,111,0.2)] border border-[rgba(46,159,111,0.2)]',
      textClass: 'text-[#1a6548]',
    };
  }

  if (status === 'pending' || status === 'processing') {
    return {
      label: 'Pending',
      icon: Hourglass,
      wrapperClass:
        'bg-[rgba(234,170,62,0.3)] border border-[rgba(234,170,62,0.6)]',
      textClass: 'text-[#b8711f]',
    };
  }

  if (status === 'failed' || status === 'canceled' || status === 'cancelled') {
    return {
      label: 'Failed',
      icon: XCircle,
      wrapperClass:
        'bg-[rgba(235,141,126,0.3)] border border-[rgba(235,141,126,0.6)]',
      textClass: 'text-[#b3402d]',
    };
  }

  if (status === 'refunded') {
    return {
      label: 'Refunded',
      icon: RotateCcw,
      wrapperClass: 'bg-[#e8e2d2] border border-[#d6ceb8]',
      textClass: 'text-[#161410]',
    };
  }

  return {
    label: statusRaw ? String(statusRaw) : '—',
    icon: null as null | typeof CheckCircle2,
    wrapperClass: 'bg-[#e8e2d2] border border-[#d6ceb8]',
    textClass: 'text-[#161410]',
  };
}

export function TransactionHistorySection({
  onBrowseLibrary,
  onViewPlans,
  transactions = [],
  loading = false,
  dateRangeLabel = 'Date range: 2025',
  onEmailTransactionsReport,
}: {
  onBrowseLibrary: () => void;
  onViewPlans: () => void;
  transactions?: Transaction[];
  loading?: boolean;
  dateRangeLabel?: string;
  onEmailTransactionsReport?: () => void;
}) {
  const txs = Array.isArray(transactions) ? transactions : [];
  const hasTransactions = txs.length > 0;

  return (
    <section className="w-full flex flex-col gap-6" aria-label="Transaction history">
      <div className="flex flex-col gap-2">
        <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
          Transaction History
        </h2>

        {hasTransactions ? (
          <div className="w-full flex items-center justify-between gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xs text-[#161410] hover:opacity-80"
              aria-label="Change date range"
            >
              <span className="text-sm font-medium leading-5 tracking-[0.1px]">
                {dateRangeLabel}
              </span>
              <ChevronDown className="size-5" aria-hidden />
            </button>

            <Button
              type="button"
              variant="outline"
              onClick={onEmailTransactionsReport}
              className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3 gap-2"
            >
              <Mail className="size-5" aria-hidden />
              <span className="px-1.5">Email transactions report</span>
            </Button>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
          <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
            Loading…
          </p>
        </div>
      ) : hasTransactions ? (
        <div className="bg-white border border-[#e8e2d2] rounded-[4px] w-full overflow-hidden">
          {/* Header row */}
          <div className="bg-[#f6f2e6] border-b border-[#e8e2d2] flex items-end pr-12">
            <div className="h-12 w-[120px] px-3 flex items-center">
              <span className="text-[#121619] text-sm font-medium leading-5 tracking-[0.1px]">
                Date
              </span>
            </div>
            <div className="h-12 flex-1 min-w-0 px-3 flex items-center">
              <span className="text-[#121619] text-sm font-medium leading-5 tracking-[0.1px]">
                Description
              </span>
            </div>
            <div className="h-12 w-[120px] px-3 flex items-center">
              <span className="text-[#121619] text-sm font-medium leading-5 tracking-[0.1px]">
                Amount
              </span>
            </div>
            <div className="h-12 w-[130px] px-3 flex items-center">
              <span className="text-[#121619] text-sm font-medium leading-5 tracking-[0.1px]">
                Status
              </span>
            </div>
            <div className="h-12 w-[48px] px-3" />
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {txs.map((t) => {
              const primaryUrl =
                t.hostedInvoiceUrl ?? t.stripeUrl ?? t.invoicePdf ?? null;
              const subtext = inferSubtext(t);
              const statusTag = mapStatusTag(t.status);
              const StatusIcon = statusTag.icon;

              // Design shows refunds as positive green amounts.
              const isRefundLike =
                String(t.status ?? '').toLowerCase() === 'refunded' ||
                (t.description ?? '').toLowerCase().includes('refund');
              const amountLabel = formatMoney(t.amount, t.currency);

              return (
                <div
                  key={t.id}
                  className="bg-[#fffbf0] border-b border-[#e8e2d2] flex h-16 items-stretch overflow-hidden"
                >
                  <div className="w-[120px] px-3 flex items-center">
                    <span className="text-[#161410] text-sm leading-5 tracking-[0.1px] w-full">
                      {formatDateFromUnixSeconds(t.created)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 px-3 flex items-center">
                    <div className="w-full flex flex-col justify-center gap-1 overflow-hidden">
                      <span className="text-[#161410] text-sm leading-5 tracking-[0.1px] truncate">
                        {t.description ||
                          (t.kind === 'invoice' ? 'Invoice' : 'Payment')}
                      </span>
                      {subtext ? (
                        <span className="text-[#7f7766] text-xs leading-4 tracking-[0.2px] truncate">
                          {subtext}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="w-[120px] px-3 flex items-center">
                    {primaryUrl ? (
                      <a
                        href={primaryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={[
                          'text-sm leading-5 tracking-[0.1px] w-full underline underline-offset-2 hover:opacity-80',
                          isRefundLike ? 'text-[#1a6548]' : 'text-[#161410]',
                        ].join(' ')}
                      >
                        {isRefundLike
                          ? `+${amountLabel.replace(/^-/, '')}`
                          : `-${amountLabel.replace(/^-/, '')}`}
                      </a>
                    ) : (
                      <span
                        className={[
                          'text-sm leading-5 tracking-[0.1px] w-full',
                          isRefundLike ? 'text-[#1a6548]' : 'text-[#161410]',
                        ].join(' ')}
                      >
                        {isRefundLike
                          ? `+${amountLabel.replace(/^-/, '')}`
                          : `-${amountLabel.replace(/^-/, '')}`}
                      </span>
                    )}
                  </div>

                  <div className="w-[130px] px-3 flex items-center">
                    <div
                      className={[
                        'h-6 px-1.5 rounded-[6px] inline-flex items-center gap-0.5',
                        statusTag.wrapperClass,
                      ].join(' ')}
                    >
                      {StatusIcon ? (
                        <StatusIcon
                          className={['size-4', statusTag.textClass].join(' ')}
                          aria-hidden
                        />
                      ) : null}
                      <span
                        className={[
                          'text-xs font-medium leading-4 tracking-[0.2px]',
                          statusTag.textClass,
                        ].join(' ')}
                      >
                        {statusTag.label}
                      </span>
                    </div>
                  </div>

                  <div className="w-[48px] px-3 flex items-center justify-center">
                    <button
                      type="button"
                      className="size-6 rounded-xs flex items-center justify-center hover:bg-[#e8e2d2] transition-colors"
                      aria-label="More actions"
                    >
                      <MoreHorizontal className="size-5 text-[#161410]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination row in design is present, but omitted here until backend provides total pages */}
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

