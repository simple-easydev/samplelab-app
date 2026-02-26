# Credit System Update - Admin Panel Changes Needed

## Overview
Credits are now stored in the `customers.credit_balance` column instead of user metadata. The webhook needs to update this when payments succeed.

## Database Schema
Ensure the `customers` table has:
```sql
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  credit_balance INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
CREATE INDEX IF NOT EXISTS idx_customers_stripe_customer_id ON customers(stripe_customer_id);
```

## Required Admin Panel Changes

### 1. Update `create-checkout-session` Edge Function

The frontend sends `isTrial` boolean. Backend determines bonus credits from this parameter:
- `isTrial = true` → 3-day trial, no bonus credits
- `isTrial = false` → Immediate charge, apply +50 bonus credits

```typescript
// In create-checkout-session edge function
const { priceId, customerId, userId, email, isTrial, successUrl, cancelUrl } = await req.json();

const sessionParams = {
  customer: stripeCustomerId,
  mode: 'subscription',
  payment_method_types: ['card'],
  line_items: [
    {
      price: priceId,
      quantity: 1,
    },
  ],
  success_url: successUrl,
  cancel_url: cancelUrl,
  metadata: {
    userId: userId,
    customerId: customerId,
    isTrial: isTrial ? 'true' : 'false',  // ⭐ Store isTrial in metadata
  },
};

// Handle trial period
if (isTrial === true) {
  sessionParams.subscription_data = {
    trial_period_days: 3,
  };
}

const session = await stripe.checkout.sessions.create(sessionParams);
```

### 2. Update `stripe-webhook` Edge Function

When payment succeeds, check `isTrial` and apply bonus credits when `isTrial=false`:

```typescript
// In stripe-webhook edge function
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// ... webhook verification code ...

switch (event.type) {
  case 'checkout.session.completed': {
    const session = event.data.object;
    const userId = session.metadata.userId;
    const customerId = session.metadata.customerId;
    const isTrial = session.metadata.isTrial === 'true';
    
    console.log('Processing checkout.session.completed:', {
      userId,
      customerId,
      isTrial,
    });

    // Create/update subscription record...
    // ... existing subscription logic ...

    // ⭐ Apply bonus credits if NOT trial (immediate charge with bonus)
    if (!isTrial && customerId) {
      console.log('Applying +50 bonus credits to customer:', customerId);
      
      const { data, error } = await supabase
        .from('customers')
        .select('credit_balance')
        .eq('id', customerId)
        .single();

      if (error) {
        console.error('Error fetching current credits:', error);
      } else {
        const currentCredits = data?.credit_balance || 0;
        const newCredits = currentCredits + 50;

        const { error: updateError } = await supabase
          .from('customers')
          .update({ 
            credit_balance: newCredits,
            updated_at: new Date().toISOString(),
          })
          .eq('id', customerId);

        if (updateError) {
          console.error('Error updating credit_balance:', updateError);
        } else {
          console.log(`✅ Successfully added 50 credits. New balance: ${newCredits}`);
        }
      }
    }
    
    break;
  }

  case 'customer.subscription.updated':
  case 'customer.subscription.deleted':
  case 'invoice.payment_failed':
    // ... existing webhook handlers ...
    break;

  default:
    console.log(`Unhandled event type: ${event.type}`);
}
```

### 3. Alternative: Create Separate Edge Function (Optional)

If you prefer to keep logic separated, create a new edge function `update-customer-credits`:

```typescript
// supabase/functions/update-customer-credits/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { customerId, amount } = await req.json();

    if (!customerId || typeof amount !== 'number') {
      return new Response(
        JSON.stringify({ error: 'customerId and amount are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get current credit balance
    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('credit_balance')
      .eq('id', customerId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch customer: ${fetchError.message}`);
    }

    const currentCredits = customer?.credit_balance || 0;
    const newCredits = currentCredits + amount;

    // Update credit balance
    const { error: updateError } = await supabase
      .from('customers')
      .update({ 
        credit_balance: newCredits,
        updated_at: new Date().toISOString(),
      })
      .eq('id', customerId);

    if (updateError) {
      throw new Error(`Failed to update credits: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        previousBalance: currentCredits,
        newBalance: newCredits,
        amountAdded: amount,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

Then call it from the webhook:

```typescript
// In stripe-webhook, after checkout.session.completed
if (pendingBonus && customerId) {
  await supabase.functions.invoke('update-customer-credits', {
    body: { customerId, amount: 50 }
  });
}
```

## Frontend Changes (Already Done ✅)

- ✅ `createCheckoutSession` passes `isTrial` boolean (backend determines bonus from this)
- ✅ `getUserCredits()` now queries `customers.credit_balance`
- ✅ `DashboardPage` uses `getUserCredits()` to fetch and display credits
- ✅ Removed user_metadata credits logic
- ✅ Credits display updates after successful payment

## Testing Checklist

1. **Free Trial Flow**:
   - [ ] User selects "Start free trial"
   - [ ] `isTrial=true` sent to checkout
   - [ ] No credits added after payment
   - [ ] `credit_balance` remains unchanged

2. **Immediate Payment with Bonus**:
   - [ ] User selects "Start Pro +50 credits"
   - [ ] `isTrial=false` sent to checkout
   - [ ] After successful payment, check database:
     ```sql
     SELECT credit_balance FROM customers WHERE user_id = '<user_id>';
     -- Should show 50 (or previous balance + 50)
     ```
   - [ ] Frontend displays correct credit balance
   - [ ] Toast shows "+50 bonus credits" message

3. **Failed/Canceled Payment**:
   - [ ] User cancels payment
   - [ ] `credit_balance` unchanged
   - [ ] User downgraded to free plan
   - [ ] No credits added

## Database Queries for Verification

```sql
-- Check customer credit balance
SELECT 
  c.id,
  c.user_id,
  c.credit_balance,
  au.email
FROM customers c
JOIN auth.users au ON c.user_id = au.id
WHERE au.email = 'test@example.com';

-- View recent credit changes (if you add a transactions table)
SELECT * FROM credit_transactions 
WHERE customer_id = '<customer_id>' 
ORDER BY created_at DESC 
LIMIT 10;
```

## Summary

**To implement bonus credits properly:**

1. ✅ **Frontend sends** `isTrial` boolean in checkout request (DONE)
2. ⏳ **Edge function stores** `isTrial` in Stripe session metadata (TODO in admin panel)
3. ⏳ **Webhook handler** determines bonus from `isTrial` (false = +50 credits) and updates `customers.credit_balance` (TODO in admin panel)
4. ✅ **Frontend reads** `credit_balance` from database using `getUserCredits()` (DONE)

The admin panel needs to implement steps 2 and 3!
