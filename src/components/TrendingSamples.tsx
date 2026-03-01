/**
 * Trending samples section from Figma (node 812-51974) – "Trending samples" + sample chart rows.
 */
const PLACEHOLDER_SAMPLES = [
  { rank: 1, name: 'Sample name goes here', creator: 'Creator name' },
  { rank: 2, name: 'Lo-Fi Keys Loop', creator: 'Beat Lab' },
  { rank: 3, name: 'Trap Hi-Hat Sequence', creator: 'Sound Factory' },
  { rank: 4, name: 'Soul Chop 04', creator: 'Vinyl Revival' },
  { rank: 5, name: 'Synth Pad Texture', creator: 'Synth Wave' },
];

export function TrendingSamples() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-[#161410] text-[28px] font-bold leading-9 tracking-[-0.2px]">
          Trending samples
        </h2>
        <p className="text-[#7f7766] text-sm leading-5 tracking-[0.1px]">
          The most downloaded samples right now
        </p>
      </div>

      <div className="border border-[#e8e2d2] rounded overflow-hidden flex flex-col">
        {PLACEHOLDER_SAMPLES.map((item) => (
          <div
            key={item.rank}
            className="bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex gap-4 items-center p-4 w-full"
          >
            <span className="text-[#161410] text-base font-medium leading-6 text-center w-4 shrink-0">
              {item.rank}
            </span>
            <div className="flex gap-4 items-center min-w-0 flex-1">
              <div className="bg-white rounded-[2px] size-14 shrink-0 overflow-hidden">
                <div className="size-full bg-[#e8e2d2]" aria-hidden />
              </div>
              <div className="flex flex-col gap-2 min-w-0 flex-1 justify-center">
                <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
                  {item.name}
                </p>
                <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
                  {item.creator}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
