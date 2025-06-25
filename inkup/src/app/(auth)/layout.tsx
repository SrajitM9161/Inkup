import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-dot-pattern flex justify-center items-center px-4 py-6 overflow-y-auto">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-dot-pattern rounded-[20px] overflow-hidden">
        {children}
      </div>
    </div>
  );
}