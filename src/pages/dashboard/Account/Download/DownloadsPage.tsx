import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SettingsTabs } from '../SettingsTabs';

export default function DownloadsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-12">
        <SettingsTabs />

        <section className="w-full flex flex-col gap-6" aria-label="Downloads">
          <h2 className="text-[28px] font-bold leading-9 text-[#161410] tracking-[-0.2px]">
            Downloads
          </h2>

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
        </section>
      </div>
    </div>
  );
}
