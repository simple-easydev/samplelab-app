# Prompt: Create Supabase RPC `get_home_feed`

Use this in your **admin / backend project** to add the RPC. The frontend already calls this RPC and types the result locally.

---

## Task

Create a **Supabase (Postgres) RPC** named **`get_home_feed`** in the **`public`** schema that:

1. **Takes no arguments.**

2. **Returns** a single JSON object with three keys:
   - **`trending_samples`** – array of **top 5** rows, ordered by **`trending_score`** DESC (or by `download_count` DESC if `trending_score` does not exist). Each row: `{ name, creator_name }` (sample name and creator name; join `samples` → `packs` → `creators`).
   - **`new_releases`** – array of **latest 5** rows, ordered by **`release_date`** DESC (or by `created_at` DESC if `release_date` does not exist). Each row: `{ name, creator_name }` (pack or sample name and creator name).
   - **`top_creators`** – array of **top 5** creators, ordered by **`rank`** ASC (or by `packs_count` DESC if `rank` does not exist). Each row: `{ name, packs_count }` (creator name and number of packs).

3. **Tables**: Use existing `public.samples`, `public.packs`, `public.creators`. Filter by `status = 'published'` where applicable.

4. **Return type**: Use a single composite type or `JSONB` so PostgREST returns one object. Example return type:

```sql
CREATE TYPE home_feed_result AS (
  trending_samples JSONB,
  new_releases     JSONB,
  top_creators     JSONB
);
```

Then the function returns `SETOF home_feed_result` with one row, or use `RETURNS JSONB` and build the object in PL/pgSQL.

---

## Contract the frontend expects

- **RPC name:** `get_home_feed`
- **Args:** none
- **Returns:** One object:
  - `trending_samples`: `Array<{ name: string; creator_name: string }>` (length 5)
  - `new_releases`: `Array<{ name: string; creator_name: string }>` (length 5)
  - `top_creators`: `Array<{ name: string; packs_count: number }>` (length 5)

Use this to generate the SQL function (and any migration) in your admin project.
