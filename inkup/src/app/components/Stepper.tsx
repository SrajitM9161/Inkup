'use client'

import React from 'react'

interface StepData {
  label: string
  content: React.ReactNode
}

interface StepperProps {
  steps: StepData[]
  step: number
  setStep: React.Dispatch<React.SetStateAction<number>>
  onComplete: () => void
}

export default function Stepper({ steps, step, setStep, onComplete }: StepperProps) {
  const current = steps[step] ?? steps[steps.length - 1]

  return (
    <div className="relative max-w-xl w-full p-8 ">
      <div className="flex items-center justify-between mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center space-x-0">
            <div
              className={`w-9 h-9 flex items-center justify-center rounded-full border text-sm font-medium transition-all duration-300 ${
                i === step
                  ? 'bg-[#d0fe17] text-black border-[#d0fe17]'
                  : 'bg-white/10 border-gray-400 text-[#f8f8f8]'
              }`}
            >
              {i + 1}
            </div>
            {i !== 3 && <div className="h-1 w-9 bg-gray-500" />}
          </div>
        ))}
      </div>

      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-white">{current.label}</h2>
        {step === 0 && (
          <p className="text-sm text-[#d0fe17] mt-1">You can always change them later.</p>
        )}
      </div>

      <div className="space-y-4">{current.content}</div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-xl disabled:opacity-40"
        >
          Back
        </button>

        {step < steps.length - 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="bg-[#D0FE17] hover:bg-[#CCFF01] text-black font-semibold px-6 py-2 rounded-xl"
          >
            Continue
          </button>
        ) : step === steps.length - 2 ? (
          <button
            type="submit"
            className="bg-[#D0FE17] hover:bg-[#CCFF01] text-black font-semibold px-6 py-2 rounded-xl"
          >
            Submit
          </button>
        ) : null}
      </div>
    </div>
  )
}