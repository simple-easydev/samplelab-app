import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicRoute() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  return <Outlet />;
}
