'use client';

import { useState } from 'react';
import HomePage from '../(landing)/landing/page';
import PricingSection from '../components/PricingSection';
import SignupModal from '../(modals)/modals/SignupModal';

export default function MainLanding() {
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="overflow-x-hidden">
      {/* Pass modal handler to HomePage */}
      <HomePage onOpenModal={() => setShowModal(true)} />

      {/* Modal */}
      <SignupModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Pricing Section */}
      <div className="bg-dot-pattern flex gap-6 flex-wrap justify-center">
        <PricingSection />
      </div>
    </main>
  );
}
