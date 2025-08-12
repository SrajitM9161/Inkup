'use client';

import { useState, useRef } from 'react';
import HomePage from '../(landing)/landing/Landing';
import SignupModal from '../(modals)/modals/SignupModal';
import { useAuth } from '../Hooks/useAuth.hook';
import RedirectIfAuthenticated from '../components/RedirectIfAuthenticated';
import Footer from '../(landing)/landing/Footer';

export default function MainLanding() {
  const [showModal, setShowModal] = useState(false);
  const { refreshAuth } = useAuth();

  const [showFooter, setShowFooter] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  return (
    <RedirectIfAuthenticated>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        {/* Main content area that grows */}
        <main className="flex-grow">
          <HomePage
            onOpenModal={() => setShowModal(true)}
            setShowFooter={setShowFooter}
            triggerRef={triggerRef}
            footerRef={footerRef}
          />

          <SignupModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSubmit={() => {}}
            onSuccess={async () => {
              await refreshAuth();
              setShowModal(false);
            }}
          />
        </main>

        {/* Sticky Footer */}
        <Footer showFooter={showFooter} footerRef={footerRef} />
      </div>
    </RedirectIfAuthenticated>
  );
}
