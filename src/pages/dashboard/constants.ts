/**
 * Shared tab config and mock data for dashboard tab content.
 */

export const DASHBOARD_TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'packs', label: 'Packs' },
  { id: 'samples', label: 'Samples' },
  { id: 'creators', label: 'Creators' },
  { id: 'genres', label: 'Genres' },
] as const;

export const TRENDING_ITEMS = [
  { rank: 1, name: 'Sample name goes here', creator: 'Creator name' },
  { rank: 2, name: 'Lo-Fi Keys Loop', creator: 'Beat Lab' },
  { rank: 3, name: 'Trap Hi-Hat Sequence', creator: 'Sound Factory' },
  { rank: 4, name: 'Soul Chop 04', creator: 'Vinyl Revival' },
  { rank: 5, name: 'Synth Pad Texture', creator: 'Synth Wave' },
];

export const NEW_RELEASES_ITEMS = [
  { rank: 1, name: 'Fresh Drop Vol. 1', creator: 'Beat Lab' },
  { rank: 2, name: 'Weekend Pack', creator: 'Sound Factory' },
  { rank: 3, name: 'Midnight Loops', creator: 'Vinyl Revival' },
  { rank: 4, name: '808 Essentials', creator: 'Synth Wave' },
  { rank: 5, name: 'Chill Vibes Pack', creator: 'Creator name' },
];

export const CREATORS_ITEMS = [
  { rank: 1, name: 'Beat Lab', creator: '24 packs' },
  { rank: 2, name: 'Sound Factory', creator: '18 packs' },
  { rank: 3, name: 'Vinyl Revival', creator: '31 packs' },
  { rank: 4, name: 'Synth Wave', creator: '12 packs' },
  { rank: 5, name: 'Creator name', creator: '8 packs' },
];

export const FEATURED_PACKS = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '20', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
];

/** 18 packs for Packs tab grid view – Figma 756-50536 */
export const PACKS_GRID_ITEMS = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '20', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
  { title: 'Midnight Loops', creator: 'Vinyl Revival', playCount: '22', genre: 'Lo-Fi' },
  { title: '808 Essentials', creator: 'Synth Wave', playCount: '19', genre: 'Trap' },
  { title: 'Chill Vibes Pack', creator: 'Creator name', playCount: '14', genre: 'R&B' },
  { title: 'Boom Bap Classics', creator: 'Beat Lab', playCount: '28', genre: 'Boom Bap', premium: true },
  { title: 'Drill Patterns', creator: 'Sound Factory', playCount: '11', genre: 'Drill' },
  { title: 'Jazz Rap Samples', creator: 'Vinyl Revival', playCount: '16', genre: 'Jazz Rap' },
  { title: 'Analog Keys', creator: 'Synth Wave', playCount: '25', genre: 'Lo-Fi' },
  { title: 'Street Beats', creator: 'Creator Name', playCount: '31', genre: 'Hip-Hop' },
  { title: 'Soulful Chops', creator: 'Beat Lab', playCount: '17', genre: 'Soul' }
];

export const LIKED_PACK_NAME = 'Sample Pack Name';

export const SIMILAR_PACKS_TO_LIKES = [
  { title: 'Sample Pack Name Goes Here', creator: 'Creator Name', playCount: '30', genre: 'Hip-Hop' },
  { title: 'Lo-Fi Essentials Vol. 2', creator: 'Beat Lab', playCount: '30', genre: 'Lo-Fi' },
  { title: 'Trap Drums & Melodies', creator: 'Sound Factory', playCount: '15', genre: 'Trap', premium: true },
  { title: 'Soul Chops Collection', creator: 'Vinyl Revival', playCount: '24', genre: 'Soul' },
  { title: 'Electronic Textures', creator: 'Synth Wave', playCount: '18', genre: 'Electronic' },
  { title: 'The Jungle', creator: 'Creator Name', playCount: '12', genre: 'Hip-Hop', premium: true },
];

export const FEATURED_CREATORS = [
  { name: 'Creator Name Goes Here', followersCount: '100', packsCount: '10' },
  { name: 'Beat Lab', followersCount: '250', packsCount: '24' },
  { name: 'Sound Factory', followersCount: '180', packsCount: '18' },
  { name: 'Vinyl Revival', followersCount: '320', packsCount: '31' },
  { name: 'Synth Wave', followersCount: '95', packsCount: '12' },
  { name: 'Creator name', followersCount: '64', packsCount: '8' },
];

export const TOP_GENRES = [
  { name: 'Hip-Hop' },
  { name: 'Drums' },
  { name: 'Boom Bap' },
  { name: 'Lo-Fi' },
  { name: 'Trap' },
  { name: 'Drill' },
  { name: 'Soul' },
];

/** Access options for packs filter – single select */
export const ACCESS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'regular', label: 'Regular' },
  { id: 'premium', label: 'Premium' },
] as const;

/** License options for packs filter – single select; clearanceGuaranteed has badge icon */
export const LICENSE_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'royalty-free', label: 'Royalty-Free' },
  { id: 'clearance-guaranteed', label: 'Clearance Guaranteed' },
] as const;

/** Creator options for packs filter – multi-select with search */
export const CREATOR_FILTER_OPTIONS = [
  { name: 'Nightshift Audio' },
  { name: 'Concrete Theory' },
  { name: 'Low End Bureau' },
  { name: 'Dusty Tape Club' },
  { name: 'Midnight Circuit' },
  { name: 'Analog Habit' },
  { name: 'Beat Lab' },
  { name: 'Sound Factory' },
  { name: 'Vinyl Revival' },
  { name: 'Synth Wave' },
];

/** Released (time) options for packs filter – single select */
export const RELEASED_OPTIONS = [
  { id: 'all', label: 'All time' },
  { id: '7d', label: 'Last 7 days' },
  { id: '30d', label: 'Last 30 days' },
  { id: '3m', label: 'Last 3 month' },
  { id: '6m', label: 'Last 6 month' },
  { id: '1y', label: 'Last year' },
] as const;

/** Keyword options for packs filter – Figma 782-56255 */
export const KEYWORDS_OPTIONS = [
  { name: 'Drums' },
  { name: 'Bass' },
  { name: 'Melody' },
  { name: 'Vocals' },
  { name: 'Loops' },
  { name: 'One-shots' },
  { name: '808' },
  { name: 'Keys' },
  { name: 'Strings' },
  { name: 'Brass' },
  { name: 'FX' },
  { name: 'Percussion' },
];
