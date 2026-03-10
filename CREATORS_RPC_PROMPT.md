# Prompt: Create Supabase RPC `get_creators_with_counts`

Use this in your **admin / backend project** to add the RPC. Do not change `database.ts` or other DB-related files in the frontend; the frontend already calls this RPC and types the result locally.

---

## Task

Create a **Supabase (Postgres) RPC** named **`get_creators_with_counts`** in the **`public`** schema that:

1. **Reads from** the existing tables:
   - **`public.creators`** (columns: `id`, `name`, `avatar_url`, `is_active`, …)
   - **`public.packs`** (has `creator_id` → `creators.id`)
   - **`public.samples`** (has `pack_id` → `packs.id`)

2. **Returns** one row per creator with:
   - **`id`** (uuid) – creator id
   - **`name`** (text) – creator name
   - **`avatar_url`** (text, nullable) – creator avatar
   - **`packs_count`** (bigint) – count of packs for that creator (all packs, or only where `packs.status` = 'published' if you filter)
   - **`samples_count`** (bigint) – count of samples that belong to those packs (all samples, or only where `samples.status` = 'published' if you filter)

3. **Optional arguments** (with defaults):
   - **`p_search`** (text, default `null`) – when provided, filter creators where `name` ILIKE `'%' || p_search || '%'`.
   - **`p_limit`** (int, default `100`) – maximum rows to return.
   - **`p_offset`** (int, default `0`) – offset for pagination.

4. **Filtering**: Only return creators where `is_active` is not false (or your equivalent). Exclude creators with no packs if you want only creators that have at least one pack; otherwise include them with `packs_count = 0` and `samples_count = 0`.

5. **Order**: Default order by `name` ASC.

The function should be **STABLE** (or VOLATILE if you prefer), **SECURITY DEFINER** only if you need elevated permissions, and exposed via PostgREST so the frontend can call `supabase.rpc('get_creators_with_counts', { p_search, p_limit, p_offset })`.

---

## Contract the frontend expects

- **RPC name:** `get_creators_with_counts`
- **Args:** `{ p_search?: string | null; p_limit?: number; p_offset?: number }`
- **Returns:** Array of `{ id: string; name: string; avatar_url: string | null; packs_count: number; samples_count: number }`

Use this to generate the SQL function (and any migration) in your admin project.
