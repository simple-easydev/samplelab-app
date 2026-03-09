/**
 * Compact sample row for search result grid (Figma chart-row 821:69520).
 * Image 56px + sample name + creator name.
 */
export interface SampleSearchRowProps {
  name: string;
  creator: string;
  imageUrl?: string | null;
}

export function SampleSearchRow({ name, creator, imageUrl }: SampleSearchRowProps) {
  return (
    <div className="bg-[#f6f2e6] border-b border-[#e8e2d2] last:border-b-0 flex flex-col p-4 w-full">
      <div className="flex gap-4 items-center min-w-0">
        <div className="bg-white rounded-[2px] size-14 shrink-0 overflow-hidden border border-[#e8e2d2]">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="size-full bg-[#e8e2d2]" aria-hidden />
          )}
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
          <p className="text-[#161410] text-sm font-bold leading-5 truncate tracking-[0.1px]">
            {name}
          </p>
          <p className="text-[#5e584b] text-xs leading-4 truncate tracking-[0.2px]">
            {creator}
          </p>
        </div>
      </div>
    </div>
  );
}
