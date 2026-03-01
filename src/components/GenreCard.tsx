/**
 * Reusable genre card from Figma (node 812-51974) – Top genres section.
 * Square cover image + genre name centered below.
 */
export interface GenreCardProps {
  name: string;
  /** Optional image URL; placeholder used if not provided */
  imageUrl?: string;
}

export function GenreCard({ name, imageUrl }: GenreCardProps) {
  return (
    <article className="bg-[#f6f2e6] border border-[#e8e2d2] rounded flex flex-col gap-2 overflow-hidden pb-4 shrink-0 w-[209px] min-h-[253px] items-center">
      {/* Cover */}
      <div className="flex flex-col h-[209px] p-2 w-full shrink-0">
        <div className="bg-[#dde1e6] flex-1 min-h-0 overflow-hidden rounded-[2px] w-full relative">
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

      {/* Genre name */}
      <div className="flex flex-col items-start px-4 w-full shrink-0">
        <p className="text-[#161410] text-sm font-bold leading-5 tracking-[0.1px] truncate text-center w-full">
          {name}
        </p>
      </div>
    </article>
  );
}
