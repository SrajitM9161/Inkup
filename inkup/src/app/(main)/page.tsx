'use client';

import { useState } from 'react';
import HomePage from '../(landing)/landing/page';
import PricingSection from '../components/PricingSection';
import SignupModal from '../(modals)/modals/SignupModal';
import { useAuth } from '../Hooks/useAuth.hook';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';
export default function MainLanding() {
  const [showModal, setShowModal] = useState(false);
  const { refreshAuth } = useAuth();

  return (
    <RedirectIfAuthenticated>
      <main className="overflow-x-hidden">
      {/* Pass modal handler to HomePage */}
      <HomePage onOpenModal={() => setShowModal(true)} />

      {/* Modal with required props */}
      <SignupModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={({ token }: { token: string }) => {
          localStorage.setItem('token', token);
        }}
        onSuccess={async () => {
          await refreshAuth();
          setShowModal(false);
        }}
      />

      {/* Pricing Section */}
      <div className="bg-dot-pattern flex gap-6 flex-wrap justify-center">
        <PricingSection />
      </div>
    </main>
    </RedirectIfAuthenticated>
  );
}
