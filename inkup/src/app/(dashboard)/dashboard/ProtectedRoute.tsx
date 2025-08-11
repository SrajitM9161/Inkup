// 'use client';

// import { useEffect, useState } from 'react';
// import { useAuth } from '../../Hooks/useAuth.hook';
// import SignupModal from '../../(modals)/modals/SignupModal';

// export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
//   const { authenticated, loading, refreshAuth } = useAuth();
//   const [showSignupModal, setShowSignupModal] = useState(false);

//   useEffect(() => {
//     if (!loading && !authenticated) {
//       setShowSignupModal(true);
//     }
//   }, [loading, authenticated]);

//   if (loading) return null;

//   if (!authenticated) {
//     return (
//       <SignupModal
//         isOpen={showSignupModal}
//         onClose={() => setShowSignupModal(false)}
//         onSuccess={async () => {
//           await refreshAuth();
//           setShowSignupModal(false);
//         }}
//         // ❌ No token storagea
//         onSubmit={() => {}}
//       />
//     );
//   }

//   return <>{children}</>;
// }



'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../Hooks/useAuth.hook';
import SignupModal from '../../(modals)/modals/SignupModal';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authenticated, loading, allowedUser, refreshAuth } = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!authenticated) {
        setShowSignupModal(true);
        setShowAccessDenied(false);
      } else if (authenticated && !allowedUser) {
        // User logged in but not in whitelist
        setShowSignupModal(false);
        setShowAccessDenied(true);
      } else {
        setShowSignupModal(false);
        setShowAccessDenied(false);
      }
    }
  }, [loading, authenticated, allowedUser]);

  if (loading) return null;

  if (showSignupModal) {
    return (
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={async () => {
          await refreshAuth();
          setShowSignupModal(false);
        }}
        onSubmit={() => {}}
      />
    );
  }

  if (showAccessDenied) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-white bg-gray-900 px-4">
        <h1 className="text-4xl font-bold mb-4">Coming Soon!</h1>
        <p className="mb-8 text-lg">
          Coming soon! 
          
        </p>
        {/* Optional: Add a logout button or link here */}
      </div>
    );
  }

  return <>{children}</>;
}

