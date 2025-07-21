'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../Hooks/useAuth.hook';
import SignupModal from '../../(modals)/modals/SignupModal';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading, refreshAuth } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);

  useEffect(() => {
    if (!loading && !authenticated) {
      setShowSignupModal(true);
    }
  }, [loading, authenticated]);

  if (loading) return null;

  if (!authenticated) {
    return (
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={async () => {
          await refreshAuth();
          setShowSignupModal(false);
        }}
        // ❌ No token storage
        onSubmit={() => {}}
      />
    );
  }

  return <>{children}</>;
}
