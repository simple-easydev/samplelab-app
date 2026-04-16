import { SettingsTabs } from './SettingsTabs';
import { useNavigate } from 'react-router-dom';
import { PaymentMethodSection } from './PaymentMethodSection';
import { TransactionHistorySection } from './TransactionHistorySection';
import { CreditActivitySection } from './CreditActivitySection';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';

type BillingDetailsResponse =
  | {
      success: true;
      stripeCustomerId: string;
      paymentMethods: Array<{
        id: string;
        type: string;
        isDefault?: boolean;
        card?: {
          brand: string;
          last4: string;
          expMonth: number;
          expYear: number;
        };
        billingDetails?: {
          name?: string | null;
          email?: string | null;
        };
        created: number;
      }>;
      transactions: Array<{
        id: string;
        kind: 'invoice' | 'payment_intent' | string;
        created: number;
        currency: string;
        status: string;
        amount: number;
        amountPaid?: number;
        amountReceived?: number;
        hostedInvoiceUrl?: string | null;
        invoicePdf?: string | null;
        description?: string | null;
        receiptEmail?: string | null;
        stripeUrl?: string | null;
      }>;
    }
  | {
      success: false;
      error?: string;
      message?: string;
    };

export default function BillingPage() {
  const navigate = useNavigate();
  const [loadingBillingDetails, setLoadingBillingDetails] = useState(false);
  const [billingDetails, setBillingDetails] =
    useState<BillingDetailsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoadingBillingDetails(true);
      try {
        const { data, error } = await supabase.functions.invoke(
          'get-stripe-billing-details',
          {
            body: { limit: 25 },
          }
        );

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setBillingDetails((data ?? null) as BillingDetailsResponse | null);
        }
      } catch (e) {
        console.error('Failed to fetch billing details:', e);
        if (!cancelled) {
          setBillingDetails(null);
        }
        toast.error('Failed to load billing details.');
      } finally {
        if (!cancelled) setLoadingBillingDetails(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-12">
        <SettingsTabs />

        <PaymentMethodSection
          onBrowseLibrary={() => navigate('/dashboard')}
          onAddPaymentMethod={() => {
            // TODO: wire to Stripe/portal when backend is ready
          }}
          loading={loadingBillingDetails}
          paymentMethods={
            billingDetails && 'success' in billingDetails && billingDetails.success
              ? billingDetails.paymentMethods
              : []
          }
        />

        <TransactionHistorySection
          onBrowseLibrary={() => navigate('/dashboard')}
          onViewPlans={() => navigate('/dashboard/settings/account')}
          loading={loadingBillingDetails}
          transactions={
            billingDetails && 'success' in billingDetails && billingDetails.success
              ? billingDetails.transactions
              : []
          }
        />

        <CreditActivitySection
          onBrowseLibrary={() => navigate('/dashboard')}
          onEmailActivityReport={() => {
            // TODO: wire to backend
          }}
        />
      </div>
    </div>
  );
}

