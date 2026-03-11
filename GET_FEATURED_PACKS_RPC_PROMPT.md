# Prompt: Create Supabase RPC `get_featured_packs`

Use this in your **admin / backend project** to add the RPC. The frontend already calls this RPC and types the result locally.

---

## Task

Create a **Supabase (Postgres) RPC** named **`get_featured_packs`** in the **`public`** schema that:

1. **Takes no arguments.**

2. **Returns** an array of pack rows suitable for the "Featured Packs" carousel. Each row must include:
   - **`id`** (uuid) – pack id
   - **`name`** (text) – pack name
   - **`creator_name`** (text) – creator display name (join `packs` → `creators`)
   - **`download_count`** (bigint, optional) – pack download count
   - **`genres`** (text[] or JSON, optional) – genre names for the pack
   - **`is_premium`** (boolean, optional) – whether the pack is premium

3. **Source**: Read from `public.packs` (and join `public.creators` for `creator_name`). Filter by `status = 'published'`. Limit to a fixed number of featured packs (e.g. 6–12), by a `featured` flag, highest `download_count`, or curated order.

4. **Return type**: `SETOF` a composite type or return a JSON/JSONB array so PostgREST returns an array of objects.

---

## Contract the frontend expects

- **RPC name:** `get_featured_packs`
- **Args:** none
- **Returns:** Array of `{ id, name, creator_name, download_count?, genres?, is_premium? }`

Use this to generate the SQL function (and any migration) in your admin project.
