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

  const refreshBillingDetails = async (options?: { cancelled?: () => boolean }) => {
    setLoadingBillingDetails(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'get-stripe-billing-details',
        {
          body: { limit: 25 },
        }
      );

      if (error) throw error;
      if (!options?.cancelled?.()) {
        setBillingDetails((data ?? null) as BillingDetailsResponse | null);
      }
    } catch (e) {
      console.error('Failed to fetch billing details:', e);
      if (!options?.cancelled?.()) {
        setBillingDetails(null);
        toast.error('Failed to load billing details.');
      }
    } finally {
      if (!options?.cancelled?.()) {
        setLoadingBillingDetails(false);
      }
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await refreshBillingDetails({ cancelled: () => cancelled });
      } catch (e) {
        console.error('Failed to fetch billing details:', e);
        if (!cancelled) {
          setBillingDetails(null);
        }
        toast.error('Failed to load billing details.');
      }
    })();

    const handleFocus = () => {
      void refreshBillingDetails({ cancelled: () => cancelled });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void refreshBillingDetails({ cancelled: () => cancelled });
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const openBillingPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'create-stripe-billing-portal-session',
        {
          body: { returnUrl: window.location.href },
        }
      );

      if (error) throw error;

      const url =
        ((data as any)?.url as string | undefined) ??
        ((data as any)?.data?.url as string | undefined) ??
        ((data as any)?.sessionUrl as string | undefined);
      if (!url) {
        const message =
          (data as any)?.message ??
          (data as any)?.error ??
          'Billing portal URL was not returned.';
        throw new Error(message);
      }

      window.location.assign(url);
    } catch (e) {
      console.error('Failed to open billing portal:', e);
      toast.error('Unable to open billing portal.');
    }
  };

  const deletePaymentMethod = async (paymentMethodId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        'delete-stripe-payment-method',
        {
          body: { paymentMethodId },
        }
      );

      if (error) throw error;
      const success =
        typeof (data as any)?.success === 'boolean' ? (data as any).success : true;
      if (!success) {
        throw new Error(
          (data as any)?.message ??
            (data as any)?.error ??
            'Failed to delete payment method.'
        );
      }

      toast.success('Payment method deleted.');
      await refreshBillingDetails();
    } catch (e) {
      console.error('Failed to delete payment method:', e);
      toast.error('Unable to delete payment method.');
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-12">
        <SettingsTabs />

        <PaymentMethodSection
          onBrowseLibrary={() => navigate('/dashboard')}
          onAddPaymentMethod={() => {
            void openBillingPortal();
          }}
          onUpdatePaymentMethod={() => openBillingPortal()}
          onDeletePaymentMethod={(paymentMethodId) => deletePaymentMethod(paymentMethodId)}
          loading={loadingBillingDetails}
          paymentMethods={
            billingDetails && 'success' in billingDetails && billingDetails.success
              ? billingDetails.paymentMethods
              : []
          }
        />

        <TransactionHistorySection
          onBrowseLibrary={() => navigate('/dashboard')}
          onViewPlans={() => navigate('/dashboard/settings/plans')}
          loading={loadingBillingDetails}
          transactions={
            billingDetails && 'success' in billingDetails && billingDetails.success
              ? billingDetails.transactions
              : []
          }
          onEmailTransactionsReport={() => {
            // TODO: wire to backend
          }}
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

