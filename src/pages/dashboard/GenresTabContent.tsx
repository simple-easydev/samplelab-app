import { AccessGate } from '@/components/AccessGate';
import { useSubscription } from '@/hooks/useSubscription';

export function GenresTabContent() {
  const { isActive } = useSubscription();

  return (
    <div className="mb-8 flex flex-col gap-8">
      {!isActive && <AccessGate />}
    </div>
  );
}
