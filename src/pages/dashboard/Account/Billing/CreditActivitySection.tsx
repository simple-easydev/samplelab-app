import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronDown, Mail, HandCoins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import type { ColumnDef } from '@tanstack/react-table';
import { supabase } from '@/lib/supabase/client';

export type CreditActivityRow = {
  id: string;
  dateLabel: string; // e.g. "Jan 24, 2025"
  description: string; // e.g. "Credits deducted for sample download"
  amountLabel: string; // e.g. "–2 credits" / "+50 credits"
  amountTone?: 'default' | 'success';
  activityType: string; // e.g. "download_charge"
};

type MyCreditActivityRpcRow = {
  id: string;
  note: string | null;
  delta: number;
  created_at: string;
  activity_type: string;
};

type GetMyCreditActivityResponse = {
  items: MyCreditActivityRpcRow[];
  current_balance?: number | null;
};

async function getMyCreditActivity(options: { p_limit?: number; p_offset?: number } = {}) {
  const { p_limit = 50, p_offset = 0 } = options;
  const { data, error } = await supabase.rpc('get_my_credit_activity', {
    p_limit,
    p_offset,
  });

  if (error) {
    console.error('get_my_credit_activity RPC error:', error);
    return { items: [], current_balance: null } satisfies GetMyCreditActivityResponse;
  }

  const items = Array.isArray((data as any)?.items) ? ((data as any).items as MyCreditActivityRpcRow[]) : [];
  const current_balance = (data as any)?.current_balance ?? null;
  return { items, current_balance } satisfies GetMyCreditActivityResponse;
}

function formatDateLabel(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

function mapRpcRowToCreditActivityRow(row: MyCreditActivityRpcRow): CreditActivityRow {
  const delta = row.delta ?? 0;
  return {
    id: row.id,
    dateLabel: formatDateLabel(row.created_at),
    description: row.note ?? '—',
    amountLabel: `${delta >= 0 ? '+' : '–'}${Math.abs(delta)} ${Math.abs(delta) === 1 ? 'credit' : 'credits'}`,
    amountTone: delta > 0 ? 'success' : 'default',
    activityType: row.activity_type ?? '—',
  };
}

export function CreditActivitySection({
  onBrowseLibrary,
  dateRangeLabel = 'Date range: 2025',
  onEmailActivityReport,
}: {
  onBrowseLibrary: () => void;
  dateRangeLabel?: string;
  onEmailActivityReport?: () => void;
}) {
  const [activityRows, setActivityRows] = useState<CreditActivityRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const resp = await getMyCreditActivity({ p_limit: 50, p_offset: 0 });
        if (cancelled) return;
        setActivityRows(resp.items.map(mapRpcRowToCreditActivityRow));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasActivity = activityRows.length > 0;
  const derivedDateRangeLabel = useMemo(() => {
    if (!activityRows.length) return dateRangeLabel;
    const years = Array.from(
      new Set(
        activityRows
          .map((r) => {
            const match = r.dateLabel.match(/\b(\d{4})\b/);
            return match?.[1] ?? null;
          })
          .filter((x): x is string => Boolean(x))
      )
    );
    return years.length === 1 ? `Date range: ${years[0]}` : dateRangeLabel;
  }, [activityRows, dateRangeLabel]);

  const columns = ([
    {
      accessorKey: 'dateLabel',
      header: 'Date',
      cell: ({ row }) => (
        <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
          {row.original.dateLabel}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: 'amountLabel',
      header: 'Amount',
      cell: ({ row }) => (
        <span
          className={[
            'text-sm leading-5 tracking-[0.1px]',
            row.original.amountTone === 'success' ? 'text-[#1a6548]' : 'text-[#161410]',
          ].join(' ')}
        >
          {row.original.amountLabel}
        </span>
      ),
      size: 120,
    },
    {
      accessorKey: 'activityType',
      header: 'Activity',
      cell: ({ row }) => (
        <span className="text-[#161410] text-sm leading-5 tracking-[0.1px]">
          {row.original.activityType}
        </span>
      ),
      size: 130,
    },
  ] satisfies ColumnDef<CreditActivityRow, any>[]);

  return (
    <section className="w-full flex flex-col gap-6" aria-label="Credit activity history">
      <div className="flex flex-col gap-2">
        <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
          Credit Activity
        </h2>

        {hasActivity ? (
          <div className="w-full flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              className="h-6 px-0 rounded-xs text-[#161410] hover:bg-transparent"
            >
              <span className="text-sm font-medium leading-5 tracking-[0.1px]">
                {derivedDateRangeLabel}
              </span>
              <ChevronDown className="size-5" aria-hidden />
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onEmailActivityReport}
              className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3 gap-2"
            >
              <Mail className="size-5" aria-hidden />
              <span className="px-1.5">Email activity report</span>
            </Button>
          </div>
        ) : null}
      </div>

      {hasActivity ? (
        <div className="bg-white border border-[#e8e2d2] rounded-[4px] overflow-hidden">
          <DataTable columns={columns} data={activityRows} />
        </div>
      ) : loading ? (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
          <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">Loading…</p>
        </div>
      ) : (
        <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full py-16 flex items-center justify-center">
          <div className="w-full max-w-[442px] flex flex-col items-center gap-6 px-4 text-center">
            <HandCoins className="size-12 text-[#7f7766]" aria-hidden />

            <div className="flex flex-col items-center gap-2">
              <p className="text-[#5e584b] text-2xl font-bold leading-8 tracking-[-0.1px]">
                No credit activity yet
              </p>
              <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
                Credits are used when you download samples or packs
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
                onClick={onBrowseLibrary}
                className="h-10 rounded-xs border border-[#a49a84] bg-transparent text-[#161410] hover:bg-[#e8e2d2] px-3 gap-2"
              >
                <span className="px-1.5">Browse library</span>
                <ArrowRight className="size-5" aria-hidden />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

