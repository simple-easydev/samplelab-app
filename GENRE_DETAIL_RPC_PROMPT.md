# Prompt: Create Supabase RPC `get_genre_detail_by_id`

Use this in your **admin / backend project** to add the RPC. Do not change `database.ts` or other DB-related files in the frontend; the frontend will call this RPC and type the result locally.

---

## Task

Create a **Supabase (Postgres) RPC** named **`get_genre_detail_by_id`** in the **`public`** schema that returns **all data needed for the Genre Detail Page** in a single call: the genre record, samples in that genre, packs in that genre, and creators that have content in that genre.

### Schema context

- **`public.genres`**: `id`, `name`, `description`, `is_active`, `created_at`. (If you have `thumbnail_url` or similar, include it.)
- **`public.pack_genres`**: `pack_id`, `genre_id` — links packs to genres (many-to-many).
- **`public.packs`**: `id`, `name`, `creator_id`, `category_id`, `cover_url`, `download_count`, `status`, `is_premium`, `tags`, etc.
- **`public.samples`**: `id`, `name`, `pack_id`, `audio_url`, `bpm`, `key`, `type`, `status`, `has_stems`, `download_count`, etc. **Samples do not have `genre_id`**; genre is derived from the pack via `pack_genres`.
- **`public.creators`**: `id`, `name`, `avatar_url`, `is_active`, etc.

So:

- **Samples “with” a genre** = samples whose pack has that `genre_id` in `pack_genres`.
- **Packs “with” a genre** = packs that have a row in `pack_genres` for that `genre_id`.
- **Creators “with” a genre** = creators that have at least one pack linked to that genre via `pack_genres`.

---

## 1. Function signature

- **Name:** `get_genre_detail_by_id`
- **Argument:** `p_genre_id` (uuid) — required. The genre’s primary key.
- **Returns:** A single JSON object (or composite type) with the following structure so the frontend can do one RPC call and render the whole page.

---

## 2. Return shape (contract for the frontend)

Return **one object** (e.g. single row as JSON or composite) with:

### 2.1 `genre` (object, nullable)

- **`id`** (uuid)
- **`name`** (text)
- **`description`** (text, nullable)
- **`thumbnail_url`** (text, nullable) — if your schema has it; otherwise omit or null.
- **`is_active`** (boolean)
- **`samples_count`** (bigint) — total samples in this genre (samples in packs that have this genre in `pack_genres`).
- **`packs_count`** (bigint) — total packs that have this genre in `pack_genres`.

If `p_genre_id` does not exist or the genre is inactive, you may return `genre: null` and empty arrays for samples/packs/creators (or return an error — document which you choose).

### 2.2 `samples` (array of objects)

Same row shape as **`get_all_samples`** (so the frontend can reuse `SampleItem`), but **filtered to samples whose pack has this genre** (via `pack_genres`). Each row should include at least:

- `id`, `name`, `pack_id`, `pack_name`, `creator_name`, `audio_url`, `thumbnail_url`, `genre` (genre name, nullable), `bpm`, `key`, `type`, `download_count`, `status`, `has_stems`, `stems_count`, `created_at`, `metadata` (if applicable).

Order: e.g. by `samples.created_at` DESC or by sample name ASC — document the default.

### 2.3 `packs` (array of objects)

Same row shape as **`get_all_packs`** (so the frontend can reuse `PackRow`), but **filtered to packs that have this genre** (exist in `pack_genres` for `p_genre_id`). Each row should include:

- `id`, `name`, `creator_id`, `creator_name`, `category_id`, `category_name`, `genres` (array of genre names for this pack), `tags`, `samples_count`, `download_count`, `status`, `cover_url`, `created_at`, `is_premium`.

Order: e.g. by `download_count` DESC or `created_at` DESC — document the default.

### 2.4 `creators` (array of objects)

Creators that have **at least one pack** in this genre (via `pack_genres`). Same shape as **`get_creators_with_counts`** for consistency:

- **`id`** (uuid)
- **`name`** (text)
- **`avatar_url`** (text, nullable)
- **`packs_count`** (bigint) — recommend **count of packs in this genre** for this creator (so the detail page shows “packs in this genre”).
- **`samples_count`** (bigint) — recommend **count of samples in this genre** for this creator (samples in packs that have this genre).

Order: e.g. by `name` ASC or by `packs_count` DESC.

---

## 3. Filtering and permissions

- Restrict to **published** content if you have `status` on `packs` and `samples` (e.g. `status = 'published'`). Otherwise document that all rows are returned.
- Only include **active** genres; if `genres.is_active` is false for `p_genre_id`, return `genre: null` and empty arrays (or an error).
- Use **SECURITY DEFINER** only if the RPC needs to bypass RLS; otherwise run with invoker permissions. Prefer **STABLE** if the result is deterministic for a given `p_genre_id` in one transaction.

---

## 4. Frontend usage

- **RPC name:** `get_genre_detail_by_id`
- **Args:** `{ p_genre_id: string }` (uuid)
- **Returns:** One object:
  - `genre`: `{ id, name, description, thumbnail_url?, is_active, samples_count, packs_count } | null`
  - `samples`: array of `SampleItem` (same as `get_all_samples` but filtered by genre)
  - `packs`: array of `PackRow` (same as `get_all_packs` but filtered by genre)
  - `creators`: array of `{ id, name, avatar_url, packs_count, samples_count }` (genre-scoped counts)

The frontend will call:

```ts
const { data, error } = await supabase.rpc('get_genre_detail_by_id', {
  p_genre_id: genreId,
});
// data: { genre: {...}, samples: [...], packs: [...], creators: [...] }
```

Use this to generate the SQL function (and any migration) in your admin/backend project.
