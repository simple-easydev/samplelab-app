/**
 * Reusable creator card from Figma (node 812-51974) – Featured creators section.
 * Circular avatar, "Creator" overline, name, tag pills (e.g. followers, packs).
 */
import { Link } from 'react-router-dom';
import { Play, FolderOpen } from 'lucide-react';

export interface CreatorCardProps {
  name: string;
  /** e.g. followers or play count "100" */
  followersCount?: string;
  /** e.g. "10" for number of packs */
  packsCount?: string;
  /** Optional avatar image URL; placeholder used if not provided */
  imageUrl?: string;
  /** Optional slug for creator detail link (e.g. "creator-name"). When set, card links to /dashboard/creators/:slug */
  creatorSlug?: string;
}

export function CreatorCard({
  name,
  followersCount,
  packsCount,
  imageUrl,
  creatorSlug,
}: CreatorCardProps) {
  const cardContent = (
    <>
      {/* Circular photo */}
      <div className="flex flex-col h-[209px] p-2 w-full shrink-0 items-center justify-center">
        <div className="bg-[#dde1e6] overflow-hidden rounded-full w-full aspect-square max-w-[193px] relative">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#e8e2d2]" aria-hidden />
          )}
        </div>
      </div>

      {/* Data */}
      <div className="flex flex-col gap-4 px-4 w-full">
        <div className="flex flex-col gap-1">
          <p className="text-[#7f7766] text-[8px] leading-3 tracking-[1.1px] uppercase">
            Creator
          </p>
          <p className="text-[#161410] text-sm font-bold leading-5 tracking-[0.1px] truncate text-center">
            {name}
          </p>
        </div>

        <div className="border-t border-[#e8e2d2] w-full shrink-0" aria-hidden />

        <div className="flex gap-2 h-6 items-center justify-center flex-wrap">
          {followersCount != null && (
            <div className="bg-[#e8e2d2] border border-[#d6ceb8] flex gap-0.5 h-5 items-center justify-center px-1.5 rounded-md shrink-0">
              <Play className="size-3 text-[#161410]" aria-hidden />
              <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                {followersCount}
              </span>
            </div>
          )}
          {packsCount != null && (
            <div className="bg-[#e8e2d2] border border-[#d6ceb8] flex gap-0.5 h-5 items-center justify-center px-1.5 rounded-md shrink-0">
              <FolderOpen className="size-3 text-[#161410]" aria-hidden />
              <span className="text-[#161410] text-[10px] font-medium leading-3 tracking-[0.3px]">
                {packsCount}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const className =
    'bg-[#f6f2e6] border border-[#e8e2d2] rounded-[4px] flex flex-col gap-2 overflow-hidden pb-4 shrink-0 w-[209px] min-h-[325px] items-center transition-[border-color,box-shadow] hover:border-[#d6ceb8] hover:shadow-[0_6px_18px_0_rgba(0,0,0,0.10),0_2px_6px_0_rgba(0,0,0,0.06)]';

  if (creatorSlug != null && creatorSlug !== '') {
    return (
      <Link
        to={`/dashboard/creators/${creatorSlug}`}
        className={className}
        aria-label={`View ${name} profile`}
      >
        {cardContent}
      </Link>
    );
  }

  return <article className={className}>{cardContent}</article>;
}
