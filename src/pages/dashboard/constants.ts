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

/** Creators tab sort options – Figma 812-85001 (Trending, Popular, Recent, A-Z). */
export const CREATORS_SORT_OPTIONS = [
  { id: 'trending', label: 'Trending' },
  { id: 'popular', label: 'Popular' },
  { id: 'recent', label: 'Recent' },
  { id: 'a-z', label: 'A-Z' },
] as const;

/** Creators tab grid – extended list for grid view (Figma 812-85001). */
export const CREATORS_GRID_ITEMS = [
  ...FEATURED_CREATORS,
  { name: 'Nightshift Audio', followersCount: '420', packsCount: '15' },
  { name: 'Concrete Theory', followersCount: '180', packsCount: '9' },
  { name: 'Low End Bureau', followersCount: '310', packsCount: '22' },
  { name: 'Dusty Tape Club', followersCount: '95', packsCount: '7' },
  { name: 'Midnight Circuit', followersCount: '200', packsCount: '14' },
  { name: 'Analog Habit', followersCount: '150', packsCount: '11' },
  { name: 'Beat Lab', followersCount: '250', packsCount: '24' },
  { name: 'Sound Factory', followersCount: '180', packsCount: '18' },
  { name: 'Vinyl Revival', followersCount: '320', packsCount: '31' },
  { name: 'Synth Wave', followersCount: '95', packsCount: '12' },
  { name: 'Creator Name Goes Here', followersCount: '100', packsCount: '10' },
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

/** Sample row data for Samples tab list – Figma 812-47888 */
export interface SampleListItem {
  name: string;
  creator: string;
  duration: string;
  genre?: string;
  tags?: string[];
  license?: string;
  premium?: boolean;
  bpm?: string;
  key?: string;
  imageUrl?: string;
}

/** Sample tab filter options – Figma 812-47896 */
export const SAMPLE_INSTRUMENT_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'keys', label: 'Keys' },
  { id: 'drums', label: 'Drums' },
  { id: 'bass', label: 'Bass' },
  { id: 'strings', label: 'Strings' },
  { id: 'brass', label: 'Brass' },
  { id: 'vocals', label: 'Vocals' },
] as const;

export const SAMPLE_TYPE_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'loop', label: 'Loop' },
  { id: 'one-shot', label: 'One-shot' },
] as const;

export const SAMPLE_STEMS_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'yes', label: 'Stems' },
  { id: 'no', label: 'No stems' },
] as const;

export const SAMPLE_KEY_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'c', label: 'C' },
  { id: 'd', label: 'D' },
  { id: 'e', label: 'E' },
  { id: 'f', label: 'F' },
  { id: 'g', label: 'G' },
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
] as const;

/** Key filter panel – Figma 812-69672, 812-70161. Flat keys: [left column, right column]. */
export const KEY_FILTER_FLAT_KEYS: readonly [readonly string[], readonly string[]] = [
  ['Db', 'Eb', 'C', 'D', 'E'],
  ['Gb', 'Ab', 'Bb', 'F', 'G', 'A', 'B'],
];

/** Key filter panel – Sharp keys: [left column, right column]. */
export const KEY_FILTER_SHARP_KEYS: readonly [readonly string[], readonly string[]] = [
  ['C#', 'D#', 'C', 'D', 'E'],
  ['F#', 'G#', 'A#', 'F', 'G', 'A', 'B'],
];

export const KEY_QUALITY_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'major', label: 'Major' },
  { id: 'minor', label: 'Minor' },
] as const;

export const SAMPLE_BPM_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: '60-90', label: '60–90 BPM' },
  { id: '90-120', label: '90–120 BPM' },
  { id: '120-140', label: '120–140 BPM' },
  { id: '140+', label: '140+ BPM' },
] as const;

export const SAMPLES_LIST: SampleListItem[] = [
  { name: 'Sample name goes here', creator: 'Creator name', duration: '0:34', genre: 'Hip-Hop', tags: ['Loop', 'Stems'], license: 'Royalty-Free', bpm: '120 BPM', key: 'F Minor' },
  { name: 'Lo-Fi Keys Loop', creator: 'Beat Lab', duration: '0:28', genre: 'Lo-Fi', tags: ['Loop'], license: 'Royalty-Free', bpm: '92 BPM', key: 'C Major' },
  { name: 'Trap Hi-Hat Sequence', creator: 'Sound Factory', duration: '0:16', genre: 'Trap', tags: ['One-shots'], license: 'Royalty-Free', premium: true, bpm: '140 BPM', key: 'A Minor' },
  { name: 'Soul Chop 04', creator: 'Vinyl Revival', duration: '0:42', genre: 'Soul', tags: ['Loop', 'Stems'], license: 'Royalty-Free', bpm: '88 BPM', key: 'E Minor' },
  { name: 'Synth Pad Texture', creator: 'Synth Wave', duration: '0:55', genre: 'Electronic', tags: ['Loop'], bpm: '110 BPM', key: 'D Major' },
  { name: '808 Bass Hit', creator: 'Creator Name', duration: '0:02', genre: 'Hip-Hop', tags: ['One-shots'], license: 'Royalty-Free', bpm: '120 BPM', key: 'F Minor' },
  { name: 'Midnight Loops', creator: 'Vinyl Revival', duration: '0:32', genre: 'Lo-Fi', tags: ['Loop'], license: 'Royalty-Free', premium: true, bpm: '85 BPM', key: 'G Minor' },
  { name: 'Drill Snare', creator: 'Sound Factory', duration: '0:01', genre: 'Drill', tags: ['One-shots'], bpm: '140 BPM', key: 'B Minor' },
  { name: 'Jazz Piano Chop', creator: 'Vinyl Revival', duration: '0:18', genre: 'Jazz Rap', tags: ['Loop', 'Stems'], license: 'Royalty-Free', bpm: '94 BPM', key: 'A Major' },
  { name: 'Analog Keys', creator: 'Synth Wave', duration: '0:24', genre: 'Lo-Fi', tags: ['Loop'], bpm: '90 BPM', key: 'C Minor' },
  { name: 'Street Vocal Chop', creator: 'Creator Name', duration: '0:08', genre: 'Hip-Hop', tags: ['Vocals'], license: 'Royalty-Free', premium: true, bpm: '95 BPM', key: 'E Minor' },
  { name: 'Soulful Stems', creator: 'Beat Lab', duration: '0:38', genre: 'Soul', tags: ['Stems'], license: 'Royalty-Free', bpm: '82 BPM', key: 'F Major' },
];
