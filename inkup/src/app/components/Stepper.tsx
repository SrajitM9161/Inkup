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
    <div className="max-w-xl mx-auto p-6 rounded-lg shadow-xl bg-gray-900 text-white">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-center">{current.label}</h2>
      </div>

      <div className="space-y-4">{current.content}</div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded disabled:opacity-40"
        >
          Back
        </button>

        {step < steps.length - 2 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        ) : step === steps.length - 2 ? (
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        ) : null}
      </div>
    </div>
  )
}
