import { SettingsTabs } from './SettingsTabs';
import { useNavigate } from 'react-router-dom';
import { PaymentMethodSection } from './PaymentMethodSection';
import { TransactionHistorySection } from './TransactionHistorySection';
import { CreditActivitySection } from './CreditActivitySection';

export default function BillingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fffbf0] flex flex-col items-center pt-8 pb-32 px-8">
      <div className="w-full max-w-[676px] flex flex-col gap-12">
        <SettingsTabs />

        <PaymentMethodSection
          onBrowseLibrary={() => navigate('/dashboard')}
          onAddPaymentMethod={() => {
            // TODO: wire to Stripe/portal when backend is ready
          }}
        />

        <TransactionHistorySection
          onBrowseLibrary={() => navigate('/dashboard')}
          onViewPlans={() => navigate('/dashboard/settings/account')}
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

