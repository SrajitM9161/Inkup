// components/modals/ContinueWithEmail.tsx
import { FiMail } from 'react-icons/fi';

export default function ContinueWithEmail() {
  return (
    <button className="bg-white text-black py-2 rounded-lg flex items-center justify-center gap-2 hover:shadow-md transition">
      <FiMail className="h-5 w-5" />
      Continue with Email
    </button>
  );
}
