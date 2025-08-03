'use client';

import React from 'react';

interface StepData {
  label: string;
  content: React.ReactNode;
}

interface StepperProps {
  steps: StepData[];
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onNext: () => void;
  onBack: () => void;
}

export default function Stepper({ steps, step, onNext, onBack }: StepperProps) {
  const current = steps[step] ?? steps[steps.length - 1];

  return (
    <div className="relative max-w-xl w-full p-6">
      <div className="flex items-center justify-center space-x-4 mb-6">
        {steps.map((_, i) => (
          <React.Fragment key={i}>
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full border text-sm font-semibold transition-all duration-300 ${
                i === step
                  ? 'bg-[#d0fe17] text-black border-[#d0fe17]'
                  : 'bg-white/10 border-gray-400 text-white'
              }`}
            >
              {i + 1}
            </div>
            {i !== steps.length - 1 && <div className="w-6 h-0.5 bg-gray-500" />}
          </React.Fragment>
        ))}
      </div>

      {step === 0 && (
        <p className="text-sm text-[#d0fe17] mt-1 text-center">You can always change them later.</p>
      )}

      <div className="space-y-4">{current.content}</div>

      <div className="flex justify-between items-center mt-8">
        {step !== 0 ? (
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        <button
          type={step === steps.length - 1 ? 'submit' : 'button'}
          onClick={step === steps.length - 1 ? undefined : onNext}
          className="bg-[#D0FE17] hover:bg-[#CCFF01] text-black font-semibold px-6 py-2 rounded-xl"
        >
          {step === steps.length - 1 ? 'Submit' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
