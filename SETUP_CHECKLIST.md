# Stripe Free Trial - Setup Checklist

## ✅ Completed (Frontend Implementation)

- [x] Created subscription utility functions (`src/lib/supabase/subscriptions.ts`)
- [x] Created `useSubscription` hook for real-time subscription status
- [x] Updated OnboardingPage to call `create-checkout-session` edge function
- [x] Updated DashboardPage to handle Stripe checkout returns and display subscription status
- [x] Added TypeScript types for environment variables
- [x] Created documentation (STRIPE_INTEGRATION.md)
- [x] Created .env.example file

## ⚠️ Required Configuration

### 1. Environment Variables (.env.local)

Add these to your `.env.local` file:

```bash
# Already configured
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

# NEW - Add these:
VITE_STRIPE_PRICE_ID_MONTHLY=price_xxxxxxxxxxxxx
VITE_STRIPE_PRICE_ID_YEARLY=price_xxxxxxxxxxxxx
```

**To get Price IDs:**
1. Go to Stripe Dashboard > Products
2. Find your Pro Monthly and Pro Yearly products
3. Copy the Price IDs (they start with `price_`)

### 2. Verify Edge Functions (Admin Panel)

Check that these exist in your admin panel project:

- [ ] `create-checkout-session` - Creates Stripe Checkout session
- [ ] `stripe-webhook` - Handles Stripe webhook events

### 3. Database Schema

Ensure the `subscriptions` table exists in Supabase. Run this SQL if needed:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### 4. Stripe Configuration

- [ ] Create Products in Stripe (Pro Monthly, Pro Yearly)
- [ ] Configure 3-day trial on each price
- [ ] Set up webhook endpoint in Stripe Dashboard
- [ ] Copy webhook signing secret to admin panel env vars

### 5. Test the Flow

1. Run the app: `npm run dev`
2. Sign up / Log in
3. Complete onboarding
4. Click "Start free trial"
5. Use Stripe test card: `4242 4242 4242 4242`
6. Verify redirect to dashboard
7. Check subscription status shows "Trial Active"

## 📝 Key Files Modified

- `src/lib/supabase/subscriptions.ts` - Subscription utilities
- `src/hooks/useSubscription.ts` - Subscription hook
- `src/pages/OnboardingPage.tsx` - Stripe checkout integration
- `src/pages/DashboardPage.tsx` - Subscription status display
- `src/vite-env.d.ts` - Environment variable types

## 🔄 User Flow

1. User clicks "Start Free Trial" → OnboardingPage
2. Frontend calls `createCheckoutSession()` → Edge function
3. Redirects to Stripe Checkout → User enters card
4. Stripe webhook fires → Updates subscriptions table
5. User redirects to Dashboard → Shows trial status
6. After 3 days → Stripe charges card automatically

## 📚 Documentation

See `STRIPE_INTEGRATION.md` for detailed documentation including:
- Complete workflow explanation
- Database schema
- Edge function specifications
- Testing instructions
- Troubleshooting guide
