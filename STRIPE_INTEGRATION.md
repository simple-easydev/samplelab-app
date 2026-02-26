# Stripe Free Trial Integration

This document explains the Stripe free trial workflow implementation in the frontend.

## Workflow Overview

```
User clicks "Start Free Trial"
        ↓
supabase.functions.invoke('create-checkout-session')
        ↓
Stripe Checkout (enter card, no charge for 3 days)
        ↓
Stripe fires webhook
        ↓
supabase/functions/stripe-webhook → updates subscriptions table
        ↓
Your app reads subscription status from Supabase DB
```

## Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

Required variables:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_STRIPE_PRICE_ID_MONTHLY` - Stripe Price ID for monthly subscription
- `VITE_STRIPE_PRICE_ID_YEARLY` - Stripe Price ID for yearly subscription

### 2. Database Schema

Ensure the `subscriptions` table exists in your Supabase database with the following schema:

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own subscriptions
CREATE POLICY "Users can read own subscriptions"
  ON subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 3. Edge Functions (Admin Panel)

The following edge functions should already exist in your admin panel project:

#### `create-checkout-session`

Creates a Stripe Checkout session with trial period.

Expected request body:
```typescript
{
  priceId: string;      // Stripe price ID
  userId: string;       // Supabase user ID
  email: string;        // User email
  trialDays: number;    // Number of trial days (3 for trial, 0 for immediate)
  successUrl: string;   // Redirect URL on success
  cancelUrl: string;    // Redirect URL on cancel
}
```

Returns:
```typescript
{
  url: string;  // Stripe Checkout URL to redirect to
}
```

#### `stripe-webhook`

Handles Stripe webhook events and updates the subscriptions table.

Key events to handle:
- `checkout.session.completed` - Create subscription record
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Mark subscription as canceled
- `invoice.payment_failed` - Mark subscription as past_due

### 4. Stripe Configuration

In your Stripe Dashboard:

1. **Create Products**:
   - Monthly Pro Plan ($19.99/month)
   - Yearly Pro Plan ($199/year)

2. **Configure Trial Period**:
   - Edit each price
   - Set "Free trial" to 3 days

3. **Set up Webhook**:
   - Go to Developers > Webhooks
   - Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

4. **Get Price IDs**:
   - Go to Products
   - Click on each product
   - Copy the Price ID (starts with `price_`)
   - Add to `.env.local`

## Frontend Implementation

### Components Created

1. **`src/lib/supabase/subscriptions.ts`**
   - Utility functions for subscription management
   - `getUserSubscription()` - Get user's active subscription
   - `hasActiveSubscription()` - Check if user has active subscription
   - `isInTrialPeriod()` - Check if user is in trial
   - `createCheckoutSession()` - Create Stripe checkout session

2. **`src/hooks/useSubscription.ts`**
   - React hook for subscription state management
   - Real-time updates via Supabase subscriptions
   - Returns: `{ subscription, isActive, isTrialing, loading, refresh }`

3. **Updated `src/pages/OnboardingPage.tsx`**
   - Integrated Stripe checkout flow
   - Calls `create-checkout-session` edge function
   - Redirects to Stripe Checkout

4. **Updated `src/pages/DashboardPage.tsx`**
   - Handles return from Stripe Checkout
   - Displays subscription status
   - Shows trial countdown

## User Flow

### Starting a Free Trial

1. User completes onboarding and selects a Pro plan
2. User clicks "Start free trial" or "Start Pro +50 credits"
3. Frontend calls `createCheckoutSession()` with:
   - `priceId`: Stripe price ID for selected plan
   - `skipBonus`: `true` for 3-day trial, `false` for immediate billing with bonus
4. Edge function creates Stripe Checkout session
5. User is redirected to Stripe to enter payment details
6. User completes checkout (no charge during trial)
7. Stripe fires `checkout.session.completed` webhook
8. Webhook handler creates subscription record in database
9. User is redirected to Dashboard with `?session_id=xxx`
10. Dashboard shows success message and subscription status

### After Trial Period

- If user doesn't cancel, Stripe charges the card after 3 days
- Webhook updates subscription status to `active`
- User continues with Pro access

### If User Cancels

- User can cancel anytime during trial
- No charge is made
- Subscription status updated to `canceled`
- User reverts to free plan

## Testing

### Test Mode

Use Stripe test mode for development:

1. Use test price IDs (start with `price_test_`)
2. Use test webhook signing secret
3. Use test cards (e.g., `4242 4242 4242 4242`)

### Testing the Flow

1. Start the frontend: `npm run dev`
2. Sign up / Log in
3. Complete onboarding
4. Select a Pro plan
5. Click "Start free trial"
6. Use Stripe test card: `4242 4242 4242 4242`
7. Complete checkout
8. Verify redirect to dashboard
9. Check subscription status in dashboard

### Verify Webhook Events

- Use Stripe CLI to forward webhooks locally:
  ```bash
  stripe listen --forward-to https://your-project.supabase.co/functions/v1/stripe-webhook
  ```
- Trigger test events:
  ```bash
  stripe trigger checkout.session.completed
  ```

## Subscription Status Values

- `trialing` - User is in free trial period
- `active` - User has active paid subscription
- `past_due` - Payment failed, subscription still active
- `canceled` - User canceled subscription
- `unpaid` - Payment failed, subscription inactive
- `incomplete` - Initial payment incomplete
- `incomplete_expired` - Initial payment incomplete and expired

## Real-time Updates

The `useSubscription` hook listens for real-time changes to the subscriptions table. When the webhook updates subscription status, the UI automatically updates without refresh.

## Security Notes

1. **Never expose Stripe secret keys** - Only use publishable keys in frontend
2. **Webhook signatures** - Edge function should verify webhook signatures
3. **Row Level Security** - Users can only read their own subscriptions
4. **Auth checks** - All edge functions verify user authentication

## Troubleshooting

### Checkout Not Working

- Check that price IDs in `.env.local` are correct
- Verify edge function is deployed and accessible
- Check browser console for errors

### Subscription Not Updating

- Verify webhook is receiving events (check Stripe Dashboard > Webhooks)
- Check edge function logs for errors
- Verify database permissions (RLS policies)

### Trial Not Starting

- Check that price has trial period configured in Stripe
- Verify `trialDays` parameter is being sent correctly
- Check subscription record in database

## Support

For issues with:
- Stripe setup → [Stripe Documentation](https://stripe.com/docs)
- Supabase setup → [Supabase Documentation](https://supabase.com/docs)
- Edge functions → Check admin panel repository
