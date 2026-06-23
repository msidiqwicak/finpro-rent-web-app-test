import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children:      ReactNode;
  requiredRole?: 'USER' | 'TENANT';
}

function LoadingScreen() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--surface)', color: 'var(--on-surface-variant)', fontFamily: "'Manrope',sans-serif", fontSize: '1rem' }}>
      Loading session...
    </div>
  );
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const { user, isLoading } = useAuth();

  if (isLoading)                                  return <LoadingScreen />;
  if (!user)                                      return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole)  return <Navigate to="/" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
