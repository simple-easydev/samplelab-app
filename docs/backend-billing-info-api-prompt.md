# Backend: Single “billing info” API for frontend

Use this prompt in the **backend** project so the frontend can fetch user + customer + subscription in **one call** and avoid many separate requests on each page load.

---

## Prompt for backend project

We need a single endpoint (or Supabase RPC) that returns the current user’s **customer** and **subscription** in one response. The frontend will call it once per session (or when needed) and cache the result.

**Requirements:**

1. **Auth**  
   - Use the current authenticated user (e.g. JWT / `auth.uid()` in Supabase, or your backend’s auth middleware).  
   - No request body needed for “who is the user” — derive from the session/token.

2. **Response shape**  
   Return one JSON object with:

   - **customer**
     - `id` (UUID) – customer row id
     - `credit_balance` (number)
     - Include any other customer fields the frontend might need later.
   - **subscription**
     - Either the **single active/trialing subscription** for that customer (same shape as your `subscriptions` table), or `null` if none.
     - “Active/trialing” = e.g. `stripe_status IN ('active', 'trialing')`.
     - If there are multiple, return the latest one (e.g. `ORDER BY created_at DESC LIMIT 1`).

   Example response:

   ```json
   {
     "customer": {
       "id": "uuid",
       "credit_balance": 100
     },
     "subscription": {
       "id": "uuid",
       "customer_id": "uuid",
       "tier": "pro",
       "stripe_price_id": "price_xxx",
       "stripe_status": "active",
       "current_period_end": "2025-03-01T00:00:00Z",
       "trial_end": null,
       ...
     }
   }
   ```

   If the user has no customer row: return `customer: null` and `subscription: null` (or an empty object for `customer` and `subscription: null` — keep the shape consistent).

3. **Implementation options (pick one)**

   - **Option A – Supabase RPC (Postgres function)**  
     - Add a Postgres function, e.g. `get_my_billing_info()`, that uses `auth.uid()` to:
       - Select the customer row for that user (e.g. `customers` where `user_id = auth.uid()`).
       - Select the latest active/trialing subscription for that customer.
     - Return a single JSON object with `customer` and `subscription`.
     - Grant `EXECUTE` to `authenticated` (and optionally `service_role`).
     - Frontend will call it via `supabase.rpc('get_my_billing_info')`.

   - **Option B – REST/Edge function**  
     - One GET (or POST) endpoint, e.g. `GET /billing-info` or `POST /get-billing-info`.
     - Backend reads the user from the JWT/session, loads customer by `user_id`, then loads the latest active/trialing subscription for that customer.
     - Response: same JSON shape as above.

4. **Naming**  
   - RPC: any name is fine (e.g. `get_my_billing_info`).  
   - REST: any path is fine (e.g. `/billing-info`, `/api/billing-info`).  
   - Frontend will be wired to whatever name/path the backend exposes.

5. **Security**  
   - Only return data for the authenticated user (no customer_id or user_id in the request body; always from the token/session).

Once this is implemented, tell the frontend team:
- The exact RPC name **or** the exact URL and method (GET/POST) for the endpoint.
- That the response shape matches the example above (customer object with `id` and `credit_balance`, subscription object or `null`).

No SQL or DB migration files should be added to the **frontend** project; all DB and API logic stays in the backend project.
