import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from '../SettingsTabs';
import { SamplesFilterBar } from '../../Samples/SamplesFilterBar';
import { SamplesFilterBarMobile } from '../../Samples/SamplesFilterBarMobile';
import {
  SamplesFilterProvider,
  useSamplesFilterBar,
} from '@/contexts/SamplesFilterContext';
import { SampleRow, type SampleRowItem } from '@/components/SampleRow';

type DownloadedSample = {
  id: string;
  name: string;
  creator: string;
  duration: string;
  bpm: string;
  musicalKey: string;
  tagsRow1: string[];
  tagsRow2: string[];
  premium?: boolean;
  downloaded?: boolean;
  artworkUrl?: string | null;
};

function OptionTabs({
  value,
  onChange,
}: {
  value: 'samples' | 'packs';
  onChange: (next: 'samples' | 'packs') => void;
}) {
  const base =
    'h-10 px-3 rounded-xs border text-[14px] font-medium tracking-[0.1px] transition-colors';
  const selected = 'bg-[#e8e2d2] border-[#161410] text-[#161410]';
  const unselected = 'bg-transparent border-[#d6ceb8] text-[#5e584b]';

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`${base} ${value === 'samples' ? selected : unselected}`}
        onClick={() => onChange('samples')}
      >
        Samples
      </button>
      <button
        type="button"
        className={`${base} ${value === 'packs' ? selected : unselected}`}
        onClick={() => onChange('packs')}
      >
        Packs
      </button>
    </div>
  );
}

function DownloadsPageInner() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'samples' | 'packs'>('samples');
  const { searchQuery } = useSamplesFilterBar();

  // TODO: Replace mock data with RPC `get_my_downloaded_samples`.
  const rows = useMemo<DownloadedSample[]>(
    () => [
      {
        id: '1',
        name: 'Sample name goes here',
        creator: 'Creator name',
        duration: '0:34',
        bpm: '120 BPM',
        musicalKey: 'F Minor',
        tagsRow1: ['Hip-Hop', 'Loop', 'Stems'],
        tagsRow2: ['Royalty-Free'],
        downloaded: true,
        artworkUrl: null,
      },
      {
        id: '2',
        name: 'Sample name goes here',
        creator: 'Creator name',
        duration: '0:34',
        bpm: '120 BPM',
        musicalKey: 'F Minor',
        tagsRow1: ['Hip-Hop', 'Loop', 'Stems'],
        tagsRow2: ['Royalty-Free'],
        premium: true,
        downloaded: false,
        artworkUrl: null,
      },
      {
        id: '3',
        name: 'Sample name goes here',
        creator: 'Creator name',
        duration: '0:34',
        bpm: '120 BPM',
        musicalKey: 'F Minor',
        tagsRow1: ['Hip-Hop', 'Loop', 'Stems'],
        tagsRow2: ['Royalty-Free'],
        downloaded: true,
        artworkUrl: null,
      },
    ],
    []
  );

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) || r.creator.toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

  const filteredItems = useMemo<SampleRowItem[]>(() => {
    return filteredRows.map((row) => {
      const bpmNum = parseInt(row.bpm.replace(/\D/g, ''), 10);
      return {
        id: row.id,
        name: row.name,
        creator: row.creator,
        duration: row.duration,
        tags: row.tagsRow1,
        royaltyFree: row.tagsRow2.includes('Royalty-Free'),
        premium: !!row.premium,
        bpm: Number.isFinite(bpmNum) ? bpmNum : undefined,
        key: row.musicalKey,
        imageUrl: row.artworkUrl ?? undefined,
      };
    });
  }, [filteredRows]);

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
        <SettingsTabs />
        <div className="w-full max-w-[1200px] flex flex-col gap-8 py-8">

        <section className="w-full flex flex-col gap-6" aria-label="Downloads">
          <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Downloads
          </h2>

          <div className="flex flex-col gap-6">
            <OptionTabs value={tab} onChange={setTab} />
            <div className="md:hidden w-full">
              <SamplesFilterBarMobile />
            </div>
            <div className="hidden md:block w-full">
              <SamplesFilterBar />
            </div>

            {tab === 'packs' ? (
              <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full px-6 py-8 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[#161410] text-base font-medium leading-6">
                    Packs downloads coming soon
                  </p>
                  <p className="mt-1 text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
                    For now, your download history is shown under Samples.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => setTab('samples')}
                >
                  View samples
                </Button>
              </div>
            ) : filteredRows.length ? (
              <div className="rounded-[4px] border border-[#e8e2d2] overflow-hidden">
                {filteredItems.map((item) => (
                  <SampleRow key={item.id} item={item} isDownloaded={true} />
                ))}
              </div>
            ) : (
              <div className="bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] w-full px-6 py-8 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="text-[#161410] text-base font-medium leading-6">
                    No downloads yet
                  </p>
                  <p className="mt-1 text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
                    When you download samples or packs, they’ll show up here.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  className="shrink-0"
                  onClick={() => navigate('/dashboard/discover')}
                >
                  Browse library
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default function DownloadsPage() {
  return (
    <SamplesFilterProvider>
      <DownloadsPageInner />
    </SamplesFilterProvider>
  );
}
